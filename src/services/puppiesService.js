import SessionInfoService from './sessionInfoService';
import axios from 'axios';

export default class PuppiesService {
    static getServiceBase() {
        return `${SessionInfoService.getBaseUrlForAPI}puppies`;
    }

    static getAllPuppies() {
        return axios.get(`${this.getServiceBase()}`);
    }

    static getPuppy(puppyId) {
        return axios.get(`${this.getServiceBase()}/${puppyId}`);
    }

    static createPuppy(data) {
        return axios.post(`${this.getServiceBase()}`, data);
    }

    static updatePuppy(data) {
        return axios.put(`${this.getServiceBase()}/${data.puppyId}`, data);
    }

    static deletePuppy(puppyId) {
        return axios.delete(`${this.getServiceBase()}/${puppyId}`);
    }
    
}