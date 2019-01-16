import React, {Component} from 'react';
import {connect} from 'react-redux';
import axios from 'axios';

import {Link, Redirect} from 'react-router-dom';
import {Button} from 'semantic-ui-react';
import Clothing from '../../components/Clothing/Component/Clothing';
import Spinner from '../../components/Spinner';

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

    getUserWishlist(uid) {
        axios.get(`/api/wishlist/${uid}`).then(res => {
            if (res.data.status || !res.data.length) {
                return this.setState({
                    productDataLoaded: true,
                });
            }
            this.setState({
                productData: res.data,
                productDataLoaded: true,
            });
        });
    }

    componentDidMount() {
        if (!this.props.user.data) {
            return null;
        }

        return this.getUserWishlist(this.props.user.data.uid);
    }

    componentWillReceiveProps(nextProps) {
        return !this.props.user.data && nextProps.user.data
            ? this.getUserWishlist(nextProps.user.data.uid)
            : null;
    }

    renderClothing() {
        const {productData} = this.state;
        return productData.map((product, i) => {
            return (
                <Clothing
                    key={i}
                    product={
                        product.hasOwnProperty('product')
                            ? product.product
                            : product
                    }
                />
            );
        });
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
                        <div className="ui link cards">
                            {this.renderClothing()}
                        </div>
                    </div>
                </div>
            );
        } else if (!this.state.productDataLoaded) {
            return <Spinner />;
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

function mapStateToProps(state) {
    return {
        user: state.user,
    };
}

export default connect(mapStateToProps)(Wishlist);
