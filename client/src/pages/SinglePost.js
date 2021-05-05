import React, { useContext, useState} from 'react'
import gql from 'graphql-tag'; 
import {useQuery, useMutation} from '@apollo/react-hooks';
import {Button, Card, Grid, Icon, Label, Image, Form} from 'semantic-ui-react';
import moment from 'moment';

import {AuthContext} from '../context/auth';
import LikeButton from '../components/LikeButton';
import DeleteButton from '../components/DeleteButton';
import MyPopup from '../utils/MyPopup'

function SinglePost(props) {
    const postId = props.match.params.postId;
    const [comment, setComment] = useState('')
    const { user } = useContext(AuthContext);    
    const {data: {getPost} = {} } = useQuery(FETCH_POST,{
        variables: {
            postId
        }
       });

       const [createComment] = useMutation(CREATE_COMMENT, {
           update(){
            setComment('');
           },
           variables: {
               postId,
               body: comment
           }
       })
    function deletePostCallback(){
        props.history.push('/')
    }
    let markup;
    if(!getPost){
        markup = <p>Loading post...</p>
    }else{
       const {id, body, createdAt, username, likes, comments} = getPost;
       markup = (
         <Grid>
             <Grid.Row>
                 <Grid.Column width={4}>
                <Image 
                src="https://react.semantic-ui.com/images/avatar/large/molly.png"
                size="small"
                float="right"
                />
                 </Grid.Column>
                 <Grid.Column width={12}>
                 <Card fluid>
                 <Card.Content>
                     <Card.Header>{username}</Card.Header>
                     <Card.Meta>{moment(createdAt).fromNow()}</Card.Meta>
                     <Card.Description>{body}</Card.Description>
                 </Card.Content>
                 <hr/>
                 <Card.Content extra>
                  <LikeButton post={{ id, likes}}/>
                 <MyPopup content="Comments on this post">
                 <Button as="div" labelPosition="right">
                      <Button basic color="blue">
                      <Icon name="comments"/>
                      </Button>
                      <Label basic color="blue" pointing="left">
                          {comments.length}
                      </Label>
                  </Button>
                 </MyPopup>
                  {user && user.username === username && (
                      <DeleteButton postId={id} callback={deletePostCallback}/>
                  )}
                 </Card.Content>
                 </Card>
                 {user && (
                     <Card fluid>
                      <Card.Content>
                      <p>Post a comment</p>
                    <Form>
                        <div className="ui action input fluid">
                      <input type="text" placeholder="Comment.." name="comment" value={comment} onChange={event => setComment(event.target.value)}/>
                      <button type="submit" className="ui button teal" disabled={comment.trim() === ''} onClick={createComment}>Post</button>
                       </div>
                    </Form>
                      </Card.Content>
                     </Card>
                 )}
                 {comments.map((comment)=>(
                 <Card fluid key={comment.id}>
                     <Card.Content>
                         {user && user.username === comment.username && (
                             <DeleteButton postId={id} commentId={comment.id}/>
                         )}
                     <Card.Header>{comment.username}</Card.Header>
                     <Card.Meta>{moment(comment.createdAt).fromNow()}</Card.Meta>
                     <Card.Description>{comment.body}</Card.Description>
                     </Card.Content>
                     </Card>
                 ))}
                 </Grid.Column>
             </Grid.Row>
         </Grid>
       )
    }
    return markup;
}

const CREATE_COMMENT = gql`
     mutation createComment($postId: ID!, $body: String!){
          createComment(postId: $postId, body: $body){
              id
              comments{
                  id
                  body
                  username
                  createdAt
              }
          }
      }
`

const FETCH_POST = gql`
  query($postId: ID!){
     getPost(postId: $postId){
         id
         body
         username
         createdAt
         likes{
             username
         }
         comments{
             id
             body
             username
             createdAt
         }
     }
  }
`

export default SinglePost
