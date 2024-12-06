import axios, { AxiosError } from "axios";

const baseURL = process.env.NEXT_PUBLIC_API_URL;

export interface IAxiosError extends AxiosError { }
export const isAxiosError = axios.isAxiosError;

const axiosApi = axios.create({
  baseURL,
  headers: {
    "Content-Type": "application/json",
  },
});

axiosApi.interceptors.request.use(
  (request) => {
    // // console.log("API Request: ", request.url);
    return request;
  },
  (error) => {
    return Promise.reject(error);
  }
);

axiosApi.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error("API Response Error: ", error);
    return Promise.reject(error);
  }
);

export default axiosApi;
