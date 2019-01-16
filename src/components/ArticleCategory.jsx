import React, {Component} from 'react';
import {Link, Redirect} from 'react-router-dom';
import firebase from '../config/firebase';

// Initialize Cloud Firestore through firebase
var db = firebase.firestore();

class ArticleCategory extends Component {
    constructor(props) {
        super(props);
        this.state = {
            articleData: false,
        };
    }

    componentWillMount() {
        let category = this.props.match.params.category;
        let articleFeed = db.collection('articles');
        let tempArticleData = {};

        articleFeed
            .where('category', '==', category)
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
            .catch(err => console.log(err));
    }

    rendePage() {
        if (this.state.articleData !== false) {
            const {articleData} = this.state;
            return (
                <div className="article-list">
                    <h1 className="ui header">
                        Articles under {this.props.match.params.category}
                    </h1>
                    <div className="page-container article-list">
                        <div className="ui divided items container">
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
                                                    src={
                                                        article[
                                                            Object.keys(
                                                                article
                                                            )[5]
                                                        ]
                                                    }
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

export default ArticleCategory;
