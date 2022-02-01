import http from './httpService';
import { apiUrl, schoolApiUrl } from "../config";
import auth from './authService';

const apiEndpoint = `${apiUrl}/settings`;
const schoolapiEndpoint = `${schoolApiUrl}/settings`;

export function getSettings() {
    let user = auth.getCurrentUser();
    if (user.user.logintype === "G")
        return http.get(apiEndpoint + '/');
    else
        return http.get(schoolapiEndpoint + '/');
}
export function updateSettings(data) {
    let user = auth.getCurrentUser();
    if (user.user.logintype === "G")
        return http.put(apiEndpoint + '/', data);
    else
        return http.put(schoolapiEndpoint + '/', data);
}