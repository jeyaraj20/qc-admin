import http from './httpService';
import { apiUrl, schoolApiUrl } from "../config";
import auth from './authService';

const apiEndpoint = `${apiUrl}/examsubcategory`;
const schoolapiEndpoint = `${schoolApiUrl}/examsubcategory`;

export function getAllExamSubCategory(status) {
    let user = auth.getCurrentUser();
    if (user.user.logintype === "G")
        return http.get(apiEndpoint + '/status/' + status);
    else
        return http.get(schoolapiEndpoint + '/status/' + status);
}

export function saveExamSubCategory(data) {
    let user = auth.getCurrentUser();
    if (user.user.logintype === "G")
        return http.post(apiEndpoint + '/', data);
    else
        return http.post(schoolapiEndpoint + '/', data);
}

export function editExamSubCategory(id, data) {
    let user = auth.getCurrentUser();
    if (user.user.logintype === "G")
    return http.put(apiEndpoint + '/id/' + id, data);
    else
    return http.put(schoolapiEndpoint + '/id/' + id, data);

}

export function getExamSubCategoryChapters(catId) {
    let user = auth.getCurrentUser();
    if (user.user.logintype === "G")
    return http.get(apiEndpoint + '/chapter/' + catId);
    else
    return http.get(schoolapiEndpoint + '/chapter/' + catId);
  
}

export function getExamSubCategoryType(catId) {
    let user = auth.getCurrentUser();
    if (user.user.logintype === "G")
    return http.get(apiEndpoint + '/type/' + catId);
    else
    return http.get(schoolapiEndpoint + '/type/' + catId);
 
}

export function getExamTypes(id) {
    let user = auth.getCurrentUser();
    if (user.user.logintype === "G")
    return http.get(apiEndpoint + '/type/' + id);
    else
    return http.get(schoolapiEndpoint + '/type/' + id);

}

export function getSearchResult(data) {
    let user = auth.getCurrentUser();
    if (user.user.logintype === "G")
    return http.post(apiEndpoint + '/search-criteria', data);
    else
    return http.post(schoolapiEndpoint + '/search-criteria', data);
   
}


export function getResult(data) {
    console.log(data);
    return http.post(apiEndpoint + '/question/assign/search-criteria', data);
}

export function getSubCategoryCount(status) {
    let user = auth.getCurrentUser();
    if (user.user.logintype === "G")
        return http.get(apiEndpoint + '/sub-cat/count/' + status);
    else
        return http.get(schoolapiEndpoint + '/sub-cat/count/' + status);
}