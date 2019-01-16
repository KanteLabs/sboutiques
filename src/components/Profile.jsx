import React, {Component} from 'react';
import {Link, Redirect} from 'react-router-dom';
import {Form, Button, Message, Menu} from 'semantic-ui-react';
import firebase from '../config/firebase';
var db = firebase.firestore();

class Profile extends Component {
    constructor(props) {
        super(props);
        this.state = {
            uid: false,
            redirect: false,
            currentPage: null,
            currentUser: false,
            brandCreated: null,
            brandStatus: false,
            profileUpdate: false,
            emailVerified: false,
        };
    }

    componentWillMount() {
        firebase.auth().onAuthStateChanged(user => {
            if (user) {
                db.collection('users')
                    .doc(user.uid)
                    .get()
                    .then(res => {
                        this.setState({
                            currentUser: res.data(),
                            uid: user.uid,
                            redirect: false,
                            currentPage: '',
                            emailVerified: user.emailVerified,
                        });
                    })
                    .then(() => {
                        db.collection('brands')
                            .doc(user.uid)
                            .get()
                            .then(res => {
                                if (res.exists && res.data().approved) {
                                    this.setState({
                                        brandStatus: true,
                                        brandCreated: true,
                                    });
                                } else if (
                                    res.exists &&
                                    res.data().approved === false
                                ) {
                                    this.setState({
                                        brandCreated: true,
                                        brandStatus: false,
                                    });
                                }
                            });
                    })
                    .catch(err => console.log(err));
            } else {
                this.setState({
                    redirect: true,
                    currentPage: '/account/login',
                });
            }
        });
    }

    componentWillUpdate(nextProps, nextState) {
        if (nextProps.authState === false && nextState.redirect === true) {
            return true;
        } else {
            return false;
        }
    }

    logout = authChange => {
        console.log('logging out');
        this.props.authStateChange(authChange);
    };

    handleProfileUpdate = () => {
        db.collection('users')
            .doc(this.state.uid)
            .update({
                first_name: this.state.first_name,
                last_name: this.state.last_name,
                display_name: this.state.display_name,
                email: this.state.currentUser.email,
                creation_time: this.state.currentUser.creation_time,
            })
            .then(() => {
                this.setState({profileUpdate: true});
            })
            .catch(function(error) {
                console.error('Error adding document: ', error);
            });
    };

    handleChange = e => {
        e.preventDefault();
        this.setState({
            [e.target.name]: e.target.value,
        });
    };

