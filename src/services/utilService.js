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

    static generateID(length) {
        let retVal = '';
        const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        const charLeng = characters.length;
        for (let i = 0, max = length; i < max; i++) {
            retVal += characters.charAt(Math.floor(Math.random() * charLeng));
        }
        return retVal;
    }

    static formatPhoneNumber(phone) {
        if (typeof phone !== 'undefined' && phone !== null) {
            const firstPart = phone.substring(0, 3);
            const secondPart = phone.substring(3, 6);
            const thirdPart = phone.substring(6, 10);
            return `${firstPart}-${secondPart}-${thirdPart}`;
        } else {
            return '';
        }
    }

    // breaks lb into lb & oz
    static convertPoundsToOunces(pounds) {
        const regex = /[1-9][0-9]*(?:\/[1-9][0-9])*/g;
        pounds = pounds.toString();
        pounds.toString();
        const found = pounds.match(regex);
        let lb, oz;
        if (pounds.substring(0, 1) === '0' || pounds.substring(0, 1) === '.') {
            lb = '';
            oz = parseInt(found[0]) * 0.016;
        } else {
            if (found[0] !== '0') {
                lb = parseInt(found[0]);
            } else {
                lb = '';
            }
            if (found[1]) {
                const length = found[1].length;
                oz = parseInt(found[1]) * 16;
                for (let i = 0; i < length; i++) {
                    oz /= 10;
                }
            } else {
                oz = '';
            }
        }
        return {
            lb: lb,
            oz: oz
        };
    }

    static getPounds(lb, oz) {
        if (lb === '') {
            lb = 0;
        } else {
            lb = parseInt(lb);
        }
        if (oz === '') {
            oz = 0;
        } else {
            oz = parseInt(oz);
        }        
        const ozInLb = oz * 0.0625;
        return (lb + ozInLb);
    }

    static shortenStr(str, len) {
        if (str === null || str === undefined || str.length === 0) {
            return '';
        }
        const strLength = str.length;
        let retVal = '';
        if (len <= strLength) {
            retVal = `${str.substring(0, len)}...`;
        } else {
            retVal = str;
        }
        return retVal;
    }

}