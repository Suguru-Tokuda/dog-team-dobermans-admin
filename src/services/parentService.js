import SessionInfoService from './sessionInfoService';
import axios from 'axios';
import { storage } from './firebaseService';
import UtilService from './utilService';

export default class ParentService {
    static getServiceBase() {
        return `${SessionInfoService.getBaseUrlForAPI()}api/parents`;
    }

    static getAllParents() {
        return axios.get(`${this.getServiceBase()}`);
    }

    static getParent(parentID) {
        return axios.get(`${this.getServiceBase()}/getByID?parentID=${parentID}`);
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
        return axios.post(`${this.getServiceBase()}`, data);
    }

    static updateParent(data) {
        return axios.put(`${this.getServiceBase()}`, data);
    }

    static deleteParent(parentID) {
        return axios.delete(`${this.getServiceBase()}?parentID=${parentID}`);
    }

    static uploadPicture(imageFile) {
        return new Promise(function (resolve, reject) {
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
                            reject('unauthorized');
                            break;
                        case 'storage/canceled':
                            reject('canceled');
                            break;
                        case 'storage/unknown':
                            reject('unknown error');
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