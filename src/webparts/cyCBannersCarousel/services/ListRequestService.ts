import { ISPList } from "../models/ISPList";
import { Web } from "@pnp/sp";
import { SPBaseTemplateConstants } from "../utils/Constants";
import { ISPColumn } from "../models/ISPColumn";

//INSTALL PNP/SP: npm install @pnp/logging @pnp/common @pnp/odata @pnp/sp --save

export interface IListDataReader {
    GetLists(): Promise<ISPList[]>;
    GetFieldsFromList(listName:string): Promise<ISPColumn[]>;
    GetItemsFromList(listName: string): Promise<any[]>;
}

export class ListsRequestService implements IListDataReader { 

    private currentWeb: Web = null;

    constructor (webURL:string) {
        this.currentWeb = new Web(webURL);
    }

    public async GetLists(): Promise<ISPList[]> {
        let filters: string = "Hidden eq false and (BaseTemplate eq "+SPBaseTemplateConstants.CustomListBaseTemplate+")";
        return this.currentWeb.lists.filter(filters).select("Id,Title").get()
            .then((response) =>{ 
                return response;
            })
            .catch((error) => {
                console.error(error);
                return null;
            });
    }

    public async GetFieldsFromList(listName:string): Promise<ISPColumn[]> {
        return this.currentWeb.lists.getByTitle(listName).fields.filter("Hidden eq false and ReadOnlyField eq false").select("Id,InternalName,Title").get()
            .then((response) =>{ 
                return response;
            })
            .catch((error) => {
                console.error(error);
                return null;
            });
    }

    public async GetItemsFromList(listName: string): Promise<any[]> {
        return this.currentWeb.lists.getByTitle(listName).items.get()
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