
const mongoose = require('mongoose');
const UserModel = require("../models/userModel");

//auth with jwt
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

exports.users_get_all = (req, res, next) => { 
    UserModel.find()
    .select('_id comment username email userimage userpassword')
    .populate('commentsArray')   
    .exec()
    .then(result => {
        console.log(result);
        const response = {
            count: result.length,
            users: result.map(result => {
                return {
                    _id: result._id,
                    username: result.username,
                    userpassword: result.userpassword,
                    email: result.email,
                    userimage : result.userimage,
                    commentsArray: result.commentsArray,
                    actions: [
                        {
                            action: "USER_GET_ALL",
                            request: {
                                type: 'GET',
                                url: 'http://localhost:3000/users/'
                            }
                            
                        },
                        {
                            action: "USER_GET_BY_ID",
                            request: {
                                type: 'GET',
                                url: 'http://localhost:3000/users/' + result._id
                            }
                        },
                        {
                            action: "USER_POST",
                            request: {
                                type: 'POST',
                                url: 'http://localhost:3000/users/',
                                formdata: {
                                    username: "",
                                    userpassword: "",
                                    userimage: "",
                                    email: ""
                                }
                            }
                        },
                        {
                            action: "USER_DELETE",
                            request: {
                                type: 'DELETE',
                                url: 'http://localhost:3000/users/' + result._id
                            }
                        },
                        {
                            action: "USER_PATCH",
                            request: {
                                type: 'PATCH',
                                url: 'http://localhost:3000/users/' + result._id,
                                body: [
                                    { "propName" : "username", "value" : "" },
                                    { "propName" : "email", "value" : "" }
                                ]
                            }                            
                        }
                    ]
                }
            })
        };
        res.status(200).json({response});    
    }).catch(err => {
        console.log(err)
        res.status(500).json({error: err});
    });  
}

exports.users_post = (req, res, next) => { 
    const user = new UserModel({
        _id: new mongoose.Types.ObjectId(),
        username: req.body.username,
        userpassword: req.body.userpassword,
        email: req.body.email,
        userimage : req.file.path
    });
    user.save().then(result => {
        console.log(result);
        res.status(201).json({
            message: 'Created user successfully',
            createdUsers: {
                _id: result._id,
                username: result.username,
                email: result.email,
                request: {
                    type: 'GET',
                    url: 'http://localhost:3000/users/' + result._id
                }
            }
        });
    }).catch(err => {
        console.log(err)
        res.status(500).json({error: err});
    });    
}

exports.users_get_single = (req, res, next) => { 
    const id = req.params.userId;
    UserModel.findById(id)
    .select('_id username email userimage userpassword')
    .exec()
    .then(result => {
        console.log(result);        
        if (result) {
            const response = {
                _id: result._id,
                username: result.username,
                userpassword: result.userpassword,
                email: result.email,
                userimage: result.userimage,
                request: {
                    type: 'GET',
                    url: 'http://localhost:3000/users/' + result._id
                }
            };
            res.status(200).json({response});
        } else {
            res.status(404).json({message: "No valid entry"});
        }        
    }).catch(err => {
        console.log(err)
        res.status(500).json({error: err});
    });      
}

exports.users_patch = (req, res, next) => { 
    const id = req.params.userId;
    const updateOps = {};
    for (const ops of req.body) {
        updateOps[ops.propName] = ops.value;
    }
    UserModel.update(
        {_id:id}, 
        { $set: updateOps}
    )
    .exec()
    .then(result => {
        console.log(result);
        res.status(200).json({
            message: 'User updated',
            request: {
                type: 'GET',
                url: 'http://localhost:3000/users/' + id
            }
        })        
    })
    .catch(err => {
        console.log(err);
        res.status(500).json({error: err}); 
    });
}

exports.users_delete = (req, res, next) => { 
    const id = req.params.userId;
    UserModel.remove({_id:id}).exec(        
    ).then(result => {
        console.log(result);
        res.status(200).json({
            message: 'User deleted',
            request: {
                type: 'GET',
                url: 'http://localhost:3000/users/'
            }
        })
    }).catch(err => {
        console.log(err);
        res.status(500).json({error: err});
    });
}

exports.users_login = (req, res, next) => {
    UserModel.find({ email: req.body.email })
    .exec()
    .then(user => {
        if (user.length < 1) {
            return res.status(401).json({
                message: "Auth failed 1"
            });
        } else {
            bcrypt.compare(req.body.userpassword, user[0].userpassword, (err, result) => {
                if (err) {
                    return res.status(401).json({
                        message: "Auth failed 2"
                    });
                }
                if (result) {
                    console.log("TEST",process.env.jwt_key);
                    const token = jwt.sign({
                        email: user[0].email,
                        userId: user[0]._id
                    }, 
                    process.env.jwt_key,
                    {
                        expiresIn: "1h"
                    });
                    return res.status(200).json({
                        message: "Auth successful",
                        token: token
                    });
                }
                return res.status(401).json({
                    message: "Auth failed"
                });
            });
        }
    }).catch(err => {
        console.log(err);
        res.status(500).json({error: err});
    });
}

exports.users_signup = (req, res, next) => { 
    UserModel.find({ email: req.body.email })
    .exec()
    .then(user => {
        if (user.length >= 1) {
            return res.status(409).json({
                message: "Email address exists"
            });
        } else {
            bcrypt.hash(req.body.userpassword, 10, (err, hash) => {
                if (err) {
                    return res.status(500).json({
                        error: err
                    });
                } else {
                    const user = new UserModel({
                        _id: new mongoose.Types.ObjectId(),
                        username: req.body.username,
                        userpassword: hash,
                        email: req.body.email,
                        userimage : req.file.path
                    });   
                    user.save().then(result => {
                        console.log(result);
                        res.status(201).json({
                            message: 'Created user successfully',
                            createdUsers: {
                                _id: result._id,
                                username: result.username,
                                email: result.email,
                                request: {
                                    type: 'GET',
                                    url: 'http://localhost:3000/users/' + result._id
                                }
                            }
                        });
                    }).catch(err => {
                        console.log(err)
                        res.status(500).json({error: err});
                    });
                }
            });
        }
    }).catch(err => {
        console.log(err);
        res.status(500).json({error: err});
    });    
}