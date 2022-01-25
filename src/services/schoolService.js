import http from './httpService';
import { apiUrl, schoolApiUrl } from "../config";
import auth from './authService';

const apiEndpoint = `${apiUrl}/school`;
const schoolapiEndpoint = `${schoolApiUrl}/school`;

export function getAllActiveSchool(status) {
    let user = auth.getCurrentUser();
    if (user.user.logintype == "G")
        return http.get(apiEndpoint + '/status/' + status);
    else
        return http.get(schoolapiEndpoint + '/status/' + status);
}
export function getInActiveSchool() {
    let user = auth.getCurrentUser();
    if (user.user.logintype == "G")
        return http.get(apiEndpoint + '/inactive');
    else
        return http.get(schoolapiEndpoint + '/inactive');
}

export function createSchool(formdata) {
    let user = auth.getCurrentUser();
    if (user.user.logintype == "G")
        return http.post(apiEndpoint + '/', formdata);
    else
        return http.post(schoolapiEndpoint + '/', formdata);
}

export function updateSchool(id, formdata) {
    let user = auth.getCurrentUser();
    if (user.user.logintype == "G")
        return http.put(apiEndpoint + '/id/' + id, formdata);
    else
        return http.put(schoolapiEndpoint + '/id' + '/' + id, formdata);
}

export function changeStatus(data) {
    let user = auth.getCurrentUser();
    if (user.user.logintype == "G")
        return http.put(apiEndpoint + '/status', data);
    else
        return http.put(schoolapiEndpoint + '/status', data);
}

export function getSchoolQCExams(schoolid) {
    let user = auth.getCurrentUser();
    if (user.user.logintype == "G")
        return http.get(apiEndpoint + '/id/' + schoolid);
    else
        return http.get(schoolapiEndpoint + '/id/' + schoolid);
}



