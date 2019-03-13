import { ICarouselOptions } from "../entities/ICarouselOptions";

export class CarouselHelper {

    public static GetCarouselOptionsForSwiper(selectedOptions:ICarouselOptions, uniqueID:number):any {
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
                el: `.pagination-${uniqueID}`,
                clickable: true,
            };
        }
    
        if (opts.enableNavigation) {
            options.navigation = {
                nextEl: `.next-${uniqueID}`,
                prevEl: `.prev-${uniqueID}`,
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

    public static AreCarouselPropertiesUpdated(currentProps: ICarouselOptions, prevProps:ICarouselOptions): boolean {
        return !(currentProps.delayAutoplay == prevProps.delayAutoplay && currentProps.disableAutoplayOnInteraction==prevProps.disableAutoplayOnInteraction &&
          currentProps.enableAutoplay == prevProps.enableAutoplay && currentProps.enableLoop == prevProps.enableLoop && 
          currentProps.enableNavigation == prevProps.enableNavigation && currentProps.enablePagination == prevProps.enablePagination && 
          currentProps.slidesPerView == prevProps.slidesPerView && currentProps.spaceBetweenSlides == prevProps.spaceBetweenSlides && 
          currentProps.imageAsBackground == prevProps.imageAsBackground && currentProps.speed == prevProps.speed &&
          currentProps.height == prevProps.height);
    }

}