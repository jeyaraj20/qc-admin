import http from './httpService';
import { apiUrl } from "../config";

const apiEndpoint = `${apiUrl}/homecategory`;

export function getHomeCategory() {
    return http.get(apiEndpoint + '/');
}

export function getInactiveHomeCategory() {
    return http.get(apiEndpoint + '/inactive');
}

export function checkCategoryExists(categoryname) {
    return http.get(apiEndpoint + '/categoryName/' + categoryname);
}

export function saveHomeCategory(formdata) {
    return http.post(apiEndpoint + '/', formdata);
}

export function editHomeCategory(categoryId, formdata) {
    return http.put(apiEndpoint + '/catId/' + categoryId, formdata);
}

export function inactiveCategory(categoryIdArr) {
    return http.put(apiEndpoint + '/inactive' , categoryIdArr);
}

export function deleteCategory(categoryIdArr) {
    return http.delete(apiEndpoint + '/', {
        headers: {
            "Content-Type": "application/json"
        },
        data: categoryIdArr
      });
}

export function changePosition(categoryIdArr) {
    return http.put(apiEndpoint + '/position' , categoryIdArr);
}
