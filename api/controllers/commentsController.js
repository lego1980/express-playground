const mongoose = require('mongoose');
const CommentModel = require("../models/commentModel");
const UserModel = require("../models/userModel");

exports.comments_get_all = (req, res, next) => { 
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
}

exports.comments_post = (req, res) => { 
    const commentModel = new CommentModel({
        _id: new mongoose.Types.ObjectId(),
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
        UserModel.updateOne(
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
}

exports.comments_get_single = (req, res, next) => { 
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
}

exports.comments_patch = (req, res, next) => { 
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
}

exports.comments_delete = (req, res, next) => { 
    const id = req.params.commentId;
    CommentModel.remove({_id:id}).exec(        
    ).then(result => {
        console.log(result);
        res.status(200).json(result)
    }).catch(err => {
        console.log(err);
        res.status(500).json({error: err});
    })
}