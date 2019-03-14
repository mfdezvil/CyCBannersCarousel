import * as React from 'react';
import styles from './CyCBannersCarousel.module.scss';
import { ICyCBannersCarouselProps } from './ICyCBannersCarouselProps';
import { ICyCBannersCarouselState } from './ICyCBannersCarouselState';
import { Utils } from '../utils/Utils';
import { IBanner } from '../models/IBanner';
import {Card} from './Card/Card';
import * as strings from 'CyCBannersCarouselWebPartStrings';
import { CarouselSwiperManager } from '../managers/CarouselSwiperManager';
import { ICarouselSPConfig } from '../models/ICarouselSPConfig';
import { BannersDataHelper } from '../helpers/BannersDataHelper';

export default class CyCBannersCarousel extends React.Component<ICyCBannersCarouselProps, ICyCBannersCarouselState> {

  private _itemsFromList: any[] = null;
  private uniqueId: number;
  private carouselSwiperManager: CarouselSwiperManager;

  constructor(props: ICyCBannersCarouselProps) {
    super(props);
    this.state= {
      banners: [] 
    };
    this.uniqueId = Math.floor(Math.random() * 10000) + 1;
    this.carouselSwiperManager = new CarouselSwiperManager(this.uniqueId);
  }

  public componentDidMount() {
    let _self=this;
    if(!Utils.IsNullOrEmpty(this.props.carouselSPConfig.listName)) {
      this.props.listAccessManager.GetItemsFromList(this.props.carouselSPConfig.listName).then(
        (data) => {
          _self._itemsFromList= data;
          if(_self.IsCarouselSPConfigInitialized()) {
            _self.SetBannersData(data);
          }
        }
      );
      
    }
  }

  public componentDidUpdate(prevProps: ICyCBannersCarouselProps) {
    let _self=this;
    if(this.props.carouselSPConfig.listName != prevProps.carouselSPConfig.listName) {
      this.setState({banners: []});
      this._itemsFromList = null;
      this.props.listAccessManager.GetItemsFromList(this.props.carouselSPConfig.listName).then(
        (data) => {
          _self._itemsFromList= data;
          if(_self.IsCarouselSPConfigInitialized()) {
            _self.SetBannersData(data);
          }
        }
      );
    }
    else if(this.AreCarouselSPFieldsUpdated(this.props.carouselSPConfig, prevProps.carouselSPConfig)) {
        if(this.IsCarouselSPConfigInitialized()) {
          this.SetBannersData(this._itemsFromList);
        }
        else {
          this.setState({banners: []});
        }
    }  
    else if(this.carouselSwiperManager.AreCarouselPropertiesUpdated(this.props.carouselOptions,prevProps.carouselOptions)) {
        let hasBanners: boolean = (!Utils.IsNullOrEmpty(_self.state.banners) && _self.state.banners.length>0);
        this.carouselSwiperManager.UpdateCarousel(_self.props.carouselOptions, hasBanners);
    }

  }

  public render(): React.ReactElement<ICyCBannersCarouselProps> {
    if(!this.IsCarouselSPConfigInitialized()) {
      this.carouselSwiperManager.DestroyCarousel();
      return (
        <div className={ styles.cyCBannersCarousel }>
          <div className={styles.row}>
            <div className={styles.column}>
              <p className={styles.messageToShow}>{strings.NotConfiguredSourceData}</p>
            </div>
          </div>
        </div>
      );
    }
    if(Utils.IsNullOrEmpty(this.state.banners) || this.state.banners.length==0) {
      this.carouselSwiperManager.DestroyCarousel();
      return (
        <div className={ styles.cyCBannersCarousel }></div>
      );
    }
    return (
      <div className={ styles.cyCBannersCarousel }>
          <div className={`swiper-container ${styles.container} container-${this.uniqueId}`}>
            <div className='swiper-wrapper'>
              {this.state.banners.length &&
                this.state.banners.map((banner, i) => {
                  let sliderStyles = styles.slide;
                  if(this.props.carouselOptions.imageAsBackground && this.props.carouselOptions.slidesPerView == "1") {
                    sliderStyles= "";
                  }
                  return <div className={`swiper-slide ${sliderStyles}`} key={i}>
                    <Card banner={banner} key={banner.ID} imageAsBackground={this.props.carouselOptions.imageAsBackground} height={this.props.carouselOptions.height}/>
                  </div>;
                })}
            </div>

            {this.props.carouselOptions.enableNavigation &&
              <div className={`swiper-button-next next-${this.uniqueId}`}></div>
            }
            {this.props.carouselOptions.enableNavigation &&
              <div className={`swiper-button-prev prev-${this.uniqueId}`}></div>
            }

            {this.props.carouselOptions.enablePagination !== false &&
              <div className={`swiper-pagination pagination-${this.uniqueId}`}></div>
            }
          </div>
      </div>
    );
  }

  private SetBannersData(data: any[]): void {
    let _self= this;
    if(!Utils.IsNullOrEmpty(data) && data.length>0) {
      let bannersToAdd: IBanner[] = BannersDataHelper.FillBannersSPData(data, this.props.carouselSPConfig);
      _self.setState({..._self.state, banners: bannersToAdd } );
    }
    else {
      _self.setState({..._self.state, banners: [] } );
    }
    //HACK: La actualización del "setState" no es inmediata, y es necesario que los items estén añadidos/actualizados antes de actualizar el carrusel
    setTimeout(()=>{
      let hasBanners: boolean = (!Utils.IsNullOrEmpty(_self.state.banners) && _self.state.banners.length>0);
      _self.carouselSwiperManager.UpdateCarousel(_self.props.carouselOptions, hasBanners);
    },0);
  }

  private IsCarouselSPConfigInitialized():boolean {
    return(!Utils.IsNullOrEmpty(this.props.carouselSPConfig.listName) && 
           !Utils.IsNullOrEmpty(this.props.carouselSPConfig.fieldTitle) && 
           !Utils.IsNullOrEmpty(this.props.carouselSPConfig.fieldURL) && 
           !Utils.IsNullOrEmpty(this.props.carouselSPConfig.fieldImage));
  }

  private AreCarouselSPFieldsUpdated(currentCarouselSPConfig: ICarouselSPConfig, prevCarouselSPConfig: ICarouselSPConfig):boolean {
    return !(currentCarouselSPConfig.fieldTitle == prevCarouselSPConfig.fieldTitle && 
            currentCarouselSPConfig.fieldSubtitle == prevCarouselSPConfig.fieldSubtitle && 
            currentCarouselSPConfig.fieldImage == prevCarouselSPConfig.fieldImage &&
            currentCarouselSPConfig.fieldURL == prevCarouselSPConfig.fieldURL);
  }

}
