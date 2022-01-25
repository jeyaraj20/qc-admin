import http from './httpService';
import { apiUrl, schoolApiUrl } from "../config";
import auth from './authService';

const apiEndpoint = `${apiUrl}/exam`;
const schoolapiEndpoint = `${schoolApiUrl}/exam`;

export function getAllExams(data) {
    let user = auth.getCurrentUser();
    if (user.user.logintype == "G")
        return http.post(apiEndpoint + '/', data);
    else
        return http.post(schoolapiEndpoint + '/', data);
}
export function getAllExamsWithAssigned(data) {
    let user = auth.getCurrentUser();
    if (user.user.logintype == "G")
        return http.post(apiEndpoint + '/assignedcount', data);
    else
        return http.post(schoolapiEndpoint + '/assignedcount', data);
}
export function getAllExamsCount(data) {
    let user = auth.getCurrentUser();
    if (user.user.logintype == "G")
        return http.post(apiEndpoint + '/examcount', data);
    else
        return http.post(schoolapiEndpoint + '/examcount', data);
}

export function saveExamSubCategory(data) {
    let user = auth.getCurrentUser();
    if (user.user.logintype == "G")
        return http.post(apiEndpoint + '/', data);
    else
        return http.post(schoolapiEndpoint + '/', data);
}

export function updateExamStatus(status) {
    let user = auth.getCurrentUser();
    if (user.user.logintype == "G")
        return http.put(apiEndpoint + '/status', status);
    else
        return http.put(schoolapiEndpoint + '/status', status);
}

export function getPreviousYear(data) {
    let user = auth.getCurrentUser();
    if (user.user.logintype == "G")
        return http.post(apiEndpoint + '/previousyear/', data);
    else
        return http.post(schoolapiEndpoint + '/previousyear/', data);
}

export function getTestTypes(subId) {
    let user = auth.getCurrentUser();
    if (user.user.logintype == "G")
        return http.get(apiEndpoint + '/getTestTypes/' + subId);
    else
        return http.get(schoolapiEndpoint + '/getTestTypes/' + subId);
}

export function getChapters(subId) {
    let user = auth.getCurrentUser();
    if (user.user.logintype == "G")
        return http.get(apiEndpoint + '/getChapters/' + subId);
    else
        return http.get(schoolapiEndpoint + '/getChapters/' + subId);
}

export function saveCommonExam(data) {
    let user = auth.getCurrentUser();
    if (user.user.logintype == "G")
        return http.post(apiEndpoint + '/create', data);
    else
        return http.post(schoolapiEndpoint + '/create', data);
}

export function getTestTypesEdit(subId) {
    let user = auth.getCurrentUser();
    if (user.user.logintype == "G")
        return http.get(apiEndpoint + '/getTestTypesEdit/' + subId);
    else
        return http.get(schoolapiEndpoint + '/getTestTypesEdit/' + subId);
}

export function getChaptersEdit(subId) {
    let user = auth.getCurrentUser();
    if (user.user.logintype == "G")
        return http.get(apiEndpoint + '/getChaptersEdit/' + subId);
    else
        return http.get(schoolapiEndpoint + '/getChaptersEdit/' + subId);
}

export function updateCommonExam(id, data) {
    let user = auth.getCurrentUser();
    if (user.user.logintype == "G")
        return http.put(apiEndpoint + '/id/' + id, data);
    else
        return http.put(schoolapiEndpoint + '/id/' + id, data);
}

export function saveBankExam(data) {
    let user = auth.getCurrentUser();
    if (user.user.logintype == "G")
        return http.post(apiEndpoint + '/bexam', data);
    else
        return http.post(schoolapiEndpoint + '/bexam', data);
}

export function getExamById(examId) {
    let user = auth.getCurrentUser();
    if (user.user.logintype == "G")
        return http.get(apiEndpoint + '/getSection/' + examId);
    else
        return http.get(schoolapiEndpoint + '/getSection/' + examId);
}

export function updateBankExam(examId, data) {
    let user = auth.getCurrentUser();
    if (user.user.logintype == "G")
        return http.put(apiEndpoint + '/bexam/id/' + examId, data);
    else
        return http.put(schoolapiEndpoint + '/bexam/id/' + examId, data);
}

export function getSearchResult(data) {
    return http.post(apiEndpoint + '/search-criteria', data);
}

export function getExamDetailsById(examId) {
    let user = auth.getCurrentUser();
    if (user.user.logintype == "G")
        return http.get(apiEndpoint + '/id/' + examId);
    else
        return http.get(schoolapiEndpoint + '/id/' + examId);
}

export function moveExam(data) {
    return http.post(apiEndpoint + '/moveexam', data);
}

export function getAllAttendedExam() {
    let user = auth.getCurrentUser();
    if (user.user.logintype == "G")
        return http.get(apiEndpoint + '/allattendexam');
}

export function getAllPaidExam() {
    let user = auth.getCurrentUser();
    if (user.user.logintype == "G")
        return http.get(apiEndpoint + '/allpaidexam');
}

export function getAutomaticRows(examId) {
    let user = auth.getCurrentUser();
    if (user.user.logintype == "G")
        return http.get(apiEndpoint + '/getautomaticrows/' + examId);
}

export function getExamResultReport() {
    let user = auth.getCurrentUser();
    return http.get(schoolapiEndpoint + '/getExamResutlReport/' +user.user.id );
}