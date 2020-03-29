import SessionInfoService from './sessionInfoService';
import UtilService from './utilService';
import * as api from '../api.json';
import axios from 'axios';
import { storage } from './firebaseService';

export default class HomepageContentService {
    static getServiceBase() {
        return `${SessionInfoService.getBaseUrlForAPI()}homepageContents`;
    }

    static getHomePageInfo() {
        return axios.get(`${this.getServiceBase()}?key=${api.API_KEY}`);
    }

    static updateBackgroundVideo(title, description, url, reference) {
        const data = {
            backgroundVideo: {
                title: title,
                description: description,
                url: url,
                reference: reference
            }
        };
        return axios.put(`${this.getServiceBase()}?key=${api.API_KEY}`, data);
    }

    static updateNews(newsBody) {
        const data = {
            news: newsBody
        };
        return axios.put(`${this.getServiceBase()}?key=${api.API_KEY}`, data);
    }

    static updateBanner(title, description, picture) {
        const data = {
            banner: {
                title: title,
                description: description,
                picture: picture
            }
        };
        return axios.put(`${this.getServiceBase()}?key=${api.API_KEY}`, data);
    }

    static updatePuppyMessage(message) {
        const data = {
            puppyMessage: message
        };
        return axios.put(`${this.getServiceBase()}?key=${api.API_KEY}`, data);
    }

    static updateGalleryImages(galleryImages) {
        const data = {
            galleryImages: galleryImages
        };
        return axios.put(`${this.getServiceBase()}?key=${api.API_KEY}`, data);
    }

    static uploadVideo(videoFile) {
        return new Promise((resolve) => {
            const videoID = UtilService.generateID(10);
            const reference = `/mainVideo/${videoID}`;
            const task = storage.ref(reference).put(videoFile);
            task.on('state_changed', 
                (snapshot) => {
                    // progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
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

    static uploadPicture(imageFile, directory) {
        return new Promise((resolve) => {
            const pictureID = UtilService.generateID(10);
            const reference = `hompageContents/${directory}/${pictureID}`;
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

    static deleteFile(reference) {
        const desertRef = storage.ref(reference);
        return desertRef.delete();
    }
}