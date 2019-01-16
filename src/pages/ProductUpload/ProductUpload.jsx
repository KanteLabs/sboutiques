import React, {Component} from 'react';
import axios from 'axios';
import {Redirect} from 'react-router-dom';

import {Button, Form, Message} from 'semantic-ui-react';
import ChooseSize from '../../options/Sizes';
import ChooseSubCategory from '../../options/SubCategories';

import './ProductUpload.css';

import firebase from '../../config/firebase';

// Initialize Cloud Firestore through firebase
let db = firebase.firestore();

const className = 'ProductUpload';
const formClassName = `${className}__Form`;
const messageClassName = `${className}__Message`;
const messageHiddenClassName = `${messageClassName}--Hidden`;

const messageText = {
    success: {
        header: 'Your product was successfully uploaded.',
        content:
            'Upload another product, or go back to the brand dashboard to view your product.',
    },
    negative: {
        header: 'Your product failed to upload.',
        content:
            'If this problem continues please try again or contact us, and somebody will respond shortly.',
        imageTooBig:
            'Your image file size is too large, please reduce it and try again!',
    },
};
class ProductUpload extends Component {
    constructor(props) {
        super(props);
        this.state = {
            uploadCount: 0,
            category: false,
            sub_category: false,
            id: new Date().getTime(),
            created_date: new Date().toString(),
            os: 0,
            brandStatus: false,
            didProductUpload: false,
            showMessageBanner: false,
            bannerText: false,
        };
    }

