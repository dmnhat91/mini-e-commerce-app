import axios from 'axios';

const LandingPage = ({currentUser}) => {
    console.log(currentUser);

    return <h1>Landing Page</h1>;
 };
 
 LandingPage.getInitialProps = async ({req}) => {
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
 };
 
 export default LandingPage;