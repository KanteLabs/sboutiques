import React, {Component} from 'react';

import './BrandLogo.css';

const className = 'BrandLogo';
const imageClassName = `${className}__Image`;
class BrandLogo extends Component {
    render() {
        const {imgUrl, brandName} = this.props;
        return (
            <div className={className}>
                <img className={imageClassName} src={imgUrl} alt={brandName} />
            </div>
        );
    }
}

export default BrandLogo;
