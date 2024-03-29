import SessionInfoService from './sessionInfoService';
import * as api from '../api.json';
import axios from 'axios';
import { storage } from './firebaseService';
import UtilService from './utilService';

export default class AboutUsService {
    static getServiceBase() {
        return `${SessionInfoService.getBaseUrlForAPI()}api/aboutUs/`;
    }

    static getAboutUs() {
        return axios.get(`${this.getServiceBase()}`);
    }

    static getAboutDobermans() {
        return axios.get(`${this.getServiceBase()}aboutDobermans`);
    }

    static updateAboutDobermans(aboutDobermans) {
        const data = {
            aboutDobermans: aboutDobermans
        };

        return axios.put(`${this.getServiceBase()}aboutDobermans`, data);
    }

    static updateAboutUs(aboutUsID, data) {
        return axios.put(`${this.getServiceBase()}?aboutUsID=${aboutUsID}`, data);
    }

    static updateIntroductions(data) {
        return axios.put(`${this.getServiceBase()}missionStatements`, data);
    }

    static updateOurTeam(data) {
        return axios.put(`${this.getServiceBase()}ourTeam`, data);
    }

    static uploadPicture(imageFile, directory) {
        return new Promise((resolve) => {
            const pictureID = UtilService.generateID(10);
            const reference = `/aboutus/${directory}/${pictureID}`;
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