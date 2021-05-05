import React, {useState} from 'react';
import { Button, Form } from 'semantic-ui-react'
import gql from 'graphql-tag';
import {useMutation} from '@apollo/react-hooks'
import { FETCH_POSTS } from '../utils/graphql'

function PostForm() {
    const [values, setValues] = useState({ body: ''})
   
    const [createPost, {error}] = useMutation(CREATE_POST, {
        variables: values,
        onError(err){
        console.log(err);
        },
        update(proxy, result){
         const data = proxy.readQuery({
                query: FETCH_POSTS
            })
            proxy.writeQuery({ query: FETCH_POSTS,
                data: {getPosts: [result.data.createPost, ...data.getPosts]  }});
            values.body = ''
        }
    })

    function onSubmit(event){
    event.preventDefault();
    createPost();
    }
    return (
        <>
       <Form onSubmit={onSubmit}>
        <h2>Create a post</h2>
        <Form.Field>
        <Form.Input placeholder="What's in your mind ??" name="body" value={values.body} onChange={(event)=> setValues({body: event.target.value})}/>
        <Button type="submit" color="teal">
        Submit    
        </Button>                  
        </Form.Field>
       </Form>
       {error && (
           <div className="ui error message" style={{marginBottom: 20}}>
               <ul className="list">
               <li>{error.graphQLErrors[0].message}</li>
               </ul>
           </div>
       )}
       </> 
    )
}

const CREATE_POST = gql`
mutation createPost($body: String!){
    createPost(body: $body){
        id body createdAt username
        likes{
            id username createdAt
        }
        comments{
            id body username createdAt 
        }
    }
}
`

export default PostForm
