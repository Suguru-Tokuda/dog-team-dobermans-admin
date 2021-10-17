import SessionInfoService from './sessionInfoService';
import ConstantsService from './constantsService';
import UtilService from './utilService';
import axios from 'axios';
import { storage } from './firebaseService';

export default class WaitlistService {
    static getServiceBase() {
        return `${SessionInfoService.getBaseUrlForAPI()}api/waitlist`;
    }

    static getWaitRequest(waitRequestID) {
        return axios.get(`${this.getServiceBase()}/getByID?&waitRequestID=${waitRequestID}`);
    }

    static getWaitRequestsByIDs(waitRequestIDs) {
        const data = {
            waitRequestIDs: waitRequestIDs
        };

        return axios.post(`${this.getServiceBase()}/getByIDs`, data);
    }

    static getWaitList() {
        const recipientID = ConstantsService.getBreederID();
        return axios.get(`${this.getServiceBase()}?&recipientID=${recipientID}`);
    }

    static getWaitlistByRange(startIndex, endIndex, sortField, sortDescending, searchText) {
        const recipientID = ConstantsService.getBreederID();
        const data = {
            recipientID: recipientID,
            startIndex: startIndex,
            endIndex: endIndex,
            sortField: sortField,
            searchText: searchText,
            activeOnly: true,
            sortDescending: sortDescending
        };

        return axios.post(`${this.getServiceBase()}/getByRange`, data);
    }

    static waitRequest(data) {
        return axios.post(`${this.getServiceBase()}`, data);
    }

    static createWaitRequest(data) {
        return axios.post(`${this.getServiceBase()}`, data);
    }

    static createWaitRequestByEmail(data) {
        return axios.post(`${this.getServiceBase()}/createByEmail`, data);
    }

    static updateWaitRequest(waitRequestID, data) {
        return axios.put(`${this.getServiceBase()}?&waitRequestID=${waitRequestID}`, data);
    }

    static updateWaitRequests(waitRequests) {
        return axios.put(`${this.getServiceBase()}?`, waitRequests);
    }

    static getMessagesByUserID(userID = ConstantsService.getBreederID(), limit) {
        return axios.get(`${this.getServiceBase()}/messages/byUserID?&userID=${userID}&limit=${limit}`)
    }

    static getUnreadMessagesByUserID(userID = ConstantsService.getBreederID(), limit) {
        return axios.get(`${this.getServiceBase()}/messages/unreadByUseID?&userID=${userID}&limit=${limit}`)
    }

    static getMessagesGroupedByWaitRequest() {
        return axios.get(`${this.getServiceBase()}/messages/byWaitRequest`);
    }

    static sendWaitRequestMessage(senderID = ConstantsService.getBreederID(), recipientID, waitRequestID, messageBody) {
        const data = {
            waitRequestID: waitRequestID,
            senderID: senderID,
            recipientID: recipientID,
            messageBody: messageBody,
            isBreeder: true,
            read: false
        };

        return axios.post(`${this.getServiceBase()}/messages`, data);
    }

    static updateWaitRequestMessage(senderID = ConstantsService.getBreederID(), recipientID, waitRequestID, messageBody) {
        const data = {
            waitRequestID: waitRequestID,
            senderID: senderID,
            recipientID: recipientID,
            messageBody: messageBody,
            isBreeder: true,
            read: false
        };

        return axios.put(`${this.getServiceBase()}/messages`, data);
    }

    static getWaitRequestMessages(waitRequestID) {
        return axios.get(`${this.getServiceBase()}/messages?&waitRequestID=${waitRequestID}`);
    }

    static getNewMessages(waitRequestID, recipientID = 'sSJ0mWxDjtaTuFsolvKskzDY4GI3') {
        return axios.get(`${this.getServiceBase()}/messages?&waitRequestID=${waitRequestID}&recipientID=${recipientID}&onlyUnread=true`);
    }

    static deleteWaitRequests(waitRequestIDs) {
        return axios({
            method: 'DELETE',
            data: {
                waitRequestIDs: waitRequestIDs
            },
            url: `${this.getServiceBase()}?`
        });
    }

    static notify(waitRequestIDs, subject, body) {
        const data = {
            waitRequestIDs: waitRequestIDs,
            subject: subject,
            body: body
        };
        return axios.post(`${this.getServiceBase()}/notify`, data);
    }

    static markMessageAsRead(messageIDs) {
        const data = {
            messageIDs: messageIDs
        };

        return axios.post(`${this.getServiceBase()}/messages/markAsRead`, data);
    }

    static uploadPicture(imageFile) {
        return new Promise((resolve) => {
            const pictureID = UtilService.generateID(10);
            const reference = `waitList/${pictureID}`;
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
}