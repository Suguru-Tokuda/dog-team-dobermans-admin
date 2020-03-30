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

    static getBuyers() {
        return axios.get(`${this.getServiceBase()}buyers?key=${api.API_KEY}`);
    }

    static getBuyer(buyerID) {
        return axios.get(`${this.getServiceBase()}buyer?key=${api.API_KEY}&buyerID=${buyerID}`);
    }

    static checkEmailAvailability(email, buyerID) {
        return axios.post(`${this.getServiceBase()}buyer/check-email-availability?key=${api.API_KEY}`, { email: email, buyerID: buyerID });
    }

    static createBuyer(firstName, lastName, email, phone, state, city) {
        const data = {
            firstName: firstName,
            lastName: lastName,
            email: email,
            phone: phone,
            state: state,
            city: city,
            puppyIDs: []
        };
        return axios.post(`${this.getServiceBase()}/buyer?key=${api.API_KEY}`, data);
    }

    static updateBuyer(buyerID, firstName, lastName, email, phone, state, city, puppyIDs) {
        const data = {
            firstName: firstName,
            lastName: lastName,
            email: email,
            phone: phone,
            state: state,
            city: city,
            puppyIDs: puppyIDs
        };
        return axios.put(`${this.getServiceBase()}/buyer?buyerID=${buyerID}&key=${api.API_KEY}`, data);
    }

    static deleteBuyer(buyerID) {
        return axios.delete(`${this.getServiceBase()}buyer?key=${api.API_KEY}&buyerID=${buyerID}`);
    }
}