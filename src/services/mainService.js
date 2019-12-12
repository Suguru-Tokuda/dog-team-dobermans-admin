import SessionInfoService from './sessionInfoService';
import UtilService from './utilService';
import * as api from '../api.json';
import axios from 'axios';
import { storage } from './firebaseService';

export default class MainService {
    static getServiceBase() {
        return `${SessionInfoService.getBaseUrlForAPI()}main`;
    }

    static getHomePageInfo() {
        return axios.get(`${this.getServiceBase()}main?key${api.API_KEY}`);
    }

    static uploadVideo(videoFile, progress) {
        return new Promise((resolve) => {
            const videoID = UtilService.generateID(10);
            const reference = `/mainVideo/${videoID}`;
            console.log(videoFile);
            const task = storage.ref(reference).put(videoFile);
            task.on('state_changed', 
                (snapshot) => {
                    progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                },
                (err) => {
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
                        .then((downloadURL) => {
                            resolve({
                                reference: reference,
                                url: downloadURL
                            })
                        });
                });
        });
    }
}