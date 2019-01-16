import React, {Component} from 'react';
import {connect} from 'react-redux';
import {
    BrowserRouter as Router,
    Redirect,
    Switch,
    Route,
} from 'react-router-dom';

// Components
import HomePageOne from './components/Home/HomePageOne/Component/HomePageOne';

// Pages

import './App.css';

const className = 'App';
class App extends Component {
    render() {
        return (
            <Router>
                <div className={className}>
                    <div className={`${className}__Body`}>
                        <Switch>
                            <HomePageOne />
                        </Switch>
                    </div>
                </div>
            </Router>
        );
    }
}

export default App;