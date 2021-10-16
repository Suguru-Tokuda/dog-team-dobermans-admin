import SessionInfoService from './sessionInfoService';
import * as api from '../api.json';
import axios from 'axios';

export default class UserService {
    static getServiceBase() {
        return `${SessionInfoService.getBaseUrlForAPI()}`;
    }

    static searchForBuyers(searchKeywords) {
        return axios.get(`${this.getServiceBase()}api/users/search?searchKeywords=${searchKeywords}`);
    }

    static getUsers() {
        return axios.get(`${this.getServiceBase()}api/users`);
    }

    static getUser(userID) {
        return axios.get(`${this.getServiceBase()}api/users?userID=${userID}`);
    }

    static checkEmailAvailability(email, userID) {
        return axios.post(`${this.getServiceBase()}api/users/getEmailAvailability`, { email: email, userID: userID });
    }

    static createUser(firstName, lastName, email, phone, state, city) {
        const data = {
            firstName: firstName,
            lastName: lastName,
            email: email,
            phone: phone,
            state: state,
            city: city,
            puppyIDs: []
        };
        return axios.post(`${this.getServiceBase()}api/users`, data);
    }

    static updateUser(userID, firstName, lastName, email, phone, state, city, puppyIDs) {
        const data = {
            firstName: firstName,
            lastName: lastName,
            email: email,
            phone: phone,
            state: state,
            city: city,
            puppyIDs: puppyIDs
        };
        return axios.put(`${this.getServiceBase()}api/users?userID=${userID}&key=${api.API_KEY}`, data);
    }

    static deleteUser(userID) {
        return axios.delete(`${this.getServiceBase()}api/users?userID=${userID}`);
    }
}