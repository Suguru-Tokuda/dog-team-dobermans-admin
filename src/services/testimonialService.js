import SessionInfoService from './sessionInfoService';
import * as api from '../api.json';
import axios from 'axios';

export default class TestimonialService {
    static getServiceBase() {
        return `${SessionInfoService.getBaseUrlForAPI()}testimonials/`;
    }

    static getAllTestimonials() {
        return axios.get(`${this.getServiceBase()}?key=${api.API_KEY}`);
    }

    static updateTestimonial() {
        return axios.put(`${this.getServiceBase()}?key=${api.API_KEY}`);
    }

    static deleteTestimonial(testimonialID) {
        return axios.delete(`${this.getServiceBase()}?key=${api.API_KEY}`);
    }

}