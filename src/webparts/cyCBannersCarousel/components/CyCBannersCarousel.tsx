import * as React from 'react';
import styles from './CyCBannersCarousel.module.scss';
import { ICyCBannersCarouselProps } from './ICyCBannersCarouselProps';
import { escape } from '@microsoft/sp-lodash-subset';
import { ICyCBannersCarouselState } from './ICyCBannersCarouselState';
import { ListsRequestService } from '../services/ListRequestService';
import { Utils } from '../commons/Utils';
import { IBanner } from '../entities/IBanner';
import { ISPImage, ISPUrl } from '../entities/ISPLink';
import { SPFieldsConstants } from '../commons/Constants';
import {Card} from './Card/Card';
import { CarouselHelper } from '../helpers/CarouselHelper';
import * as strings from 'CyCBannersCarouselWebPartStrings';

//Necesario Swiper, para su instalación:
// npm install swiper
const Swiper: any = require('swiper/dist/js/swiper.min');

export default class CyCBannersCarousel extends React.Component<ICyCBannersCarouselProps, ICyCBannersCarouselState> {

  private _itemsFromList: any[] = null;
  private uniqueId: number;
  private swiper: any = null;

  constructor(props: ICyCBannersCarouselProps) {
    super(props);
    this.state= {
      banners: [] 
    };
    this.uniqueId = Math.floor(Math.random() * 10000) + 1;
  }

  public componentDidMount() {
    var _self=this;
    if(!Utils.IsNullOrEmpty(this.props.listName)) {
      
      ListsRequestService.GetItemsFromList(this.props.context.pageContext.web.absoluteUrl, this.props.listName).then(
        (data) => {
          _self._itemsFromList= data;
          if(!Utils.IsNullOrEmpty(this.props.fieldTitle) && !Utils.IsNullOrEmpty(this.props.fieldURL) && !Utils.IsNullOrEmpty(this.props.fieldImage)) {
            _self.SetBannersData(data);
          }
        }
      );
      
    }
  }

  public componentDidUpdate(prevProps: ICyCBannersCarouselProps) {
    var _self=this;
    if(this.props.listName != prevProps.listName) {
      ListsRequestService.GetItemsFromList(this.props.context.pageContext.web.absoluteUrl, this.props.listName).then(
        (data) => {
          _self._itemsFromList= data;
          if(_self.IsSPDataConfigured()) {
            _self.SetBannersData(data);
          }
        }
      );
    }
    else if(this.props.fieldTitle != prevProps.fieldTitle || this.props.fieldSubtitle != prevProps.fieldSubtitle || 
      this.props.fieldImage != prevProps.fieldImage || this.props.fieldURL != prevProps.fieldURL) {
        this.SetBannersData(this._itemsFromList);
    }  
    else if(CarouselHelper.AreCarouselPropertiesUpdated(this.props.carouselOptions,prevProps.carouselOptions)) {
        _self.UpdateCarousel();
    }

  }

  public render(): React.ReactElement<ICyCBannersCarouselProps> {
    if(!this.IsSPDataConfigured()) {
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
    var _self= this;
    if(!Utils.IsNullOrEmpty(data) && data.length>0) {
      var bannersToAdd: IBanner[] = [];
      data.forEach(item => {
        var bannerToAdd: IBanner= {ID: null, Title: null, Subtitle: null, Image: null, URL: null};
        bannerToAdd.ID = item[SPFieldsConstants.ID];
        for (var key in item) {
          if(key == _self.props.fieldTitle){
            bannerToAdd.Title = item[key];
          }
          if(key == _self.props.fieldSubtitle){
            bannerToAdd.Subtitle = item[key];
          }
          if(key == _self.props.fieldImage){
            let image: ISPImage = (item[key] != null && !Utils.IsNullOrEmpty(item[key].Url)) ? item[key] : null;
            bannerToAdd.Image = image;
          }
          if(key == _self.props.fieldURL){
            let url: ISPUrl = (item[key] != null && !Utils.IsNullOrEmpty(item[key].Url)) ? item[key] : null;
            bannerToAdd.URL = url.Url;
          }
        }
        bannersToAdd.push(bannerToAdd);
      });
      _self.setState({..._self.state, banners: bannersToAdd } );
    }
    else {
      _self.setState({..._self.state, banners: [] } );
    }
    //HACK: La actualización del "setState" no es inmediata, y es necesario que los items estén añadidos/actualizados antes de actualizar el carrusel
    setTimeout(()=>{
      _self.UpdateCarousel();
    },0);
  }

  private SetCarousel():void {
    const options: any= CarouselHelper.GetCarouselOptionsForSwiper(this.props.carouselOptions, this.uniqueId);
    this.swiper= new Swiper(`.container-${this.uniqueId}`, options);
  }

  private UpdateCarousel():void {
    if(this.swiper != null) {
      //this.swiper.update(); //se supone que el método update() del swiper lo actualiza, pero no me funcionaba dinámicamente.
      //HACK: Se borra el swiper actual y se vuelve a crear.
      this.swiper.destroy(true, true);
      this.SetCarousel();
    }      
    else
      this.SetCarousel();
  }

  private IsSPDataConfigured():boolean {
    return(!Utils.IsNullOrEmpty(this.props.listName) && 
           !Utils.IsNullOrEmpty(this.props.fieldTitle) && !Utils.IsNullOrEmpty(this.props.fieldURL) && !Utils.IsNullOrEmpty(this.props.fieldImage));
  }

}
