import http from './httpService';
import { apiUrl, schoolApiUrl } from "../config";
import auth from './authService';

const apiEndpoint = `${apiUrl}/coupon`;

export function getAllCoupon(status) {
    return http.get(apiEndpoint + '/status/' + status);
}

export function saveCoupon(data) {
    return http.post(apiEndpoint + '/', data);
}

export function updateCoupon(id, data) {
    return http.put(apiEndpoint + '/id/' + id, data);
}

export function changeStatus(idArr) {
    return http.put(apiEndpoint + '/status', idArr);
}

export function getAlldurations() {
    return http.get(apiEndpoint + '/duration');
}