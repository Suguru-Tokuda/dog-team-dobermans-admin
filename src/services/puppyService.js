import SessionInfoService from './sessionInfoService';
import UtilService from './utilService';
import axios from 'axios';
import { storage } from './firebaseService';

export default class PuppyService {
    static getServiceBase() {
        return `${SessionInfoService.getBaseUrlForAPI()}api/puppies`;
    }

    static getAllPuppies() {
        return axios.get(`${this.getServiceBase()}?includeBuyer=true`);
    }

    static getPuppy(puppyID) {
        return axios.get(`${this.getServiceBase()}/getByID?puppyID=${puppyID}`);
    }

    static getPuppiesForBuyerID(buyerID) {
        return axios.get(`${this.getServiceBase()}/getByBuyerID?&buyerID=${buyerID}`);
    }

    static createPuppy(data) {
        return axios.post(`${this.getServiceBase()}`, data);
    }

    static updatePuppy(puppyID, data) {
        return axios.put(`${this.getServiceBase()}?puppyID=${puppyID}`, data);
    }

    static processTransaction(puppyID, buyerID, paidAmount) {
        const data = {
            puppyID: puppyID,
            buyerID: buyerID,
            paidAmount: paidAmount
        };
        return axios.post(`${this.getServiceBase()}/processTransaction`, data);
    }

    static cancelTransaction(puppyID) {
        return axios.post(`${this.getServiceBase()}/cancelTransaction?&puppyID=${puppyID}`);
    }

    static deletePuppy(puppyID) {
        return axios.delete(`${this.getServiceBase()}?&puppyID=${puppyID}`);
    }

    static uploadPicture(imageFile) {
        return new Promise(function (resolve, reject) {
            const pictureID = UtilService.generateID(10);
            const reference = `/puppies/${pictureID}`;
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
                            reject('Storage unauthorized.');
                            // console.log('unauthorized');
                            break;
                        case 'storage/canceled':
                            reject('Image uploading cancelled.');
                            // console.log('canceled');
                            break;
                        case 'storage/unknown':
                            reject('Image uploading stopped for unknown error.');
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
                        })
                        .catch((err) => {
                            reject(err);
                        });
                });
        });
    }

    static deletePicture(imageRef) {
        const desertRef = storage.ref(imageRef);
        return desertRef.delete();
    }
    
}