    renderPage() {
        if (this.state.uid !== false && this.state.brandCreated !== null) {
            return (
                <div className="profile-page">
                    <h1 className="ui header title">
                        {this.state.currentUser
                            ? `Welcome, ${this.state.currentUser.first_name}`
                            : `Welcome`}
                    </h1>
                    <div className="profile-links">
                        <Menu text>
                            <Menu.Item>
                                <Link to="/profile/brand">Brand Page</Link>
                            </Menu.Item>
                            <Menu.Item>
                                <Link to="/profile/transactions">
                                    Transactions
                                </Link>
                            </Menu.Item>
                            <Menu.Item>
                                <Link to="/profile/product-create">
                                    List A Item
                                </Link>
                            </Menu.Item>
                            {!this.state.emailVerified ? (
                                <Menu.Item>
                                    <a
                                        href="#"
                                        onClick={() =>
                                            firebase
                                                .auth()
                                                .currentUser.sendEmailVerification()
                                                .catch(err => console.log(err))
                                        }
                                    >
                                        Resend Email Verification
                                    </a>
                                </Menu.Item>
                            ) : null}
                        </Menu>
                    </div>
                    <div className="page-contianer ui container">
                        <div className="register-form">
                            <h3 className="ui header ">Account Information</h3>
                            <Form
                                onSubmit={this.handleProfileUpdate}
                                warning={!this.state.emailVerified}
                                success={this.state.profileUpdate}
                            >
                                <Message
                                    warning
                                    header="Could you check something!"
                                    list={[
                                        'You have not yet clicked the verification link to verify your account!',
                                        "Check your spam/junk folder for an email from 'noreply@copped-9a558.firebaseapp.com",
                                    ]}
                                />
                                <Message
                                    success
                                    header="Profile Updated"
                                    content="Your Profile information has been updated!"
                                />
                                <Form.Field>
                                    <label>First Name</label>
                                    <input
                                        required="true"
                                        placeholder={
                                            this.state.currentUser.first_name
                                        }
                                        name="first_name"
                                        type="text"
                                        onChange={e => this.handleChange(e)}
                                    />
                                </Form.Field>
                                <Form.Field>
                                    <label>Last Name</label>
                                    <input
                                        required="true"
                                        placeholder={
                                            this.state.currentUser.last_name
                                        }
                                        name="last_name"
                                        type="text"
                                        onChange={e => this.handleChange(e)}
                                    />
                                </Form.Field>
                                <Form.Field>
                                    <label>Dispaly Name</label>
                                    <input
                                        required="true"
                                        placeholder={
                                            this.state.currentUser.display_name
                                        }
                                        name="display_name"
                                        type="text"
                                        onChange={e => this.handleChange(e)}
                                    />
                                </Form.Field>
                                <Button secondary>UPDATE</Button>
                            </Form>
                        </div>
                    </div>
                </div>
            );
        } else if (this.state.uid === false) {
            return (
                <div className="ui active inverted dimmer">
                    <div className="ui indeterminate text loader">
                        Preparing Files
                    </div>
                </div>
            );
        } else {
            return (
                <div className="profile-page">
                    <h1 className="ui header title">
                        {this.state.currentUser
                            ? `Welcome, ${this.state.currentUser.first_name}`
                            : `Welcome`}
                    </h1>
                    <div className="profile-links">
                        <Menu text>
                            <Menu.Item>
                                <Link to="/profile/brand-signup">
                                    Register A Brand
                                </Link>
                            </Menu.Item>
                            {!this.state.emailVerified ? (
                                <Menu.Item>
                                    <a
                                        href="#"
                                        onClick={() =>
                                            firebase
                                                .auth()
                                                .currentUser.sendEmailVerification()
                                                .catch(err => console.log(err))
                                        }
                                    >
                                        Resend Email Verification
                                    </a>
                                </Menu.Item>
                            ) : null}
                        </Menu>
                    </div>
                    <div className="page-contianer ui container">
                        <div className="register-form">
                            <h3 className="ui header ">Account Information</h3>
                            <Form
                                onSubmit={this.handleProfileUpdate}
                                warning={!this.state.emailVerified}
                                success={this.state.profileUpdate}
                            >
                                <Message
                                    warning
                                    header="Could you check something!"
                                    list={[
                                        'You have not yet clicked the verification link to verify your account!',
                                        "Check your spam/junk folder for an email from 'noreply@copped-9a558.firebaseapp.com",
                                    ]}
                                />
                                <Message
                                    success
                                    header="Profile Updated"
                                    content="Your Profile information has been updated!"
                                />
                                <Form.Field>
                                    <label>First Name</label>
                                    <input
                                        required="true"
                                        placeholder={
                                            this.state.currentUser.first_name
                                        }
                                        name="first_name"
                                        type="text"
                                        onChange={e => this.handleChange(e)}
                                    />
                                </Form.Field>
                                <Form.Field>
                                    <label>Last Name</label>
                                    <input
                                        required="true"
                                        placeholder={
                                            this.state.currentUser.last_name
                                        }
                                        name="last_name"
                                        type="text"
                                        onChange={e => this.handleChange(e)}
                                    />
                                </Form.Field>
                                <Form.Field>
                                    <label>Dispaly Name</label>
                                    <input
                                        required="true"
                                        placeholder={
                                            this.state.currentUser.display_name
                                        }
                                        name="display_name"
                                        type="text"
                                        onChange={e => this.handleChange(e)}
                                    />
                                </Form.Field>
                                <Button secondary>UPDATE</Button>
                            </Form>
                        </div>
                    </div>
                </div>
            );
        }
    }
    render() {
        const {redirect, currentPage} = this.state;
        return (
            <section id="profile-page">
                {redirect ? <Redirect to={currentPage} /> : null}
                {this.renderPage()}
            </section>
        );
    }
}

export default Profile;
