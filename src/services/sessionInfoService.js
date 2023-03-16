export default class SessionInfoService {
    static getBaseUrlForAPI() {
        const prodOriginIdentifier = 'https://dogteamdobermans';
        let isProd = window.location.origin.toLowerCase().indexOf(prodOriginIdentifier) !== -1;
        
        if (isProd)
            return "https://us-central1-dogteamdobermans.cloudfunctions.net/";
        else
            return "https://us-central1-dogteamdobermansdev.cloudfunctions.net/";
    }
}
