import firebase from '../config/firebase';
export default class User {
    static get() {
        return new Promise((resolve, reject) => {
            firebase.auth().onAuthStateChanged(user => {
                if (user) {
                    const userData = user.toJSON();
                    fetch(`/api/user/${userData.uid}`)
                        .then(res => {
                            return res.json().then(response => {
                                return resolve({
                                    uid: userData.uid,
                                    email: userData.email,
                                    emailVerified: userData.emailVerified,
                                    bio: response,
                                });
                            });
                        })
                        .catch(err => {
                            console.log(err);
                        });
                } else {
                    reject('User is not logged in');
                }
            });
        });
    }
}
