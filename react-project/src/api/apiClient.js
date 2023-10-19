import axios from "axios";

const apiClient = axios.create({
  baseURL: 'http://13.124.126.209:80'
})

export default apiClient;