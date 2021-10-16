import SessionInfoService from './sessionInfoService';
import axios from 'axios';

export default class ContactService {
    static getServiceBase() {
        return `${SessionInfoService.getBaseUrlForAPI()}api/contact`;
    }

    static getContact() {
        return axios.get(`${this.getServiceBase()}`);
    }

    static updateContact(firstName, lastName, street, city, state, email, phone, zip, contactID) {
        const data = {
            contactID: contactID,
            firstName: firstName,
            lastName: lastName,
            street: street,
            city: city,
            state: state,
            email: email,
            phone: phone,
            zip: zip
        };
        return axios.put(`${this.getServiceBase()}`, data);
    }
    
}