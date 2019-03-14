import { ISPList } from "../../models/ISPList";
import { ISPColumn } from "../../models/ISPColumn";
import { IListDataReader } from "../ListRequestService";

export class ListDataMock implements IListDataReader {
    private static _lists: ISPList[] = [{Title: "Mock List", Id: "1"},
                                        {Title: "Mock List 2", Id: "2"},
                                        {Title: "Mock List 3", Id: "3"}];

    private static _columns: ISPColumn[] = [{Title: "Mock column title", InternalName: "MockColumn", Id: "1"},
                                            {Title: "Mock column subtitle", InternalName: "MockColumn2", Id: "2"},
                                            {Title: "Mock column Image", InternalName: "MockColumn3", Id: "3"},
                                            {Title: "Mock column URL", InternalName: "MockColumn4", Id: "4"}];

    private static _items: any[] = [
        {ID: 1, MockColumn: "Banner 1", MockColumn2: "This is a subtitle", MockColumn3: {Description:"https://i.imgur.com/z7DhU6n.jpg", Url:"https://i.imgur.com/z7DhU6n.jpg"}, MockColumn4: {Description:"https://www.cyc.es", Url:"https://www.cyc.es"}},
        {ID: 2, MockColumn: "Banner 2", MockColumn2: "This is a subtitle 2", MockColumn3: {Description:"https://i.imgur.com/z7DhU6n.jpg", Url:"https://i.imgur.com/z7DhU6n.jpg"}, MockColumn4: {Description:"https://www.cyc.es", Url:"https://www.cyc.es"}},
        {ID: 3, MockColumn: "Banner 3", MockColumn2: "This is a subtitle", MockColumn3: {Description:"https://i.imgur.com/z7DhU6n.jpg", Url:"https://i.imgur.com/z7DhU6n.jpg"}, MockColumn4: {Description:"https://www.cyc.es", Url:"https://www.cyc.es"}},
        {ID: 4, MockColumn: "Banner 4", MockColumn2: "This is a subtitle 2", MockColumn3: {Description:"https://i.imgur.com/z7DhU6n.jpg", Url:"https://i.imgur.com/z7DhU6n.jpg"}, MockColumn4: {Description:"https://www.cyc.es", Url:"https://www.cyc.es"}},
        {ID: 5, MockColumn: "Banner 5", MockColumn2: "This is a subtitle", MockColumn3: {Description:"https://i.imgur.com/z7DhU6n.jpg", Url:"https://i.imgur.com/z7DhU6n.jpg"}, MockColumn4: {Description:"https://www.cyc.es", Url:"https://www.cyc.es"}},
        {ID: 6, MockColumn: "Banner 6", MockColumn2: "This is a subtitle 2", MockColumn3: {Description:"https://i.imgur.com/z7DhU6n.jpg", Url:"https://i.imgur.com/z7DhU6n.jpg"}, MockColumn4: {Description:"https://www.cyc.es", Url:"https://www.cyc.es"}},
        {ID: 7, MockColumn: "Banner 7", MockColumn2: "This is a subtitle", MockColumn3: {Description:"https://i.imgur.com/z7DhU6n.jpg", Url:"https://i.imgur.com/z7DhU6n.jpg"}, MockColumn4: {Description:"https://www.cyc.es", Url:"https://www.cyc.es"}},
        {ID: 8, MockColumn: "Banner 8", MockColumn2: "This is a subtitle 2", MockColumn3: {Description:"https://i.imgur.com/z7DhU6n.jpg", Url:"https://i.imgur.com/z7DhU6n.jpg"}, MockColumn4: {Description:"https://www.cyc.es", Url:"https://www.cyc.es"}},
    ];

    private static _itemsEmpty: any[] = [];

    constructor(webURL?:string) {}

    public GetLists(): Promise<ISPList[]> {
        return new Promise<ISPList[]>((resolve) => {
            resolve(ListDataMock._lists);
        });
    }

    public GetFieldsFromList(listName:string): Promise<ISPColumn[]> {
        return new Promise<ISPColumn[]>((resolve) => {
            resolve(ListDataMock._columns);
        });
    }

    public GetItemsFromList(listName: string): Promise<any> {
        return new Promise<any[]>((resolve) => {
            resolve(ListDataMock._items);
        });
    }
}