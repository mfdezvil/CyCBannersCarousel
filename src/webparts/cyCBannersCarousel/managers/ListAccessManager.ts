import { ISPList } from "../models/ISPList";
import {
    Environment,
    EnvironmentType
  } from '@microsoft/sp-core-library';
import { ListDataMock } from "../services/mocks/ListDataMock";
import { ISPColumn } from "../models/ISPColumn";
import { ListsRequestService, IListDataReader } from "../services/ListRequestService";

export class ListAccessManager {

    private listDataReader: IListDataReader;

    constructor(webURL:string) {
        if (Environment.type === EnvironmentType.Local) {
            this.listDataReader = new ListDataMock(null);
        }
        else if (Environment.type == EnvironmentType.SharePoint || 
                  Environment.type == EnvironmentType.ClassicSharePoint) {
            this.listDataReader = new ListsRequestService(webURL);
        }
    }

    public GetLists(): Promise<ISPList[]> {
        return this.listDataReader.GetLists();
    }

    public GetFieldsFromList(listName: string): Promise<ISPColumn[]> {
        return this.listDataReader.GetFieldsFromList(listName);
    }

    public GetItemsFromList(listName: string): Promise<any[]> {
        return this.listDataReader.GetItemsFromList(listName);
    }

}