import React, {Component} from 'react';
import axios from 'axios';
import {Link, Redirect} from 'react-router-dom';
import {Button} from 'semantic-ui-react';
import firebase from '../config/firebase';
var db = firebase.firestore();

class Cart extends Component {
    constructor(props) {
        super(props);
        this.state = {
            redirect: false,
            currentPage: null,
            productData: false,
            productDataLoaded: false,
            cartLength: 0,
        };
    }

    componentWillMount() {
        let productInfo = {};

        firebase.auth().onAuthStateChanged(user => {
            if (user) {
                this.setState({redirect: false, uid: user.uid});
                db.collection('users')
                    .doc(user.uid)
                    .collection('cart')
                    .get()
                    .then(res => {
                        this.setState({cartLength: res.size});
                        if (res.empty === false) {
                            res.forEach(product => {
                                return (productInfo[
                                    product.id
                                ] = product.data());
                            });
                            this.setState({
                                productData: productInfo,
                                productDataLoaded: true,
                                cartEmpty: false,
                            });
                        } else {
                            this.setState({
                                productDataLoaded: 'empty',
                                cartEmpty: false,
                            });
                        }
                    });
            } else {
                this.setState({
                    redirect: true,
                    currentPage: '/account/login',
                });
            }
        });
    }

    removeFromCart = product => {
        db.collection('users')
            .doc(this.state.uid)
            .collection('cart')
            .doc(product.id)
            .delete()
            .then(res => {
                console.log(res);
                window.location.reload();
            })
            .catch(err => console.log(err));
    };

    handleCheckout(e, total) {
        document
            .querySelector('.paypal-button')
            .setAttribute('disabled', 'true');
        console.log(total);
        axios
            .post('/pay', {
                data: this.state.productData,
                total: total,
                cartLength: this.state.cartLength,
            })
            .then(res => {
                console.log(res);
                // window.location.href=(res.data.href);
            })
            .catch(err => console.log(err));
    }

    renderClothing() {
        const {productData} = this.state;
        let total = 0;
        return (
            <div className="ui container">
                <div className="ui divided items">
                    {Object.values(productData).map((product, i) => {
                        let id = Object.keys(productData);
                        total = total + Number(product.price);
                        return (
                            <div className="item clothes" key={i}>
                                <div className="image">
                                    <img src={product.main_image} alt="" />
                                </div>
                                <div className="content">
                                    <Link
                                        className="header"
                                        to={`/designers/${product.designer}/${
                                            product.designerId
                                        }/${product.title}/${product.id}`}
                                    >
                                        {product.designer}
                                    </Link>
                                    <div className="meta">
                                        <span>{product.title}</span>
                                    </div>
                                    <div className="description">
                                        <a>Category: {product.category}</a>
                                        <a>Cost: ${product.price}</a>
                                        <a>Size: {product.size}</a>
                                        <Button
                                            data-id={id[i]}
                                            data-title={product.title}
                                            onClick={e =>
                                                this.removeFromCart(
                                                    e.target.dataset
                                                )
                                            }
                                        >
                                            Remove
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
                <div className="payment-info">
                    <h4 className="ui header">Order Summary</h4>
                    <p>
                        Subtotal: <span id="cost">{total}</span>
                    </p>
                    <p>
                        Shipping, calculated at checkout.{' '}
                        <span id="cost">0</span>
                    </p>
                    <p>
                        Total: <span id="cost">{total}</span>
                    </p>
                    <Button
                        secondary
                        className="paypal-button"
                        onClick={e => this.handleCheckout(e, total)}
                    >
                        Checkout with Paypal
                    </Button>
                </div>
            </div>
        );
    }

    renderPage() {
        if (this.state.productDataLoaded && this.state.productData) {
            return (
                <div className="single-brand">
                    <h1 className="ui header">Shopping Bag</h1>
                    <div className="page-container ui container">
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
                    <h1 className="ui header">Shopping Bag</h1>
                    <div className="page-container ui container">
                        <h3 className="ui header">Shopping bag is empty :(</h3>
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
            <section id="cart">
                {redirect ? <Redirect to={currentPage} /> : null}
                {this.renderPage()}
            </section>
        );
    }
}

export default Cart;
