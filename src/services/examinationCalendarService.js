import http from './httpService';
import { apiUrl, schoolApiUrl  } from "../config";
import auth from './authService';

const apiEndpoint = `${apiUrl}/subcategory`;
const apiEndpointqwe = `${apiUrl}/dashboardCategory`;
const quesapiEndpoint = `${apiUrl}/question`;
const schoolapiEndpoint = `${schoolApiUrl}/subcategory`;
const schoolquesapiEndpoint = `${schoolApiUrl}/question`;
const schoolapiEndpoints = `${schoolApiUrl}/category`;

export function getAllexamination() {
    let user = auth.getCurrentUser();
    if (user.user.logintype === "G")
        return http.get(apiEndpointqwe + '/');
    
}
//getexamination

// export function getAllgetAllexaminationCount(status) {
//     let user = auth.getCurrentUser();
//     if (user.user.logintype === "G")
//         return http.get(apiEndpointqwe + '/examinationCalendar-sub/count/' + status);
// }


export function saveSubCategory(formdata) {
    let user = auth.getCurrentUser();
    if (user.user.logintype === "G")
    //     return http.post(apiEndpoint + '/', formdata);
    // else
    //     return http.post(schoolapiEndpoint + '/', formdata);
    return http.get(apiEndpoint + '/');
}

export function editQbankCategory(categoryId, formdata) {
    let user = auth.getCurrentUser();
    // if (user.user.logintype === "G")
    //     return http.put(apiEndpoint + '/pid/' + categoryId, formdata);
    // else
    //     return http.put(schoolapiEndpoint + '/pid/' + categoryId, formdata);
    return http.get(apiEndpoint + '/');
}

export function inactiveCategory() {
    let user = auth.getCurrentUser();
    if (user.user.logintype === "G")
//return http.put(apiEndpointqwe + '/inactive', categoryIdArr);
return http.get(apiEndpoint + '/inactive');

}

export function deleteCategory(categoryIdArr) {
    let user = auth.getCurrentUser();
    if (user.user.logintype === "G")
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




export function getSubCategoryById(id) {
    let user = auth.getCurrentUser();
    if (user.user.logintype === "G")
        return http.get(apiEndpoint + '/sub/' + id);
    else
        return http.get(schoolapiEndpoint + '/sub/' + id);
}

export function getSearchResult(data) {
    let user = auth.getCurrentUser();
    if (user.user.logintype === "G")
        return http.post(apiEndpoint + '/search-criteria', data);
    else
        return http.post(schoolapiEndpoint + '/search-criteria', data);
}

export function changePosition(categoryIdArr) {
    return http.put(apiEndpoint + '/position', categoryIdArr);
}


export function getAllQuestionMainCategoryAsc() {
    let user = auth.getCurrentUser();
    if (user.user.logintype === "G")
        return http.get(apiEndpoint + '/asc');
    else
        return http.get(schoolapiEndpoints + '/asc');
}

//------------------------------------------------------------------------


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

// export function inactiveCategory(categoryIdArr) {
//     return http.put(apiEndpoint + '/inactive' , categoryIdArr);
// }

// export function deleteCategory(categoryIdArr) {
//     return http.delete(apiEndpoint + '/', {
//         headers: {
//             "Content-Type": "application/json"
//         },
//         data: categoryIdArr
//       });
// }

// export function changePosition(categoryIdArr) {
//     return http.put(apiEndpoint + '/position' , categoryIdArr);
// }

export function imageUpload(formData) {
    return http.post(`${apiUrl}/image/dashboard`, formData);
}
