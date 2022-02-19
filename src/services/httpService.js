import axios from "axios";
import auth from "./authService";
// import logger from "./logService";
// import { toast } from "react-toastify";

//axios.defaults.headers.common["x-auth-token"] = auth.getJwt();

axios.interceptors.response.use(null, error => {
  const expectedError =
    error.response &&
    error.response.status >= 400 &&
    error.response.status < 500;

    if(error.response && error.response.status===401)
       {
         localStorage.clear()
        // window.location="/login"
        // window.location.reload(true)// if navbar visibles ...it'll remove
       }
       if(error.response && error.response.status===500){
         //alert(error.response);
         if(error.response.data.error.message === "jwt expired"){
          localStorage.clear();
          window.location="signin";
         }
       }

  if (!expectedError) {
    console.log(error);
    console.log("error response ",error.response);

    // toast.error("An unexpected error occurrred.");
  }

  return Promise.reject(error);
});

function setJwt(jwt) {
   console.log(jwt);
   axios.defaults.headers.common["x-auth-token"] = String(jwt);
}

function getJwt(){
  console.log(axios.defaults.headers.common["x-auth-token"]);
  return axios.defaults.headers.common["x-auth-token"]
}

function convertQueryString(paramsObj) {



  let queryString=""
  for( let key in paramsObj)
  {
      if(Array.isArray(paramsObj[key]))
      {
        for( let val of paramsObj[key])
        queryString=queryString+"&"+key+"="+val
      }
      else 
      queryString=queryString+"&"+key+"="+paramsObj[key]
  }

  return queryString;
}

function uploadFile(url, file, params) {
  var formData = new FormData();
  
  formData.append("file", file);
  for ( let param of params  )
    formData.append(param.key, param.value);
  return axios.post(url, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
      'x-auth-token' : axios.defaults.headers.common["x-auth-token"]
    }
  })
}

function convertToFormData(obj){

  /* 
  obj={
    file:FileObj,
    group:"string",
    key:val
  }
   */



  let options={
    headers: {
      'Content-Type': 'multipart/form-data',
      'x-auth-token' : axios.defaults.headers.common["x-auth-token"]
    }
  }
   let formData=new FormData()
   for(let key in obj)
       formData.append(key,obj[key])

       return  ({formData,options})


}


export default {
  get: axios.get,
  post: axios.post,
  put: axios.put,
  delete: axios.delete,
  setJwt,
  convertQueryString,
  uploadFile,
  convertToFormData,
  getJwt
};
