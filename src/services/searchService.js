export default class SearchService {
 
    
    /* Returns the index of the target. array needs to be sorted by the key */
    static getTargetIndex(array, target, key) {
        if (array !== undefined) {
            if (typeof target === 'string')
                target = target.toLowerCase();
            
            let left = 0;
            let right = array.length - 1;

            while (left <= right) {
                const mid = Math.floor((left + right) / 2);
                let toCompare = null;

                if (key === null || key === undefined)
                    toCompare = array[mid];
                else
                    toCompare = array[mid][key];

                if (typeof toCompare === 'string')
                    toCompare = toCompare.toLowerCase();

                if (target === toCompare)
                    return mid;

                if (target < toCompare)
                    right = mid - 1;
                else
                    left = mid + 1;
            }
        }

        return -1;
    }

    static getInsertIndex(array, target, key) {
        let left = 0;

        if (array !== undefined) {
            if (typeof target === 'string')
                target = target.toLowerCase();

            let right = array.length - 1;

            while (left <= right) {
                const mid = Math.floor((left + right) / 2);
                let toCompare = null;

                if (key === null || key === undefined)
                    toCompare = array[mid];
                else
                    toCompare = array[mid][key];

                if (typeof toCompare === 'string')
                    toCompare = toCompare.toLowerCase();

                if (target < toCompare)
                    right = mid - 1;
                else if (target > toCompare)
                    left = mid + 1;
                else
                    return mid;
            }
        } else {
            left = -1;
        }

        return left;
    }


}