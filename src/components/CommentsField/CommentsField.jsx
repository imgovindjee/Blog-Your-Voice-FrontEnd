import React, { useContext, useState } from 'react'
import toast, { Toaster } from 'react-hot-toast';
import { UserContext } from '../../App';
import { BlogContext } from '../../pages/BlogPages/BlogPage';
import axios from 'axios';



const CommentsField = ({ action, index = undefined, replyingTo = undefined, setIsReplying }) => {

    // Accessing the "GLOBAL-CONTEXT" of the user
    const { userAuth: { access_token, username, profile_img, fullname } } = useContext(UserContext);

    // accessing the "log-context" for the post
    const { blog, blog: { _id, author: { _id: blog_author }, comments, comments: { results: commentArray }, activity, activity: { total_comments, total_parent_comments }
    }, setBlog, setTotalParentCommentsLoaded } = useContext(BlogContext);

    // useState-hook
    // setting the state of the comment..
    const [comment, setComment] = useState("");


    // function to handle the commnet/reply button
    const handleClick = () => {
        // if user is not login
        if (!access_token) {
            return (
                toast.error("Login with us to Comment....")
            )
        }

        // if comment "content" is NULL/undefine
        if (!comment.length) {
            return (
                toast.error("Please Write Something to Comment..")
            )
        }

        // making the request to the server for creating a comment
        axios.post(import.meta.env.VITE_SERVER_DOMAIN + "/add-comment", { _id, blog_author, comment, replying_to: replyingTo },
            {
                headers: {
                    'Authorization': `Bearer ${access_token}`
                }
            }
        )
            .then(({ data }) => {

                setComment("")

                console.log(data);


                // adding the data of "WHO COMMNETD ON THE POST"
                data.commented_by = { personal_info: { username, profile_img, fullname } }

                let newCommentArray;

                if (replyingTo) {
                    commentArray[index].children.push(data._id);

                    data.childrenLevel = commentArray[index].childrenLevel + 1;
                    data.parentIndex = index

                    commentArray[index].isReplyLoaded = true

                    commentArray.splice(index + 1, 0, data)

                    newCommentArray = commentArray

                    setIsReplying(false)
                } else {
                    // adding the nested children class-like structure(INHERITANCE)
                    data.childrenLevel = 0;

                    newCommentArray = [data, ...commentArray];
                }


                let parentCommentIncreamental = replyingTo ? 0 : 1;

                // setting-up the nexted comments...... 
                setBlog({ ...blog, comments: { ...comments, results: newCommentArray }, activity: { ...activity, total_comments: total_comments + 1, total_parent_comments: total_parent_comments + parentCommentIncreamental } })
                setTotalParentCommentsLoaded(preVal => preVal + parentCommentIncreamental); //increasing the parent comments... 
            })
            .catch(error => {
                console.log(error);
            })
    }



    return (
        <>
            <Toaster />
            <textarea
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder='Leave a Comment.....'
                className='resize-none input-box pl-5 placeholder:text-dark-grey h-[150px] overflow-auto'
            >
            </textarea>

            <button
                className="btn-dark mt-5 px-10"
                onClick={handleClick}
            >
                {action}
            </button>
        </>
    )
}

export default CommentsField
