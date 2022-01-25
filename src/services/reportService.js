import http from './httpService';
import { apiUrl, schoolApiUrl } from "../config";
import auth from './authService';

const apiEndpoint = `${apiUrl}/reports`;
const schoolapiEndpoint = `${schoolApiUrl}/reports`;

export function getOverall(data) {
    let user = auth.getCurrentUser();
    if (user.user.logintype == "G")
        return http.post(apiEndpoint + '/report', data);
    else
        return http.post(schoolapiEndpoint + '/report', data);
}
export function getMaincat(data) {
    let user = auth.getCurrentUser();
    if (user.user.logintype == "G")
        return http.post(apiEndpoint + '/mainreport', data);
    else
        return http.post(schoolapiEndpoint + '/mainreport', data);
}
export function getTestcat(data) {
    let user = auth.getCurrentUser();
    if (user.user.logintype == "G")
        return http.post(apiEndpoint + '/testreport', data);
    else
        return http.post(schoolapiEndpoint + '/testreport', data);
}
export function getOverallmain(data) {
    let user = auth.getCurrentUser();
    if (user.user.logintype == "G")
        return http.post(apiEndpoint + '/overallmaster', data);
    else
        return http.post(schoolapiEndpoint + '/overallmaster', data);
}

/** PDF 1.2 */
export function getOverallPDF(data) {
    let user = auth.getCurrentUser();
    if (user.user.logintype == "G")
        return http.post(apiEndpoint + '/reportpdf', data, {
            responseType: 'arraybuffer',
            headers: {
              'Accept': 'application/pdf'
            }
      });
    else
        return http.post(schoolapiEndpoint + '/reportpdf', data);
}
export function getMaincatPDF(data) {
    let user = auth.getCurrentUser();
    if (user.user.logintype == "G")
        return http.post(apiEndpoint + '/mainreportpdf', data, {
            responseType: 'arraybuffer',
            headers: {
              'Accept': 'application/pdf'
            }
      });
    else
        return http.post(schoolapiEndpoint + '/mainreportpdf', data);
}
export function getTestcatPDF(data) {
    let user = auth.getCurrentUser();
    if (user.user.logintype == "G")
        return http.post(apiEndpoint + '/testreportpdf', data, {
            responseType: 'arraybuffer',
            headers: {
              'Accept': 'application/pdf'
            }
      });
    else
        return http.post(schoolapiEndpoint + '/testreportpdf', data);
}
export function getOverallmainPDF(data) {
    let user = auth.getCurrentUser();
    if (user.user.logintype == "G")
        return http.post(apiEndpoint + '/overallmasterpdf', data, {
            responseType: 'arraybuffer',
            headers: {
              'Accept': 'application/pdf'
            }
      });
    else
        return http.post(schoolapiEndpoint + '/overallmasterpdf', data);
}