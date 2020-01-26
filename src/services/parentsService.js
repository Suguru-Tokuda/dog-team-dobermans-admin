import SessionInfoService from './sessionInfoService';
import axios from 'axios';
import * as api from '../api.json';
import { storage } from './firebaseService';
import UtilService from './utilService';

export default class ParentsService {
    static getServiceBase() {
        return `${SessionInfoService.getBaseUrlForAPI()}`;
    }

    static getAllParents() {
        return axios.get(`${this.getServiceBase()}parents?key=${api.API_KEY}`);
    }

    static getParent(parentID) {
        return axios.get(`${this.getServiceBase()}parent?parentID=${parentID}&key=${api.API_KEY}`);
    }

    static createParent(name, dateOfBirth, type, gender, color, weight, description, pictures) {
        const data = {
            name: name,
            dateOfBirth: dateOfBirth,
            type: type,
            gender: gender,
            color: color,
            weight: weight,
            description: description,
            pictures: pictures,
            live: false
        };
        return axios.post(`${this.getServiceBase()}parent?&key=${api.API_KEY}`, data);
    }

    static updateParent(parentID, data) {
        return axios.put(`${this.getServiceBase()}parent?parentID=${parentID}&key=${api.API_KEY}`, data);
    }

    static deleteParent(parentID) {
        return axios.delete(`${this.getServiceBase()}parent?parentID=${parentID}&key=${api.API_KEY}`);
    }

    static uploadPicture(imageFile) {
        return new Promise(function (resolve) {
            const pictureID = UtilService.generateID(10);
            const reference = `/parents/${pictureID}`;
            const task = storage.ref(reference).put(imageFile);
            task.on('state_changed',
                function (snapshot) {
                    // const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                    // console.log(`Upload is ${progress}% done`);
                    switch (snapshot.state) {
                        case 'paused':
                            // console.log('Upload is paused');
                            break;
                        case 'running':
                            // console.log('Upload is running');
                            break;
                        default:
                            break;
                    }
                },
                function (err) {
                    switch (err.code) {
                        case 'storage/unauthorized':
                            // console.log('unauthorized');
                            break;
                        case 'storage/canceled':
                            // console.log('canceled');
                            break;
                        case 'storage/unknown':
                            // console.log('unknown error');
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
        const desertRef = storage.ref(imageRef);
        return desertRef.delete();
    }
    
}