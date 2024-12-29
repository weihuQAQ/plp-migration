'use client';

import { useEffect } from 'react';

export function Log(props: { content: unknown }) {
  useEffect(() => {
    console.log(props.content);
  }, [props.content]);

  return null;
}
