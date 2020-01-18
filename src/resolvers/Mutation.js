import uuidv4 from "uuid/v4";

const Mutation =  {
    createUser(parent, args, {db}, info) {
        const emailTaken = db.users.some((user) =>  user.email === args.data.email);

        if (emailTaken) {
            throw new Error('Email taken.')
        }

        const user = {
            id: uuidv4(),
            ...args.data
        };

        db.users.push(user);

        return user;

    },
    updateUser(parent, args, { db }, info) {
        const {id, data} = args;
        const user = db.users.find((user) => user.id == id);

        if (!user) {
            throw new Error('User not found');
        }

        if (typeof data.email === 'string') {
            const emailTaken = db.users.some((user) => user.email === data.email);

            if (emailTaken) {
                throw new Error('Email taken')
            }

            user.email = data.email;
        }

        if (typeof data.name === 'string') {
            user.name = data.name;
        }

        if (typeof data.age !== 'undefined') {
            user.age = data.age
        }

        return user
    },
    deleteUser(params, args, {db}, info) {
        const userIndex = db.users.findIndex((user) => user.id === args.id);

        if (userIndex === -1) {
            throw new Error('User not found');
        }

        const deletedUser = db.users.splice(userIndex, 1);

        db.posts = db.posts.filter((post) => {
            const mathc = post.author === args.id;
            if (mathc) {
                db.comments = db.comments.filter((comment) => comment.post !== post.id)
            }
            return !mathc;
        });

        db.comments = comments.filter((comment) => comment.author !== args.id);

        return deletedUser[0];
    },
    createPost(parent, args, {db, pubsub}, info) {
        const userExists = db.users.some((user) => user.id === args.data.author);

        if (!userExists) {
            throw new Error('User not found')
        }

        const post = {
            id: uuidv4(),
            ...args.data
        };

        db.posts.push(post);

        if (post.published) {
            pubsub.publish('post', { 
                post: {
                    mutation: 'CREATED',
                    data: post
                }
            })
        }

        return post;

    },
    updatePost(parent, args, {db, pubsub}, info) {
        const {id, data} = args;
        const post = db.posts.find((post) => post.id === id);
        const originalPost = {...post}

        if (!post) {
            throw new Error('Post not found');
        }

        if (typeof data.title == 'string') {
            post.title = data.title
        }

        if (typeof data.body == 'string') {
            post.body = data.body
        }

        if (typeof data.published !== 'boolean') {
            post.published = data.published;

            if (originalPost.published && !post.published) {
                pubsub.publish('post', {
                    post: {
                        mutation: 'DELETE',
                        data: originalPost
                    }
                })
            } else if (!originalPost.published && post.published) {
                pubsub.publish('post', {
                    post: {
                        mutation: "CREATED",
                        data: post
                    }
                })
            } 
        } else if (post.published) {
            pubsub.publish('post', {
                post: {
                    mutation: 'UPDATE',
                    data: post
                }
            })
        }

        return post
    },
    deletePost(parent, args, {db, pubsub}, info) {
        const postIndex = db.posts.findIndex((post) => post.id === args.id);

        if (postIndex === -1) {
            throw new Error('Post not found');
        }

        const [post] = db.posts.splice(postIndex, 1);

        db.comments = db.comments.filter((comment) => comment.post !== args.id);

        if (post.published) {
            pubsub.publish('post', {
                post: {
                    mutation: 'DELETE',
                    data: post
                }
            })
        }

        return post;
    },
    createComment(parent, args, { db, pubsub }, info) {
        const userExists = db.users.some((user) => user.id === args.data.author);
        const postExists = db.posts.some((post) => post.id === args.data.post && post.published);

        if (!userExists || !postExists) {
            throw new Error('Unable to find user and post.')
        }

        const comment = {
            id: uuidv4(),
            ...args.data
        };

        db.comments.push(comment);
        pubsub.publish(`comment ${args.data.post}`, {
            comment: {
                mutation: 'CREATED',
                data: comment
            }
        });

        return comment;
    },
    updateComment(parent, args, {db, pubsub}, info) {
        const {id, data} = args;
        const comment = db.comments.find((comment) => comment.id == id);

        if (!comment) {
            throw new Error('Comment not found');
        }

        if (typeof data.text == 'string') {
            comment.text = data.text
        }

        pubsub.publish(`comment ${comment.post}`, {
            comment: {
                mutation: 'UPDATE',
                data: comment
            }
        })

        return comment;
    },
    deleteComment(params, args, {db, pubsub}, info) {
        const commentIndex = db.comments.findIndex((comment) => comment.id === args.id);

        if (commentIndex === -1) {
            throw new Error('Comment not found')
        }

        const [deletedComment] = db.comments.splice(commentIndex, 1);
        pubsub.publish(`comment ${deletedComment.post}`, {
            comment: {
                mutation: 'DELETE',
                data: deletedComment
            }
        })

        return deletedComment;
    }
}

export { Mutation as default }