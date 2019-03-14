export class Utils {
    
    public static IsNullOrEmpty(object: any):boolean {
        if (object == undefined || object == null) return true;
        if (object.constructor === Object) return Object.keys(object).length === 0;
        return object == "";
    }
}