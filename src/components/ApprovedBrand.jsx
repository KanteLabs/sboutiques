import React, {Component} from 'react';
import {Link, Redirect} from 'react-router-dom';
import {Button} from 'semantic-ui-react';
import firebase from '../config/firebase';
var db = firebase.firestore();

class ApprovedBrand extends Component {
    constructor(props) {
        super(props);
        this.state = {
            uid: false,
            redirect: false,
            currentPage: null,
            brandData: false,
            productData: false,
        };
    }

    componentWillMount() {
        firebase.auth().onAuthStateChanged(user => {
            if (user) {
                db.collection('brands')
                    .doc(user.uid)
                    .get()
                    .then(res => {
                        if (res.exists && res.data().approved) {
                            this.setState({
                                brandStatus: true,
                                brandCreated: true,
                                brandData: res.data(),
                                uid: user.uid,
                                redirect: false,
                                currentPage: '',
                            });
                            let productRef = db
                                .collection('brands')
                                .doc(this.state.uid)
                                .collection('products');
                            let productData = {};
                            productRef
                                .orderBy('title')
                                .get()
                                .then(res => {
                                    res.forEach(product => {
                                        return (productData[
                                            product.id
                                        ] = product.data());
                                    });
                                })
                                .then(() => {
                                    this.setState({productData: productData});
                                })
                                .catch(err => {
                                    console.log(err);
                                });
                        } else if (res.exists && !res.data().approved) {
                            this.setState({
                                redirect: true,
                                currentPage: '/profile',
                            });
                        } else if (res.exists === false) {
                            this.setState({
                                redirect: true,
                                currentPage: '/profile/brand-signup',
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

    componentWillUpdate(nextProps, nextState) {
        if (nextProps.authState && nextState.uid === false) {
            console.log('update');
            return true;
        } else {
            console.log(' no update');
            return false;
        }
    }

    handleDelete = (id, title) => {
        if (
            window.confirm(
                `Are you sure you want to delete ${title}? This action can't be reversed.`
            )
        ) {
            db.collection('brands')
                .doc(this.state.uid)
                .collection('products')
                .doc(title)
                .delete()
                .then(res => {
                    console.log(`${title} was deleted`);
                    db.collection('products')
                        .where('id', '==', id)
                        .get()
                        .then(res => {
                            res.forEach(item => {
                                item.ref.update({
                                    deleted: true,
                                });
                            });
                        })
                        .then(() => {
                            alert(`${title} was deleted`);
                            window.location.reload();
                        });
                })
                .catch(err => console.log(err));
        } else {
            return null;
        }
    };

    markSoldOut = (id, title) => {
        db.collection('brands')
            .doc(this.props.userUid)
            .collection('products')
            .doc(title)
            .update({
                sold_out: true,
            })
            .then(res => {
                window.location.reload();
            })
            .catch(err => console.log(err));
    };

    renderGallery() {
        if (this.state.productData) {
            return (
                <div className="ui link cards">
                    {Object.values(this.state.productData).map((product, i) => {
                        return (
                            <div className="card" key={i}>
                                <Link
                                    to={`/designers/${
                                        this.state.brandData.name
                                    }/${this.state.brandData.id}/${
                                        product.title
                                    }/${product.id}`}
                                >
                                    <div className="image">
                                        <img
                                            src={product.main_image}
                                            alt={product.title}
                                        />
                                    </div>
                                </Link>
                                <div className="content">
                                    <div className="header">
                                        {product.title}
                                    </div>
                                    <div className="meta">
                                        <a>{product.category}</a>
                                        <a>${product.price}</a>
                                    </div>
                                </div>
                                <div className="extra content">
                                    <span className="right floated">
                                        SOLD: {product.amount_sold}
                                    </span>
                                    <span className="left floated">
                                        {product.sold_out ? (
                                            <p id="soldout">SOLD OUT</p>
                                        ) : (
                                            `Available: ${
                                                product.inventory_total
                                            }`
                                        )}
                                    </span>
                                    <Button
                                        secondary
                                        disabled={product.sold_out}
                                        onClick={() =>
                                            this.markSoldOut(
                                                product.id,
                                                product.title
                                            )
                                        }
                                    >
                                        Mark As Sold Out
                                    </Button>
                                    <Button
                                        negative
                                        onClick={() =>
                                            this.handleDelete(
                                                product.id,
                                                product.title
                                            )
                                        }
                                    >
                                        DELETE PRODUCT
                                    </Button>
                                </div>
                            </div>
                        );
                    })}
                </div>
            );
        } else {
            return (
                <div className="ui active inverted dimmer">
                    <div className="ui indeterminate text loader">
                        Preparing Files
                    </div>
                </div>
            );
        }
    }

    renderPage() {
        if (this.state.brandData && this.state.productData) {
            return (
                <div className="brand-page">
                    <h1 className="ui header">{this.state.brandData.name}</h1>
                    <h3 className="ui header">
                        {this.state.brandData.description}
                    </h3>
                    <Link to="/profile/product-create">
                        <button className="ui button">List A Item</button>
                    </Link>
                    <div className="page-container">{this.renderGallery()}</div>
                </div>
            );
        } else if (this.state.brandData && !this.state.productData) {
            return (
                <div className="brand-page">
                    <h1 className="ui header">{this.state.brandData.name}</h1>
                    <h3 className="ui header">
                        {this.state.brandData.description}
                    </h3>
                    <Link to="/profile/product-create">
                        <button className="ui button">List A Item</button>
                    </Link>
                    <div className="product-gallery">
                        <div className="card">
                            No Products Yet! List a item to get started.
                        </div>
                    </div>
                </div>
            );
        } else {
            return (
                <div className="ui active inverted dimmer">
                    <div className="ui indeterminate text loader">
                        Preparing Files
                    </div>
                </div>
            );
        }
    }

    render() {
        const {redirect, currentPage} = this.state;
        return (
            <section id="brand-page">
                {redirect ? <Redirect to={currentPage} /> : null}
                {this.renderPage()}
            </section>
        );
    }
}

export default ApprovedBrand;
