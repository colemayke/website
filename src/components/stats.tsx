import { useMemo } from 'react';
import { useFirstEverLoad, useVisitCounts } from '../hooks/use-first-ever-load';

export function Stats() {
  const [stats] = useFirstEverLoad();
  const [visits] = useVisitCounts();

  const firstEverLoadTime = useMemo(() => new Date(stats.time), [stats.time]);

  return (
    <div>
      <p>
        You first visited my website on {firstEverLoadTime.toLocaleDateString()} at{' '}
        {firstEverLoadTime.toLocaleTimeString()}. Since then, you have visited {visits - 1} more times.{' '}
        {visits > 1 && 'Thanks for coming back!'}
      </p>
    </div>
  );
}