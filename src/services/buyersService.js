import SessionInfoService from './sessionInfoService';
import * as api from '../api.json';
import axios from 'axios';

export default class BuyersService {
    static getServiceBase() {
        return `${SessionInfoService.getBaseUrlForAPI()}`;
    }

    static searchForBuyers(searchKeyword) {
        return axios.post(`${this.getServiceBase()}buyer/search?key=${api.API_KEY}`, { searchKeyword: searchKeyword });
    }

    static getBuyer(buyerId) {
        return axios.get(`${this.getServiceBase()}buyer?key=${api.API_KEY}&buyerId=${buyerId}`);
    }

    static createBuyer(firstName, lastName, email, phone, state, city) {
        const data = {
            firstName: firstName,
            lastName: lastName,
            email: email,
            phone: phone,
            state: state,
            city: city
        };
        return axios.post(`${this.getServiceBase()}/buyer?key=${api.API_KEY}`, data);
    }
}