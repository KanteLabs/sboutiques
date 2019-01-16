import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {Link} from 'react-router-dom';

import ClothingHelper from '../../Base/Helpers/ClothingHelper';

import WishListIcon from '../../Base/Components/WishListIcon/WishListIcon';

import './Clothing.css';

const className = 'Clothing';
const ImageClassName = `${className}__Image`;
const contentClassName = `${className}__Content`;
class Clothing extends Component {
    render() {
        const {product} = this.props;
        return (
            <div className={`${className}`}>
                <Link to={product.url}>
                    <img
                        className={ImageClassName}
                        src={product.main_image}
                        alt={product.title}
                    />
                </Link>
                <div className={contentClassName}>
                    <div className={`${contentClassName}__Header`}>
                        <Link to={product.url}>{product.title}</Link>
                    </div>
                    <div className={`${contentClassName}__Description`}>
                        <Link to={ClothingHelper.getDesignerUrl(product)}>
                            {product.designer}
                        </Link>
                    </div>
                    <div className={`${contentClassName}__Details`}>
                        <Link
                            to={ClothingHelper.getCategoryUrl(product.category)}
                        >
                            {product.category}
                        </Link>
                        <p>
                            {ClothingHelper.formatPrice(product.price)}
                            <span
                                className={`${contentClassName}__Details__Icon`}
                            >
                                {' '}
                                <WishListIcon
                                    id={product.id}
                                    title={product.title}
                                    product={product}
                                />
                            </span>
                        </p>
                    </div>
                </div>
            </div>
        );
    }
}
export default Clothing;

Clothing.propTypes = {
    product: PropTypes.object.isRequired,
};
