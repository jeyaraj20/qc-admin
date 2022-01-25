import http from './httpService';
import { apiUrl, schoolApiUrl } from "../config";
import auth from './authService';

const apiEndpoint = `${apiUrl}/exampackage`;
const schoolapiEndpoint = `${schoolApiUrl}/exampackage`;

export function getAllExamPackage(status) {
    return http.get(apiEndpoint + '/status/' + status);
}

export function saveExamPackage(data) {
    return http.post(apiEndpoint + '/', data);
}

export function updateExamPackage(id, data) {
    return http.put(apiEndpoint + '/id/' + id, data);
}

export function changeStatus(idArr) {
    return http.put(apiEndpoint + '/status', idArr);
}

export function getAlldurations() {
    return http.get(apiEndpoint + '/duration');
}

export function getExamDurationById(id) {
    return http.get(apiEndpoint + '/examduration/' + id);
}