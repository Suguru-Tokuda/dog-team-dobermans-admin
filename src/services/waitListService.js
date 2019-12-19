import SessionInfoService from './sessionInfoService';
import * as api from '../api.json';
import axios from 'axios';

export default class WaitListService {
    static getServiceBase() {
        return `${SessionInfoService.getBaseUrlForAPI()}waitList`;
    }

    static getWaitList() {
        return axios.get(`${this.getServiceBase()}?key=${api.API_KEY}`);
    }

    static updateWaitRequest(waitRequestIDs, color, email, firstName, lastName, message, phone) {
        const data = {
            firstName: firstName,
            lastName: lastName,
            email: email,
            phone: phone,
            color: color,
            message: message
        };
        return axios.put(`${this.getServiceBase()}?key=${api.API_KEY}&waitRequestIDs=${waitRequestIDs}`, data);
    }

    static deleteWaitRequests(waitRequestIDs) {
        return axios({
            method: 'DELETE',
            data: {
                waitRequestIDs: waitRequestIDs
            },
            url: `${this.getServiceBase()}?key=${api.API_KEY}`
        });
    }

    static notify(waitRequestIDs, subject, body) {
        const data = {
            waitRequestIDs: waitRequestIDs,
            subject: subject,
            body: body
        };
        return axios.post(`${this.getServiceBase()}/notify?key=${api.API_KEY}`, data);
    }
}