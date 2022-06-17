import Link from 'next/link';

export default ({currentUser}) => {
    const links = [
        !currentUser && {label: 'Sign Up', href: '/auth/signup'}, //if user NOT signed in, then Sign Up is defined inside the links array
        !currentUser && {label: 'Sign In', href: '/auth/signin'},
        currentUser && {label: 'Sign Out', href: '/auth/signout'}
    ] //  will be either [false, false, {currentUser && {label: 'Sign Out', href: '/auth/signout'}] OR [{..},{..}, false]
        .filter(linkConfig => linkConfig) //filter out 'false' entries
        .map(({label, href}) => { //destructure label, href of the object
            return (
            <li key={href} className="nav-item">
                <Link href={href}>
                    <a className="nav-link">{label}</a>
                </Link>
            </li>
            );
        });

    return (
    <nav className="navbar navbar-light bg-light">
        <Link href="/">
            <a className="navbar-brand">GitTix</a>
        </Link>

        <div className="d-flex justify-content-end">
            <ul className="nav d-flex align-items-center">
                {links}
            </ul>
        </div>
    </nav>
    );
};