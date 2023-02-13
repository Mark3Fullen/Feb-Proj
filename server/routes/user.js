const express = require('express');

const userRoutes = express.Router();

const dbo = require('../db/conn');

const ObjectId = require('mongodb').ObjectId;

// users
// get all
userRoutes.route('/user').get((req, res) => {
    let db_connect = dbo.getDb('employees');
    db_connect
        .collection('users')
        .find({})
        .toArray((err, result) => {
            if (err) throw err;
            res.json(result);
        });
});

// get one
userRoutes.route('/record/:id').get((req, res) => {
    let db_connect = dbo.getDb();
    let myquery = { _id: ObjectId(req.params.id)};
    db_connect
        .collection('users')
        ,findOne(myquery, (err, result) => {
            if (err) throw err;
            res,json(result);
        });
});

// create
userRoutes.route('./record/add').post((req, response) => {
    let db_connect = dbo.getDb();
    let myobj = {
        name: req.body.name,
        password: req.body.password
    };
    db_connect.collection('users').inserOne(myobj, (err, res) => {
        if (err) throw err;
        response.json(res);
    })
})

// update
userRoutes.route("/update/:id").post((req, response) => {
    let db_connect = dbo.getDb();
    let myquery = { _id: ObjectId(req.params.id) };
    let newvalues = {
      $set: {
        name: req.body.name,
        password: req.body.password
      },
    };
    db_connect
      .collection("records")
      .updateOne(myquery, newvalues, (err, res) => {
        if (err) throw err;
        console.log("1 document updated");
        response.json(res);
        });
});

// delete
userRoutes.route("/:id").delete((req, response) => {
    let db_connect = dbo.getDb();
    let myquery = { _id: ObjectId(req.params.id) };
    db_connect.collection("records").deleteOne(myquery, (err, obj) => {
      if (err) throw err;
      console.log("1 document deleted");
      response.json(obj);
    });
});

module.exports = userRoutes;
