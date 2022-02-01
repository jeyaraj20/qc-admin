import axios from "axios";
import http from './httpService';
import { apiUrl, schoolApiUrl } from "../config";
import auth from './authService';

const apiEndpoint = `${apiUrl}/notes`;
const schoolapiEndpoint = `${schoolApiUrl}/notes`;

export function getChapters(data) {
    let user = auth.getCurrentUser();
    if (user.user.logintype === "G")
        return http.post(apiEndpoint + '/getChapters', data);
    else
        return http.post(schoolapiEndpoint + '/getChapters', data);
}

export function getNotes(chapterId) {
    let user = auth.getCurrentUser();
    if (user.user.logintype === "G")
        return http.get(apiEndpoint + '/?chapterId=' + chapterId);
    else
        return http.get(schoolapiEndpoint + '/?chapterId=' + chapterId);
}

export function createNotes(data) {
    let user = auth.getCurrentUser();
    if (user.user.logintype === "G")
        return http.post(apiEndpoint + '/', data);
    else
        return http.post(schoolapiEndpoint + '/', data);
}

export function updateNotes(data, notesId) {
    let user = auth.getCurrentUser();
    if (user.user.logintype === "G")
        return http.put(`${apiEndpoint}/${notesId}`, data);
    else
        return http.put(`${schoolapiEndpoint}/${notesId}`, data);
}

export function deleteNotes(notesId) {
    let user = auth.getCurrentUser();
    if (user.user.logintype === "G")
        return http.delete(apiEndpoint + '?notesId=' + notesId);
    else
        return http.delete(schoolapiEndpoint + '?notesId=' + notesId);
}

export function getFile(notesId) {
    let user = auth.getCurrentUser();
    if (user.user.logintype === "G")
        return http.get(apiEndpoint + '/file?notesId=' + notesId);
    else
        return http.get(schoolapiEndpoint + '/file?notesId=' + notesId);
}

export function imageUpload(formData) {
    return http.post(`${apiUrl}/image`, formData);
}

export function attachmentUpload(formData) {
    return http.post(`${apiUrl}/image/attachment`, formData);
}
