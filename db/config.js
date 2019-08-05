const cloudinary = require('cloudinary');
const paypal = require('paypal-rest-sdk');
const isProduction =  process.env.NODE_ENV === 'production';
const redis = require('redis');
const client = redis.createClient();
const Rollbar = require("rollbar");


const rollbar = new Rollbar({
    accessToken: '4c2bf438e7864fc68106f1e065017153',
    captureUncaught: true,
    captureUnhandledRejections: true
});

cloudinary.config({ 
    cloud_name: 'streetwear-boutiques', 
    api_key: '', 
    api_secret: '' 
});

const sendgrid = {
    "key": "",
    "email": "streetwearboutiques@gmail.com",
    "subscribe_list" : "",
    "api_key": "",
    "mailchimpInstance": "us17"

}

const paypalKeys = {
    "sandbox": {
        "client_id": "",
        "client_secret": ""
    },
    "redirect_urls": {
        "return_url": `${isProduction ? 'https://streetwearboutiques.com' : 'http://localhost:3000'}/profile/process`,
        "cancel_url": `${isProduction ? 'https://streetwearboutiques.com' : 'http://localhost:3000'}/profile/`,
    }
}

paypal.configure({
    mode: isProduction ? 'live' : 'sandbox',
    client_id: paypalKeys[isProduction ? "live" : "sandbox"].client_id,
    client_secret: paypalKeys[isProduction ? "live" : "sandbox"].client_secret,
})



client.on('connect', function() {
    console.log('Redis client connected');
});

client.on('error', function (err) {
    console.log('Something went wrong ' + err);
});

module.exports = {
    cloudinary,
    sendgrid,
    paypal,
    isProduction,
    paypalKeys,
    client,
    redis,
    rollbar
}