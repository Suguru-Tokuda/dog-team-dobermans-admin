import SessionInfoService from './sessionInfoService';
import UtilService from './utilService';
import * as api from '../api.json';
import axios from 'axios';
import { storage } from './firebaseService';

export default class BlogService {
    static getServiceBase() {
        return `${SessionInfoService.getBaseUrlForAPI()}blogs?key=${api.API_KEY}`;
    }

    static getAllBlogs() {
        return axios.get(`${this.getServiceBase()}`);
    }

    static getBlog(blogID) {
        return axios.get(`${this.getServiceBase()}&blogID=${blogID}`);
    }

    static createBlog(author, )
}