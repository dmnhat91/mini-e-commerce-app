import axios from 'axios';

export default ({req}) => {
    if (typeof window === 'undefined'){ 
        //we are on the server

        return axios.create({
            baseURL: 'http://ingress-nginx-controller.ingress-nginx.svc.cluster.local',
            headers: req.headers
        }); //create a preconfigured version of Axios
    } else {
        //we must be on the browser
        return axios.create({
            baseURL: '/' //we even don't need this line for it to work
        });
    }
};