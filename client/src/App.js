import React, {Component} from 'react';
import autoBind from 'react-autobind';
import {connect} from 'react-redux';

import {GET_USER_ACTION} from './Actions/User/getUserAction';

import firebase from './config/firebase';
import {
    BrowserRouter as Router,
    Redirect,
    Switch,
    Route,
} from 'react-router-dom';

import Home from './components/Home/Component/Home';
import Navbar from './components/Navbar';
import Login from './components/Login';
import Profile from './components/Profile';
import ApprovedBrand from './components/ApprovedBrand';
import BrandForm from './components/BrandForm';
// import Designers from './components/Designers';
// import Clothing from './components/Clothing';
import Article from './components/Article';
import ReadArticle from './components/ReadArticle';
import ArticleCategory from './components/ArticleCategory';
import SearchQuery from './components/SearchQuery';
import About from './components/About';
import Contact from './components/Contact';
import Terms from './components/Terms';
import ProcessPayment from './components/ProcessPayment';
import JoinMailing from './components/Base/Components/JoinMailing/JoinMailing';

// Pages
import AllClothing from './pages/AllClothing/AllClothing';
import ClothingPage from './pages/ClothingPage/ClothingPage';
import Designer from './pages/Designer/Designer';
import Designers from './pages/Designers/Designers';
import ProductUpload from './pages/ProductUpload/ProductUpload';
import OrderHistoryPage from './pages/OrderHistoryPage/OrderHistoryPage';
import Wishlist from './pages/Wishlist/Wishlist';
import NoMatch from './components/NoMatch';

import './App.css';

var db = firebase.firestore();

class App extends Component {
    constructor() {
        super();
        autoBind(this);

        this.state = {
            authState: false,
            userInfo: false,
            redirect: false,
            currentPage: '',
            uid: null,
            brandData: false,
            productData: false,
            productDataLoaded: false,
            articleData: false,
            articleDataLoaded: false,
            image: false,
            displayMailingList: false,
        };
    }

    componentWillReceiveProps(props) {
        if (props.user.data) {
            this.setState({
                userInfo: this.props.user.data,
                authState: true,
                redirect: false,
                currentPage: '',
            });
        } else {
            this.setState({
                userInfo: null,
                authState: false,
            });

            function lsTest() {
                var test = 'test';
                try {
                    localStorage.setItem(test, test);
                    localStorage.removeItem(test);
                    return true;
                } catch (e) {
                    return false;
                }
            }

            if (lsTest() === true) {
                this.setState({
                    displayMailingList: !localStorage.getItem('visited'),
                });
                localStorage.setItem('visited', 'true');
            } else {
                null;
            }
        }
    }

    handleAuthState = authChange => {
        if (!authChange) {
            firebase
                .auth()
                .signOut()
                .then(res => {
                    this.props.GET_USER_ACTION();
                })
                .catch(err => console.log(err));
        } else {
            this.props.GET_USER_ACTION();
            return null;
        }
    };

    storeFeed(brandData) {
        this.setState({
            brandData,
        });
    }

    storeArticleData = (articleData, brandData) => {
        this.setState({
            articleData: articleData,
            articleDataLoaded: true,
            featBrandData: brandData,
            featBrandDataLoaded: true,
        });
    };

    handleSearch = (search, kind) => {
        console.log(search, kind);
        if (search !== undefined) {
            db.collection('brands')
                .where('approved', '==', true)
                .where('name', '==', search)
                .get()
                .then(res => {
                    console.log(res);
                });
        }
    };

    changeMailingState() {
        this.setState({
            displayMailingList: false,
        });
    }

