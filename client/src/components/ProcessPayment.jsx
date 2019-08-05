import React, {Component} from 'react';
import {connect} from 'react-redux';
import autoBind from 'react-autobind';
import axios from 'axios';
import {Redirect} from 'react-router-dom';

class ProcessPayment extends Component {
    constructor(props) {
        super(props);
        autoBind(this);

        this.state = {
            redirect: false,
            currentPage: null,
        };
    }

    componentWillReceiveProps(props) {
        if (props.user && props.user.data) {
            this.completePayment(props.user.data);
        }
    }

    completePayment(userData) {
        axios
            .post(`/api/pay/paypal/process${this.props.location.search}`, {
                userId: userData.uid,
            })
            .then(res => {
                if (res.data.status === 404) {
                    if (
                        window.confirm(
                            'Payment failed to process please contact us.'
                        )
                    ) {
                        this.setState({
                            redirect: true,
                            currentPage: '/contact-us',
                        });
                    } else {
                        this.setState({
                            redirect: true,
                            currentPage: '/profile',
                        });
                    }
                }
                this.setState({
                    redirect: true,
                    currentPage: '/profile/transactions',
                });
            });
    }

    render() {
        const {redirect, currentPage} = this.state;
        return (
            <section id="cart">
                {redirect ? <Redirect to={currentPage} /> : null}
                <div className="ui active inverted dimmer">
                    <div className="ui indeterminate text loader">
                        Finalizing Order
                    </div>
                </div>
            </section>
        );
    }
}

function mapStateToProps(state) {
    return {
        user: state.user,
    };
}

export default connect(mapStateToProps)(ProcessPayment);
