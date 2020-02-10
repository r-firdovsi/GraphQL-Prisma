import { Prisma } from 'prisma-binding';
import { fragmentReplacements } from './resolvers/index'

const prisma = new Prisma({
    typeDefs: 'src/generated/prisma.graphql',
    endpoint: process.env.PRISMA_ENDPOINT,
    secret: 'thisismysupersecrettext',
    fragmentReplacements
});

export { prisma as default }

// 1. Create a new post
// 2.Fetch all of the info about the use

// prisma.exists.Comment({
//     id: "abc123"
// }).then((exists) => {
//     console.log(exists)
// })

// const createPostForUser = async (authorId, data) => {
//     const userExists = await prisma.exists.User({
//         id: authorId
//     })

//     if (!userExists) {
//         throw new Error('User not found')
//     }

//     const post = await prisma.mutation.createPost({
//         data: {
//             ...data,
//             author: {
//                 connect: {
//                     id: authorId
//                 }
//             }
//         }
//     }, '{ author {id name email posts { id title published }} }')
//     return post.author
// }



// createPostForUser('ck5fljzsn00wk0859p8vcrumm', {
//     title: 'Greate book for read',
//     body: 'The War of Art',
//     published: true
// }).then((user) => {
//     console.log(JSON.stringify(user, undefined, 2))
// }).catch((error) => {
//     console.log(error.message)
// })

// const updatePostForUser = async (postId, data) => {
//     const postExists = await prisma.exists.Post({
//         id: postId
//     })

//     if (!postExists) {
//         throw new Error('Post Not Found')
//     }

//     const post = await prisma.mutation.updatePost({
//         where: {
//             id: postId
//         },
//         data: {
//             ...data
//         }
//     }, '{ author { id name email } }')

//     return post.author
// }

// updatePostForUser('ck5h5vhjp01ab0859nrezk0hc', {
//     title: "My latest graphql post",
//     body: "First class",
//     published: false
// }).then((user) => {
//     console.log(JSON.stringify(user, undefined, 2))
// }).catch((error) => {
//     console.log(error)
// })

// prisma.query.users(null, '{ name email posts { id title } }').then((data) => {
//     console.log(JSON.stringify(data, undefined, 2));
// })

// prisma.query.comments(null, '{ id text author { id name } }').then((data) => {
//     console.log(JSON.stringify(data, undefined, 2));
// })

// prisma.mutation.createPost({
//     data: {
//         title: "My new graphql post",
//         body: "",
//         published: false,
//         author: {
//             connect: {
//                 id: "ck5fljzsn00wk0859p8vcrumm"
//             }
//         }
//     }
// }, '{ id title body published }').then((data) => {
//     console.log(data);
//     return prisma.query.users(null, '{ id name posts { id title } }');
// }).then((data) => {
//     console.log(JSON.stringify(data, undefined, 2));
// })

// prisma.mutation.updatePost({
//     data: {
//         body: "Oke this is my first post from graphql",
//         published: true
//     },
//     where: {
//         id: "ck5h62h0m01bu0859c97ej7z2"
//     }
// }, '{id title published}').then((data) => {
//     console.log(data)
//     return prisma.query.posts(null, '{ id title body published }');
// }).then((data) => {
//     console.log(data)
// })