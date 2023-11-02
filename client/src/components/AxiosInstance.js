import  axios from 'axios';
const instance = axios.create({
    baseURL: 'http://172.19.22.140:4000/', 
    headers: {'X-Custom-Header': 'foobar'}
  });
  
export default instance;
