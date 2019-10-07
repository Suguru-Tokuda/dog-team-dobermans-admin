import SessionInfoService from './sessionInfoService';
import axios from 'axios';
import * as api from '../api.json';
import { storage } from './firebaseService';

export default class ParentsService {
    static getServiceBase() {
        return `${SessionInfoService.getBaseUrlForAPI()}`;
    }

    static getAllParents() {
        return axios.get(`${this.getServiceBase()}parents?key=${api.API_KEY}`);
    }

    static get(parentId) {
        return axios.get(`${this.getServiceBase()}parent?parentId=${parentId}&key=${api.API_KEY}`);
    }

    static createParent(data) {
        return axios.post(`${this.getServiceBase()}parent?key=${api.API_KEY}`, data);
    }

    static updateParent(data) {
        return axios.put(`${this.getServiceBase()}parent?parentId=${data.parentId}&key=${api.API_KEY}`, data);
    }

    static deleteParent(parentId) {
        return axios.delete(`${this.getServiceBase()}parent?parentId=${parentId}&key=${api.API_KEY}`);
    }

    static uploadPicture(imageFile) {
        return new Promise(function (resolve) {
            const reference = `/parents/${imageFile.name}`;
            const task = storage.ref(reference).put(imageFile);
            task.on('state_changed',
                function (snapshot) {
                    const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                    console.log(`Upload is ${progress}% done`);
                    switch (snapshot.state) {
                        case 'paused':
                            console.log('Upload is paused');
                            break;
                        case 'running':
                            console.log('Upload is running');
                            break;
                        default:
                            break;
                    }
                },
                function (err) {
                    switch (err.code) {
                        case 'storage/unauthorized':
                            console.log('unauthorized');
                            break;
                        case 'storage/canceled':
                            console.log('canceled');
                            break;
                        case 'storage/unknown':
                            console.log('unknown error');
                            break;
                        default:
                            break;
                    }
                },
                function () {
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