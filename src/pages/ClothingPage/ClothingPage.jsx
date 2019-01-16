import React, {Component} from 'react';
import axios from 'axios';
import {connect} from 'react-redux';
import autoBind from 'react-autobind';
import SizeChoose from '../../options/SizeChoose';
import {Link} from 'react-router-dom';
import {Button, Form, Image, Modal} from 'semantic-ui-react';
import Spinner from '../../components/Spinner';
import WishListIcon from '../../components/Base/Components/WishListIcon/WishListIcon';

import './ClothingPage.css';

const className = 'ClothingPage';
const moreImagesClassName = `${className}__MoreImages`;
class ClothingPage extends Component {
    constructor(props) {
        super(props);
        autoBind(this);

        this.state = {
            clothingData: false,
            active: false,
            itemNotFound: false,
            size: false,
            brandDetails: false,
        };
    }

    componentDidMount() {
        const {brand_id, product_title, id} = this.props.match.params;
        const url = `/api/brands/clothing/${id}/${product_title}/${brand_id}`;

        axios.get(url).then(res => {
            if (res.data.status === 404 || !res.data[0]) {
                return this.setState({
                    itemNotFound: true,
                });
            }
            this.setState({
                clothingData: res.data[0],
                brandDetails: res.data[0].clothing_label,
                itemNotFound: false,
            });
        });
    }

    handleChange(e) {
        const {name, value} = e.target;

        this.setState({
            [name]: value,
        });
    }

    storeTransaction(data) {
        const additionalInfo = {
            date_placed: Date().toString(),
            product: this.state.clothingData,
        };
        const token = data.paypal_link.split('token=')[1];
        axios
            .post(`/api/pay/transaction/started`, {
                ...data,
                additionalInfo,
                token,
            })
            .then(res => {
                return (window.location.href = data.paypal_link);
            });
    }

    handleSubmit(e) {
        e.preventDefault();
        const {clothingData, size, brandDetails} = this.state;
        const button = document.querySelector('#cart-button');

        localStorage.setItem(
            'currentTransactionId',
            JSON.stringify([clothingData])
        );

        if (!this.props.user.data) {
            const errorFrom = document.querySelector('#error');
            const message =
                "<p><a href='/account/login'>In order to protect all of our users, we ask that you Login or Sign up first before you are allowed to make purchases.</a></p>";
            errorFrom.innerHTML = message;
            return null;
        }

        const userData = this.props.user.data;

        this.setState({active: true});
        button.setAttribute('disabled', 'true');

        if (!clothingData.sold_out) {
            const data = {
                shipping: clothingData.shipping_cost,
                total:
                    Number(clothingData.price) +
                    Number(clothingData.shipping_cost),
                cost: Number(clothingData.price),
                description: clothingData.description,
                designer: clothingData.designer,
                title: clothingData.title,
                id: clothingData.id,
                size: size,
                paypal_email: brandDetails.paypal_email,
                user_id: userData.uid,
            };
            axios
                .post('/api/pay/paypal', data)
                .then(res => {
                    if (res.data.status === 404) {
                        return null;
                    }
                    return this.storeTransaction({
                        ...data,
                        paypal_link: res.data,
                    });
                })
                .catch(err => console.log(err));
        } else {
            let errorFrom = document.querySelector('#error');
            let message = '<p>Currently out of stock</p>';
            errorFrom.innerHTML = message;
        }
    }

    static handleImageChange(e) {
        const bigImage = document.getElementById('product-view');
        return (bigImage.style = `background: url('${e.target.dataset.img}')`);
    }

    static renderAdditonalImages(clothingData) {
        if (!clothingData.additonal_images) {
            return null;
        }
        return Object.values(clothingData.additonal_images).map((image, i) => {
            return <Image key={i} src={image} />;
        });
    }

    static renderAdditonalImagesSmall(clothingData) {
        if (!clothingData.additonal_images) {
            return null;
        }
        return Object.values(clothingData.additonal_images).map((image, i) => {
            return (
                <div
                    className={`${moreImagesClassName}__Image`}
                    key={i}
                    data-img={image}
                    onTouchEnd={ClothingPage.handleImageChange}
                    onClick={ClothingPage.handleImageChange}
                    style={{backgroundImage: `url('${image}')`}}
                    role="button"
                    aria-pressed="true"
                />
            );
        });
    }

