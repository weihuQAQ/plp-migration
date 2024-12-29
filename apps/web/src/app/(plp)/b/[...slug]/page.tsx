import { queryPLPPageAsset } from '@repo/contentful';
import { ContentfulPLPPageLayout } from '@repo/contentful/server';

import { componentsMaps } from '@/components';
import { Log } from '@/components/log';

interface PageProps {
  params: Promise<{ slug: string[] }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}

export default async function Page(props: PageProps) {
  const { params } = props;

  const slug = (await params).slug;

  // query page
  const s = await queryPLPPageAsset(
    { locale: 'en-US', url: `/b/${slug.join('/')}` },
    { next: { revalidate: 300 } },
  );

  return (
    <div>
      <ContentfulPLPPageLayout
        componentsMap={componentsMaps}
        fetchOptions={{ next: { revalidate: 300 } }}
        locale="en-US"
        url={`/b/${slug.join('/')}`}
      />
      <Log content={s} />
    </div>
  );
}
