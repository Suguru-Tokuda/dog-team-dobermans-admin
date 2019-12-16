import SessionInfoService from './sessionInfoService';
import * as api from '../api.json';
import axios from 'axios';

export default class WaitListService {
    static getServiceBase() {
        return `${SessionInfoService.getServiceBase()}waitList/`;
    }

    static getWaitList() {
        return axios.get(`${this.getServiceBase()}?key=${api.API_KEY}`);
    }

    static updateWaitRequest(waitListID, color, email, firstName, lastName, message, phone) {
        const data = {
            firstName: firstName,
            lastName: lastName,
            email: email,
            phone: phone,
            color: color,
            message: mmessage
        };
        return axios.put(`${this.getServiceBase()}?key=${api.API_KEY}&waitListID=${waitListID}`, data);
    }

    static sendEmail(waitListIDs, subject, body) {
        const data = {
            waitListIDs: waitListIDs,
            subject: subject,
            body: body
        };
        return axios.post(`${this.getServiceBase()}/email?key=${api.API_KEY}`, data);
    }
}