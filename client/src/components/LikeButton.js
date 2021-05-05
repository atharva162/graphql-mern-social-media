import React, {useEffect, useState, useContext} from 'react'
import {Link} from 'react-router-dom';
import { useMutation } from '@apollo/react-hooks'
import gql from 'graphql-tag'
import { Button, Label, Icon } from 'semantic-ui-react';

import {AuthContext} from '../context/auth';
import MyPopup from '../utils/MyPopup';

function LikeButton({post: { id, likes}}) {
    const {user} = useContext(AuthContext);    
    const [liked, setLiked] = useState(false)

    useEffect(() => {
        if(user && likes.find((like)=> like.username ===  user.username)){
            setLiked(true)
        }else{
            setLiked(false)
        }
    }, [user, likes])

    const [likePost] = useMutation(LIKE_POST, {
        variables: {postId: id},
        onError(err){
          console.log(err)
        }
    });

   const likeButton = user ? ( liked ?
      (
        <Button color="red">
        <Icon name="heart"/>    
        </Button>
      ) : (
        <Button color="red" basic>
        <Icon name="heart"/>    
        </Button>
      )
   ) : (
    <Button as={Link} to="/login" color="red" basic>
    <Icon name="heart"/>    
    </Button>
   )

    return (
        <Button as="div" labelPosition="right" onClick={likePost}> 
           <MyPopup content={liked ? 'Unlike' : 'Like'}>
             {likeButton}
           </MyPopup>
            <Label basic color="red" pointing="left">
                {likes.length}
            </Label>   
            </Button>
    )
    }

   const LIKE_POST = gql`
     mutation likePost($postId: ID!){
        likePost(postId: $postId){
            id 
            likes{
              id username
            }
        }
     }
   `

export default LikeButton
