import axios from "axios";
import http from './httpService';
import { apiUrl, schoolApiUrl } from "../config";
import auth from './authService';

const apiEndpoint = `${apiUrl}/videos`;
const schoolapiEndpoint = `${schoolApiUrl}/videos`;

export function getVideos(chapterId) {
    let user = auth.getCurrentUser();
    if (user.user.logintype === "G")
        return http.get(apiEndpoint + '/?chapterId=' + chapterId);
    else
        return http.get(schoolapiEndpoint + '/?chapterId=' + chapterId);
}

export function createVideos(data) {
    let user = auth.getCurrentUser();
    if (user.user.logintype === "G")
        return http.post(apiEndpoint + '/', data);
    else
        return http.post(schoolapiEndpoint + '/', data);
}

export function updateVideos(data, videosId) {
    let user = auth.getCurrentUser();
    if (user.user.logintype === "G")
        return http.put(`${apiEndpoint}/${videosId}`, data);
    else
        return http.put(`${schoolapiEndpoint}/${videosId}`, data);
}

export function deleteVideos(videosId) {
    let user = auth.getCurrentUser();
    if (user.user.logintype === "G")
        return http.delete(apiEndpoint + '?videosId=' + videosId);
    else
        return http.delete(schoolapiEndpoint + '?videosId=' + videosId);
}

export function thumbnailUpload(formData) {
    return http.post(`${apiUrl}/image/thumbnail`, formData);
}

