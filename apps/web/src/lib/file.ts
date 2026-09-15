export async function calculateSHA256(file: File): Promise<string> {
  try {
    const buffer = await file.arrayBuffer();
    const hashBuffer = await crypto.subtle.digest('SHA-256', buffer);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  } catch (err) {
    console.error("Error hashing file:", err);
    return "Error calculating hash";
  }
}

export function formatBytes(bytes: number, decimals = 2) {
  if (!Number.isFinite(bytes) || bytes === 0) return '0 Bytes';
  const sign = bytes < 0 ? '-' : '';
  const absBytes = Math.abs(bytes);
  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB'];
  const i = Math.min(Math.floor(Math.log(absBytes) / Math.log(k)), sizes.length - 1);
  return `${sign}${parseFloat((absBytes / Math.pow(k, i)).toFixed(dm))} ${sizes[i]}`;
}
