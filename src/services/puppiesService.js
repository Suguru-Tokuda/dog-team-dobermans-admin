import SessionInfoService from './sessionInfoService';
import * as api from '../api.json';
import axios from 'axios';

export default class PuppiesService {
    static getServiceBase() {
        return `${SessionInfoService.getBaseUrlForAPI()}`;
    }

    static getAllPuppies() {
        return axios.get(`${this.getServiceBase()}puppies`);
    }

    static getPuppy(puppyId) {
        return axios.get(`${this.getServiceBase()}puppy/${puppyId}`);
    }

    static createPuppy(data) {
        return axios.post(`${this.getServiceBase()}puppy?key=${api.API_KEY}`, data);
    }

    static updatePuppy(data) {
        return axios.put(`${this.getServiceBase()}puppy/${data.puppyId}`, data);
    }

    static deletePuppy(puppyId) {
        return axios.delete(`${this.getServiceBase()}puppy/${puppyId}`);
    }
    
}