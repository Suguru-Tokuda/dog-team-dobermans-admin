import utilService from './utilService';

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

    static sortDisplayedData(arr, key, sortData, startIndex, endIndex) {
        let orderAsc;
        if (sortData.key === key) {
            orderAsc = sortData.orderAsc;
            orderAsc = !orderAsc;
        } else {
            orderAsc = false;
        }
        const tableData = this.sortArray(arr, key, orderAsc);
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