    render() {
        const {redirect, currentPage, displayMailingList} = this.state;
        return (
            <Router>
                <div className="App">
                    <div className="app-body">
                        <Navbar
                            authState={this.state.authState}
                            userInfo={this.state.userInfo}
                            authStateChange={authChange =>
                                this.handleAuthState(authChange)
                            }
                            handleSearch={(search, kind) =>
                                this.handleSearch(search, kind)
                            }
                        />
                        {displayMailingList ? (
                            <JoinMailing
                                changeMailingState={this.changeMailingState}
                            />
                        ) : null}
                        <Switch>
                            <Route
                                exact
                                path="/"
                                render={() => (
                                    <Home
                                        authState={this.state.authState}
                                        articleData={this.state.articleData}
                                        articleDataLoaded={
                                            this.state.articleDataLoaded
                                        }
                                        featBrandData={this.state.featBrandData}
                                        storeArticleData={(
                                            articleData,
                                            brandData
                                        ) =>
                                            this.storeArticleData(
                                                articleData,
                                                brandData
                                            )
                                        }
                                    />
                                )}
                            />
                            <Route
                                exact
                                path="/account/login"
                                render={() => (
                                    <Login
                                        authState={authChange =>
                                            this.handleAuthState(authChange)
                                        }
                                        handleAuthState={this.handleAuthState}
                                    />
                                )}
                            />
                            <Route
                                exact
                                path="/profile"
                                render={() => (
                                    <Profile
                                        authState={this.state.authState}
                                        userInfo={this.state.userInfo}
                                        authStateChange={authChange =>
                                            this.handleAuthState(authChange)
                                        }
                                    />
                                )}
                            />
                            <Route
                                exact
                                path="/profile/brand-signup"
                                component={BrandForm}
                            />
                            <Route
                                exact
                                path="/profile/product-create"
                                component={ProductUpload}
                            />
                            <Route
                                exact
                                path="/profile/brand"
                                render={() => (
                                    <ApprovedBrand
                                        authState={this.state.authState}
                                        userUid={this.state.uid}
                                    />
                                )}
                            />
                            {/* <Route exact path="/profile/cart" render={()=> <Cart authState={this.state.authState} userUid={this.state.uid} shopping_cart={this.state.shopping_cart} /> }/> */}
                            <Route
                                exact
                                path="/profile/transactions"
                                component={OrderHistoryPage}
                            />
                            <Route
                                exact
                                path="/profile/process"
                                component={ProcessPayment}
                            />
                            <Route
                                exact
                                path="/profile/wishlist"
                                component={Wishlist}
                            />
                            <Route
                                exact
                                path="/designers"
                                render={() => (
                                    <Designers
                                        brandData={this.state.brandData}
                                        storeFeed={this.storeFeed}
                                    />
                                )}
                            />
                            <Route
                                exact
                                path="/designers/:brand/:brand_id"
                                component={Designer}
                            />
                            <Route
                                exact
                                path="/designers/:brand/:brand_id/:product_title/:id"
                                component={ClothingPage}
                            />
                            <Route
                                exact
                                path="/editorial/"
                                render={() => (
                                    <Article authState={this.state.authState} />
                                )}
                            />
                            <Route
                                exact
                                path="/editorial/archive/:category"
                                component={ArticleCategory}
                            />
                            <Route
                                exact
                                path="/editorial/:id/:article"
                                component={ReadArticle}
                            />
                            <Route
                                exact
                                path="/search/products/:product_type"
                                component={SearchQuery}
                            />
                            <Route
                                exact
                                path="/clothing"
                                component={AllClothing}
                            />
                            <Route exact path="/about" component={About} />
                            <Route
                                exact
                                path="/contact-us"
                                component={Contact}
                            />
                            <Route
                                exact
                                path="/customer/terms-conditions"
                                component={Terms}
                            />
                            {redirect ? <Redirect to={currentPage} /> : null}
                            <Route component={NoMatch} />
                        </Switch>
                    </div>
                </div>
            </Router>
        );
    }
}

const mapDispatchToProps = {
    GET_USER_ACTION,
};

function mapStateToProps(state) {
    return {
        media: state.media,
        user: state.user,
    };
}

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(App);
