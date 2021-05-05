import React, {useState} from 'react'
import gql from 'graphql-tag';
import {useMutation} from '@apollo/react-hooks';
import {Button, Icon, Confirm } from 'semantic-ui-react';

import { FETCH_POSTS } from '../utils/graphql';
import MyPopup from '../utils/MyPopup';

function DeleteButton({ postId, callback, commentId}) {
    const [open, setOpen] =  useState(false);
    const mutation = commentId ? DELETE_COMMENT : DELETE_POST
    const [deletePostOrComment] = useMutation(mutation, {
        update(proxy){
         setOpen(false)
         if(!commentId){
            const data = proxy.readQuery({
                query: FETCH_POSTS
            })
            proxy.writeQuery({ query: FETCH_POSTS,
                data: {getPosts: data.getPosts.filter((post)=> post.id !== postId)}});
         }
         if(callback) callback();
        },  
        variables :{
              postId,
              commentId
          }
      })
    return (
        <>
           <MyPopup content={commentId ? 'Delete comment' : 'Delete post'}>
           <Button as="div" color="red" floated="right" onClick={()=> setOpen(true)}>
                 <Icon name="trash" style={{margin: 0}} />
                 </Button>
           </MyPopup>
             <Confirm open={open} onCancel={()=> setOpen(false)} onConfirm={deletePostOrComment}/>
          </>
            )
}

const DELETE_POST = gql`
  mutation deletePost($postId: ID!){
      deletePost(postId: $postId)
  }
`
const DELETE_COMMENT = gql`
   mutation deleteComment($postId: ID!, $commentId: ID!){
       deleteComment(postId: $postId, commentId: $commentId){
           id
           comments{
               id
               username
               body
               createdAt
           }
       }
   }
`

export default DeleteButton
