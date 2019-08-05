import React from 'react';
import {Link} from 'react-router-dom';

const Clothes = props => {
    const {clothingData} = props;
    const cardLayout = {
        display: 'flex',
        flexFlow: 'row wrap',
        justifyContent: 'center',
        marginTop: '1em',
    };
    const singleCard = {
        margin: '0em 1em 1em',
        width: 'auto',
    };

    return (
        <div className="ui link cards clothes" style={cardLayout}>
            {Object.values(clothingData).map((product, i) => {
                const style = {
                    backgroundImage: `url(${product.main_image}`,
                    backgroundSize: 'cover',
                    width: '250px',
                    height: '250px',
                    backgroundPosition: 'center',
                    backgroundRepeat: 'no-repeat',
                };
                return (
                    <div className="card" key={i} style={singleCard}>
                        <Link
                            to={`/designers/${product.designer}/${
                                product.clothing_label.id
                            }/${product.title}/${product.id}`}
                        >
                            <div className="imageHolder" style={style} />
                        </Link>
                        <div className="content">
                            <div className="header">
                                <Link
                                    to={`/designers/${product.designer}/${
                                        product.clothing_label.id
                                    }/${product.title}/${product.id}`}
                                >
                                    {product.title}
                                </Link>
                            </div>
                            {product.inventory_total === 0 ? (
                                <p id="soldout">SOLD OUT</p>
                            ) : null}
                            <div className="description links">
                                <Link
                                    to={`/designers/${product.designer}/${
                                        product.clothing_label.id
                                    }`}
                                >
                                    {product.designer}
                                </Link>
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
                                        color: localStorage.getItem(product.id),
                                    }}
                                    className="like icon"
                                    title="add to wishlist"
                                    data-id={product.id}
                                    data-title={product.title}
                                    onClick={e =>
                                        props.handleAddToWishlist(
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
};

export default Clothes;
