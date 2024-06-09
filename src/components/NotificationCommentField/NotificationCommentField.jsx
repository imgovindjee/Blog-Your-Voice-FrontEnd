import React, { useContext, useState } from 'react'
import toast, { Toaster } from 'react-hot-toast'
import { UserContext } from '../../App';
import axios from 'axios';




const NotificationCommentField = ({ _id, blog_author, index = undefined, replyingTo = undefined, setIsReplying, notification_id, notificationData }) => {

    // Accessing the global context of the website..
    const { userAuth: { access_token } } = useContext(UserContext)

    // hook
    // toset the comment state EDITABLE
    const [comment, setComment] = useState("");

    // Destructuring the data..
    let { _id: user_id } = blog_author
    const { notifications, notifications: { results }, setNotifications } = notificationData

    // function to handle the "REPLY" button
    const handleClick = () => {
        console.log("clicked")

        // if comment "content" is NULL/undefine
        if (!comment.length) {
            return (
                toast.error("Please Write Something to Comment..")
            )
        }

        // making the request to the server for creating a comment
        axios.post(import.meta.env.VITE_SERVER_DOMAIN + "/add-comment", { _id, blog_author: user_id, comment, replying_to: replyingTo, notification_id },
            {
                headers: {
                    'Authorization': `Bearer ${access_token}`
                }
            }
        )
            .then(({ data }) => {
                console.log(data);
                setIsReplying(false)

                results[index].reply = { comment, _id: data._id }
                setNotifications({ ...notifications, results });
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
                Reply
            </button>
        </>
    )
}

export default NotificationCommentField
