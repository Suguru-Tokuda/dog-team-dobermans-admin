import SessionInfoService from './sessionInfoService';
import * as api from '../api.json';
import axios from 'axios';

export default class BuyersService {
    static getServiceBase() {
        return `${SessionInfoService.getBaseUrlForAPI()}`;
    }

    static searchForBuyers(searchKeywords) {
        return axios.get(`${this.getServiceBase()}buyer/search?key=${api.API_KEY}&searchKeywords=${searchKeywords}`);
    }

    static getBuyer(buyerID) {
        return axios.get(`${this.getServiceBase()}buyer?key=${api.API_KEY}&buyerID=${buyerID}`);
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