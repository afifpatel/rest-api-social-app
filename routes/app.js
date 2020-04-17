const express = require('express');
const router = express.Router();
const Post = require('../models/post');
const Community = require('../models/community');
const Comment = require('../models/comment');
const ObjectId = require('mongoose').Types.ObjectId;

// get community
router.get('/communities/:communityId' , (req, res, next) => {
    Community
    .find({ "_id" : ObjectId(req.params.communityId) })
    .populate({
        path: 'posts',
        populate: {
            path: 'comments',
            model: Comment
        }
    })
    .then((community) => {
        if(community && community.length > 0) res.send(community);
        else res.status(404).json({ error: 'Community not found'});
    })
    .catch(next);
});

// add a new post to community
router.post('/communities/:communityId/post' , (req, res, next) => {  
    const { communityId } = req.params;
    Community
    .find({ _id: new ObjectId(communityId) })
    .then(community => {
        if(!community || community.length === 0) {
            return res.status(404).json({ error: 'Community not found' })
        }
        else {
            Post
            .create(req.body)
            .then(post => {
                if(!post) {
                   return res.status(500).json({ error: 'Post could not be created'})
                }
                else {
                    const postId = post._id
                    Community
                    .findOneAndUpdate({ _id: new ObjectId(communityId) }, { $push: { posts: new ObjectId(postId) }}, { new: true })
                    .then(community => {
                        if(community.posts.indexOf(postId) > -1) {
                            return res.send(post);
                        }
                        else {
                            Post
                            .findByIdAndDelete(new Object(postId))
                            .then(() => res.status(500).json({ error: 'Failed to update community posts' }))
                        }
                    })
                    .catch(next);
                }
            })
            .catch(next);
        }
    })
    .catch(next);
});

//delete a post
router.delete('/communities/:communityId/post/:postId', async (req, res, next) => {
    const { communityId, postId } = req.params;

    const query = {
        _id: new Object(communityId),
        posts: new ObjectId(postId)
    }

    const postPromise = await Post.findById(new ObjectId(postId)).exec();
    const communityPromise = await Community.find(query).exec();

    Promise
    .all([postPromise, communityPromise])
    .then((result) => {
        const [ post, community ] = result;
        // 404 if any promise result is empty
        if(!post && (!community || community.length === 0)) {
            res.status(404).json({ error: 'Post and Community not found'});
        }
        else if(!post) {
            res.status(404).json({ error: 'Post does not exist in collection: posts'});
        }
        else if(!community || community.length === 0) {
            res.status(404).json({ error: 'either post does not exist in community:posts[] or community not found in collection: community'});
        }
        // if none promise empty - execute delete
        else {

            // let community = await Community
            //                         .findByIdAndUpdate({ _id: new ObjectId(communityId) },
            //                                            { $pull: { post: new ObjectId(postId) }},
            //                                            { new: true });
            // if (community.posts.indexOf(postId) > -1 ) {
            //     throw 'Failed to update community';
            // }


             deletePost(postId, communityId, post)
                .then((data) => {
                    res.send(data);
                })
                .catch((err) => {
                    res.status(500).send(err);
                });
            
            }
            // if(!isError) {
            //     res.send(post);
            // }
            // else {
            //     res.status(500).json(isError);
            // }
        
    })
    .catch(next);
});

// add a new comment to a post
router.post('/post/:postId/comment', (req, res, next) => {
    const { postId } = req.params;
    Post
    .find({ _id: new ObjectId(postId) })
    .then(post => {
        if(!post || post.length === 0){
            return res.status(404).json({ error: 'Post not found'});
        }
        else{
            Comment
            .create(req.body)
            .then(comment => {
                if(!comment){
                    return res.status(500).json({ error: 'Comment could not be created'});
                }
                else{
                    const commentId = comment._id;
                    Post
                    .findByIdAndUpdate({ _id: new ObjectId(postId)}, { $push: { comments: new ObjectId(commentId) }}, { new: true })
                    .then(post => {
                        if(post.comments.indexOf(commentId) > -1) {
                            return res.send(comment);
                        }
                        else {
                            Comment
                            .findByIdAndDelete(new ObjectId(commentId))
                            .then(() => res.status(500).json({ error: 'Failed to update post comments'}))
                        }
                    })
                    .catch(next)
                }
            })
            .catch(next);
        }
    })
    .catch(next);
});

// update a post
router.put('/post/:postId', (req, res, next) => {
    const { postId } = req.params;
    Post
    .findByIdAndUpdate(new ObjectId(postId), req.body, { new: true })
    .then(post => {
        if(post){
            res.send(post);
        }
        else {
            res.status(404).json({ error: 'Post not found' });
        }
    })
    .catch(next);
});

//delete a comment
router.delete('/post/:postId/comment/:commentId', async (req, res, next) => {
    const { postId, commentId } = req.params;

    const query = {
        _id : new ObjectId(postId),
        comments : new ObjectId(commentId)
    }
    const commentPromise = await Comment.findById(new ObjectId(commentId)).exec();
    const postPromise = await Post.find(query).exec();

    Promise
    .all([commentPromise, postPromise])
    .then((result) => {
        const [ comment, post ] = result;
        if(!comment && (!post || post.length === 0)) {
            res.status(404).json({ error: 'Comment and Post not found'});
        }
        else if(!comment) {
            res.status(404).json({ error: 'comment does not exist in collection: comments '});
        }
        else if(!post || post.length === 0) {
            res.status(404).json({ error: 'either comment does not exist in post:comments[] or post not found in collection: posts' });
        }
        else {
            // execute delete comment
            deleteComment(commentId, postId)
            .then((data) => {
                res.send(data);
            })
            .catch((error) => {
                res.status(500).send(error);
            })
        }
    })
    .catch(next);
});

//update a comment
router.put('/comment/:commentId', (req, res, next) => {
    const { commentId } = req.params;
    Comment
    .findByIdAndUpdate(new ObjectId(commentId), req.body, { new: true })
    .then(comment => {
        if(comment){
            res.send(comment);
        }
        else {
            res.status(404).json({ error: 'Comment not found' });
        }
    })
    .catch(next);
});

async function deletePost(postId, communityId, post) {

    let community = await Community
                            .findByIdAndUpdate({ _id: new ObjectId(communityId) },
                                               { $pull : { posts: new ObjectId(postId) }},
                                               { new: true })
                            .exec();
    if(community && community.posts.indexOf(postId) > -1) {
        throw {error: 'Failed to update community posts'};
    }
    const oldComments = post.comments;
    let comments = await Comment
                            .deleteMany({ _id: { $in : [ ...oldComments ]}})
                            .exec();

    if(!comments) {
        throw { error: 'Failed to delete post comments'};
    }

    return Post
            .findByIdAndDelete({ _id: new ObjectId(postId) });
}

async function deleteComment(commentId, postId) {

    // update comments array in post
    let post = await Post
                        .findByIdAndUpdate({ _id: new ObjectId(postId) },
                                           { $pull: { comments: new ObjectId(commentId) }},
                                           { new: true})
                        .exec();   
    // throw error if update fails
    if(post && post.comments.indexOf(commentId) > -1) {
        throw { error: 'Failed to update post comments'};
    }

    // exceute comment delete
    return Comment
            .findByIdAndDelete({ _id: new ObjectId(commentId) });
}


module.exports = router;
