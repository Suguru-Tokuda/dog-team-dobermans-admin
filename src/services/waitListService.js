import SessionInfoService from './sessionInfoService';
import UtilService from './utilService';
import * as api from '../api.json';
import axios from 'axios';
import { storage } from './firebaseService';

export default class WaitListService {
    static getServiceBase() {
        return `${SessionInfoService.getBaseUrlForAPI()}waitList`;
    }

    static getWaitRequest(waitRequestID) {
        return axios.get(`${this.getServiceBase()}?key=${api.API_KEY}&waitRequestID=${waitRequestID}`);
    }

    static getWaitList() {
        return axios.get(`${this.getServiceBase()}?key=${api.API_KEY}`);
    }

    static waitRequest(data) {
        return axios.post(`${this.getServiceBase()}?key=${api.API_KEY}`, data);
    }

    static createWaitRequest(data) {
        return axios.post(`${this.getServiceBase()}?key=${api.API_KEY}`, data);
    }

    static updateWaitRequest(waitRequestID, data) {
        return axios.put(`${this.getServiceBase()}?key=${api.API_KEY}&waitRequestID=${waitRequestID}`, data);
    }

    static updateWaitRequests(waitRequests) {
        return axios.put(`${this.getServiceBase()}?key=${api.API_KEY}`, waitRequests);
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
    
    static uploadPicture(imageFile) {
        return new Promise((resolve) => {
            const pictureID = UtilService.generateID(10);
            const reference = `waitList/${pictureID}`;
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
}