import http from './httpService';
import { apiUrl, schoolApiUrl } from "../config";
import auth from './authService';

const apiEndpoint = `${apiUrl}/question`;
const schoolapiEndpoint = `${schoolApiUrl}/question`;

export function getQuestionId(reqData) {
    let user = auth.getCurrentUser();
    if (user.user.logintype === "G")
        return http.post(apiEndpoint + '/questionNo', reqData);
    else
        return http.post(schoolapiEndpoint + '/questionNo', reqData);
}

export function getQuestionById(qid) {
    let user = auth.getCurrentUser();
    if (user.user.logintype === "G")
        return http.get(apiEndpoint + '/qid/' + qid);
    else
        return http.get(schoolapiEndpoint + '/qid/' + qid);
}

export function getPassageQuestionById(qid) {
    let user = auth.getCurrentUser();
    if (user.user.logintype === "G")
        return http.get(apiEndpoint + '/passage/qid/' + qid);
    else
        return http.get(schoolapiEndpoint + '/passage/qid/' + qid);
}

export function saveQuestion(formdata) {
    let user = auth.getCurrentUser();
    if (user.user.logintype === "G")
        return http.post(apiEndpoint + '/', formdata);
    else
        return http.post(schoolapiEndpoint + '/', formdata);
}

export function updateQuestion(questionId, formdata) {
    let user = auth.getCurrentUser();
    if (user.user.logintype === "G")
        return http.put(apiEndpoint + '/qid/' + questionId, formdata);
    else
        return http.put(schoolapiEndpoint + '/qid/' + questionId, formdata);
}

export function inactiveQuestion(categoryIdArr) {
    let user = auth.getCurrentUser();
    if (user.user.logintype === "G")
        return http.put(apiEndpoint + '/inactive', categoryIdArr);
    else
        return http.put(schoolapiEndpoint + '/inactive', categoryIdArr);
}

export function getAllQuestions(reqData) {
    let user = auth.getCurrentUser();
    if (user.user.logintype === "G")
        return http.post(apiEndpoint + '/view', reqData);
    else
        return http.post(schoolapiEndpoint + '/view', reqData);
}

export function getAllQuestionsCount(reqData) {
    let user = auth.getCurrentUser();
    if (user.user.logintype === "G")
        return http.post(apiEndpoint + '/totalcount', reqData);
    else
        return http.post(schoolapiEndpoint + '/totalcount', reqData);
}

export function getSearchResult(data) {
    return http.post(apiEndpoint + '/search-criteria', data);
}

export function getQuestionsCount() {
    let user = auth.getCurrentUser();
    if (user.user.logintype === "G")
        return http.get(apiEndpoint + '/dashboard/count');
    else
        return http.get(schoolapiEndpoint + '/dashboard/count');
}

export function savePassageQuestion(formdata) {
    let user = auth.getCurrentUser();
    if (user.user.logintype === "G")
        return http.post(apiEndpoint + '/passage', formdata);
    else
        return http.post(schoolapiEndpoint + '/passage', formdata);
}

export function updatePassageQuestion(qid, formdata) {
    let user = auth.getCurrentUser();
    if (user.user.logintype === "G")
        return http.put(apiEndpoint + '/passage/' + qid, formdata);
    else
        return http.put(schoolapiEndpoint + '/passage/' + qid, formdata);
}

export function deletePassageQuestionById(qid) {
    let user = auth.getCurrentUser();
    if (user.user.logintype === "G")
        return http.get(apiEndpoint + '/passage/delete/qid/' + qid);
    else
        return http.get(schoolapiEndpoint + '/passage/delete/qid/' + qid);
}