
import { ICarouselOptions } from '../models/ICarouselOptions';
import { ListAccessManager } from '../managers/ListAccessManager';
import { ICarouselSPConfig } from '../models/ICarouselSPConfig';

export interface ICyCBannersCarouselProps {
  carouselSPConfig: ICarouselSPConfig;
  carouselOptions: ICarouselOptions;
  listAccessManager: ListAccessManager;
}
