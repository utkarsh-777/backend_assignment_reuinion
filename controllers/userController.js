import User from '../models/User.js';

const follow_user = async(req,res) => {
    if(req.params.user_id === req.user._id.toString()) {
        return res.json({
            message: 'You cannot follow yourself!'
        });
    }

    try {
        const user_to_follow = await User.findById({_id: req.params.user_id});

        const update_following = await User.updateOne({_id: req.user._id}, {
            $push: {
                following: user_to_follow
            }
        }, {new: true});

        console.log(update_following);

        const update_followers = await user_to_follow.updateOne({
            $push: {
                followers: req.user
            }
        }, {new: true});

        console.log(update_followers);

        return res.status(200).json({
            message: `You Follwed ${user_to_follow.name}`
        });

    } catch (error) {
        console.error(error);
        return res.status(500).json({
            message: 'Internal Server Error!'
        });
    }
}

const unfollow_user = async(req,res) => {
    if(req.params.user_id === req.user._id.toString()) {
        return res.json({
            message: 'You cannot Unfollow yourself!'
        });
    }

    try {
        const user_to_unfollow = await User.findById({_id: req.params.user_id});

        const update_following = await User.updateOne({_id: req.user._id}, {
            $pull: {
                following: user_to_unfollow._id
            }
        }, {new: true});

        console.log(update_following);

        const update_followers = await user_to_unfollow.updateOne({
            $pull: {
                followers: req.user._id
            }
        }, {new: true});

        console.log(update_followers);

        return res.status(200).json({
            message: `You UnFollwed ${user_to_unfollow.name}`
        });

    } catch (error) {
        console.error(error);
        return res.status(500).json({
            message: 'Internal Server Error!'
        });
    }
}

const get_user = (req,res) => {
    return res.json({user: req.user});
}

export default {
    follow_user,
    unfollow_user,
    get_user
}