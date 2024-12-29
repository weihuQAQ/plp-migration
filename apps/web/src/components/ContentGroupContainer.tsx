import type { PropsWithChildren } from 'react';

export function ContentGroupContainer({
  children,
  configJson,
}: PropsWithChildren<{ configJson?: Record<string, string> }>) {
  return (
    <div className="content-group-container">
      <fieldset>
        <legend>Content Group Container</legend>
        {/* tw-flex */}
        <legend className={configJson?.className}>{children}</legend>
      </fieldset>
    </div>
  );
}
