import jwtDecode from "jwt-decode";
import http from "./httpService";
import { apiUrl } from "../config";
const apiEndpoint = `${apiUrl}/login`;
// const apiEndpoint = apiUrl + "/auth";
const tokenKey = "token";



export async function signInWithEmailAndPassword(admin_name,admin_pass,type,logintype) {
  if(type =="S")
{ 
  var data={
        "admin_name":admin_name,
        "admin_pass":admin_pass,
        "type":type,
        "logintype":logintype
    };
      const { data: jwt } = await http.post(apiEndpoint, data);
      return jwt

    }
else{

  var data={
    "admin_name":admin_name,
    "admin_pass":admin_pass,
    "type":type,
    "logintype":logintype
};
  const { data: jwt } = await http.post(apiEndpoint+'/adminfaculty', data);
  return jwt

}
 }

export function loginWithJwt(jwt) {
  localStorage.setItem(tokenKey, jwt.token);
}

export function logout() {
  localStorage.removeItem(tokenKey);
}

export function getCurrentUser() {
  try {
    const jwt = localStorage.getItem(tokenKey);
    // console.log(jwt);
    return jwtDecode(jwt);
  } catch (ex) {
    return null;
  }
}

export function getJwt() {
  // console.log(localStorage.getItem(tokenKey));
  return localStorage.getItem(tokenKey);
}


export function isAuthorized(){
 return localStorage.getItem(tokenKey)

}

export default {
  signInWithEmailAndPassword,
  loginWithJwt,
  logout,
  getCurrentUser,
  getJwt,
  isAuthorized
};

