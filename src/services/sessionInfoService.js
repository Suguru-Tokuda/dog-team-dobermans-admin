import * as api from '../api.json';

export default class SessionInfoService {
    static getBaseUrlForAPI() {
        let isProd = window.location.toString().indexOf(api.identifiers.prod) !== -1;
        
        if (isProd)
            return "https://us-central1-dogteamdobermans.cloudfunctions.net/";
        else
            return "https://us-central1-dogteamdobermansdev.cloudfunctions.net/";
    }
}
