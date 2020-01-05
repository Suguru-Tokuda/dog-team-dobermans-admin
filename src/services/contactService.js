import SessionInfoService from './sessionInfoService';
import * as api from '../api.json';
import axios from 'axios';

export default class ContactService {
    static getServiceBase() {
        return `${SessionInfoService.getBaseUrlForAPI()}contact/`;
    }

    static getContactusInfo() {
        return axios.get(`${this.getServiceBase()}?key=${api.API_KEY}`);
    }

    static updateContactdInfo(firstName, lastName, street, city, state, email, phone, contactID) {
        const data = {
            firstName: firstName,
            lastName: lastName,
            street: street,
            city: city,
            state: state,
            email: email,
            phone: phone
        }
        return axios.put(`${this.getServiceBase()}?key=${api.API_KEY}&contactID=${contactID}`, data);
    }
    
}