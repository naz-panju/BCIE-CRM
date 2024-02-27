// http.ts
import axios from 'axios'
import {signOut} from "next-auth/react";

const http = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_PATH,
})

const setAuthorizationHeader = (token) => {
    http.defaults.headers.common['Authorization'] = `Bearer ${token}`;
};

const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
// console.log(token);
if (token) {
    // console.log('***', token);
    axios.defaults.headers.common['Authorization'] = 'Bearer ' + token;
}

const setToken = (token) => {
    // console.log('###', token);
    if (typeof window !== 'undefined') {
        setAuthorizationHeader(token);
     }
}
http.interceptors.request.use((config) => {
    config.params = {
        api_token: localStorage.getItem('token'),
        ...config.params,
    };


    config.headers = {
        ...config.headers,
        Authorization: 'Bearer ' + localStorage.getItem('token'),
        "Cache-Control": "no-store",
    };

    return config;
},
    error => Promise.reject(error),
);

http.interceptors.response.use((response) =>
    response,
    async (error) => {
        return Promise.reject(error.response?.data);
    },
);

http.interceptors.response.use(
    function(response) {
        // Check if the response contains a specific message
        if (response.data && response.data.error === 1001) {
            // Redirect to a specific page
            // You can replace 'YourPageName' with the actual route or URL you want to redirect to
            console.log("Sign out now")
            // signOut();
        }

        // Return the response for further processing
        return response;
    },
    function(error) {
        // Handle errors here if needed
        return Promise.reject(error);
    }
);


export { http, setToken }