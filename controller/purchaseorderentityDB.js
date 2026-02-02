var express = require('express');
var app = express();
let middleware = require('./middleware');

var po = require('../model/purchaseorderModel.js');

app.get('/api/getPurchaseOrders', middleware.checkToken, function (req, res) {
    po.getPurchaseOrders()
        .then((result) => {
            res.send(result);
        })
        .catch((err) => {
            console.log(err);
            res.status(500).send("Failed to get purchase order list");
        });
});

app.get('/api/getPurchaseOrderById/:id', middleware.checkToken, function (req, res) {
    var id = req.params.id;
    po.getPurchaseOrderById(id)
        .then((result) => {
            res.send(result);
        })
        .catch((err) => {
            console.log(err);
            res.status(500).send("Failed to get purchase order by id");
        });
});

app.get('/api/getPurchaseOrderLineItem/:id', middleware.checkToken, function (req, res) {
    var id = req.params.id;
    po.getPurchaseOrderLineItem(id)
        .then((result) => {
            res.send(result);
        })
        .catch((err) => {
            console.log(err);
            res.status(500).send("Failed to get purchase order line item");
        });
});

var bodyParser = require('body-parser');
var jsonParser = bodyParser.json({ extended: false });
app.post('/api/addPurchaseOrder', [middleware.checkToken, jsonParser], function (req, res) {
    po.addPurchaseOrder(req.body)
        .then((result) => {
            res.send(result);
        })
        .catch((err) => {
            console.log(err);
            res.status(500).send("Failed to add purchase order");
        });
});

app.post('/api/addPurchaseOrderLineItem', [middleware.checkToken, jsonParser], function (req, res) {
    po.addPurchaseOrderLineItem(req.body)
        .then((result) => {
            res.send(result);
        })
        .catch((err) => {
            console.log(err);
            res.status(500).send("Failed to add purchase order line item");
        });
});

app.post('/api/removePOLineItem', [middleware.checkToken, jsonParser], function (req, res) {
    po.removePOLineItem(req.body)
        .then((result) => {
            if(result){
                po.removePOLineItem2(req.body)
                    .then((result) => {
                        res.send(result);
                    })
                    .catch((err) => {
                        console.log(err);
                        res.status(500).send("Failed to remove purchase order line item");
                    });
            }
            else {
                res.status(500).send("Failed to remove purchase order line item");
            }
        })
        .catch((err) => {
            console.log(err);
            res.status(500).send("Failed to remove purchase order line item");
        });
});

app.put('/api/updatePurchaseOrderStatus', [middleware.checkToken, jsonParser], function (req, res) {
    var id = req.body.id;
    var status = req.body.status;
    po.updatePurchaseOrderStatus(id,status)
        .then((result) => {
            res.send(result);
        })
        .catch((err) => {
            console.log(err);
            res.status(500).send("Failed to update purchase order status");
        });
});

app.put('/api/updatePurchaseOrder', [middleware.checkToken, jsonParser], function (req, res) {
    var id = req.body.id;
    var supplier = req.body.supplier;
    var warehouse = req.body.warehouse;
    var expectedDate = req.body.expectedDate;
    po.updatePurchaseOrder(id,supplier,warehouse,expectedDate)
        .then((result) => {
            res.send(result);
        })
        .catch((err) => {
            console.log(err);
            res.status(500).send("Failed to update purchase order");
        });
});

exports.getByMember = function(req, res) {
    var memberId = req.params.memberId;

    salesRecordModel.getByMemberId(memberId, function(err, orders) {
        if (err) return res.status(500).json(err);

        let done = 0;
        if (orders.length === 0) return res.json([]);

        orders.forEach(order => {
            salesRecordLineItemModel.getBySalesRecordId(order.id, function(err, items) {
                order.items = items;
                done++;
                if (done === orders.length) {
                    res.json(orders);
                }
            });
        });
    });
};


module.exports = app;