import SessionInfoService from './sessionInfoService';
import axios from 'axios';

export default class ParentsService {
    static getServiceBase() {
        return `${SessionInfoService.getBaseUrlForAPI()}contactus`;
    }

    static getContactusInfo() {
        return axios.get(this.getServiceBase());
    }

    static updateContactdInfo(data) {
        return axios.put(this.getServiceBase());
    }
    
}