import React, {Component} from 'react';
import {Link} from 'react-router-dom';
import Spinner from '../../Spinner';
import RecentUploads from '../../RecentUploads/Component/RecentUploads';

class Home extends Component {
    constructor(props) {
        super(props);
        this.state = {
            dataLoaded: false,
            articleData: false,
            featuredBrand: false,
            brandImage: false,
        };
    }

    componentDidMount() {
        if (!this.props.articleDataLoaded) {
            fetch('/api/articles/featured_article')
                .then(res => {
                    return res.json();
                })
                .then(resData => {
                    let {articleData, brandData} = resData;
                    this.setState({
                        featuredBrand: brandData,
                        articleData: articleData,
                        dataLoaded: !!(articleData || brandData),
                    });
                    this.props.storeArticleData(articleData, brandData);
                })
                .catch(err => console.log(err));
        } else {
            let articleDataInfo = this.props.articleData;
            let featBrandDataInfo = this.props.featBrandData;

            this.setState({
                featuredBrand: featBrandDataInfo,
                articleData: articleDataInfo,
                dataLoaded: true,
            });
        }
    }

    shouldComponentUpdate(prev, next) {
        if (prev.articleDataLoaded && next.dataLoaded) {
            return true;
        } else {
            return true;
        }
    }

    renderPage = () => {
        const {articleData, featuredBrand} = this.state;
        return (
            <div className="home">
                <Link to={`/editorial/${articleData.id}/${articleData.title}`}>
                    <div
                        className="article imgHolder"
                        style={{
                            backgroundImage:
                                'url(' + articleData.screen_image + ')',
                        }}
                    >
                        <div className="overlay" />
                        <h2 className="ui header article-title">
                            {articleData.title}
                        </h2>
                        <h3 className="ui header article-subtitle">
                            {articleData.subtitle}
                        </h3>
                    </div>
                </Link>
                <Link
                    to={`/designers/${featuredBrand.name}/${featuredBrand.id}`}
                >
                    <div
                        className="featured-brand imgHolder"
                        style={{
                            backgroundImage: 'url(' + featuredBrand.image + ')',
                        }}
                    >
                        <div className="overlay" />
                        <h1 className="ui header brand-title">
                            {featuredBrand.name}
                        </h1>
                    </div>
                </Link>
            </div>
        );
    };

    renderBanner = () => {
        return (
            <div className="page-banner">
                <h1 className="ui header">
                    <a href="/account/login">Join our community of brands!</a>
                </h1>
            </div>
        );
    };

    render() {
        return (
            <section id="home">
                <main role="main">
                    {this.state.dataLoaded ? this.renderPage() : <Spinner />}
                    {!this.props.authState ? this.renderBanner() : null}
                    <RecentUploads />
                </main>
            </section>
        );
    }
}

export default Home;
