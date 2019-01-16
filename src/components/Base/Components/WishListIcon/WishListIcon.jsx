import React, {Component} from 'react';
import PropTypes from 'prop-types';
import autoBind from 'react-autobind';

import {connect} from 'react-redux';
import {ADD_TO_WISHLIST, REMOVE_FROM_WISHLIST} from './Actions/WishlistAction';

import './WishListIcon.css';

const className = 'WishListIcon like icon';
class WishListIcon extends Component {
    constructor(props) {
        super(props);
        autoBind(this);

        this.state = {
            isLiked: localStorage.getItem(this.props.id),
        };
    }

    componentDidMount() {
        this.setState({
            liked: localStorage.getItem(this.props.id),
        });
    }

    handleAddToWishList() {
        if (!this.props.user.data) {
            return alert('You must be signed in first to do that!');
        } else if (localStorage.getItem(this.props.id)) {
            localStorage.removeItem(this.props.id);
            this.setState({
                isLiked: false,
            });

            return this.props.REMOVE_FROM_WISHLIST({
                product: this.props.product,
                uid: this.props.user.data.uid,
            });
        }

        this.props.ADD_TO_WISHLIST({
            product: this.props.product,
            uid: this.props.user.data.uid,
        });

        localStorage.setItem(this.props.id, 'true');
        this.setState({
            isLiked: true,
        });
    }
    render() {
        return (
            <i
                className={`${className} ${this.state.isLiked ? 'liked' : ''}`}
                title="Add to wishlist"
                data-id={this.props.id}
                data-title={this.props.title}
                onClick={this.handleAddToWishList}
            />
        );
    }
}

const mapDispatchToProps = {
    ADD_TO_WISHLIST,
    REMOVE_FROM_WISHLIST,
};

function mapStateToProps(state) {
    return {
        user: state.user,
    };
}

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(WishListIcon);

WishListIcon.propTypes = {
    id: PropTypes.number.isRequired,
    title: PropTypes.string.isRequired,
    product: PropTypes.object.isRequired,
};
