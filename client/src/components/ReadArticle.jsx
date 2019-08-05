import React, {Component} from 'react';
import {Redirect} from 'react-router-dom';
import {fb_key} from '../config/api-keys';
import firebase from '../config/firebase';

// Initialize Cloud Firestore through firebase
var db = firebase.firestore();

class ReadArticle extends Component {
    constructor(props) {
        super(props);
        this.state = {
            articleData: false,
            articleDataLoaded: false,
        };
    }

    componentWillMount() {
        console.log(this.props);
        let articleId = Number(this.props.match.params.id);
        let articleRef = db.collection('articles').doc(`article_${articleId}`);
        let articleInfo = {};

        articleRef
            .get()
            .then(res => {
                if (res.exists) {
                    this.setState({
                        redirect: false,
                        currentPage: '',
                    });
                    return (articleInfo = res.data());
                } else {
                    this.setState({
                        redirect: true,
                        currentPage: '/editorial',
                    });
                }
            })
            .then(() => {
                this.setState({
                    articleData: articleInfo,
                    articleDataLoaded: true,
                });
            })
            .catch(err => console.log(err));
    }

    shouldComponentUpdate(prevProps, prevState) {
        if (
            prevState.articleData !== false &&
            prevState.articleDataLoaded === true
        ) {
            return true;
        } else {
            return false;
        }
    }

    componentWillUpdate(prev, next) {
        if (next.articleDataLoaded === true) {
            console.log('updated');
            return true;
        } else {
            console.log('did not update');
            return false;
        }
    }

    renderArticle() {
        if (this.state.articleData.hasOwnProperty('id')) {
            const {articleData} = this.state;
            return (
                <div className="page-container single-article ui container">
                    <img
                        src={articleData.screen_image}
                        alt={articleData.title}
                        title={articleData.title}
                        className="article-image"
                    />
                    <h1 className="ui header title">{articleData.title}</h1>
                    <h3 className="ui header title">{articleData.subtitle}</h3>

                    <div className="article-info">
                        <p className="author">
                            Written by: {articleData.author}
                        </p>
                        <p className="photographer">
                            Photos by: {articleData.photographer}
                        </p>
                        <p className="data">Date: {articleData.created}</p>
                        <div className="share">
                            <a
                                title="facebook"
                                target="_blank"
                                href={`https://www.facebook.com/dialog/share?app_id=${fb_key}&display=popup&href=https://streetwearboutiques.com/editorial/${
                                    this.props.match.params.id
                                }/${
                                    this.props.match.params.article
                                }&redirect_uri=https://streetwearboutiques.com/editorial/${
                                    this.props.match.params.id
                                }/${this.props.match.params.article}`}
                            >
                                <i
                                    title="facebook"
                                    className="facebook square icon"
                                />
                            </a>
                            <a
                                title="twitter"
                                target="_blank"
                                href={`https://twitter.com/home/?status=${
                                    this.props.match.params.article
                                } - https://streetwearboutiques.com/editorial/${
                                    this.props.match.params.id
                                }/${
                                    this.props.match.params.article
                                }  @streetwearboutiques`}
                            >
                                <i title="twitter" className="twitter icon" />
                            </a>
                            <a
                                title="email"
                                target="_blank"
                                href={`mailto:?Subject=Check out this Article: ${
                                    this.props.match.params.article
                                }&body=https://streetwearboutiques.com/editorial/${
                                    this.props.match.params.id
                                }/${this.props.match.params.article}`}
                            >
                                <i title="email" className="mail icon" />
                            </a>
                        </div>
                    </div>

                    <div
                        className="article-text"
                        dangerouslySetInnerHTML={{__html: articleData.text}}
                    />
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

    rendePage() {
        if (
            this.state.articleDataLoaded &&
            this.state.articleData.hasOwnProperty('id')
        ) {
            return this.renderArticle();
        } else if (
            this.state.articleDataLoaded &&
            !this.state.articleData.hasOwnProperty('id')
        ) {
            return (
                <div className="page-container">
                    <h1 className="ui header title">
                        Sorry this article wasn't found!
                    </h1>
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
            <section id="single-article">
                {redirect ? <Redirect to={currentPage} /> : null}
                {this.rendePage()}
            </section>
        );
    }
}

export default ReadArticle;
