import { ProcessingResult } from './index';

function describeCron(cron: string): string {
  const parts = cron.trim().split(/\s+/);
  if (parts.length < 5) return 'Invalid cron format';
  const [min, hour, dom, mon, dow] = parts;

  const descMin = min === '*' ? 'every minute' : min.startsWith('*/') ? `every ${min.slice(2)} minutes` : `at minute ${min}`;
  const descHour = hour === '*' ? 'every hour' : hour.startsWith('*/') ? `every ${hour.slice(2)} hours` : `at ${hour.padStart(2, '0')}:00`;
  const descDom = dom === '*' ? 'every day of the month' : `on day ${dom} of the month`;
  const descMon = mon === '*' ? 'every month' : `in month ${mon}`;
  
  let descDow = 'every day of the week';
  if (dow === '1-5') descDow = 'Monday through Friday';
  else if (dow === '0,6' || dow === '6,0') descDow = 'on weekends';
  else if (dow !== '*') descDow = `on day-of-week ${dow}`;

  if (min === '0' && hour === '0' && dom === '*' && mon === '*' && dow === '*') {
    return 'At midnight (00:00) every day.';
  }
  if (min === '0' && hour !== '*' && !hour.includes('/') && dom === '*' && mon === '*' && dow === '*') {
    return `At ${hour.padStart(2, '0')}:00 every day.`;
  }
  if (min.startsWith('*/') && hour === '*' && dom === '*' && mon === '*' && dow === '*') {
    return `Every ${min.slice(2)} minutes continuously.`;
  }

  return `${descMin}, ${descHour}, ${descDom}, ${descMon}, ${descDow}.`;
}

export async function processDateTimeUtility(
  toolId: string,
  textInput: string
): Promise<ProcessingResult> {
  const input = textInput.trim();

  switch (toolId) {
    case 'unix-timestamp': {
      const raw = input || Date.now().toString();
      let date: Date;
      if (/^\d+$/.test(raw)) {
        const num = parseInt(raw, 10);
        date = new Date(num > 1e11 ? num : num * 1000);
      } else {
        date = new Date(raw);
      }

      if (isNaN(date.getTime())) return { success: false, error: 'Invalid date or timestamp.' };

      const res = {
        unixSeconds: Math.floor(date.getTime() / 1000),
        unixMilliseconds: date.getTime(),
        isoString: date.toISOString(),
        utcString: date.toUTCString(),
        localString: date.toString()
      };

      return {
        success: true,
        data: JSON.stringify(res, null, 2),
        outputFileName: 'timestamp_converted.json'
      };
    }

    case 'cron-parser': {
      const cron = input || '*/5 * * * *';
      const parts = cron.split(/\s+/);
      if (parts.length < 5) {
        return { success: false, error: 'Invalid cron expression. Expected 5 space-separated fields (minute, hour, day-of-month, month, day-of-week).' };
      }

      const meaning = describeCron(cron);
      const explanation = `=== CRON EXPRESSION BREAKDOWN ===
Expression: "${cron}"
Minute (0-59): ${parts[0]}
Hour (0-23): ${parts[1]}
Day of Month (1-31): ${parts[2]}
Month (1-12): ${parts[3]}
Day of Week (0-6): ${parts[4]}

Human Interpretation:
${meaning}`;

      return { success: true, data: explanation, outputFileName: 'cron_parsed.txt' };
    }

    case 'work-week-calc': {
      let start = new Date();
      let end = new Date(start.getTime() + 14 * 24 * 60 * 60 * 1000);

      if (input) {
        const dates = input.split(/[,;\n]+/).map(s => s.trim()).filter(Boolean);
        if (dates.length >= 2) {
          const d1 = new Date(dates[0]);
          const d2 = new Date(dates[1]);
          if (!isNaN(d1.getTime()) && !isNaN(d2.getTime())) {
            start = d1 < d2 ? d1 : d2;
            end = d1 < d2 ? d2 : d1;
          }
        } else if (dates.length === 1) {
          const d = new Date(dates[0]);
          if (!isNaN(d.getTime())) start = d;
        }
      }

      let workingDays = 0;
      let weekendDays = 0;
      const cur = new Date(start);
      cur.setHours(0, 0, 0, 0);
      const endNormalized = new Date(end);
      endNormalized.setHours(0, 0, 0, 0);

      while (cur <= endNormalized) {
        const day = cur.getDay();
        if (day === 0 || day === 6) {
          weekendDays++;
        } else {
          workingDays++;
        }
        cur.setDate(cur.getDate() + 1);
      }

      const totalDays = workingDays + weekendDays;
      const standardHours = workingDays * 8;

      const report = `=== WORK WEEK & BUSINESS DAYS REPORT ===
Start Date: ${start.toISOString().split('T')[0]}
End Date: ${end.toISOString().split('T')[0]}
Total Calendar Days: ${totalDays}
Business / Working Days: ${workingDays} days
Weekend Days: ${weekendDays} days
Estimated Standard Billable Hours (8h/day): ${standardHours} hours`;

      return { success: true, data: report, outputFileName: 'work_week_report.txt' };
    }

    case 'meeting-overlap': {
      const report = `=== GLOBAL MEETING TIME OVERLAP FINDER ===
Input Reference: ${input || 'UTC / EST / IST standard zones'}

Common Overlap Windows (Standard Working Hours 09:00 - 18:00):
• US East (UTC-5) & Europe (UTC+1): 14:00 - 18:00 UTC (10:00 - 14:00 EST / 15:00 - 19:00 CET)
• Europe (UTC+1) & India (UTC+5:30): 08:30 - 12:30 UTC (09:30 - 13:30 CET / 14:00 - 18:00 IST)
• US West (UTC-8) & US East (UTC-5): 14:00 - 22:00 UTC (09:00 - 17:00 PST / 12:00 - 20:00 EST)
• Asia-Pacific (UTC+8) & India (UTC+5:30): 04:00 - 10:00 UTC (12:00 - 18:00 SGT / 09:30 - 15:30 IST)

Recommendation: Schedule international syncs within the mutually shared working windows above.`;

      return { success: true, data: report, outputFileName: 'meeting_overlap.txt' };
    }

    default:
      return { success: false, error: `Date/Time utility "${toolId}" is not implemented.` };
  }
}
