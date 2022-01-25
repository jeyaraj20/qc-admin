import http from './httpService';
import { apiUrl, schoolApiUrl } from "../config";
import auth from './authService';
const apiEndpoint = `${apiUrl}/exammaincategory`;
const schoolapiEndpoint = `${schoolApiUrl}/exammaincategory`;

export function getExamMainCategory() {
    let user = auth.getCurrentUser();
    if (user.user.logintype == "G")
        return http.get(apiEndpoint + '/master');
    else
        return http.get(schoolapiEndpoint + '/master');
}

export function getExamSubCategoryById(id) {
    let user = auth.getCurrentUser();
    if (user.user.logintype == "G")
        return http.get(apiEndpoint + '/main/' + id);
    else
        return http.get(schoolapiEndpoint + '/main/' + id);
}

export function getExamSubCategoryByCatId(id) {
    let user = auth.getCurrentUser();
    if (user.user.logintype == "G")
        return http.get(apiEndpoint + '/sub/' + id);
    else
        return http.get(schoolapiEndpoint + '/sub/' + id);
}

export function getAllQuestionMainCategory(status) {
    let user = auth.getCurrentUser();
    if (user.user.logintype == "G")
        return http.get(apiEndpoint + '/' + status);
    else
        return http.get(schoolapiEndpoint + '/' + status);
}

export function getInactiveExamMainCategory() {
    let user = auth.getCurrentUser();
    if (user.user.logintype == "G")
        return http.get(apiEndpoint + '/inactive');
    else
        return http.get(schoolapiEndpoint + '/inactive');
}

export function saveExamMainCategory(formdata) {
    let user = auth.getCurrentUser();
    if (user.user.logintype == "G")
        return http.post(apiEndpoint + '/', formdata);
    else
        return http.post(schoolapiEndpoint + '/', formdata);
}

export function editExamMainCategory(categoryId, formdata) {
    let user = auth.getCurrentUser();
    if (user.user.logintype == "G")
        return http.put(apiEndpoint + '/catId/' + categoryId, formdata);
    else
        return http.put(schoolapiEndpoint + '/catId/' + categoryId, formdata);
}

export function inactiveCategory(categoryIdArr) {
    let user = auth.getCurrentUser();
    if (user.user.logintype == "G")
        return http.put(apiEndpoint + '/inactive', categoryIdArr);
    else
        return http.put(schoolapiEndpoint + '/inactive', categoryIdArr);
}

export function deleteCategory(categoryIdArr) {
    let user = auth.getCurrentUser();
    if (user.user.logintype == "G")
        return http.delete(apiEndpoint + '/', {
            headers: {
                "Content-Type": "application/json"
            },
            data: categoryIdArr
        });
    else
        return http.delete(schoolapiEndpoint + '/', {
            headers: {
                "Content-Type": "application/json"
            },
            data: categoryIdArr
        });
}

export function changePosition(categoryIdArr) {
    let user = auth.getCurrentUser();
    if (user.user.logintype == "G")
        return http.put(apiEndpoint + '/position', categoryIdArr);
    else
        return http.put(schoolapiEndpoint + '/position', categoryIdArr);
}

export function getHomeExamMasterCategory(id) {
    let user = auth.getCurrentUser();
    if (user.user.logintype == "G")
        return http.get(apiEndpoint + '/category/' + id);
    else
        return http.get(schoolapiEndpoint + '/category/' + id);
}

export function getExamChapterById(id) {
    let user = auth.getCurrentUser();
    if (user.user.logintype == "G")
        return http.get(apiEndpoint + '/chapter/' + id);
    else
        return http.get(schoolapiEndpoint + '/chapter/' + id);
}
