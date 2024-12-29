import { ContentfulPLPPageLayout } from '@repo/contentful/server';

import { componentsMaps } from '@/components';

interface PageProps {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}

export default async function Page(props: PageProps) {
  const { searchParams } = props;

  const search = await searchParams;

  console.log(123, search);

  return (
    <div>
      <span>search</span>
      <ContentfulPLPPageLayout componentsMap={componentsMaps} locale="en-US" url="/search" />
    </div>
  );
}
