import SessionInfoService from './sessionInfoService';
import axios from 'axios';

export default class ParentsService {
    static getServiceBase() {
        return `${SessionInfoService.getBaseUrlForAPI}parents`;
    }

    static getAllParents() {
        return axios.get(`${this.getServiceBase()}`);
    }

    static get(parentsId) {
        return axios.get(`${this.getServiceBase()}/${parentsId}`);
    }

    static createParent(data) {
        return axios.post(`${this.getServiceBase()}`, data);
    }

    static updateParent(data) {
        return axios.put(`${this.getServiceBase()}/${data.parentsId}`, data);
    }

    static deleteParent(parentsId) {
        return axios.delete(`${this.getServiceBase()}/${parentsId}`);
    }
    
}