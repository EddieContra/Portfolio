import { useEffect, useState } from 'react';

const ZONES = [
  { label: 'ARS', tz: 'Africa/Dar_es_Salaam' }, // Arusha (EAT, UTC+3)
  { label: 'LDN', tz: 'Europe/London' },
  { label: 'NYC', tz: 'America/New_York' },
  { label: 'TYO', tz: 'Asia/Tokyo' },
];

function formatTime(date, tz) {
  return new Intl.DateTimeFormat('en-GB', {
    timeZone: tz,
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  }).format(date);
}

export default function Clock({ className = '' }) {
  const [now, setNow] = useState(() => new Date());

  useEffect(() => {
    // Tick on the next minute boundary, then every 60s
    const ms = 60_000 - (Date.now() % 60_000);
    let interval;
    const timeout = setTimeout(() => {
      setNow(new Date());
      interval = setInterval(() => setNow(new Date()), 60_000);
    }, ms);
    return () => {
      clearTimeout(timeout);
      if (interval) clearInterval(interval);
    };
  }, []);

  return (
    <div
      className={`flex gap-4 sm:gap-5 items-center font-sans tabular-nums text-xs ${className}`}
      aria-label="Current time across world cities"
    >
      {ZONES.map((z) => (
        <div key={z.label} className="flex items-center gap-1.5">
          <span className="font-bold tracking-wider">{z.label}</span>
          <span className="text-muted">{formatTime(now, z.tz)}</span>
        </div>
      ))}
    </div>
  );
}
