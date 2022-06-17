import {useEffect} from 'react';
import Router from 'next/router';
import useRequest from '../../hooks/use-request';

export default () => {
    const {doRequest} = useRequest({
        url: 'api/users/signout',
        method: 'post',
        body: {},
        onSuccess: () => {
            Router.push('/');
        }
    });

    useEffect(() => {
        doRequest();
    }, []); //2nd argument is an empty array because we want to run this only one time

    return <div>Signing you out...</div>;
};