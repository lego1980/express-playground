const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const User = require("../models/userModel");
const Email = require("../models/emailModel");

router.get('/', (req, res, next) => { 
    User.find()
    .select('_id comment username email')
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
                    email: result.email,
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
                                body: {
                                    username: "",
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
});

router.post('/', (req, res) => { 
    const user = new User({
        _id: mongoose.Types.ObjectId(),
        username: req.body.username,
        userpassword: req.body.userpassword,
        email: req.body.email
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
});

router.get('/:userId', (req, res, next) => { 
    const id = req.params.userId;
    User.findById(id)
    .select('_id username email')
    .exec()
    .then(result => {
        console.log(result);        
        if (result) {
            const response = {
                _id: result._id,
                username: result.username,
                email: result.email,
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
});

router.patch('/:userId', (req, res, next) => { 
    const id = req.params.userId;
    const updateOps = {};
    for (const ops of req.body) {
        updateOps[ops.propName] = ops.value;
    }
    User.update(
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
                url: 'http://localhost:3000/users/' + aldid
            }
        })        
    })
    .catch(err => {
        console.log(err);
        res.status(500).json({error: err}); 
    });
});

router.delete('/:userId', (req, res, next) => { 
    const id = req.params.userId;
    User.remove({_id:id}).exec(        
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
    })
});

module.exports = router;