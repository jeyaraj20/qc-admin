import http from './httpService';
import { schoolApiUrl } from "../config";

export function getQCMasterCategory() {
    return http.get(`${schoolApiUrl}/qcexamcategory/master`);
}

export function getQCMainCategory(masterIds) {
    let url = `${schoolApiUrl}/qcexamcategory/main`;
    masterIds.forEach((m, index) => {
        if(index === 0){
            url += `?masterIds[${index}]=${m}`;
        }else{
            url += `&masterIds[${index}]=${m}`;
        }
    });
    return http.get(url);
}

export function getQCSubCategory(mainIds) {
    let url = `${schoolApiUrl}/qcexamcategory/sub`;
    mainIds.forEach((m, index) => {
        if(index === 0){
            url += `?mainIds[${index}]=${m}`;
        }else{
            url += `&mainIds[${index}]=${m}`;
        }
    });
    return http.get(url);
}

export function getQCChapterCategory(subIds) {
    let url = `${schoolApiUrl}/qcexamcategory/chapter`;
    subIds.forEach((m, index) => {
        if(index === 0){
            url += `?subIds[${index}]=${m}`;
        }else{
            url += `&subIds[${index}]=${m}`;
        }
    });
    return http.get(url);
}