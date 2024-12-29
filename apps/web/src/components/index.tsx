import { ContentGroupContainer } from './ContentGroupContainer';
import { FooterMenu } from './FooterMenu';
import { GlobalHeader } from './globalHeader';
import { NoStructContainer } from './no-struct-container';

function NamedComponent({ name }: { name: string }) {
  return <div>{name}</div>;
}

export const componentsMaps = {
  NoStructContainer,
  GlobalHeader,
  FooterMenu,
  ContentGroupContainer,
  NewPLPFilter: NamedComponent,
  PLPHeaderBanner: NamedComponent,
  NewPLPHeader: NamedComponent,
  PillFilter: NamedComponent,
  AppliedFilters: NamedComponent,
  NewProductList: NamedComponent,
  RelatedProducts: NamedComponent,
  LiveStream: NamedComponent,
  ThemeBanner: NamedComponent,
  NewTrustBar: NamedComponent,
};
