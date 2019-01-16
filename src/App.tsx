import React, {Component} from 'react';
import {connect} from 'react-redux';
import {
    BrowserRouter as Router,
    Redirect,
    Switch,
    Route,
} from 'react-router-dom';

// Components

// Pages

import './App.css';

class App extends Component {
    render() {
        return (
            <Router>
                <div className="App">
                    <div className="app-body">
                        <Switch>
                            
                        </Switch>
                    </div>
                </div>
            </Router>
        );
    }
}

export default App;