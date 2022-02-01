import axios from "axios";

export function setJwt(jwt) {
   console.log("je",jwt);
   axios.defaults.headers.common["x-auth-token"] = String(jwt);
}

export function getJwt(){
  console.log(axios.defaults.headers.common["x-auth-token"]);
  return axios.defaults.headers.common["x-auth-token"]
}

let customHeaders = {
  Accept : 'application/json'
}

export default axios.create({
  headers : customHeaders
});

