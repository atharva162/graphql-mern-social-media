const { UserInputError } = require('apollo-server');
const { AuthenticationError } = require('apollo-server');


const Postmerng = require('../../models/Post');
const checkAuth = require('../../util/check-auth');

module.exports = {
    Mutation: {
       async createComment(_, { postId, body}, context){
       const user = checkAuth(context)
       if(body.trim() === ''){
         throw new UserInputError('Empty comment', {
             errors: {
                 body: 'Comment body must not be empty'
             }
         })
       }
       const post = await Postmerng.findById(postId)
        try {
          if(post){
                  post.comments.unshift({
                     body: body,
                     username: user.username,
                     createdAt: new Date().toISOString()
                  });
                  await post.save();
                  return post;
              }else{
             throw new UserInputError('Post not found')
          }  
        } catch (err) {
            throw new Error(err)
        }
       },

       async deleteComment(_, { postId, commentId }, context) {
        const { username } = checkAuth(context);
  
        const post = await Postmerng.findById(postId);
  
        if (post) {
          const commentIndex = post.comments.findIndex((c) => c.id === commentId);
  
          if (post.comments[commentIndex].username === username) {
            post.comments.splice(commentIndex, 1);
            await post.save();
            return post;
          } else {
            throw new AuthenticationError('Action not allowed');
          }
        } else {
          throw new UserInputError('Post not found');
        }
      }
    }
}