    static renderModal(clothingData) {
        return (
            <Modal
                trigger={
                    <div
                        className="imgHolder"
                        id="product-view"
                        style={{
                            backgroundImage: `url('${
                                clothingData.main_image
                            }')`,
                        }}
                    />
                }
                closeOnDocumentClick={true}
                closeIcon
            >
                <Modal.Content image>
                    <Image src={clothingData.main_image} />
                    {ClothingPage.renderAdditonalImages(clothingData)}
                </Modal.Content>
            </Modal>
        );
    }

    static renderItemNotFound() {
        return (
            <div className="single-brand">
                <h1 className="ui header title">
                    {' '}
                    404 - This item was recently deleted or not found!
                </h1>
                <Link to="/designers">
                    <Button secondary>Check Out Some Designers</Button>
                </Link>
                <div className="page-container">
                    <img src="" alt="" />
                </div>
            </div>
        );
    }

    static renderMoreImagesSection(clothingData) {
        return (
            <div className={moreImagesClassName}>
                <div
                    className={`${moreImagesClassName}__Image`}
                    key={clothingData.id}
                    style={{
                        backgroundImage: `url('${clothingData.main_image}')`,
                    }}
                    data-img={clothingData.main_image}
                    onClick={ClothingPage.handleImageChange}
                    role="button"
                />
                {ClothingPage.renderAdditonalImagesSmall(clothingData)}
            </div>
        );
    }

    renderPage(clothingData) {
        const {clothing_label} = clothingData;
        return (
            <div className="product-info">
                {ClothingPage.renderModal(clothingData)}
                {!this.props.media.isDesktop
                    ? ClothingPage.renderMoreImagesSection(clothingData)
                    : null}
                <div className="product-text">
                    <div
                        className={
                            this.state.active
                                ? 'ui active inverted dimmer'
                                : 'ui disabled inverted dimmer'
                        }
                    >
                        <div className="ui indeterminate text loader">
                            Contacting PayPal. If this last longer than a minute
                            refresh the page
                        </div>
                    </div>
                    <Link
                        to={`/designers/${clothing_label.name}/${
                            clothing_label.id
                        }`}
                    >
                        <h1 className="ui header">{clothing_label.name}</h1>
                    </Link>
                    <h3 className="ui header">{clothingData.title}</h3>
                    <h3 className="ui header">${clothingData.price}</h3>
                    <p className="text">
                        <span id="details">Details: </span>
                        {clothingData.description}
                    </p>
                    <p>
                        {clothingData.category} - {clothingData.sub_category}
                    </p>
                    <div className="add-to-bag">
                        <Form required onSubmit={this.handleSubmit}>
                            <div id="error" />
                            <Form.Group required>
                                {clothingData ? (
                                    <SizeChoose
                                        productDetails={clothingData}
                                        handleChange={this.handleChange}
                                    />
                                ) : null}
                            </Form.Group>
                            <Button
                                secondary
                                id="cart-button"
                                disabled={!clothingData.inventory_total}
                            >
                                {!clothingData.inventory_total
                                    ? 'Sold out'
                                    : 'Checkout with Paypal'}
                            </Button>
                        </Form>
                        <Button>
                            <WishListIcon
                                id={clothingData.id}
                                title={clothingData.title}
                                product={clothingData}
                            />
                            Wishlist
                        </Button>
                    </div>
                    <a
                        target="_blank"
                        href={`mailto:kamidou95-sb@gmail.com?body=Reason%3A%0A%0AURL%3A%20${
                            this.props.match.url
                        }&Subject=Reporting An Item`}
                    >
                        Report This Item
                    </a>
                    {this.props.media.isDesktop
                        ? ClothingPage.renderMoreImagesSection(clothingData)
                        : null}
                </div>
            </div>
        );
    }

    render() {
        const {clothingData, itemNotFound} = this.state;
        return (
            <section id="single-clothing">
                <div className="single-clothing">
                    {itemNotFound ? ClothingPage.renderItemNotFound() : null}
                    <div className="page-container ui container">
                        {clothingData ? (
                            this.renderPage(clothingData)
                        ) : !itemNotFound ? (
                            <Spinner />
                        ) : null}
                    </div>
                </div>
            </section>
        );
    }
}

function mapStateToProps(state) {
    return {
        user: state.user,
        media: state.media,
    };
}

export default connect(mapStateToProps)(ClothingPage);
