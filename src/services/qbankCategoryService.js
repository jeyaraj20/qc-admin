import http from './httpService';
import { apiUrl, schoolApiUrl } from "../config";
import auth from './authService';
const apiEndpoint = `${apiUrl}/category`;
const schoolapiEndpoint = `${schoolApiUrl}/category`;

export function getAllQuestionMainCategory() {
    let user = auth.getCurrentUser();
    if (user.user.logintype === "G")
        return http.get(apiEndpoint + '/');
    else
        return http.get(schoolapiEndpoint + '/');
}

export function getAllQuestionMainCategoryAsc() {
    let user = auth.getCurrentUser();
    if (user.user.logintype === "G")
        return http.get(apiEndpoint + '/asc');
    else
        return http.get(schoolapiEndpoint + '/asc');
}

export function getInactiveQbankCategory() {
    let user = auth.getCurrentUser();
    if (user.user.logintype === "G")
        return http.get(apiEndpoint + '/inactive/');
    else
        return http.get(schoolapiEndpoint + '/inactive/');

}

export function saveQbankCategory(formdata) {
    let user = auth.getCurrentUser();
    if (user.user.logintype === "G")
        return http.post(apiEndpoint + '/', formdata);
    else
        return http.post(schoolapiEndpoint + '/', formdata);
}

export function editQbankCategory(categoryId, formdata) {
    let user = auth.getCurrentUser();
    if (user.user.logintype === "G")
        return http.put(apiEndpoint + '/catId/' + categoryId, formdata);
    else
        return http.put(schoolapiEndpoint + '/catId/' + categoryId, formdata);

}

export function deleteCategory(categoryIdArr) {
    return http.delete(apiEndpoint + '/', {
        headers: {
            "Content-Type": "application/json"
        },
        data: categoryIdArr
    });
}

export function inactiveCategory(categoryIdArr) {
    let user = auth.getCurrentUser();
    if (user.user.logintype === "G")
        return http.put(apiEndpoint + '/inactive', categoryIdArr);
    else
        return http.put(schoolapiEndpoint + '/inactive', categoryIdArr);
}

export function changePosition(categoryIdArr) {
    let user = auth.getCurrentUser();
    if (user.user.logintype === "G")
        return http.put(apiEndpoint + '/position', categoryIdArr);
    else
        return http.put(schoolapiEndpoint + '/position', categoryIdArr);
}