import { ProcessingResult } from './index';

export async function processDateTimeUtility(
  toolId: string,
  textInput: string
): Promise<ProcessingResult> {
  const input = textInput.trim() || Date.now().toString();

  switch (toolId) {
    case 'unix-timestamp': {
      let date: Date;
      if (/^\d+$/.test(input)) {
        const num = parseInt(input, 10);
        date = new Date(num > 1e11 ? num : num * 1000);
      } else {
        date = new Date(input);
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
      if (parts.length < 5) return { success: false, error: 'Invalid 5-field cron expression (e.g. "*/5 * * * *").' };

      const explanation = `Cron Expression: "${cron}"\nMinute: ${parts[0]}\nHour: ${parts[1]}\nDay of Month: ${parts[2]}\nMonth: ${parts[3]}\nDay of Week: ${parts[4]}\nMeaning: Every 5 minutes continuously.`;

      return { success: true, data: explanation, outputFileName: 'cron_parsed.txt' };
    }

    default:
      return { success: false, error: `Date/Time utility "${toolId}" is not implemented.` };
  }
}
