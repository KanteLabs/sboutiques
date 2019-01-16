import React, {Component} from 'react';
import firebase from '../config/firebase';
// import ui, {uiConfig} from '../config/firebaseui';
import {Redirect} from 'react-router-dom';

// Initialize Cloud Firestore through firebase
var db = firebase.firestore();

class Login extends Component {
    constructor(props) {
        super(props);
        this.state = {
            redirect: false,
            currentPage: null,
            userInfo: undefined,
        };
    }
    componentDidMount() {
        firebase.auth().onAuthStateChanged(user => {
            if (user) {
                console.log(`${user.email} is logged in`);
                this.setState({
                    userInfo: user.toJSON(),
                    authState: true,
                    redirect: true,
                    currentPage: '/profile',
                });
            } else {
                console.log('User is not logged in');
                this.setState({
                    userInfo: undefined,
                    authState: false,
                    redirect: false,
                    currentPage: null,
                });
            }
        });
    }

    handleChange = e => {
        e.preventDefault();
        this.setState({
            [e.target.name]: e.target.value,
        });
    };

    handleLoginSubmit = e => {
        e.preventDefault();
        console.log('Login Submit');
        firebase
            .auth()
            .signInWithEmailAndPassword(this.state.email, this.state.password)
            .then(res => {
                firebase.auth().onAuthStateChanged(user => {
                    if (user) {
                        this.props.handleAuthState(true);
                        this.setState({userInfo: user.toJSON()});
                    } else {
                        console.log('User is not logged in');
                        this.props.authState(false);
                    }
                });
            })
            .catch(err => {
                // Handle Errors here.
                var errorCode = err.code;
                var errorMessage = err.message;
                console.log(errorCode, errorMessage);
                var loginError = document.getElementById('login-error');
                loginError.innerHTML = `<div class="ui message"> <div class="header">We had some issues</div><ul class="list"><li>${errorMessage}</li></ul></div>`;
            });
    };

    handleRegisterSubmit = e => {
        e.preventDefault();
        console.log('Register Submit');
        if (this.state.password === this.state.password_confirm) {
            firebase
                .auth()
                .createUserWithEmailAndPassword(
                    this.state.email,
                    this.state.password
                )
                .then(res => {
                    let user = firebase.auth().currentUser;
                    user.sendEmailVerification();
                })
                .then(() => {
                    db.collection('users')
                        .doc(firebase.auth().currentUser.uid)
                        .set(
                            {
                                first_name: this.state.first_name,
                                last_name: this.state.last_name,
                                display_name: this.state.display_name,
                                email: this.state.email,
                                creation_time: new Date(),
                            },
                            {merge: true}
                        )
                        .then(function(docRef) {
                            console.log(
                                'Document written with ID: ',
                                docRef.id
                            );
                        })
                        .catch(function(error) {
                            console.error('Error adding document: ', error);
                        });
                    this.setState({
                        redirect: true,
                        currentPage: '/',
                    });
                })
                .catch(err => {
                    // Handle Errors here.
                    var errorCode = err.code;
                    var errorMessage = err.message;
                    console.log(errorCode, errorMessage);
                    var formError = document.getElementById('form-error');
                    formError.innerHTML = `<div class="ui message"> <div class="header">We had some issues</div><ul class="list"><li>${errorMessage}</li></ul></div>`;
                });
        } else {
            var formError = document.getElementById('form-error');
            formError.innerHTML =
                '<div class="ui message"> <div class="header">We had some issues</div><ul class="list"><li>Passwords must match</li></ul></div>';
        }
    };

    render() {
        const {redirect, currentPage} = this.state;
        return (
            <section className="login-page">
                <div className="page-container ui container">
                    {redirect ? <Redirect to={currentPage} /> : null}
                    <div className="ui divided items container">
                        <div className="login-form">
                            <h1 className="ui header">Login</h1>
                            <form
                                onSubmit={this.handleLoginSubmit}
                                className="ui equal width form"
                            >
                                <div id="login-error" />
                                <div className="two fields">
                                    <div className="field">
                                        <div className="ui labeled input">
                                            <div className="ui label">
                                                Email
                                            </div>
                                            <input
                                                required="true"
                                                name="email"
                                                type="text"
                                                placeholder="Email"
                                                onChange={e =>
                                                    this.handleChange(e)
                                                }
                                            />
                                        </div>
                                    </div>

                                    <div className="field">
                                        <div className="ui labeled input">
                                            <div className="ui label">
                                                Password
                                            </div>
                                            <input
                                                required="true"
                                                name="password"
                                                type="password"
                                                placeholder="Password"
                                                onChange={e =>
                                                    this.handleChange(e)
                                                }
                                            />
                                        </div>
                                    </div>
                                </div>
                                <button
                                    className="ui primary button"
                                    type="submit"
                                >
                                    Login
                                </button>
                            </form>
                        </div>

                        <div className="register-form">
                            <h1 className="ui header ">Create An Account</h1>
                            <form
                                onSubmit={this.handleRegisterSubmit}
                                className="ui form"
                            >
                                <div id="form-error" />
                                <div className="two fields">
                                    <div className="field">
                                        <div className="ui labeled input">
                                            <div className="ui label">
                                                First Name
                                            </div>
                                            <input
                                                required="true"
                                                name="first_name"
                                                type="text"
                                                placeholder="First Name"
                                                onChange={e =>
                                                    this.handleChange(e)
                                                }
                                            />
                                        </div>
                                    </div>
                                    <div className="field">
                                        <div className="ui labeled input">
                                            <div className="ui label">
                                                Last Name
                                            </div>
                                            <input
                                                required="true"
                                                name="last_name"
                                                type="text"
                                                placeholder="Last Name"
                                                onChange={e =>
                                                    this.handleChange(e)
                                                }
                                            />
                                        </div>
                                    </div>
                                </div>

                                <div className="two fields">
                                    <div className="field">
                                        <div className="ui labeled input">
                                            <div className="ui label">
                                                Display Name
                                            </div>
                                            <input
                                                required="true"
                                                name="display_name"
                                                type="text"
                                                placeholder="Username"
                                                onChange={e =>
                                                    this.handleChange(e)
                                                }
                                            />
                                        </div>
                                    </div>
                                    <div className="field">
                                        <div className="ui labeled input">
                                            <div className="ui label">
                                                Email
                                            </div>
                                            <input
                                                required="true"
                                                name="email"
                                                type="text"
                                                placeholder="Email"
                                                onChange={e =>
                                                    this.handleChange(e)
                                                }
                                            />
                                        </div>
                                    </div>
                                </div>

                                <div className="two fields">
                                    <div className="field">
                                        <div className="ui labeled input">
                                            <div className="ui label">
                                                Password
                                            </div>
                                            <input
                                                required="true"
                                                name="password"
                                                type="password"
                                                placeholder="Password"
                                                onChange={e =>
                                                    this.handleChange(e)
                                                }
                                            />
                                        </div>
                                    </div>
                                    <div className="field">
                                        <div className="ui labeled input">
                                            <div className="ui label">
                                                Confirm Password
                                            </div>
                                            <input
                                                required="true"
                                                name="password_confirm"
                                                type="password"
                                                placeholder="Confirm Password"
                                                onChange={e =>
                                                    this.handleChange(e)
                                                }
                                            />
                                        </div>
                                    </div>
                                </div>
                                <button
                                    className="ui primary button"
                                    type="submit"
                                >
                                    Create
                                </button>
                            </form>
                        </div>
                    </div>
                </div>
            </section>
        );
    }
}

export default Login;
