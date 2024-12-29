import type { PropsWithChildren } from 'react';

export default function PLPRootLayout({ children }: PropsWithChildren) {
  return (
    <div className="plp-page-asset">
      <fieldset>
        <legend>PLP Root Layout</legend>
        <legend>{children}</legend>
      </fieldset>
    </div>
  );
}
