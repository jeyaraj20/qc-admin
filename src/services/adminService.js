import http from './httpService';
import { apiUrl, schoolApiUrl } from "../config";
import auth from './authService';

const apiEndpoint = `${apiUrl}/operator`;
const apimenuEndpoint = `${apiUrl}/adminmenu`;
const schoolapiEndpoint = `${schoolApiUrl}/operator`;


export function getName() {
    let user = auth.getCurrentUser();
    if (user.user.logintype == "G")
        return http.get(apiEndpoint + '/Y');
    else
        return http.get(schoolapiEndpoint + '/Y');
}
export function getInActiveOperator() {
    let user = auth.getCurrentUser();
    if (user.user.logintype == "G")
        return http.get(apiEndpoint + '/N');
    else
        return http.get(schoolapiEndpoint + '/N');
}
export function getOperator(opId) {
    let user = auth.getCurrentUser();
    if (user.user.logintype == "G")
        return http.get(apiEndpoint + '/' + opId);
    else
        return http.get(schoolapiEndpoint + '/' + opId);
}
export function getAllAdminmenu() {
    let user = auth.getCurrentUser();
    return http.get(apimenuEndpoint + '/all');

}

export function getUserMenu() {
    return http.get(apimenuEndpoint + '/');
}

export function createOperator(data) {
    let user = auth.getCurrentUser();
    if (user.user.logintype == "G")
        return http.post(apiEndpoint + '/', data);
    else
        return http.post(schoolapiEndpoint + '/', data);
}
export function editOperator(data, opId) {
    let user = auth.getCurrentUser();
    if (user.user.logintype == "G")
        return http.put(apiEndpoint + '/opId' + '/' + opId, data);
    else
        return http.put(schoolapiEndpoint + '/opId' + '/' + opId, data);
}

export function changeStatus(data) {
    let user = auth.getCurrentUser();
    if (user.user.logintype == "G")
        return http.put(apiEndpoint + '/inactive', data);
    else
        return http.put(schoolapiEndpoint + '/inactive', data);
}

export function changePassword(data) {
    let user = auth.getCurrentUser();
    if (user.user.type == "S")
        return http.put(apimenuEndpoint + '/changepasswordsuperadmin', data);
    else
        return http.put(apimenuEndpoint + '/changepasswordadminoperator', data);
}
export function getAllOperators() {
    let user = auth.getCurrentUser();
    if (user.user.logintype == "G")
        return http.get(apiEndpoint + '/getoperator/Y');
    else
        return http.get(schoolapiEndpoint + '/getoperator/Y');
}



