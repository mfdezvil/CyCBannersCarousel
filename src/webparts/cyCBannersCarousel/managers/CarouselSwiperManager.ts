import { ICarouselOptions } from "../models/ICarouselOptions";

//Necesario Swiper, para su instalación:
// npm install swiper
const Swiper: any = require('swiper/dist/js/swiper.min');

export class CarouselSwiperManager {

    private swiper: any = null;
    private uniqueID: number;

    constructor(uniqueID:number) {
        this.uniqueID= uniqueID;
    }

    public SetCarousel(carouselOptions: ICarouselOptions, hasBanners: boolean):void {
        if(hasBanners && this.swiper==null) {
          const options: any= this.GetCarouselOptionsForSwiper(carouselOptions);
          this.swiper= new Swiper(`.container-${this.uniqueID}`, options);
        }
    }

    public UpdateCarousel(carouselOptions: ICarouselOptions, hasBanners: boolean):void {
        //this.swiper.update(); //se supone que el método update() del swiper lo actualiza, pero no me funcionaba dinámicamente.
        //HACK: Se borra el swiper actual y se vuelve a crear.
        this.DestroyCarousel();
        this.SetCarousel(carouselOptions, hasBanners);
      }
    
    public DestroyCarousel():void {
        if(this.swiper != null) {
            this.swiper.destroy(true, true);
            this.swiper= null;
        }
    }

    public AreCarouselPropertiesUpdated(currentProps: ICarouselOptions, prevProps:ICarouselOptions): boolean {
        return !(currentProps.delayAutoplay == prevProps.delayAutoplay && currentProps.disableAutoplayOnInteraction==prevProps.disableAutoplayOnInteraction &&
          currentProps.enableAutoplay == prevProps.enableAutoplay && currentProps.enableLoop == prevProps.enableLoop && 
          currentProps.enableNavigation == prevProps.enableNavigation && currentProps.enablePagination == prevProps.enablePagination && 
          currentProps.slidesPerView == prevProps.slidesPerView && currentProps.spaceBetweenSlides == prevProps.spaceBetweenSlides && 
          currentProps.imageAsBackground == prevProps.imageAsBackground && currentProps.speed == prevProps.speed &&
          currentProps.height == prevProps.height);
    }

    private GetCarouselOptionsForSwiper(selectedOptions:ICarouselOptions):any {
        const opts = selectedOptions;
        //Lista de propiedades del Swiper: http://idangero.us/swiper/api/#parameters
        const options: any = {
            speed: (parseInt(opts.speed)) || 500,
            slidesPerView: parseInt(opts.slidesPerView) || 3,
            slidesPerGroup: parseInt(opts.slidesPerView) || 3,
            spaceBetween: parseInt(opts.spaceBetweenSlides) || 10,
            loop: opts.enableLoop || false,
            breakpoints: {
                1024: {
                    slidesPerView: 3,
                    spaceBetween: 10,
                },
                768: {
                    slidesPerView: 2,
                    spaceBetween: 10,
                },
                640: {
                    slidesPerView: 1,
                    spaceBetween: 5,
                },
                320: {
                    slidesPerView: 1,
                    spaceBetween: 5,
                }
            }
        };
    
        if (opts.enablePagination !== false) {
            options.pagination = {
                el: `.pagination-${this.uniqueID}`,
                clickable: true,
            };
        }
    
        if (opts.enableNavigation) {
            options.navigation = {
                nextEl: `.next-${this.uniqueID}`,
                prevEl: `.prev-${this.uniqueID}`,
            };
        }
    
        if (opts.enableAutoplay) {
            options.autoplay = {
                delay: opts.delayAutoplay,
                disableOnInteraction: opts.disableAutoplayOnInteraction,
            };
        }

        if (opts.imageAsBackground && opts.slidesPerView=="1") {
            options.effect = "fade";
        }

        return options;
    }

    

}