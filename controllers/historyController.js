var historyModel = require('../models/historyModel.js');
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
        historyModel.find(function (err, visitors) {
            if (err) {
                return res.status(500).json({
                    message: 'Error when getting visitor.',
                    error: err
                });
            }
            res.render('history',{
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
        hsitoryModel.findOne({_id: id}, function (err, visitor) {
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
        var visitor = new historyModel({
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
    }
};
