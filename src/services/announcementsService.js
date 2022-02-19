import http from './httpService';
import { apiUrl } from "../config";

const apiEndpoint = `${apiUrl}/Announcements`;

export function getAnnouncements() {
    return http.get(apiEndpoint + '/');
}
export function getAnnouncementsTypes(categoryname) {
    return http.get(apiEndpoint + '/ExamMainName/' + categoryname);
}

export function getInactiveAnnouncements() {
    return http.get(apiEndpoint + '/inactive');
}

export function checkCategoryExists(categoryname) {
    return http.get(apiEndpoint + '/categoryName/' + categoryname);
}

export function saveAnnouncements(data) {
    return http.post(apiEndpoint + '/', data); 
}

export function editAnnouncements(categoryId, formdata) {
    return http.put(apiEndpoint + '/Id/' + categoryId, formdata);
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
