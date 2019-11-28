var visitorModel = require('../models/visitorModel.js');
var axios = require('axios')
/**
 * visitorController.js
 *
 * @description :: Server-side logic for managing visitors.
 */ 
module.exports = {

    /**
     * visitorController.list()
     */
    list: function (req, res) {
        visitorModel.find(function (err, visitors) {
            if (err) {
                return res.status(500).json({
                    message: 'Error when getting visitor.',
                    error: err
                });
            }
            res.render('visitors',{
                visitors:visitors
            })
            // return res.json(visitors);
        });
    },

    /**
     * visitorController.show()
     */
    show: function (req, res) {
        var id = req.params.id;
        visitorModel.findOne({_id: id}, function (err, visitor) {
            if (err) {
                return res.status(500).json({
                    message: 'Error when getting visitor.',
                    error: err
                });
            }
            if (!visitor) {
                return res.status(404).json({
                    message: 'No such visitor'
                });
            }
            return res.json(visitor);
        });
    },

    /**
     * visitorController.create()
     */
    create: function (req, res) {
        console.log('/visit')
        console.log(req.body)
        var visitor = new visitorModel({
            name : req.body.name,
            email:req.body.email,
			phone : req.body.phone,
			inTime : new Date() + new Date().getTimezoneOffset(),
			outTime : null,
			type : req.body.type,
			host : req.body.host
        });
        console.log(visitor)
        visitor.save(function (err, visitor) {
            console.log(err,visitor)
            if (err) {
                return res.status(500).json({
                    message: 'Error when creating visitor',
                    error: err
                });
            }
            console.log('visited')
            return res.status(201).json(visitor);
        });
    },

    /**
     * visitorController.update()
     */
    update: function (req, res) {
        var id = req.params.id;
        visitorModel.findOne({_id: id}, function (err, visitor) {
            if (err) {
                return res.status(500).json({
                    message: 'Error when getting visitor',
                    error: err
                });
            }
            if (!visitor) {
                return res.status(404).json({
                    message: 'No such visitor'
                });
            }

            visitor.name = req.body.name ? req.body.name : visitor.name;
			visitor.phone = req.body.phone ? req.body.phone : visitor.phone;
			visitor.inTime = req.body.inTime ? req.body.inTime : visitor.inTime;
			visitor.outTime = req.body.outTime ? req.body.outTime : visitor.outTime;
			visitor.host = req.body.host ? req.body.host : visitor.host;
			visitor.visited = req.body.visited ? req.body.visited : visitor.visited;
			
            visitor.save(function (err, visitor) {
                if (err) {
                    return res.status(500).json({
                        message: 'Error when updating visitor.',
                        error: err
                    });
                }

                return res.json(visitor);
            });
        });
    },

    /**
     * visitorController.remove()
     */
    remove: function (req, res) {
        var name = req.params.name;
        visitorModel.findOneAndRemove(name, function (err, visitor) {
            if (err) {
                return res.status(500).json({
                    message: 'Error when deleting the visitor.',
                    error: err
                });
            }
            var nodemailer = require('nodemailer');

            var transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user:process.env.EMAIL,
                pass:process.env.PASS
            }
            });
            let PDF = require('handlebars-pdf')
            const hbs = require('nodemailer-express-handlebars')
            let document = {
                template: `<!DOCTYPE html>
                <html lang="en">
                <head>
                    <meta charset="UTF-8">
                    <meta name="viewport" content="width=device-width, initial-scale=1.0">
                    <meta http-equiv="X-UA-Compatible" content="ie=edge">
                    <title>Document</title>
                </head>
                <body>
                    <img src="data:image/jpeg;base64,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" style="float:right; padding:20px"></img>
                    <h5 align="center">Jaypee Institute of Information Technology</h5>
                    <address align="center">A 10, A Block, Block A, Industrial Area, Sector 62, Noida, Uttar Pradesh 201309</address>
                    <h6 align="center">Embracing the Transformative Times:</h6>
                    <address align="center">An International Conference ob Digitalization of Management and Social Sciences(ETTIC-2020)</address>
                    <label for="name"><b>Name:- </b></label>{{name}}<br>
                    <label for="name"><b>Phone numbere:- </b></label>{{phone}}<br>
                    <label for="name"><b>Check-in-time:- </b></label>{{inTime}}<br>
                    <label for="name"><b>Check-out-time:- </b></label>{{outTime}}<br>
                </body>
                </html>`,
                context: {
                    name: visitor.name,
                    phone: visitor.phone,
                    inTime: visitor.inTime,
                    outTime: new Date() + new Date().getTimezoneOffset(),
                    host:visitor.host
                },
                path: '.'+file
            }
            var fileLocation = __dirname+file;
     PDF.create(document)
        .then(function(resp){
          // setTimeout(function(){
          const nodemailer = require('nodemailer')

          const hbs = require('nodemailer-express-handlebars')
  
          //Sendgrid
          //mailGun
  
          //step 1 transporter
          let transporter = nodemailer.createTransport({
              service:'gmail',
              auth:{
                  user:process.env.EMAIL,
                  pass:process.env.PASS
              }
          });
  
          transporter.use('compile',hbs({
              viewEngine: {
                  extName:'express-handlebars',
                  partialsDir: 'views',
                  layoutsDir: 'views',
                  defaultLayout: 'mail',
          },
              viewPath:'./views/'
          }));
        //step 2
        let mailOptions = {
            from:process.env.EMAIL,
            to:payment.email,
            subject:'test mail',
            attachments:[
                {filename:'text-'+rand+'pdf',path:fileLocation}
            ],
            text:'hello',
            template:'mail'
        };
  
        //step 3
        transporter.sendMail(mailOptions,function(err,data){
            if(err) console.log(err);
            else console.log('email sent');
        });
      })
          .catch(error => {
              console.error(error)
          })
  
            // axios.post('/history',{visitors})
            res.redirect('/visit')
        });
    }
};
