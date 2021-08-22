import utilService from './utilService';
import moment from 'moment';

export default class SortService {

    static sortArray(array, key, sortAsc) {
        if (array.length > 0) {
            return array.sort((a, b) => {
                let valA, valB;
                if (typeof utilService.accessValue(array[0], key) === "string") {
                    const isDate = isNaN(Date.parse(utilService.accessValue(array[0], key))) === false;
                    if (isDate === true) {
                        valA = new Date(utilService.accessValue(a, key));
                        valB = new Date(utilService.accessValue(b, key));
                        if (valA.toString() === 'Invalid Date' || valB.toString() === 'Invalid Date') {
                            valA = utilService.accessValue(a, key);
                            valB = utilService.accessValue(b, key);
                        }
                    } else {
                        valA = utilService.accessValue(a, key);
                        valB = utilService.accessValue(b, key);
                    }
                } else if (typeof utilService.accessValue(array[0], key) === "number") {
                    const isFloat = isNaN(parseFloat(utilService.accessValue(array[0], key))) === false;
                    if (isFloat === true) {
                        valA = parseFloat(utilService.accessValue(a, key));
                        valB = parseFloat(utilService.accessValue(b, key));
                    }
                } else {
                    valA = utilService.accessValue(a, key);
                    valB = utilService.accessValue(b, key);
                }
                if (sortAsc === true) {
                    return (valA > valB ? 1: (valA < valB ? -1 : 0));
                } else {
                    return (valA < valB ? 1: (valA > valB ? -1 : 0));
                }
            });
        } else {
            return array;
        }
    }

    static quickSort(array, key, sortDescending) {
        this.quickSortExecute(array, key, 0, array.length - 1, sortDescending);
        return array;
    }

    /* quick sort */
    static quickSortExecute(array, key, left, right, sortDescending) {
        if (left >= right)
            return;

        let pivot = this.getValue(array, key, Math.floor((left + right) / 2));
        const index = this.partition(array, key, left, right, pivot, sortDescending);

        this.quickSortExecute(array, key, left, index - 1, sortDescending);
        this.quickSortExecute(array, key, index, right, sortDescending);
    }

    static partition(array, key, left, right, pivot, sortDescending) {
        while (left <= right) {
            let leftVal = this.getValue(array, key, left);
            let rightVal = this.getValue(array, key, right);

            if (!sortDescending) {
                while (leftVal < pivot) {
                    left++;
                    leftVal = this.getValue(array, key, left);
                }
    
                while (rightVal > pivot) {
                    right--;
                    rightVal = this.getValue(array, key, right);
                }
            } else {
                while (leftVal > pivot) {
                    left++;
                    leftVal = this.getValue(array, key, left);
                }
    
                while (rightVal < pivot) {
                    right--;
                    rightVal = this.getValue(array, key, right);
                }
            }

            if (left <= right) {
                this.swap(array, left, right);
                left++;
                right--;
            }
        }

        return left;
    }

    static getValue(array, key, index) {
        let value = key ? utilService.accessValue(array[index], key) : array[index];
        const valueType = typeof value;

        switch (valueType) {
            case 'string':
                // check if the string is date string
                const isDate = moment(value, moment.ISO_8601, true).isValid();
                if (isDate) {
                    const dateValue = new Date(value);
                    if (dateValue.toString() !== 'Invalid Date')
                        value = dateValue;
                } else {
                    value = value.toLowerCase();
                }
                break;
            case 'number':
                // check if the value is float
                if (isNaN(parseFloat(value)) === false) {
                    value = parseFloat(value);
                }
                break;
            case 'undefined':
                value = '';
                break;
            default:
                break;
        }

        return value;
    }

    static swap(array, left, right) {
        const temp = array[left];
        array[left] = array[right];
        array[right] = temp;
    }

    static sortDisplayedData(arr, key, sortData, startIndex, endIndex) {
        let orderAsc;
        if (sortData.key === key) {
            orderAsc = sortData.orderAsc;
            orderAsc = !orderAsc;
        } else {
            orderAsc = true;
        }
        // const tableData = this.quickSort(arr, key, orderAsc);
        const tableData = this.quickSort(arr, key, !orderAsc);
        let displayedData;
        if (startIndex !== endIndex) {
            displayedData = arr.slice(startIndex, endIndex + 1);
        } else {
            displayedData = arr.slice(startIndex, startIndex + 1);
        }
        return {
            filteredData: tableData,
            displayedData: displayedData,
            sortData: {
                key: key,
                orderAsc: orderAsc
            }
        };
    }
}