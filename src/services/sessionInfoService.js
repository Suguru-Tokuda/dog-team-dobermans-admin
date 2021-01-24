export default class SessionInfoService {
    static getBaseUrlForAPI() {
        const isProd = window.location.toString().indexOf('dogteamdobermans-admin.web.app') !== -1;
        
        if (isProd)
            return "https://us-central1-dogteamdobermans.cloudfunctions.net/";
        else
            return "https://us-central1-dogteamdobermansdev.cloudfunctions.net/";
    }
}
