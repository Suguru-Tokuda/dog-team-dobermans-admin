import { storage } from './firebaseService';
import UtilService from './utilService';

export default class AboutDobermanService {
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