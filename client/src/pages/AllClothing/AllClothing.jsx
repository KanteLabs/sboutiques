import React, {Component} from 'react';
import axios from 'axios';
import autoBind from 'react-autobind';

import Clothing from '../../components/Clothing/Component/Clothing';
import Spinner from '../../components/Spinner';

import './AllClothing.css';

const categories = ['all', 'outerwear', 'tops', 'bottoms', 'accessories'];

const className = 'AllClothing';
class AllClothing extends Component {
    constructor(props) {
        super(props);
        autoBind(this);

        this.state = {
            product: false,
            currentQuery: 'Clothing',
            shouldBannerDisplay: false,
        };
    }

    componentDidMount() {
        axios.get(`/api/clothes/all?${window.location.search}`).then(res => {
            this.setState({
                product: res.data,
            });
        });
        if (window.sessionStorage.getItem('currentQuery')) {
            this.setState({
                currentQuery: window.sessionStorage.getItem('currentQuery'),
            });
        }
    }

    queryClothing(e) {
        e.preventDefault();
        const {category} = e.target.dataset;
        axios
            .get(`/api/clothes/category/${category}?limit=all`)
            .then(res => {
                this.setState({
                    product: res.data,
                    currentQuery: category.match('all') ? 'Clothing' : category,
                    shouldBannerDisplay: !res.data.length,
                });
                return window.sessionStorage[
                    category.match('all') ? 'removeItem' : 'setItem'
                ]('currentQuery', category);
            })
            .catch(err => {
                console.log(err);
                return err;
            });
    }

    renderSubCategories(category) {
        return (
            <a
                onClick={this.queryClothing}
                className={`item ${className}__Container__Filters__Filter`}
                key={category}
                data-category={category}
            >
                {category}
            </a>
        );
    }

    renderClothing() {
        return this.state.product.map((product, i) => {
            return <Clothing key={i} product={product} />;
        });
    }

    render() {
        const {product, currentQuery, shouldBannerDisplay} = this.state;
        return (
            <section id="all-clothing">
                <h1 className="ui header">{currentQuery}</h1>
                {shouldBannerDisplay ? (
                    <h3 className="ui header">
                        No products where found or have been uploaded under this
                        category yet.
                    </h3>
                ) : null}
                <div className="ui text menu">
                    {categories.map(this.renderSubCategories)}
                </div>
                <div className={`${className}__Container`}>
                    {product ? this.renderClothing() : <Spinner />}
                </div>
            </section>
        );
    }
}

export default AllClothing;
