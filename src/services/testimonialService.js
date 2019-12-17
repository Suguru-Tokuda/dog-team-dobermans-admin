import SessionInfoService from './sessionInfoService';
import * as api from '../api.json';
import axios from 'axios';
import { storage } from './firebaseService';

export default class TestimonialService {
    static getServiceBase() {
        return `${SessionInfoService.getBaseUrlForAPI()}testimonials`;
    }

    static getAllTestimonials() {
        return axios.get(`${this.getServiceBase()}?key=${api.API_KEY}`);
    }

    static updateTestimonial(testimonial) {
        const data = JSON.parse(JSON.stringify(testimonial));
        delete data.testimonialID;
        return axios.put(`${this.getServiceBase()}?key=${api.API_KEY}&testimonialID=${testimonial.testimonialID}`, data);
    }

    static deleteTestimonials(testimonialIDs) {
        const data = {
            testimonialIDs: testimonialIDs
        };
        return axios({
            method: 'DELETE',
            data: data,
            url: `${this.getServiceBase()}?key=${api.API_KEY}`
        });
    }

    static deleteImage(reference) {
        const desertRef = storage.ref(reference);
        return desertRef.delete();
    }

}