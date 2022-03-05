import Post from "../models/Post.js";
import AWSFileHandle from "../s3.js";
import multiparty from 'multiparty';

const uploadFiles = async(req,res) => {
    const form = new multiparty.Form();
    form.parse(req, async(error,fields,files) => {
        if(error) {
            return res.status(500).json({
                message: 'Internal Server Error!'
            });
        };

        try {
            const data = await AWSFileHandle.uploadFile(files);
            console.log(data);
            return res.status(200).json({
                uploadedFiles: data 
            });
          } catch (err) {
            return res.status(500).json(err);
          }
    });
};

const getFile = async(req, res) => {
    const key = `${req.params.bucket}/${req.params.key}`;
    const readStream = AWSFileHandle.getFile(key);

    readStream.pipe(res);
}

const createPost = async(req,res) => {
    const {title,description,files,location} = req.body;

    if(!title || !description) {
        return res.json({
            message: "Title and Description is needed!"
        });
    }

    try {
        const newPost = new Post({
            title,
            description,
            files,
            location,
            postedBy: req.user,
        });

        let save = await newPost.save();
        console.log(save);

        return res.status(200).json({
            post: {
                _id: newPost._id,
                title,
                description,
                created_at: newPost.createdAt
            },
        });

    } catch (error) {
        return res.status(500).json({
            message: "Error!"
        })
    }
}

const delete_post = async(req,res) => {
    const post_id = req.params.post_id;

    try {
        const to_be_deleted_post = await Post.findById({_id: post_id});
        if(to_be_deleted_post.postedBy._id.toString() !== req.user._id.toString()){
            return res.json({
                message: 'You are not authorized!'
            });
        }

        const deleted_post = await to_be_deleted_post.deleteOne();

        return res.status(200).json({
            to_be_deleted_post
        });

    } catch (error) {
        console.error(error);
        return res.status(500).json({
            error: 'Internal Server Error'
        })
    }
}

const like_post = async(req,res) => {
    const post_id = req.params.post_id;

    try {
        const post = await Post.findById({_id: post_id});

        // post.bulkWrite([
        //     {updateOne: {filter: }}
        // ])

        const likePost = await post.updateOne({
            $push: {
                likes: req.user,
            }
        }, {new: true});

        console.log(likePost);

        const removeUnlike = await post.updateOne({
            $pull: {
                unlikes: req.user._id,
            }
        });

        console.log(removeUnlike);

        return res.status(200).json({
            message: 'Liked Post!'
        });
    } catch (error) {
        return res.status(500).json({
            message: 'Internal Server Error!'
        })
    }
}

const unlike_post = async(req,res) => {
    const post_id = req.params.post_id;

    try {
        const post = await Post.findById({_id: post_id});
        const unlikePost = await post.updateOne({
            $push: {
                unlikes: req.user,
            }
        }, {new: true});

        console.log(unlikePost);

        const removeLike = await post.updateOne({
            $pull: {
                likes: req.user._id
            }
        });

        console.log(removeLike);

        return res.status(200).json({
            message: 'Unliked Post!'
        });
    } catch (error) {
        return res.status(500).json({
            message: 'Internal Server Error!'
        });
    }
}

const add_comment = async(req,res) => {
    const post_id = req.params.post_id;
    const {comment} = req.body;

    if(!comment) {
        return res.json({
            message: 'Enter a valid comment!'
        });
    }

    try {
        const post = await Post.findByIdAndUpdate({_id: post_id}, {
            $push: {
                comments: {
                    comment,
                    commentBy: req.user,
                }
            }
        }, {new: true});

        console.log(post);
        return res.status(200).json({
            message: `Added Comment ${post.comments[post.comments.length - 1]._id}`
        });
        
    } catch (error) {
        return res.status(500).json({
            message: 'Internal Server Error!'
        });
    }
}

const get_post = async(req,res) => {
    const post_id = req.params.post_id;

    try {
        const post = await Post.findById({_id: post_id});

        const return_post = {
            _id: post._id,
            title: post.title,
            description: post.description,
            created_at: post.createdAt,
            comments: post.comments,
            likes: post.likes,
        }

        return res.status(200).json({
            post: return_post
        });
    } catch (error) {
        return res.status(500).json({
            message: 'Internal Server Error!'
        });
    }
}

const get_all_posts = async(req,res) => {
    try {
        const posts = await Post.find().sort({createdAt: -1});
        return res.status(200).json({
            posts
        })
    } catch (error) {
        return res.status(500).json({
            message: 'Internal Server Error!'
        });
    }
    
}

export default {
    uploadFiles,
    createPost,
    getFile,
    delete_post,
    like_post,
    unlike_post,
    add_comment,
    get_post,
    get_all_posts,
}