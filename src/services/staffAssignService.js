import http from './httpService';
import { schoolApiUrl } from "../config";

const schoolapiEndpoint = `${schoolApiUrl}/staffassign`;

export function createStaffAssign(formdata) {
    return http.post(schoolapiEndpoint + '/', formdata);
}

export function updateStaffAssign(id, data) {
    return http.put(schoolapiEndpoint + '/id/' + id, data);
}

export function getAllStaffAssign() {
    return http.get(schoolapiEndpoint + '/allstaffassign' );
}



