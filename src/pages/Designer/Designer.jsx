import React, {Component} from 'react';
import {Redirect} from 'react-router-dom';

import Clothing from '../../components/Clothing/Component/Clothing';
import BrandLogo from '../../components/Base/Components/BrandLogo/BrandLogo';
import Spinner from '../../components/Spinner';

import './Designer.css';

const className = 'DesignerPage';
class Designer extends Component {
    constructor(props) {
        super(props);
        this.state = {
            redirect: false,
            currentPage: null,
            singleBrandData: false,
            singleBrandDataLoaded: false,
            productData: false,
            productDataLoaded: false,
        };
    }

    componentWillMount() {
        let brandId = this.props.match.params.brand_id;
        fetch(`/api/brands/${brandId}`)
            .then(res => {
                if (res.status === 404) {
                    this.setState({
                        redirect: true,
                        currentPage: '/designers',
                    });
                    return null;
                }
                return res.json();
            })
            .then(jsonData => {
                let {brandProducts, brand} = jsonData;
                this.setState({
                    productData: brandProducts,
                    productDataLoaded: jsonData.brandProducts === 204,
                    singleBrandData: brand.brandData,
                    singleBrandDataLoaded: brand.brandUid.length ? true : false,
                });
                return jsonData;
            })
            .catch(err => console.log(err));
    }

    renderClothing(productData) {
        if (!Object.keys(productData).length) {
            return Designer.renderNoProducts();
        }
        return productData.map((product, i) => {
            return <Clothing key={i} product={product} />;
        });
    }

    renderDescription() {
        let {singleBrandData} = this.state;
        return <h5 className="ui header">{singleBrandData.description}</h5>;
    }

    renderBrandLogo;

    static renderNoProducts() {
        return (
            <h3 className="ui header">
                Either this brand has sold out or no products are available yet.
            </h3>
        );
    }

    render() {
        const {redirect, currentPage, singleBrandData} = this.state;
        return (
            <section id="single-brand">
                {redirect ? <Redirect to={currentPage} /> : null}
                <div className={className}>
                    {singleBrandData.brand_logo ? (
                        <BrandLogo
                            imgUrl={singleBrandData.brand_logo}
                            brandName={singleBrandData.name}
                        />
                    ) : (
                        <h1 className="ui header title">
                            {this.state.singleBrandData.name}
                        </h1>
                    )}
                    <div className="page-container ui container">
                        {this.renderDescription()}
                        <div className={`${className}Container`}>
                            {this.state.singleBrandDataLoaded ? (
                                this.renderClothing(this.state.productData)
                            ) : (
                                <Spinner />
                            )}
                        </div>
                    </div>
                </div>
            </section>
        );
    }
}

export default Designer;
