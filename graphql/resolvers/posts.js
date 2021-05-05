const { AuthenticationError, UserInputError } = require('apollo-server');

const Postmerng = require('../../models/Post');
const { Mutation } = require('./users');
const checkAuth = require('../../util/check-auth')

module.exports = {
    Query: {
        async getPosts(){
        try {
            const posts = await Postmerng.find();
            return posts
        } catch (err) {
            throw new Error(err);
        }
          },
        async getPost(_, { postId }){
            try {
              const post = await Postmerng.findById(postId);
              if(post){
                  return post;
              }else{
                  throw new Error('Post not found')
              }
            } catch (err) {
                throw new Error(err)
            }
        }
      },
     Mutation: {
          async createPost(_, { body }, context){
          const user =  checkAuth(context);
         
          if(body.trim() === ''){
              throw new Error('Post body must not be empty');
          }

          const newPost = new Postmerng({
              body,
              user: user.id,
              username: user.username,
              createdAt: new Date().toISOString()
          })
          const post = await newPost.save();
          return post;
          },
          async deletePost(_, { postId }, context){
              const user = checkAuth(context);
              try {
                const post = await Postmerng.findById(postId);
                if(user.username === post.username){
                    await post.delete();
                    return 'Post deleted successfully'
                }else{
                    return new AuthenticationError('Action not allowed')
                }  
              } catch (err) {
                  throw new Error(err); 
              }
            },
            async likePost(_, { postId }, context){
                const user = checkAuth(context);
                  const post = await Postmerng.findById(postId)
                  if(post){
                   if(post.likes.find(like=> like.username === user.username)){ 
                     post.likes = post.likes.filter(like=> like.username !== user.username)
                    } else{
                    post.likes.push({
                        username: user.username,
                        createdAt: new Date().toISOString()
                    });
                   }
                   await post.save();
                   return post;   
                  }else{
                      throw new UserInputError('Post not found');
                  }
                }
            }
      }
