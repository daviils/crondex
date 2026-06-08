export function formatLogEntry(date: Date, status: string, details?: string): string {
  const lines = [`[${formatDate(date)}]`, status];

  if (details) {
    lines.push('', details);
  }

  return `${lines.join('\n')}\n\n`;
}

function formatDate(date: Date): string {
  const year = date.getFullYear();
  const month = pad(date.getMonth() + 1);
  const day = pad(date.getDate());
  const hour = pad(date.getHours());
  const minute = pad(date.getMinutes());
  const second = pad(date.getSeconds());

  return `${year}-${month}-${day} ${hour}:${minute}:${second}`;
}

function pad(value: number): string {
  return String(value).padStart(2, '0');
}
