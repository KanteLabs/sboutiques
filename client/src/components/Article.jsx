import React, {Component} from 'react';
import {Link, Redirect} from 'react-router-dom';
import firebase from '../config/firebase';

// Initialize Cloud Firestore through firebase
var db = firebase.firestore();

class Article extends Component {
    constructor(props) {
        super(props);
        this.state = {
            articleData: false,
            featuredArticle: false,
        };
    }

    componentWillMount() {
        let articleFeed = db.collection('articles').orderBy('created');
        let tempArticleData = {};
        let featuredArticleData = {};

        articleFeed
            .limit(15)
            .get()
            .then(res => {
                res.forEach(article => {
                    return (tempArticleData[
                        article.data().title
                    ] = article.data());
                });
                this.setState({articleData: tempArticleData});
            })
            .then(() => {
                db
                    .collection('articles')
                    .doc('article_0')
                    .get()
                    .then(res => {
                        featuredArticleData = res.data();
                        this.setState({featuredArticle: featuredArticleData});
                    });
            })
            .catch(err => console.log(err));
    }

    rendePage() {
        if (
            this.state.articleData !== false &&
            this.state.featuredArticle !== false
        ) {
            const {articleData, featuredArticle} = this.state;
            return (
                <div className="article-list">
                    <div className="page-container article-list">
                        <div className="featured-article ui container">
                            <Link
                                to={`/editorial/${featuredArticle.id}/${
                                    featuredArticle.title
                                }`}
                            >
                                <img
                                    src={featuredArticle.screen_image}
                                    alt={featuredArticle.title}
                                    title={featuredArticle.title}
                                />
                                <h2 className="ui header article-title">
                                    {featuredArticle.title}
                                </h2>
                                <h3 className="ui header article-subtitle">
                                    {featuredArticle.subtitle}
                                </h3>
                            </Link>
                        </div>

                        <div className="ui divided items container">
                            <div className="ui text menu">
                                <div className="header item"> Category: </div>
                                <a
                                    href="/editorial/archive/Art"
                                    className="item"
                                >
                                    Art
                                </a>
                                <a
                                    href="/editorial/archive/Culture"
                                    className="item"
                                >
                                    Culture
                                </a>
                                <a
                                    href="/editorial/archive/Fashion"
                                    className="item"
                                >
                                    Fashion
                                </a>
                                <a
                                    href="/editorial/archive/Interviews"
                                    className="item"
                                >
                                    Interviews
                                </a>
                                <a
                                    href="/editorial/archive/Life"
                                    className="item"
                                >
                                    Life
                                </a>
                            </div>
                            {Object.values(articleData).map((article, i) => {
                                return (
                                    <div className="item article" key={i}>
                                        <div className="image">
                                            <Link
                                                to={`/editorial/${article.id}/${
                                                    article.title
                                                }`}
                                            >
                                                <img
                                                    src={article.screen_image}
                                                    alt=""
                                                />
                                            </Link>
                                        </div>
                                        <div className="content">
                                            <a
                                                className="header"
                                                href={`/editorial/${
                                                    article.id
                                                }/${article.title}`}
                                            >
                                                {article.title}
                                            </a>
                                            <div className="meta">
                                                <span>{article.subtitle}</span>
                                            </div>
                                            <div
                                                className="description"
                                                dangerouslySetInnerHTML={{
                                                    __html: article.text.split(
                                                        '</p>'
                                                    )[0],
                                                }}
                                            />
                                            <div className="extra">
                                                By: {article.author} |{' '}
                                                {article.created} |{' '}
                                                <a
                                                    href={`/editorial/archive/${
                                                        article.category
                                                    }`}
                                                >
                                                    {article.category}
                                                </a>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
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
            <section className="article-feed">
                {redirect ? <Redirect to={currentPage} /> : null}
                {this.rendePage()}
            </section>
        );
    }
}

export default Article;
