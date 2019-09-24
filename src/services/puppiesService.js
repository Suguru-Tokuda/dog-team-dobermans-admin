import SessionInfoService from './sessionInfoService';
import * as api from '../api.json';
import axios from 'axios';
import { storage } from './firebaseService';

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

    static uploadPicture(imageFile) {
        return new Promise(function (resolve, reject) {
            const task = storage.ref(`/puppies/${imageFile.name}`).put(imageFile);
            task.on('state_changed',
                function (snapshot) {
                    console.log(snapshot);
                    const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                    console.log(`Upload is ${progress}% done`);
                    switch (snapshot.state) {
                        case 'paused':
                            console.log('Upload is paused');
                            break;
                        case 'running':
                            console.log('Upload is running');
                            break;
                    }
                },
                function (err) {
                    console.log(err);
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
                    }
                },
                function () {
                    task.snapshot.ref.getDownloadURL()
                        .then(function (downloadURL) { 
                            resolve(downloadURL);
                        });
                });
        });
    }
    
}