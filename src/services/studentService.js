import http from './httpService';
import { apiUrl, schoolApiUrl } from "../config";
import auth from './authService';

const apiEndpoint = `${apiUrl}/student`;
const schoolapiEndpoint = `${schoolApiUrl}/student`;
const schoolStudentapiEndpoint = `${apiUrl}/school/student`;

export function getAllActiveStudent(status) {
    let user = auth.getCurrentUser();
    if (user.user.logintype == "G")
        return http.get(apiEndpoint + '/status/' + status);
    else
        return http.get(schoolapiEndpoint + '/status/' + status);
}
export function getInActiveStudent() {
    let user = auth.getCurrentUser();
    if (user.user.logintype == "G")
        return http.get(apiEndpoint + '/inactive');
    else
        return http.get(schoolapiEndpoint + '/inactive');
}
export function getActiveStudent() {
    let user = auth.getCurrentUser();
    if (user.user.logintype == "G")
        return http.get(apiEndpoint + '/');
    else
        return http.get(schoolapiEndpoint + '/');
}
export function getStudent(studId) {
    let user = auth.getCurrentUser();
    if (user.user.logintype == "G")
        return http.get(apiEndpoint + '/' + studId);
    else
        return http.get(schoolapiEndpoint + '/' + studId);
}
export function createStudent(data) {
    let user = auth.getCurrentUser();
    if (user.user.logintype == "G")
        return http.post(apiEndpoint + '/create-one', data);
    else
        return http.post(schoolapiEndpoint + '/create-one', data);
}
export function updateStudent(data, studId) {
    let user = auth.getCurrentUser();
    if (user.user.logintype == "G")
        return http.put(apiEndpoint + '/id' + '/' + studId, data);
    else
        return http.put(schoolapiEndpoint + '/school/stud-id' + '/' + studId, data);
}

export function changeStatus(data) {
    let user = auth.getCurrentUser();
    if (user.user.logintype == "G")
        return http.put(apiEndpoint + '/status', data);
    else
        return http.put(schoolapiEndpoint + '/school/stud-status', data);
}

export function readBulkStudents(data) {
    return http.post(schoolapiEndpoint + '/read/excel-file', data);
}

export function uploadBulkStudents(data) {
    return http.post(schoolapiEndpoint + '/school/create-many', data);
}




