import axios from 'axios';
import buildClient from '../api/build-client';

const LandingPage = ({currentUser}) => {
    return currentUser ? <h1>You are signed in</h1> : <h1>You are NOT signed in</h1>;
 };
 
 LandingPage.getInitialProps = async (context) => {
    /***** REPLACED BY buildClient
    // console.log(req.headers);

    if (typeof window === 'undefined'){ 
        //if window variable undefined, meaning we are on server
        //requests should be made to ingress nginx
        const {data} = await axios.get(
            'http://ingress-nginx-controller.ingress-nginx.svc.cluster.local/api/users/currentuser', 
            {
                headers: req.headers
            }
        );

        return data;
    } else {
        //we are on the browser
        //requests can be made with a base url of ''
        const {data} = await axios.get('/api/users/currentuser'); //we don't need to attach headers as browser does it for us automatically

        return data;
    }

    return {};
    ******/
    console.log('LANDING PAGE');
    const client = buildClient(context); //context for this = {req, res}
    const {data} = await client.get('/api/users/currentuser').catch((err) => {
        console.log(err.message);
    });

    return data;
 };
 
 export default LandingPage;