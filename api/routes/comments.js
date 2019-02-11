const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const CommentModel = require("../models/commentModel");
const User = require("../models/userModel");

router.get('/', (req, res, next) => { 

    CommentModel.find()
    .select('_id text user createdDate updatedDate') 
    //.populate('user', 'username')   
    .exec()
    .then(result => {
        console.log(result);
        const response = {
            count: result.length,
            comments: result.map(result => {
                return {
                    _id: result._id,
                    text: result.text,
                    user: result.user,
                    createdDate: result.createdDate,
                    updatedDate: result.updatedDate,
                    actions: [
                        {
                            action: "COMMENTS_GET_ALL",
                            request: {
                                type: 'GET',
                                url: 'http://localhost:3000/comments/'
                            }
                        },
                        {
                            action: "COMMENT_GET_BY_ID",
                            request: {
                                type: 'GET',
                                url: 'http://localhost:3000/comments/' + result._id
                            }
                        },
                        {
                            action: "COMMENT_POST",
                            request: {
                                type: 'POST',
                                url: 'http://localhost:3000/comments/',
                                body: {
                                    text: "",
                                    user: ""
                                }
                            }
                        },
                        {
                            action: "COMMENT_DELETE",
                            request: {
                                type: 'DELETE',
                                url: 'http://localhost:3000/comments/' + result._id
                            }
                        },
                        {
                            action: "COMMENT_PATCH",
                            request: {
                                type: 'PATCH',
                                url: 'http://localhost:3000/comments/' + result._id,
                                body: [
                                    { "propName" : "text", "value" : "" },
                                    { "propName" : "updatedDate", "value" : "" }
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
    const commentModel = new CommentModel({
        _id: mongoose.Types.ObjectId(),
        text: req.body.text,
        user: req.body.user
    });
    commentModel.save().then(result => {
        console.log(result);
        res.status(201).json({
            message: 'Created comment successfully',
            createdUsers: {
                _id: result._id,
                text: result.text,
                user: result.user,
                request: {
                    type: 'GET',
                    url: 'http://localhost:3000/comments/' + result._id
                }
            }
        });
        
        //update user for relations - see userModel.js for relationship
        User.updateOne(
            {_id : result.user }, 
            { $push : { "commentsArray" : result._id } }
        ).exec()
        .then(result => {
            console.log(result);      
        })
        .catch(err => {
            console.log(err);
        });

    }).catch(err => {
        console.log(err)
        res.status(500).json({error: err});
    });    
});

router.get('/:commentId', (req, res, next) => { 
    const id = req.params.commentId;
    CommentModel.findById(id)
    .select('_id text user createdDate updatedDate')
    .populate('user', 'username')   
    .exec()
    .then(result => {
        console.log(result);        
        if (result) {
            const response = {
                _id: result._id,
                text: result.text,
                user: result.user,
                createdDate: result.createdDate,
                updatedDate: result.updatedDate,
                request: {
                    type: 'GET',
                    url: 'http://localhost:3000/comments/' + result._id
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

router.patch('/:commentId', (req, res, next) => { 
    const id = req.params.commentId;
    const updateOps = {};
    for (const ops of req.body) {
        updateOps[ops.propName] = ops.value;
    }
    CommentModel.update(
        {_id:id}, 
        { $set: updateOps}
    )
    .exec()
    .then(result => {
        console.log(result);
        res.status(200).json(result)        
    })
    .catch(err => {
        console.log(err);
        res.status(500).json({error: err}); 
    });
});

router.delete('/:commentId', (req, res, next) => { 
    const id = req.params.commentId;
    CommentModel.remove({_id:id}).exec(        
    ).then(result => {
        console.log(result);
        res.status(200).json(result)
    }).catch(err => {
        console.log(err);
        res.status(500).json({error: err});
    })
});

module.exports = router;