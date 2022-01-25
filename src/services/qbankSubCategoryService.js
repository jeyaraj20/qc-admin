import http from './httpService';
import { apiUrl, schoolApiUrl } from "../config";
import auth from './authService';

const apiEndpoint = `${apiUrl}/subcategory`;
const quesapiEndpoint = `${apiUrl}/question`;
const schoolapiEndpoint = `${schoolApiUrl}/subcategory`;
const schoolquesapiEndpoint = `${schoolApiUrl}/question`;

export function getAllQuestionSubCategory(status) {
    let user = auth.getCurrentUser();
    if (user.user.logintype == "G")
        return http.get(apiEndpoint + '/status/' + status);
    else
        return http.get(schoolapiEndpoint + '/status/' + status);
}

export function getAllQuestionSubCategoryCount(status) {
    let user = auth.getCurrentUser();
    if (user.user.logintype == "G")
        return http.get(apiEndpoint + '/qbank-sub/count/' + status);
    else
        return http.get(schoolapiEndpoint + '/qbank-sub/count/' + status);
}

export function getInactiveSubCategory() {
    let user = auth.getCurrentUser();
    if (user.user.logintype == "G")
        return http.get(apiEndpoint + '/inactive');
    else
        return http.get(schoolapiEndpoint + '/inactive');
}

export function saveSubCategory(formdata) {
    let user = auth.getCurrentUser();
    if (user.user.logintype == "G")
        return http.post(apiEndpoint + '/', formdata);
    else
        return http.post(schoolapiEndpoint + '/', formdata);
}

export function editQbankCategory(categoryId, formdata) {
    let user = auth.getCurrentUser();
    if (user.user.logintype == "G")
        return http.put(apiEndpoint + '/pid/' + categoryId, formdata);
    else
        return http.put(schoolapiEndpoint + '/pid/' + categoryId, formdata);
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

export function getWaitingQuestions(data) {
    let user = auth.getCurrentUser();
    if (user.user.logintype == "G")
        return http.post(quesapiEndpoint + '/get/status', data);
    else
        return http.post(schoolquesapiEndpoint + '/get/status', data);
}

export function getQuestionsCount(data) {
    let user = auth.getCurrentUser();
    if (user.user.logintype == "G")
        return http.post(quesapiEndpoint + '/active-inactive/count', data);
    else
        return http.post(schoolquesapiEndpoint + '/active-inactive/count', data);
}

export function getActiveQuestions(data) {
    let user = auth.getCurrentUser();
    if (user.user.logintype == "G")
        return http.post(quesapiEndpoint + '/get/status', data);
    else
        return http.post(schoolquesapiEndpoint + '/get/status', data);
}

export function getInActiveQuestions(data) {
    let user = auth.getCurrentUser();
    if (user.user.logintype == "G")
        return http.post(quesapiEndpoint + '/get/status', data);
    else
        return http.post(schoolquesapiEndpoint + '/get/status', data);
}

export function getSubCategoryById(id) {
    let user = auth.getCurrentUser();
    if (user.user.logintype == "G")
        return http.get(apiEndpoint + '/sub/' + id);
    else
        return http.get(schoolapiEndpoint + '/sub/' + id);
}

export function getSearchResult(data) {
    let user = auth.getCurrentUser();
    if (user.user.logintype == "G")
        return http.post(apiEndpoint + '/search-criteria', data);
    else
        return http.post(schoolapiEndpoint + '/search-criteria', data);
}

export function getAllQuestionSubCategoryOnly(status) {
    let user = auth.getCurrentUser();
    if (user.user.logintype == "G")
        return http.get(apiEndpoint + '/subcat/status/' + status);
    else
        return http.get(schoolapiEndpoint + '/subcat/status/' + status);
}

export function getCategory(data) {
    let user = auth.getCurrentUser();
    if (user.user.logintype == "G")
        return http.post(quesapiEndpoint + '/getcategory', data);
    else
        return http.post(schoolquesapiEndpoint + '/getcategory', data);
}

export function getSubCategoryQuestionForPDF(data) {
    return http.post(apiEndpoint + '/get/Questionspdfreport', data, {
        responseType: 'arraybuffer',
        headers: {
          'Accept': 'application/pdf'
        }
  });
}

export function getExamCategoryQuestionForPDF(data) {
    return http.post(apiEndpoint + '/get/ExamQuestionpdf', data);
}

export function changePosition(categoryIdArr) {
    return http.put(apiEndpoint + '/position', categoryIdArr);
}

export function getAllAdmin() {
    return http.post(apiEndpoint + '/get/alladmin');
}

export function getOpData(data) {
    return http.post(apiEndpoint + '/get/alladminquestions', data);
}