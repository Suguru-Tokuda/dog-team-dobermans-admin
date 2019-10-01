import SessionInfoService from './sessionInfoService';
import axios from 'axios';

export default class BuyersService {
    static getServiceBase() {
        return `${SessionInfoService.getBaseUrlForAPI()}`;
    }

    static searchForBuyers(searchKeyword) {
        return axios.post(`${this.getServiceBase}buyers`, { searchKeyword: searchKeyword});
    }
}