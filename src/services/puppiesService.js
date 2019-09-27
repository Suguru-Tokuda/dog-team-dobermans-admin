import SessionInfoService from './sessionInfoService';
import * as api from '../api.json';
import axios from 'axios';
import { storage } from './firebaseService';

export default class PuppiesService {
    static getServiceBase() {
        return `${SessionInfoService.getBaseUrlForAPI()}`;
    }

    static getAllPuppies() {
        return axios.get(`${this.getServiceBase()}puppies?key=${api.API_KEY}`);
    }

    static getPuppy(puppyId) {
        return axios.get(`${this.getServiceBase()}puppy?key=${api.API_KEY}&id=${puppyId}`);
    }

    static createPuppy(data) {
        return axios.post(`${this.getServiceBase()}puppy?key=${api.API_KEY}`, data);
    }

    static updatePuppy(puppyId, data) {
        return axios.put(`${this.getServiceBase()}puppy/?key=${api.API_KEY}&id=${puppyId}`, data);
    }

    static deletePuppy(puppyId) {
        return axios.delete(`${this.getServiceBase()}puppy/${puppyId}`);
    }

    static uploadPicture(imageFile) {
        return new Promise(function (resolve) {
            const reference = `/puppies/${imageFile.name}`;
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

    static deletePicture(imageRef) {
        const desertRef = storage.ref(imageRef)
        return desertRef.delete();
    }
    
}