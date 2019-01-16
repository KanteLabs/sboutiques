import React, {Component} from 'react';
import autoBind from 'react-autobind';
import axios from 'axios';

import {Modal, Header, Image, Form, Button} from 'semantic-ui-react';

import './JoinMailing.css';

const headerText = {
    default: 'Subscribe to our newsletter',
    success: 'You were successfully subscribed!',
    fail: 'You failed to subscribe to our newsletter',
};
const className = 'JoinMailing';
class JoinMailing extends Component {
    constructor(props) {
        super(props);
        autoBind(this);

        this.state = {
            headerText: '',
        };
    }

    componentDidMount() {
        this.setState({
            headerText: headerText.default,
        });
    }

    handleSumbit(e) {
        e.preventDefault();
        axios
            .post('/email/subscribe', {
                firstName: this.state.firstName,
                lastName: this.state.lastName,
                email: this.state.email,
            })
            .then(res => {
                if (res.data.status === 404) {
                    this.setState({
                        headerText: headerText.fail,
                    });
                } else {
                    this.setState({
                        headerText: headerText.success,
                    });
                    setTimeout(() => {
                        this.props.changeMailingState();
                    }, 1500);
                }
            });
    }

    handleChange(e) {
        const {name, value} = e.target;
        this.setState({
            [name]: value,
        });
    }

    render() {
        return (
            <Modal
                trigger={
                    <img
                        className={`${className}__Image`}
                        src="https://res.cloudinary.com/streetwear-boutiques/image/upload/v1530919010/Assets/JoinNewsletter.png.png"
                        alt="Join Newsletter"
                    />
                }
                closeOnDocumentClick={true}
                closeIcon
                size={'mini'}
                onClose={this.props.changeMailingState}
            >
                <Modal.Content image>
                    <Image
                        wrapped
                        size="medium"
                        className={`${className}__Modal__Image`}
                        src="https://res.cloudinary.com/streetwear-boutiques/image/upload/v1530919155/Assets/sw_logo.png"
                    />
                    <Modal.Description>
                        <Header>{this.state.headerText}</Header>
                        <Form onSubmit={this.handleSumbit}>
                            <Form.Field required>
                                <label>First Name</label>
                                <input
                                    required
                                    name="firstName"
                                    type="text"
                                    placeholder="First Name"
                                    autoComplete="given-name"
                                    onChange={this.handleChange}
                                />
                            </Form.Field>
                            <Form.Field required>
                                <label>Last Name</label>
                                <input
                                    required
                                    name="lastName"
                                    type="text"
                                    placeholder="Last Name"
                                    autoComplete="family-name"
                                    onChange={this.handleChange}
                                />
                            </Form.Field>
                            <Form.Field required>
                                <label>Email</label>
                                <input
                                    required
                                    name="email"
                                    type="text"
                                    placeholder="Email"
                                    autoComplete="email"
                                    onChange={this.handleChange}
                                />
                            </Form.Field>
                            <Button primary>Submit</Button>
                        </Form>
                    </Modal.Description>
                </Modal.Content>
            </Modal>
        );
    }
}

export default JoinMailing;
