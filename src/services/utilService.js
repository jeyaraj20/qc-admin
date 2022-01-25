import http from './httpService';
import { apiUrl } from "../config";

const apiEndpoint = `${apiUrl}/util`;

export function checkAlreadyExists(data) {
    return http.post(apiEndpoint + '/getcountbyfield', data);
}

export function checkAlreadyExistsExamMainCat(data) {
    return http.post(apiEndpoint + '/validateexammaincat', data);
}

export function checkAlreadyExistsExamSubCat(data) {
    return http.post(apiEndpoint + '/validateexamsubcat', data);
}