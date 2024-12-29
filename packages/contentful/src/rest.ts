import resolveResponse from 'contentful-resolve-response';
import jsonStringifySafe from 'json-stringify-safe';

import type { ContentfulCollection } from './interface';

function mixinStringifySafe<T = unknown>(data: T) {
  return Object.defineProperty(data, 'stringifySafe', {
    enumerable: false,
    configurable: false,
    writable: false,
    value: function (serializer = null, indent = '') {
      return jsonStringifySafe(this, serializer, indent, (_, value) => {
        return {
          sys: {
            type: 'Link',
            linkType: 'Entry',
            id: value.sys.id,
            circular: true,
          },
        };
      });
    },
  });
}

function resolveCircular<T = unknown>(data: T) {
  const wrappedData = mixinStringifySafe(data);
  (wrappedData as any).items = resolveResponse(wrappedData, {
    removeUnresolved: true,
    itemEntryPoints: ['fields'],
  });
  return wrappedData;
}

function normalizeSearchParameters(query: Record<string, unknown>) {
  const params = new URLSearchParams();
  for (const key in query) {
    if (Array.isArray(query[key])) {
      params.append(key, (query[key] as unknown[]).join(','));
    } else {
      params.append(key, `${query[key]}`);
    }
  }
  return params.toString();
}

function check(space?: string, accessToken?: string, environment?: string, host?: string) {
  if (!space) {
    throw new Error('@repo/contentful: space is required');
  }
  if (!accessToken) {
    throw new Error('@repo/contentful: accessToken is required');
  }
  if (!environment) {
    throw new Error('@repo/contentful: environment is required');
  }
  if (!host) {
    throw new Error('@repo/contentful: host is required');
  }
}

export interface CreateClientParams {
  space?: string;
  accessToken?: string;
  environment?: string;
  host?: string;
}

export function createClient(clientParams: CreateClientParams) {
  const { space, accessToken, environment, host } = clientParams;
  check(space, accessToken, environment, host);
  async function get<T>(
    type: string,
    params: Record<string, unknown>,
    init: RequestInit = {},
  ): Promise<ContentfulCollection<T>> {
    const baseUrl = `https://${host}/spaces/${space}/environments/${environment}/${type}?access_token=${accessToken}`;

    const query = normalizeSearchParameters(params);
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 30000);
    try {
      console.log(`Call to Contentful API started: ${query}`);
      const response = await fetch(`${baseUrl}&${query}`, {
        ...init,
        signal: controller.signal,
      }).then((res) => res.json());
      console.log(`Call to Contentful API completed: ${query}`);
      return resolveCircular(response);
    } catch (e) {
      console.error(e, `Call to Contentful API failed`, query);
      throw e;
    } finally {
      clearTimeout(timeoutId);
    }
  }

  async function getEntries<T>(params: Record<string, unknown>, init?: RequestInit) {
    return get<T>('entries', params, init);
  }

  return { getEntries };
}
