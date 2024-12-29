import { type ComponentType } from 'react';
import _ from 'lodash';

import type { QueryPLPPageAssetParams } from '../index';
import { queryPLPPageAsset } from '../index';

import type { ContentfulWidget } from '../interface';
import type { ContentGroup } from '../typings';

export interface ContentfulComponentsProps {
  widgets: unknown;
  componentsMap: unknown;
}
export const ContentfulComponents = (props: ContentfulComponentsProps) => {
  const { widgets, componentsMap } = props;
  return (_.castArray(widgets) as ContentfulWidget[]).map((widget, index) => {
    const { fields, sys } = widget;
    const { componentType } = fields;

    const Component = (componentsMap as Record<string, ComponentType<Record<string, unknown>>>)[
      componentType
    ];

    if (!Component) {
      console.warn(
        `Component ${componentType} not found in ${Object.keys(componentsMap as Record<string, unknown>)}.`,
      );
      return null;
    }

    const temp = { ...fields };

    const group = ['NoStructContainer', 'ContentGroupContainer'];

    if (group.includes(componentType)) {
      const { content } = fields as ContentGroup<unknown, unknown>;
      return (
        <Component key={`${sys.id}-${index}`} {...temp}>
          <ContentfulComponents widgets={content} componentsMap={componentsMap} />
        </Component>
      );
    }

    return <Component key={`${sys.id}-${index}`} {...temp} />;
  });
};

export interface ContentfulTemplateContentProps extends QueryPLPPageAssetParams {
  componentsMap: unknown;
  fetchOptions?: RequestInit;
}

export const ContentfulPLPPageLayout = async (props: ContentfulTemplateContentProps) => {
  const { locale, url, componentsMap, fetchOptions } = props;
  const page = await queryPLPPageAsset({ locale, url }, fetchOptions);

  return (
    <>
      {page!.fields.headerContent && (
        <ContentfulComponents widgets={page!.fields.headerContent} componentsMap={componentsMap} />
      )}
      {page!.fields.bodyContent && (
        <ContentfulComponents widgets={page!.fields.bodyContent} componentsMap={componentsMap} />
      )}
      {page!.fields.footerContent && (
        <ContentfulComponents widgets={page!.fields.footerContent} componentsMap={componentsMap} />
      )}
    </>
  );
};
