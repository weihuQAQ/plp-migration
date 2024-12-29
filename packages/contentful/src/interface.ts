import type { ContentGroup, FunctionalWidget, PageTemplate } from './typings';

export interface ContentfulLink {
  type: 'Link';
  id: string;
}

export interface ContentfulEntitySys {
  type: string;
  id: string;
  createdAt: string;
  updatedAt: string;
  revision: number;
  space: {
    sys: ContentfulLink;
  };
  environment: {
    sys: ContentfulLink;
  };
  locale?: string;
}
export interface ContentfulEntity<T> {
  sys: ContentfulEntitySys;
  fields: T;
}

export interface ContentfulCollection<T> {
  total: number;
  skip: number;
  limit: number;
  items: Array<T>;
  errors?: Array<unknown>;
}

export type ContentfulWidget =
  | ContentfulEntity<ContentGroup<unknown, unknown>>
  | ContentfulEntity<FunctionalWidget<unknown>>;

export type ContentfulPLPPageAsset = ContentfulEntity<
  PageTemplate<ContentfulWidget, ContentfulWidget, ContentfulWidget>
>;
