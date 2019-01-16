import React, {Component} from 'react';
import {Redirect} from 'react-router-dom';

class OrderHistoryPage extends Component {
    constructor(props) {
        super(props);
        this.state = {
            uid: false,
            redirect: false,
            currentPage: null,
            currentUser: false,
            transactionsLoaded: false,
            allTransactions: false,
            orderInfromation: false,
        };
    }

    // componentDidMount() {
    //     firebase.auth().onAuthStateChanged(user => {
    //         if (user) {
    //             db
    //                 .collection('payments')
    //                 .doc(user.uid)
    //                 .get()
    //                 .then(res => {
    //                     console.log(res.data());
    //                     allTransactions = res.data();
    //                     this.setState({
    //                         allTransactions: allTransactions,
    //                         currentUser: user,
    //                     });
    //                 })
    //                 .then(() => {
    //                     this.sortTransactions();
    //                 })
    //                 .then(() => {
    //                     db
    //                         .collection('users')
    //                         .doc(user.uid)
    //                         .collection('transactions')
    //                         .get()
    //                         .then(res => {
    //                             res.forEach(order => {
    //                                 if (order.exists) {
    //                                     return (orderInfromation[
    //                                         order.data().id
    //                                     ] = order.data());
    //                                 }
    //                             });
    //                             this.setState({
    //                                 orderInfromation: orderInfromation,
    //                                 transactionsLoaded: true,
    //                             });
    //                         });
    //                 })
    //                 .catch(err => console.log(err));
    //         } else {
    //             this.setState({
    //                 redirect: true,
    //                 currentPage: '/account/login',
    //             });
    //         }
    //     });
    // }

    // /* Grabs the date of each transaction, to be sorted into an array. From there a new object refrence is created with
    // the transactions sorted by most recent
    // */
    // sortTransactions = () => {
    //     let transactions = this.state.allTransactions;
    //     let dateHolder = [];
    //     let sortedArray = [];

    //     Object.values(transactions).map((transaction, i) => {
    //         return dateHolder.push([new Date(transaction.date), i]);
    //     });
    //     this.sortDateArray(dateHolder, sortedArray);
    // };

    // sortDateArray = (dateHolder, sortedArray) => {
    //     let newTransactionObject = {};
    //     sortedArray = dateHolder.sort(function(min, max) {
    //         return max[0] - min[0];
    //     });
    //     sortedArray.map((item, x) => {
    //         return (newTransactionObject[`Transaction ${x}`] = [
    //             Object.values(this.state.allTransactions)[item[1]],
    //             [
    //                 Object.values(this.state.allTransactions)[item[1]].product
    //                     .sku,
    //             ],
    //         ]);
    //     });
    //     this.setState({
    //         newTransactionObject: newTransactionObject,
    //     });
    // };

    render() {
        const {redirect, currentPage} = this.state;
        return (
            <section id="transaction-page">
                {redirect ? <Redirect to={currentPage} /> : null}
                <h1 className="ui header">Order History</h1>
                {/* {this.state.transactionsLoaded ? (
                    <Transaction
                        transactionData={this.state.newTransactionObject}
                        orderData={this.state.orderInfromation}
                    />
                ) : (
                    <Spinner />
                )} */}
            </section>
        );
    }
}

export default OrderHistoryPage;
