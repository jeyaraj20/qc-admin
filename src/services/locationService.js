import http from './httpService';
import { apiUrl, schoolApiUrl } from "../config";
import auth from './authService';

const apiEndpoint = `${apiUrl}/location`;
const schoolapiEndpoint = `${schoolApiUrl}/location`;

export function getCountry(status) {
    let user = auth.getCurrentUser();
    if (user.user.logintype === "G")
        return http.get(apiEndpoint + '/country/' + status);
    else
        return http.get(schoolapiEndpoint + '/country/' + status);
}
export function getCity(status) {
    let user = auth.getCurrentUser();
    if (user.user.logintype === "G")
        return http.get(apiEndpoint + '/city/' + status);
    else
        return http.get(schoolapiEndpoint + '/city/' + status);
}
export function getState(status) {
    let user = auth.getCurrentUser();
    if (user.user.logintype === "G")
        return http.get(apiEndpoint + '/state/' + status);
    else
        return http.get(schoolapiEndpoint + '/state/' + status);
}
export function checkStateExists(statename) {
    let user = auth.getCurrentUser();
    if (user.user.logintype === "G")
        return http.get(apiEndpoint + '/statename/' + statename);
    else
        return http.get(schoolapiEndpoint + '/statename/' + statename);
}
export function checkCityExists(cityname) {
    let user = auth.getCurrentUser();
    if (user.user.logintype === "G")
        return http.get(apiEndpoint + '/cityname/' + cityname);
    else
        return http.get(schoolapiEndpoint + '/cityname/' + cityname);
}
export function createState(data) {
    let user = auth.getCurrentUser();
    if (user.user.logintype === "G")
        return http.post(apiEndpoint + '/state', data);
    else
        return http.post(schoolapiEndpoint + '/state', data);
}
export function createCity(formData) {
    let user = auth.getCurrentUser();
    if (user.user.logintype === "G")
        return http.post(apiEndpoint + '/city', formData);
    else
        return http.post(schoolapiEndpoint + '/city', formData);
}
export function editState(data, stateId) {
    let user = auth.getCurrentUser();
    if (user.user.logintype === "G")
        return http.put(apiEndpoint + '/state' + '/' + stateId, data);
    else
        return http.put(schoolapiEndpoint + '/state' + '/' + stateId, data);
}
export function editCity(data, cityId) {
    let user = auth.getCurrentUser();
    if (user.user.logintype === "G")
        return http.put(apiEndpoint + '/city' + '/' + cityId, data);
    else
        return http.put(schoolapiEndpoint + '/city' + '/' + cityId, data);
}
export function changeStatus(data) {
    let user = auth.getCurrentUser();
    if (user.user.logintype === "G")
        return http.put(apiEndpoint + '/statestatus', data);
    else
        return http.put(schoolapiEndpoint + '/statestatus', data);
}
export function changecityStatus(data) {
    let user = auth.getCurrentUser();
    if (user.user.logintype === "G")
        return http.put(apiEndpoint + '/citystatus', data);
    else
        return http.put(schoolapiEndpoint + '/citystatus', data);
}



