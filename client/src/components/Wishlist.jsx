import React, {Component} from 'react';
import {Link, Redirect} from 'react-router-dom';
import {Button} from 'semantic-ui-react';
import firebase from '../config/firebase';
var db = firebase.firestore();

class Wishlist extends Component {
    constructor(props) {
        super(props);
        this.state = {
            redirect: false,
            currentPage: null,
            productData: false,
            productDataLoaded: false,
        };
    }

    componentWillMount() {
        let productInfo = {};

        firebase.auth().onAuthStateChanged(user => {
            if (user) {
                this.setState({redirect: false});
                db
                    .collection('users')
                    .doc(user.uid)
                    .collection('wishlist')
                    .limit(40)
                    .get()
                    .then(res => {
                        if (res.empty === false) {
                            res.forEach(product => {
                                return (productInfo[
                                    product.data().title
                                ] = product.data());
                            });
                            this.setState({
                                productData: productInfo,
                                productDataLoaded: true,
                            });
                        } else {
                            this.setState({
                                productDataLoaded: 'empty',
                            });
                        }
                    })
                    .then(res => console.log(res))
                    .catch(err => console.log(err));
            } else {
                this.setState({
                    redirect: true,
                    currentPage: '/account/login',
                });
            }
        });
    }

    handleAddToWishlist = (e, data) => {
        let productId = data.id;
        let productTitle = data.title;
        let likedItem = e.target;

        firebase.auth().onAuthStateChanged(user => {
            if (user) {
                if (localStorage.getItem(productId) === 'red') {
                    localStorage.removeItem(productId);
                    likedItem.style.color = 'gray';
                    db
                        .collection('users')
                        .doc(user.uid)
                        .collection('wishlist')
                        .doc(productTitle)
                        .delete()
                        .then(res => {
                            console.log(res);
                            window.location.reload();
                        })
                        .catch(err => console.log(err));
                } else {
                    return null;
                }
            } else {
                alert('You must be signed in first to do that!');
            }
        });
    };

    renderClothing() {
        const {productData} = this.state;
        return (
            <div className="ui link cards">
                {Object.values(productData).map((product, i) => {
                    return (
                        <div className="card" key={i}>
                            <Link
                                to={`/designers/${product.designer}/${
                                    product.designerId
                                }/${product.title}/${product.id}`}
                            >
                                <div className="image">
                                    <img src={product.main_image} alt="" />
                                </div>
                            </Link>
                            <div className="content">
                                <div className="header">{product.designer}</div>
                                <div className="description links">
                                    {product.title}
                                </div>
                                <div className="meta links">
                                    <Link
                                        to={`/search/products/${product.category.toLowerCase()}`}
                                    >
                                        {product.category}
                                    </Link>
                                    <a>${product.price}</a>
                                    <i
                                        style={{
                                            color: localStorage.getItem(
                                                product.id
                                            ),
                                        }}
                                        className="like icon"
                                        title="add to wishlist"
                                        data-id={product.id}
                                        data-title={product.title}
                                        onClick={e =>
                                            this.handleAddToWishlist(
                                                e,
                                                e.target.dataset
                                            )
                                        }
                                    />
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>
        );
    }

    renderPage() {
        if (this.state.productDataLoaded && this.state.productData) {
            return (
                <div className="single-brand">
                    <h1 className="ui header">Wishlist</h1>
                    <div className="page-container ui container">
                        <h3 className="ui header">
                            Purchase an item off of your wishlist today!
                        </h3>
                        {this.renderClothing()}
                    </div>
                </div>
            );
        } else if (this.state.productDataLoaded === false) {
            return (
                <div className="ui active inverted dimmer">
                    <div className="ui indeterminate text loader">
                        Preparing Files
                    </div>
                </div>
            );
        } else {
            return (
                <div className="single-brand">
                    <h1 className="ui header">Wishlist</h1>
                    <div className="page-container">
                        <h3 className="ui header">
                            Your wish list is empty :(
                        </h3>
                        <Link to="/designers/">
                            <Button secondary>Check out Designers</Button>
                        </Link>
                    </div>
                </div>
            );
        }
    }
    render() {
        const {redirect, currentPage} = this.state;
        return (
            <section id="single-brand">
                {redirect ? <Redirect to={currentPage} /> : null}
                {this.renderPage()}
            </section>
        );
    }
}

export default Wishlist;
