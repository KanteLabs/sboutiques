const db = require('../../db/firebase');
const sgMail = require('@sendgrid/mail');
const axios = require('axios')

const { sendgrid } = require('../../db/config');
const Forms = {};

Forms.subscribe = (body) => {
    return new Promise((resolve, reject) => {
        const url = `https://${sendgrid.mailchimpInstance}.api.mailchimp.com/3.0/lists/${sendgrid.subscribe_list}/members/`
        const data = {
            "email_address": body.email,
            "status": "pending",
            "merge_fields": {
                "FNAME": body.firstName,
                "LNAME": body.lastName,
            }
        }
        const headers = {
            "Authorization":  'Basic ' + new Buffer('any:' + sendgrid.api_key ).toString('base64'),
            "Content-Type": "application/json;charset=utf-8"
        }

        axios.post(url, data, {headers})
        .then((res) => {
            resolve(res.status)
        })
        .catch((err) => {
            reject(err.response.data)
        })
    });
}

Forms.contact = (body) => {
    return new Promise((resolve, reject) => {
        sgMail.setApiKey(sendgrid.key);
    
        const msg = {
          to: sendgrid.email,
          from: body.email,
          subject: `Request: ${body.request} - ${body.subject}`,
          text: `New message from a user on Streetwear Boutiques`,
          html: `username: ${body.display_name} \n uid: ${body.uid}<br/>From ${body.first_name} ${body.last_name}<br/> ${body.message}`,
        };
    
        sgMail.send(msg, false, function (error, message) {
          if (error) {
             (reject(error));
          } else {
              console.log(message)
              return resolve(message["0"].statusCode)
          }
        })
    });
}

Forms.newBrand = (body) => {
    return new Promise((resolve, reject) => {
        sgMail.setApiKey(sendgrid.key);
    
        const msg = {
            to: sendgrid.email,
            from: body.email,
            subject: `New Brand Registration: ${body.name}`,
            text: `A new brand has submitted a registration from.`,
            html: `paypal: ${body.paypal_email} \n uid: ${body.uid}<br/>Brand description: ${body.description}`,
          };
    
        sgMail.send(msg, false, function (error, message) {
          if (error) {
             (reject(error));
          } else {
              return resolve(message["0"].statusCode)
          }
        })
    });
}

Forms.newPayment = (body) => {
    return new Promise((resolve, reject) => {
        sgMail.setApiKey(sendgrid.key);
        const buyerEmail = body.payment.payer.payer_info.email;
        const msg = {
            to: sendgrid.email,
            from: sendgrid.email,
            subject: `New Payment on Streetwear Boutiques`,
            text: `A brand has just received a purchase!`,
            html: `email: ${buyerEmail} <br/> paypal info: ${body.payment.transactions[0].custom}`
          };
    
        sgMail.send(msg, false, function (error, message) {
          if (error) {
             (reject(error));
          } else {
              return resolve(message["0"].statusCode)
          }
        })
    });
}

module.exports = Forms;