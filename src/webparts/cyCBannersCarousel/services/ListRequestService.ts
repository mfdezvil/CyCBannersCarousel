import { ISPList } from "../entities/ISPList";
import {
    Environment,
    EnvironmentType
  } from '@microsoft/sp-core-library';
import { Web } from "@pnp/sp";
import { SPBaseTemplateConstants } from "../commons/Constants";
import { MockData } from "./mocks/MockData";
import { ISPColumn } from "../entities/ISPColumn";

//INSTALL PNP/SP: npm install @pnp/logging @pnp/common @pnp/odata @pnp/sp --save

export class ListsRequestService { 
    public static GetLists(webURL: string): Promise<ISPList[]> {
        if (Environment.type === EnvironmentType.Local) {
            return MockData.GetListsMockData();
        }
        else if (Environment.type == EnvironmentType.SharePoint || 
                  Environment.type == EnvironmentType.ClassicSharePoint) {
            return ListsRequestService.GetListsFromWeb(webURL);
        }
    }

    public static GetFieldsFromList(webURL: string, listName: string): Promise<ISPColumn[]> {
        if (Environment.type === EnvironmentType.Local) {
            return MockData.GetFieldsMockData();
        }
        else if (Environment.type == EnvironmentType.SharePoint || 
                  Environment.type == EnvironmentType.ClassicSharePoint) {
            return ListsRequestService.GetListFields(webURL, listName);
        }
    }

    public static GetItemsFromList(webURL: string, listName: string): Promise<any[]> {
        if (Environment.type === EnvironmentType.Local) {
            return MockData.GetItemsMockData();
        }
        else if (Environment.type == EnvironmentType.SharePoint || 
                  Environment.type == EnvironmentType.ClassicSharePoint) {
            return ListsRequestService.GetItemsFromSPList(webURL, listName);
        }
    }

    
    private static GetListsFromWeb(webURL: string): Promise<ISPList[]> {
        //CON PnPJs
        const web: Web = new Web(webURL);
        //let filtersLibrary: string = "Hidden eq false and (BaseTemplate eq "+SPBaseTemplateConstants.DocumentLibraryBaseTemplate+" or BaseTemplate eq "+SPBaseTemplateConstants.PictureLibraryBaseTemplate+")";
        let filters: string = "Hidden eq false and (BaseTemplate eq "+SPBaseTemplateConstants.CustomListBaseTemplate+")";
        return web.lists.filter(filters).select("Id,Title").get()
            .then((response) =>{ 
                return response;
            })
            .catch((error) => {
                console.error(error);
                return null;
            });
    }

    private static GetListFields(webURL: string, listName:string): Promise<ISPColumn[]> {
        //CON PnPJs
        const web: Web = new Web(webURL);
        return web.lists.getByTitle(listName).fields.filter("Hidden eq false and ReadOnlyField eq false").select("Id,InternalName,Title").get()
            .then((response) =>{ 
                return response;
            })
            .catch((error) => {
                console.error(error);
                return null;
            });
    }

    private static GetItemsFromSPList(webURL:string, listName: string): Promise<any[]> {
        const web: Web = new Web(webURL);
        return web.lists.getByTitle(listName).items.get()
            .then((response: any) =>{
                if(response == null || response.error != null) {
                    console.error("ERROR at GetFirstItemFromList: "+response.error.message);
                    return null;
                }
                return response;
            })
            .catch((error) => {
                console.error("ERROR at GetFirstItemFromList");
                console.error(error);
                return null;
            });

    }
}