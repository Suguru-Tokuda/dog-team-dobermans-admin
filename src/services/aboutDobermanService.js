import SessionInfoService from './sessionInfoService';
import * as api from '../api.json';
import axios from 'axios';
import { storage } from './firebaseService';
import UtilService from './utilService';

export default class AboutDobermanService {
    static getServiceBase() {
        return `${SessionInfoService.getBaseUrlForAPI()}aboutDobermans?key=${api.API_KEY}`;
    }

    static getAboutDobermans() {
        return axios.get(`${this.getServiceBase()}`);
    }

    static postAboutDobermans(aboutDobermans) {
        const data = {
            aboutDobermans: aboutDobermans
        };
        return axios.put(`${this.getServiceBase()}`, data);
    }

    static uploadPicture(imageFile) {
        return new Promise((resolve) => {
            const pictureID = UtilService.generateID(10);
            const reference = `/aboutDobermans/${pictureID}`;
            const task = storage.ref(reference).put(imageFile);
            task.on('state_changed',
                function (snapshot) {
                    switch (snapshot.state) {
                        case 'paused':
                            break;
                        case 'runing':
                            break;
                        default:
                            break;
                    }
                },
                function (err) {
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
                function () {
                    task.snapshot.ref.getDownloadURL()
                        .then((downloadURL) => {
                            resolve({
                                reference: reference,
                                url: downloadURL
                            })
                        });
                }
            );
        });
    }

    static deletePicture(imageRef) {
        const desertRef = storage.ref(imageRef);
        return desertRef.delete();
    }
    
}