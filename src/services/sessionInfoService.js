import * as api from "../api.json";

export default class SessionInfoService {
  static getBaseUrlForAPI() {
    let isProd = false;
    api.identifiers.prod.forEach((identifier) => {
      if (window.location.toString().indexOf(identifier) !== -1) isProd = true;
    });

    if (isProd)
      return "https://us-central1-dogteamdobermans.cloudfunctions.net/";
    else return "https://us-central1-dogteamdobermansdev.cloudfunctions.net/";
  }
}
