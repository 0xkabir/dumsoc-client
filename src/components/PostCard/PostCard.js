import { useState } from "react";
import {
    Card,
    CardHeader,
    CardBody,
    CardFooter,
    Typography,
    Input,
    Button,
  } from "@material-tailwind/react";
  import { useAuth0 } from "@auth0/auth0-react";
import toast from "react-hot-toast";
import { useQuery } from 'react-query';
   
  export default function PostCard({post, refresh}) {
    const { user } = useAuth0();
    const [showComments, setShowComments] = useState(false)
    const {data: comments=[], refetch} = useQuery({
        queryKey: ['comments', post._id],
        queryFn: ()=>fetch(`https://dumsoc-server.vercel.app/comments/${post._id}`)
        .then(response => response.json())
    })

    const updateLikesCount = () => {
        fetch(`https://dumsoc-server.vercel.app/update-likes/${post._id}`, {
            method: 'PUT', 
            headers: {
                'content-type': 'application/json'
            },
            body: JSON.stringify({likes: post.likes+1})
        })
        .then(response => response.json())
        .then(data => {
            refetch()
        })
    }

    const updateCommentCount = () => {
        fetch(`https://dumsoc-server.vercel.app/update-comment-count/${post._id}`, {
            method: 'PUT', 
            headers: {
                'content-type': 'application/json'
            },
            body: JSON.stringify({comments: post.comments+1})
        })
        .then(response => response.json())
        .then(data => {
            refresh()
        })
    }

    const postComment = event => {
        event.preventDefault()
        const form = event.target;
        const comment = form.comment.value;
        const commentObj = {
            postId: post._id,
            commenter: user.nickname, 
            comment: comment
        }
        fetch('https://dumsoc-server.vercel.app/post-comment', {
            method: 'POST',
            headers: {
                'content-type':'application/json'
            },
            body: JSON.stringify(commentObj)
        })
        .then(response => response.json())
        .then(data => {
            if(data.acknowledged){
                form.reset()
                toast.success('Added Comment')
                updateCommentCount()
            }
        })
    }

    return (
      <Card className="md:w-max-[40vw] mx-auto my-10">
        <CardHeader className="relative shadow-sm">
        <Typography variant="h3" className="mb-2">{post.title}</Typography>
        </CardHeader>
        <CardBody>
          <Typography>
            {post.description}
          </Typography>
        </CardBody>
        <CardFooter divider className="flex items-center justify-between py-3">
          <div>
          <Typography variant="small" color="gray" className="flex items-center gap-4 md:gap-6">
              <Button variant="text" size="sm" onClick={updateLikesCount}>Like</Button>
            <span>{post.likes} Likes</span>
            <span className="cursor-pointer" onClick={()=>setShowComments(!showComments)}>{post.comments} Comments</span>
          </Typography>
          {showComments && <div className="my-2">
              {comments.map((comment, index) => <div key={index}>
                <Typography variant="small" color='gray'>{comment.commenter}</Typography>
                <Typography>{comment.comment}</Typography>
              </div>)}
          </div>}
          {
              user?<form onSubmit={postComment} className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-2">
              <Input label="Comment" id="comment" className="w-full md:w-80"/>
              <Button size="sm" type="submit" className="max-w-[130px]">Add Comment</Button>
              </form>:''
          }
          </div>
        </CardFooter>
      </Card>
    );
  }