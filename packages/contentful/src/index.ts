import { createClient } from './rest';

import type { ContentfulPLPPageAsset } from './interface';
import type { Locales } from './typings';

const client = createClient({
  space: process.env.CONTENTFUL_SPACE_ID,
  accessToken: process.env.CONTENTFUL_ACCESS_TOKEN,
  environment: process.env.CONTENTFUL_ENVIRONMENT,
  host: process.env.CONTENTFUL_HOST,
});

export type QueryPLPPageAssetParams = {
  locale: Locales;
  url: string;
};

export const queryPLPPageAsset = async (params: QueryPLPPageAssetParams, init?: RequestInit) => {
  const { locale, url } = params;
  const response = await client.getEntries(
    {
      content_type: 'plpPageAsset',
      locale,
      'fields.url': url,
      include: 10,
    },
    init,
  );
  if (response.items.length === 0) {
    console.error(`Not found plp page asset`);
    return null;
  }
  return response.items[0] as unknown as ContentfulPLPPageAsset;
};
