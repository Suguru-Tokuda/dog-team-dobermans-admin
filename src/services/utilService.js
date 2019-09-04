export default class UtilService {
    // a function to access the value of the object for a corresponding nested key
    static accessValue(object, key) {
        const keys = key.split('.');
        let value = object;
        for (let i = 0, max = keys.length; i < max; i++) {
            value = value[keys[i]];
        }
        return value;
    }
}