import 'bootstrap/dist/css/bootstrap.css';
import buildClient from '../api/build-client';
import Header from '../components/header';

const AppComponent = ({Component, pageProps, currentUser}) => {
    return (
    <div>
        <Header currentUser={currentUser}/>
        <Component {...pageProps} />
    </div>
    );
};

AppComponent.getInitialProps = async (appContext) => {
    const client = buildClient(appContext.ctx); // appContext = {.. , .. , ctx , ..}
    const {data} = await client.get('/api/users/currentuser');

    let pageProps = {};
    if (appContext.Component.getInitialProps){ //if Component.getInitialProps is defined
        pageProps = await appContext.Component.getInitialProps(appContext.ctx); //Components are the pages under this AppComponent (aka. index.js, signin.js, signup.js, etc.)
    }

    return {
        pageProps,
        ...data
    }
};

export default AppComponent;