import React, {Component} from 'react';

import Clothing from '../../Clothing/Component/Clothing';

import './RecentUploads.css';

const className = 'RecentUploads';
class RecentUploads extends Component {
    constructor(props) {
        super(props);
        this.state = {
            productData: false,
            productDataLoaded: false,
        };
    }

    componentDidMount() {
        fetch('/api/clothes/recent-uploads')
            .then(response => {
                return response.json();
            })
            .then(products => {
                this.setState({
                    productData: products,
                    productDataLoaded: products ? true : false,
                });
            })
            .catch(err => console.log(err));
    }

    renderPage() {
        const {productData} = this.state;

        return productData.map((product, i) => {
            return <Clothing key={i} product={product} />;
        });
    }

    render() {
        return (
            <div className={className}>
                <h1 className={`${className}__Title section-title`}>
                    New Arrivals
                </h1>
                <div className={`${className}Container`}>
                    {this.state.productDataLoaded ? this.renderPage() : null}
                </div>
            </div>
        );
    }
}

export default RecentUploads;
