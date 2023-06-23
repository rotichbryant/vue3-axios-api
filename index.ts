import axios from 'axios';
import { isEmpty } from 'lodash';

export default {
    install: (app,options) => {
        
        // State variables
        const { store: { getters: { auth:{ token_type, token },env:{ VITE_API_BASE_URL } }, router } } : Object = options;

        // Init axios
        const api = axios.create({
            baseURL: VITE_API_BASE_URL,
            headers: {
                'X-Requested-With': 'XMLHttpRequest'
            },
        });

        if( !isEmpty(token) ){
            api.interceptors.request.use(
                (config) => {
                    config.headers.Authorization = `${token_type} ${token}`;
                    return config;
                },
                error => Promise.reject(error)
            );
        }

        api.interceptors.response.use(
            response => response,
            (error) => {
                if (error.response.status === 401) {
                    router.push({name:"Logout"})
                }
                return Promise.reject(error);
            }
        );

        app.config.globalProperties.$api = api;
    }
}
