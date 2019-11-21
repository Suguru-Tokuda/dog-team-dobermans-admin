import SessionInfoService from './sessionInfoService';
import * as api from '../api.json';
import axios from 'axios';

export default class ContactUsService {
    static getServiceBase() {
        return `${SessionInfoService.getBaseUrlForAPI()}contactus/`;
    }

    static getContactusInfo() {
        return axios.get(`${this.getServiceBase()}?key=${api.API_KEY}`);
    }

    static updateContactdInfo(firstName, lastName, street, city, state, email, phone, contactUsID) {
        const data = {
            firstName: firstName,
            lastName: lastName,
            street: street,
            city: city,
            state: state,
            email: email,
            phone: phone
        }
        return axios.put(`${this.getServiceBase()}?key=${api.API_KEY}&contactUsID=${contactUsID}`, data);
    }
    
}