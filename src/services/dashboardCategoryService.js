import http from './httpService';
import { apiUrl } from "../config";

const apiEndpoint = `${apiUrl}/dashboardCategory`;

export function getDashboardCategory() {
    return http.get(apiEndpoint + '/');
}

export function getInactiveDashboardCategory() {
    return http.get(apiEndpoint + '/inactive');
}

export function checkCategoryExists(categoryname) {
    return http.get(apiEndpoint + '/categoryName/' + categoryname);
}

export function saveDashboardCategory(data) {
    return http.post(apiEndpoint + '/', data); 
}

export function editDashboardCategory(categoryId, formdata) {
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

export function imageUpload(formData) {
    return http.post(`${apiUrl}/image/dashboard`, formData);
}
