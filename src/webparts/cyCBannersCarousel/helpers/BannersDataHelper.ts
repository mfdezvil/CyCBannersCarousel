import { IBanner } from "../models/IBanner";
import { SPFieldsConstants } from "../utils/Constants";
import { ICarouselSPConfig } from "../models/ICarouselSPConfig";
import { Utils } from "../utils/Utils";

export class BannersDataHelper {
    public static FillBannersSPData(data: any[], carouselSPConfig:ICarouselSPConfig):IBanner[] {
        let bannersToAdd: IBanner[] = [];
        try{
            data.forEach(item => {
                let bannerToAdd: IBanner= {ID: null, Title: null, Subtitle: null, Image: null, URL: null};
                bannerToAdd.ID = item[SPFieldsConstants.ID];
                for (var key in item) {
                  if(key == carouselSPConfig.fieldTitle){
                    if(!Utils.IsNullOrEmpty(item[key]) && typeof item[key] == "object")
                      throw `Field Title is not a valid text field column`;
                    bannerToAdd.Title = item[key];
                  }
                  if(key == carouselSPConfig.fieldSubtitle){
                    if(!Utils.IsNullOrEmpty(item[key]) && typeof item[key] == "object")
                      throw `Field Subtitle is not a valid text field column`;
                    bannerToAdd.Subtitle = item[key];
                  }
                  if(key == carouselSPConfig.fieldImage){
                    this.CheckValidSPLinkValue("Image", item[key]);
                    bannerToAdd.Image = item[key];
                  }
                  if(key == carouselSPConfig.fieldURL){
                    this.CheckValidSPLinkValue("URL", item[key]); 
                    bannerToAdd.URL = item[key].Url;
                  }
                }
                bannersToAdd.push(bannerToAdd);
            });
            return bannersToAdd;
        }
        catch(error) {
            console.error("Error at FillBannersSPData: Cannot fill property field.");
            console.error(error);
            return [];
        }
    }

    private static CheckValidSPLinkValue(field: string, value: any):void {
        if(Utils.IsNullOrEmpty(value)) {
            throw `Field ${field} is empty in one or more banner items`;
        }
        if(Utils.IsNullOrEmpty(value.Url)) {
            throw `URL value is empty in field ${field} in one or more banner items`;
        }
    }
}