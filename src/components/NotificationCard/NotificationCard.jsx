import P from '@editorjs/image'
import React, { useContext, useState } from 'react'
import { Link } from 'react-router-dom'
import { getFullDay } from '../../common/Date/Date'
import NotificationCommentField from '../NotificationCommentField/NotificationCommentField'
import { UserContext } from '../../App'
import axios from 'axios'

const NotificationCard = ({ data, index, notificationState }) => {

    const { userAuth: { username: author_username, profile_img: author_profile_img, access_token, fullname: author_fullname } } = useContext(UserContext);

    // Destructuring the "data" of the notification...
    const { blog: { _id, blog_id, title }, user, user: { personal_info: { profile_img, fullname, username } }, type, comment, replied_on_comment, createdAt, _id: notification_id, reply, seen } = data
    const { notifications, notifications: { results, totalDocs }, setNotifications } = notificationState;

    // hooks
    // setting the state for the replying..
    const [isReplying, setIsReplying] = useState(false)

    // function to handle the reply click button... on the notification page
    const handleReplyClick = () => {
        setIsReplying(currnetVal => !currnetVal)
    }

    // function to handle the delete comments or reply in Notification
    const handleDelete = (comment_id, type, target) => {
        target.setAttribute("disabled", true)

        axios.post(import.meta.env.VITE_SERVER_DOMAIN + "/delete-comment", { _id: comment_id },
            {
                headers: {
                    'Authorization': `Bearer ${access_token}`
                }
            }
        )
            .then(() => {
                if (type == "comment") {
                    results.splice(index, 1);
                } else {
                    delete results[index].reply
                }

                target.removeAttribute("disabled")
                setNotifications({ ...notifications, results, totalDocs: totalDocs - 1, deletedDocumnet: notifications.deletedDocumnet + 1 })
            })
            .catch(error => {
                console.log(error);
            })
    }


    return (
        // {border-l-2}----- at {!seen}
        <div className={'p-6 mb-2 border-b border-grey border-l-black ' + (!seen && "bg-grey")}>
            <div className="flex gap-5 mb-3">
                <img
                    src={profile_img}
                    alt="IMG PROFILE"
                    className='w-14 h-14 flex-none rounded-full'
                />

                <div className="w-full">
                    <h1 className='font-medium text-xl text-dark-grey'>
                        <span className='lg:inline-block hidden capitalize'>
                            {fullname}
                        </span>
                        <Link
                            to={`/user/${username}`}
                            className='mx-1 text-black underline'
                        >
                            @{username}
                        </Link>


                        {/* type of notification */}
                        <span className='font-normal'>
                            {
                                type == 'like' ? (
                                    "liked your blog"
                                ) : (
                                    type == 'comment' ? (
                                        "commented on"
                                    ) : (
                                        "replied on"
                                    )
                                )
                            }
                        </span>
                    </h1>




                    {
                        type === 'reply' ? (
                            <div className='p-4 mt-4 rounded-md bg-grey'>
                                <p>
                                    {replied_on_comment.comment}
                                </p>
                            </div>
                        ) : (
                            <Link
                                to={`/blog/${blog_id}`}
                                className='font-medium text-dark-grey hover:text-black line-clamp-2'
                            >
                                {
                                    `"${title}"`
                                }
                            </Link>
                        )
                    }

                </div>
            </div>


            {
                type !== "like" && (
                    <p className='ml-14 pl-5 font-gelasio text-xl my-5'>
                        {comment.comment}
                    </p>
                )
            }


            <div className="ml-14 pl-5 mt-5 text-dark-grey flex gap-8">
                <p>
                    {getFullDay(createdAt)}
                </p>

                {/* OPtion to reply to the comment or delet the comment */}
                {
                    type !== 'like' && (
                        <>
                            {
                                !reply && (
                                    <button className='underline hover:text-black' onClick={handleReplyClick}>
                                        Reply
                                    </button>
                                )
                            }
                            <button
                                className='underline hover:text-black'
                                onClick={(e) => handleDelete(comment._id, "comment", e.target)}
                            >
                                Delete
                            </button>
                        </>
                    )
                }
            </div>

            {/* if user wnat to reply to some notification the... */}
            {
                isReplying && (
                    <div className='mt-8'>
                        <NotificationCommentField
                            _id={_id}
                            blog_author={user}
                            index={index}
                            replyingTo={comment._id}
                            setIsReplying={setIsReplying}
                            notification_id={notification_id}
                            notificationData={notificationState}
                        />
                    </div>
                )
            }

            {
                reply && (
                    <div className="ml-20 p-5 bg-grey mt-5 rounded-md">
                        <div className="flex gap-3 mb-3">
                            <img
                                src={author_profile_img}
                                alt="IMG PROFILE"
                                className='w-8 h-8 rounded-full'
                            />

                            <div>
                                <h1 className='font-medium text-xl text-dark-grey'>
                                    <Link to={`/user/${author_username}`} className='mx-1 text-black underline'>
                                        @{author_username}
                                    </Link>

                                    <span className="font-normal">
                                        replied to
                                    </span>

                                    <Link to={`/user/${username}`} className='mx-1 text-black underline'>
                                        @{username}
                                    </Link>
                                </h1>
                            </div>
                        </div>

                        <p className="ml-14 font-gelasio text-xl my-2">
                            {reply.comment}
                        </p>

                        <button
                            className='underline text-dark-grey hover:text-black ml-14 mt-2'
                            onClick={(e) => handleDelete(comment._id, "reply", e.target)}
                        >
                            Delete
                        </button>
                    </div>
                )
            }

        </div>
    )
}

export default NotificationCard
