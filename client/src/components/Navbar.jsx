import React, {Component, Fragment} from 'react';
import {connect} from 'react-redux';
import autoBind from 'react-autobind';

import {BaseLinks} from '../options/NavbarLinks';

import {Link} from 'react-router-dom';
import {Dropdown} from 'semantic-ui-react';

import './Navbar.css';

import * as firebase from 'firebase';
var db = firebase.firestore();

const className = 'Navbar';
const menuClassName = `${className}__Menu`;
const menuItemClassName = `${menuClassName}__Item`;
class Navbar extends Component {
    constructor(props) {
        super(props);
        this.state = {
            signedIn: false,
            user: undefined,
            searchType: 'clothing',
            displayMenu: false,
            toggleHamburger: false,
        };

        autoBind(this);
    }

    componentWillMount() {
        firebase.auth().onAuthStateChanged(user => {
            let userInfo = {};
            if (user) {
                this.setState({signedIn: true});
                db.collection('brands')
                    .doc(user.uid)
                    .get()
                    .then(res => {
                        if (res.exists && res.data().approved) {
                            this.setState({
                                uid: user.uid,
                                brandStatus: true,
                                redirect: false,
                                currentPage: '',
                            });
                        }
                    })
                    .then(() => {
                        db.collection('users')
                            .doc(user.uid)
                            .get()
                            .then(res => {
                                userInfo = res.data();
                                this.setState({user: userInfo});
                            });
                    });
            } else {
                this.setState({signedIn: false});
            }
        });
        document.addEventListener('click', this.closeMenu);
    }

    renderDropDowns(menuItems) {
        return menuItems.map((item, i) => {
            return (
                <Fragment key={i}>
                    {item.checkAuth && this.props.authState ? (
                        this.authUser(this.props.media.isDesktop)
                    ) : (
                        <Link to={item.link} key={i}>
                            <Dropdown.Item>{item.name}</Dropdown.Item>
                        </Link>
                    )}
                    {menuItems.length === i ? null : <Dropdown.Divider />}
                </Fragment>
            );
        });
    }

    logout = authChange => {
        this.props.authStateChange(authChange);
    };

    handleMenuClick = e => {
        this.setState(prevState => {
            return {
                toggleHamburger: !this.state.toggleHamburger,
                displayMenu: false,
            };
        });
    };

    closeMenu = e => {
        if (
            !e.target.className.match('icon') &&
            !e.target.id.match('profile-name')
        ) {
            this.setState(prevState => {
                return {toggleHamburger: false, displayMenu: false};
            });
        } else {
            return null;
        }
    };

    displayMenu(e) {
        e.preventDefault();
        this.setState({
            displayMenu: !this.state.displayMenu,
        });
    }

    authUser = isDesktop => {
        if (!isDesktop) {
            return (
                <ul className="submenu item">
                    <li className="menuToggle">
                        <p id="profile-name" onClick={e => this.displayMenu(e)}>
                            {this.state.user
                                ? this.state.user.display_name
                                : `Account`}
                        </p>
                    </li>
                    <ul
                        className={`${className}__Submenu__List ${
                            this.state.displayMenu ? 'block' : ''
                        }`}
                        id="menu_content"
                    >
                        <Link to="/profile">
                            <li className="item">Profile</li>
                        </Link>
                        <Dropdown.Divider />
                        {this.state.brandStatus ? (
                            <Link to="/profile/brand">
                                <li className="item">Brand Dashboard</li>
                            </Link>
                        ) : (
                            <Link to="/profile/brand-signup">
                                <li className="item">Register A Brand</li>
                            </Link>
                        )}
                        <Dropdown.Divider />
                        <Link to="/profile/wishlist">
                            <li className="item">Wishlist</li>
                        </Link>
                        <Dropdown.Divider />
                        <Link to="/profile/transactions">
                            <li className="item">Transactions</li>
                        </Link>
                        <Dropdown.Divider />
                        <Link to="#" onClick={() => this.logout(false)}>
                            <li className="item">Logout</li>
                        </Link>
                    </ul>
                </ul>
            );
        }
        return (
            <ul className="submenu item">
                <li className="menuToggle">
                    <p id="profile-name" onClick={e => this.displayMenu(e)}>
                        {this.state.user
                            ? this.state.user.display_name
                            : `Account`}
                    </p>
                </li>
                <ul
                    className={`${className}__Submenu__List ${
                        this.state.displayMenu ? 'block' : ''
                    }`}
                    id="menu_content"
                >
                    <Link to="/profile">
                        <li className="item">Profile</li>
                    </Link>
                    <Dropdown.Divider />
                    {this.state.brandStatus ? (
                        <Link to="/profile/brand">
                            <li className="item">Brand Dashboard</li>
                        </Link>
                    ) : (
                        <Link to="/profile/brand-signup">
                            <li className="item">Register A Brand</li>
                        </Link>
                    )}
                    <Dropdown.Divider />
                    <Link to="/profile/wishlist">
                        <li className="item">Wishlist</li>
                    </Link>
                    <Dropdown.Divider />
                    <Link to="/profile/transactions">
                        <li className="item">Transactions</li>
                    </Link>
                    <Dropdown.Divider />
                    <Link to="#" onClick={() => this.logout(false)}>
                        <li className="item">Logout</li>
                    </Link>
                </ul>
            </ul>
        );
    };

    renderNav() {
        return (
            <div className={`${menuClassName} ${menuClassName}--Desktop`}>
                <div className={`${menuClassName}--Left`}>
                    <Link className={menuItemClassName} to="/designers">
                        Designers
                    </Link>
                    <Link className={menuItemClassName} to="/clothing">
                        Clothing
                    </Link>
                    <Link className={menuItemClassName} to="/editorial">
                        Articles
                    </Link>
                </div>
                <div className={`BrandTitle`}>
                    <Link className="brand" to="/">
                        streetwear boutiques
                    </Link>
                </div>
                <div className={`${menuClassName}--Right`}>
                    {this.props.authState ? (
                        this.authUser()
                    ) : (
                        <Link className={menuItemClassName} to="/account/login">
                            Login
                        </Link>
                    )}
                    <Link className={menuItemClassName} to="/about">
                        About
                    </Link>
                    <Link className={menuItemClassName} to="/contact-us">
                        Contact
                    </Link>
                </div>
            </div>
        );
    }

    renderMobileNav() {
        return (
            <div className={`${menuClassName} ${menuClassName}--Mobile`}>
                <div className="menu-hamburger">
                    {' '}
                    <i
                        onClick={e => this.handleMenuClick(e)}
                        className="icon"
                        id="menu-icon"
                    >
                        ☰
                    </i>
                    <ul
                        className={`main-menu ${
                            this.state.toggleHamburger ? 'block' : 'hide'
                        }`}
                        id="main-menu"
                    >
                        {this.renderDropDowns(BaseLinks)}
                    </ul>
                </div>
                <div className="BrandTitle">
                    <Link className="brand" to="/">
                        streetwear boutiques
                    </Link>
                </div>
            </div>
        );
    }

    render() {
        const {media} = this.props;
        const header = {
            height: '58px',
            position: 'relative',
            background: 'white',
            top: '0em',
            maxWidth: '1200px',
        };
        return (
            <header className="Header">
                <nav>
                    <div className={className}>
                        {!media.isDesktop
                            ? this.renderMobileNav()
                            : this.renderNav()}
                    </div>
                </nav>
            </header>
        );
    }
}

function mapStateToProps(state) {
    return {
        media: state.media,
        user: state.user,
    };
}

export default connect(mapStateToProps)(Navbar);
