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

    static createBlog(author, title, message, thumbnail) {
        const data = {
            author: author,
            title: title,
            message: message,
            thumbnail: thumbnail
        };
        return axios.put(`${this.getServiceBase()}`, data);
    }

    static updateBlog(blogID, author, title, message, thumbnail) {
        const data = {
            author: author,
            title: title,
            message: message,
            thumbnail: thumbnail
        };
        return axios.put(`${this.getServiceBase()}&blogID=${blogID}`, data);
    }

    static deleteBlog(blogID) {
        return axios.delete(`${this.getServiceBase()}&blogID=${blogID}`);
    }

    static uploadPicture(imageFile) {
        return new Promise((resolve) => {
            const pictureID = UtilService.generateID(10);
            const reference = `blogs/${pictureID}`;
            const task = storage.ref(reference).put(imageFile);
            task.on('state_changed', 
            (snapshot) => {
                switch (snapshot.state) {
                    case 'paused':
                        break;
                    case 'running':
                        break;
                    default:
                        break;
                }
            }
            ,(err) => {
                switch (err.code) {
                    case 'storage/unauthorized':
                        break;
                    case 'storage/canceled':
                        break;
                    case 'storage/unknown':
                        break;
                    default:
                        break;
                }
            },
            () => {
                task.snapshot.ref.getDownloadURL()
                .then(function (downloadURL) { 
                    resolve({
                        reference: reference,
                        url: downloadURL
                    });
                });
            });
        });
    }

    static deleteImage(reference) {
        const desertRef = storage.ref(reference);
        return desertRef.delete();
    }
    
}