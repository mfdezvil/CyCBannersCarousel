import { WebPartContext } from '@microsoft/sp-webpart-base';
import { ICarouselOptions } from '../entities/ICarouselOptions';

export interface ICyCBannersCarouselProps {
  listName: string;
  fieldTitle: string;
  fieldSubtitle: string;
  fieldImage: string;
  fieldURL: string;
  carouselOptions: ICarouselOptions;
  context: WebPartContext;
}
