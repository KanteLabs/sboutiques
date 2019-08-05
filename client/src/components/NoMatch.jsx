import React, {Component} from 'react';
import {Link} from 'react-router-dom';
import {Button} from 'semantic-ui-react';

class NoMatch extends Component {
    render() {
        return (
            <section id="no-match">
                <div className="brand-list">
                    <h1 className="ui header title"> 404 - Page not found</h1>
                    <div className="page-container">
                        <Link to="/designers">
                            <Button secondary>Check Out Some Designers</Button>
                        </Link>
                        <img src="" alt="" />
                    </div>
                </div>
            </section>
        );
    }
}

export default NoMatch;
