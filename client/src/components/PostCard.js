import React, {useContext} from 'react'
import { Card, Icon, Label, Image, Button } from 'semantic-ui-react';
import moment from 'moment';
import { Link } from 'react-router-dom';

import {AuthContext} from '../context/auth'
import LikeButton from "./LikeButton";
import DeleteButton from './DeleteButton'
import MyPopup from '../utils/MyPopup';

function PostCard({ post: { body, username, createdAt, id, likes, comments}}) {
  const {user} = useContext(AuthContext)
    return (
        <Card fluid>
            <Card.Content>
             <Image floated="right" size="mini" src="https://react.semantic-ui.com/images/avatar/large/molly.png"/>
             <Card.Header>{username}</Card.Header>
             <Card.Meta>{moment(createdAt).fromNow()}</Card.Meta>
             <Card.Description>{body}</Card.Description>
            </Card.Content>
            <Card.Content extra>
            <LikeButton post={{ id, likes}}/>
            <MyPopup content="Comments on this post">
            <Button labelPosition="right" as={Link} to={`/posts/${id}`}> 
                <Button color="blue" basic>
                <Icon name="comments"/>    
                </Button>
                <Label basic color="blue" pointing="left">
                    {comments.length}
                </Label>   
                </Button>
            </MyPopup>
            {user && user.username === username && <DeleteButton postId={id} />}
            </Card.Content>
        </Card>
    )
}

export default PostCard
