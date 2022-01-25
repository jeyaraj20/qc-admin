import http from './httpService';
import { apiUrl, schoolApiUrl } from "../config";
import auth from './authService';

const apiEndpoint = `${apiUrl}/examquestion`;
const schoolapiEndpoint = `${schoolApiUrl}/examquestion`;

export function createExamQuestion(data) {
    let user = auth.getCurrentUser();
    if (user.user.logintype == "G")
        return http.post(apiEndpoint + '/', data);
    else
        return http.post(schoolapiEndpoint + '/', data);
}

export function createBankExamQuestion(data) {
    let user = auth.getCurrentUser();
    if (user.user.logintype == "G")
        return http.post(apiEndpoint + '/bank', data);
    else
        return http.post(schoolapiEndpoint + '/bank', data);
}

export function getAssinged(data) {
    let user = auth.getCurrentUser();
    if (user.user.logintype == "G")
        return http.post(apiEndpoint + '/getassinged', data);
    else
        return http.post(schoolapiEndpoint + '/getassinged', data);
}

export function getAssingedCount(data) {
    let user = auth.getCurrentUser();
    if (user.user.logintype == "G")
        return http.post(apiEndpoint + '/getassingedcount', data);
    else
        return http.post(schoolapiEndpoint + '/getassingedcount', data);
}

export function removeAssignedQuestion(data) {
    let user = auth.getCurrentUser();
    if (user.user.logintype == "G")
        return http.put(apiEndpoint + '/', data);
    else
        return http.put(schoolapiEndpoint + '/', data);
}