    componentWillMount() {
        firebase.auth().onAuthStateChanged(user => {
            if (user) {
                db.collection('users')
                    .doc(user.uid)
                    .get()
                    .then(res => {
                        this.setState({currentUser: res.data()});
                    })
                    .catch(err => console.log(err));

                this.setState({
                    uid: user.uid,
                    redirect: false,
                    currentPage: '',
                });

                let brandRef = db.collection('brands').doc(this.state.uid);
                brandRef.get().then(res => {
                    if (res.exists && res.data().approved) {
                        this.setState({
                            brandStatus: true,
                            brandCreated: true,
                            brandData: res.data(),
                        });
                    } else if (res.exists) {
                        this.setState({
                            brandCreated: true,
                            brandStatus: false,
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

    renderPicPreviews = e => {
        let fileList = e.target.files;
        let picPreview = document.querySelector('#pic-preview ul');
        if (picPreview.children.length) {
            while (picPreview.firstChild) {
                picPreview.removeChild(picPreview.firstChild);
            }
        }

        Object.values(fileList).map((file, i) => {
            let fileURL = URL.createObjectURL(file);
            let tempListTag = document.createElement('li');
            let tempPic = document.createElement('img');

            tempPic.src = fileURL;
            tempPic.dataset.name = file.name;
            tempPic.id = i;
            tempPic.className = 'temp-pic';

            return picPreview.appendChild(tempListTag).appendChild(tempPic);
        });
    };

    handleSubmit = e => {
        e.preventDefault();
        let formData = new FormData(document.querySelector('#product-form'));
        let {uid, created_date, brandData, category, title, id} = this.state;
        let url = `/designers/${brandData.name}/${brandData.id}/${title}/${id}`;
        let inventory =
            category === ('OUTERWEAR' || 'TOPS')
                ? {
                      xxs: this.state.xxs,
                      xs: this.state.xs,
                      s: this.state.s,
                      m: this.state.m,
                      l: this.state.l,
                      xl: this.state.xl,
                      xxl: this.state.xxl,
                  }
                : this.state.category === 'BOTTOMS'
                ? {
                      us_26: this.state.us_26,
                      us_27: this.state.us_27,
                      us_28: this.state.us_28,
                      us_29: this.state.us_29,
                      us_30: this.state.us_30,
                      us_31: this.state.us_31,
                      us_32: this.state.us_32,
                      us_33: this.state.us_33,
                      us_34: this.state.us_34,
                      us_35: this.state.us_35,
                      us_36: this.state.us_36,
                      us_37: this.state.us_37,
                      us_38: this.state.us_38,
                      us_39: this.state.us_39,
                      us_40: this.state.us_40,
                      us_41: this.state.us_41,
                      us_42: this.state.us_42,
                      us_43: this.state.us_43,
                      us_44: this.state.us_44,
                  }
                : {
                      xs: this.state.xs,
                      s: this.state.s,
                      m: this.state.m,
                      l: this.state.l,
                      xl: this.state.xl,
                      os: this.state.os,
                  };

        formData.append('user_id', uid);
        formData.append('created_date', created_date);
        formData.append('sold_out', false);
        formData.append('merge', true);
        formData.append('clothing_label', JSON.stringify(brandData));
        formData.append('inventory', JSON.stringify(inventory));
        formData.append('url', url);
        formData.append('designer', brandData.name);
        formData.append('id', id);
        axios
            .post('/api/clothes/upload', formData)
            .then(res => {
                this.setState({
                    didProductUpload: res.status === 200,
                    showMessageBanner: true,
                });
                document.querySelector('#pic-preview ul').innerHTML = '';
                return document.querySelector('#product-form').reset();
            })
            .catch(err => {
                console.log(err, err.response);
                this.setState({
                    didProductUpload: false,
                    showMessageBanner: true,
                    bannerText:
                        err.response.status === 413
                            ? messageText.negative.imageTooBig
                            : err.response.status === 415 ||
                              err.response.status === 406
                            ? err.response.data
                            : false,
                });
            });
    };

    handleChange = e => {
        let {name, value} = e.target;
        let regEx = /[^a-zA-Z0-9_^ (),"-]/gi;

        if (name === 'title') {
            this.setState({
                title: (value = value.replace(regEx, '')),
            });
        } else if (name === 'category') {
            if (this.state.category) {
                document.querySelector("select[name='sub_category']").value =
                    '';
                this.setState({
                    [name]: value,
                });
            } else {
                this.setState({
                    [name]: value,
                });
            }
        } else {
            this.setState({
                [name]: value,
            });
        }
    };

    renderPage() {
        const {
            redirect,
            currentPage,
            didProductUpload,
            showMessageBanner,
            bannerText,
        } = this.state;

        if (this.state.brandStatus) {
            return (
                <section id="product-upload">
                    {redirect ? <Redirect to={currentPage} /> : null}
                    <h1 className="ui header title">Upload A New Product</h1>
                    {showMessageBanner ? (
                        <Message
                            className={`${
                                didProductUpload ? 'success' : 'negative'
                            } ${
                                !showMessageBanner ? messageHiddenClassName : ''
                            }`}
                            header={
                                didProductUpload
                                    ? messageText.success.header
                                    : messageText.negative.header
                            }
                            content={
                                didProductUpload
                                    ? messageText.success.content
                                    : bannerText
                                    ? bannerText
                                    : messageText.negative.content
                            }
                        />
                    ) : null}
                    <Form
                        id="product-form"
                        onSubmit={this.handleSubmit}
                        encType="multipart/form-data"
                    >
                        <Form.Group widths="equal">
                            <Form.Field required>
                                <label>Title</label>
                                <input
                                    required
                                    name="title"
                                    type="text"
                                    placeholder="Product Name"
                                    onChange={e => this.handleChange(e)}
                                />
                            </Form.Field>
                            <Form.Field required>
                                <label>Listing Price in USD</label>
                                <input
                                    required
                                    name="price"
                                    type="number"
                                    placeholder="USD Price"
                                    min="1"
                                    onChange={e => this.handleChange(e)}
                                />
                            </Form.Field>
                            <Form.Field required>
                                <label>Shipping Cost</label>
                                <input
                                    required
                                    name="shipping_cost"
                                    type="number"
                                    placeholder="USD Price"
                                    min="0"
                                    onChange={e => this.handleChange(e)}
                                />
                            </Form.Field>
                            <Form.Field required>
                                <label>Quantity</label>
                                <input
                                    required
                                    name="inventory_total"
                                    type="number"
                                    placeholder="Quantity available"
                                    onChange={e => this.handleChange(e)}
                                    min="1"
                                />
                            </Form.Field>
                        </Form.Group>
                        <div className={`${formClassName}__Container`}>
                            <div className={`${formClassName}__Description`}>
                                <Form.Field required>
                                    <label>Product Description</label>
                                    <textarea
                                        required
                                        name="description"
                                        rows="5"
                                        placeholder="Product Description"
                                        onChange={e => this.handleChange(e)}
                                    />
                                </Form.Field>
                            </div>
                            <div className={`${formClassName}__Categories`}>
                                <Form.Field required>
                                    <label>Category</label>
                                    <select
                                        required
                                        name="category"
                                        type="text"
                                        onChange={e => this.handleChange(e)}
                                    >
                                        <option defaultValue value="">
                                            Select Category
                                        </option>
                                        <option value="OUTERWEAR">
                                            OUTERWEAR
                                        </option>
                                        <option value="TOPS">TOPS</option>
                                        <option value="BOTTOMS">BOTTOMS</option>
                                        <option value="ACCESSORIES">
                                            ACCESSORIES
                                        </option>
                                    </select>
                                </Form.Field>
                                <Form.Field required>
                                    <label>Sub Category</label>
                                    <ChooseSubCategory
                                        category={this.state.category}
                                        handleChange={e => this.handleChange(e)}
                                    />
                                </Form.Field>
                            </div>
                        </div>
                        <Form.Group widths="equal">
                            <Form.Field required>
                                <label>
                                    Enter Amount Available for each size. If
                                    none enter Zero.
                                </label>
                                <ChooseSize
                                    category={this.state.category}
                                    handleChange={e => this.handleChange(e)}
                                />
                            </Form.Field>
                        </Form.Group>
                        <Form.Group widths="equal">
                            <Form.Field>
                                <label>Upload Main Image for Product</label>
                                <input
                                    required
                                    type="file"
                                    name="main_image"
                                    id="main_image"
                                    accept="image/*"
                                />
                                <label>
                                    Upload additonal images (recommmended)
                                </label>
                                <input
                                    type="file"
                                    name="photos"
                                    id="products_upload"
                                    accept="image/*"
                                    multiple
                                    onChange={e => this.renderPicPreviews(e)}
                                />
                                <div id="pic-preview">
                                    <ul />
                                </div>
                            </Form.Field>
                        </Form.Group>
                        <Button primary>Create Product</Button>
                    </Form>
                </section>
            );
        } else if (!this.state.brandStatus) {
            return (
                <section id="product-upload">
                    <h1 className="ui header title">
                        Sorry Your Brand Hasn't Been Approved Yet
                    </h1>
                </section>
            );
        }
    }

    render() {
        return this.state.brandCreated ? this.renderPage() : null;
    }
}

export default ProductUpload;
