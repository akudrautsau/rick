import axios from 'axios';

declare module 'axios' {
  // eslint-disable-next-line @typescript-eslint/no-empty-object-type
  export interface AxiosResponse<T = any> extends Promise<T> {}
}

const http = axios.create();

http.interceptors.response.use(
  (res) => res.data,
  (e) => {
    return Promise.reject(e.response?.data);
  }
);

export default http;
