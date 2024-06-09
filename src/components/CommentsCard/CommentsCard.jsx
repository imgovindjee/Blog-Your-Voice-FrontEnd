import React, { useContext, useState } from 'react'
import { getDateOfPublished } from '../../common/Date/Date';
import toast, { Toaster } from 'react-hot-toast';
import { UserContext } from '../../App';
import CommentsField from '../CommentsField/CommentsField';
import { BlogContext } from '../../pages/BlogPages/BlogPage';
import axios from 'axios';



const CommentsCard = ({ index, commentData, leftValue }) => {

    // getting the access of the global-context hook
    const { userAuth: { access_token, username } } = useContext(UserContext);

    // accessing the context of the blog...
    const { blog, blog: { comments, comments: { results: commentArray }, activity, activity: { total_parental_comments }, author: { personal_info: { username: blog_author_username } } }, setBlog, setTotalParentCommentsLoaded } = useContext(BlogContext)

    // Data destructuring from the commentData...
    const { commented_by: { personal_info: { profile_img, fullname, username: commented_by_username } }, commentedAt, comment, _id, children } = commentData;


    // getting the state to take a track of the user is replying or not
    const [isReplying, setIsReplying] = useState(false)


    // accessing the parent-index
    const getParentIndex = () => {
        let startingPoint = index - 1;

        try {
            while (commentArray[startingPoint].childrenLevel >= commentData.childrenLevel) {
                startingPoint--;
            }
        } catch (error) {
            startingPoint = undefined
        }

        return startingPoint;
    }




    // handing the remove CommentsCard functionality
    const removeCommentsCard = (startingPoint, isDelete = false) => {
        if (commentArray[startingPoint]) {
            while (commentArray[startingPoint].childrenLevel > commentData.childrenLevel) {
                commentArray.splice(startingPoint, 1);

                if (!commentArray[startingPoint]) {
                    break;
                }
            }
        }

        if (isDelete) {
            // geting the parent index of the comment(parent of the comment)
            let parentIndex = getParentIndex();

            if (parentIndex !== undefined) {
                commentArray[parentIndex].children = commentArray[parentIndex].children.filter(child => child !== _id)

                if (!commentArray[parentIndex].children.length) {
                    commentArray[parentIndex].isReplyLoaded = false
                }
            }

            commentArray.splice(index, 1);
        }

        if (commentData.childrenLevel === 0 && isDelete) {
            setTotalParentCommentsLoaded(currentValue => currentValue - 1)
        }

        setBlog({ ...blog, comments: { results: commentArray }, activity: { ...activity, total_parental_comments: total_parental_comments - ((commentData.childrenLevel === 0 && isDelete) ? 1 : 0) } })
    }



    // function to handle in-commnet reply
    const handleReplyClick = () => {
        if (!access_token) {
            return (
                toast.error("Please Login to Reply...")
            )
        }

        setIsReplying(currentVal => !currentVal);
    }


    // function to handle in-comment-reply hide/show functionality
    const hideReply = () => {
        commentData.isReplyLoaded = false

        // removing the replied-comment between two-comments
        removeCommentsCard(index + 1);
    }


    // function to handle load-replies button
    const loadReplies = ({ skip = 0, currentIndex = index }) => {
        console.log("click");
        if (commentArray[currentIndex].children.length) {
            hideReply();


            axios.post(import.meta.env.VITE_SERVER_DOMAIN + "/get-replies", { _id: commentArray[currentIndex]._id, skip })
                .then(({ data: { replies } }) => {
                    commentArray[currentIndex].isReplyLoaded = true

                    for (let i = 0; i < replies.length; i++) {
                        replies[i].childrenLevel = commentArray[currentIndex].childrenLevel + 1;

                        commentArray.splice(currentIndex + 1 + i + skip, 0, replies[i])
                    }

                    setBlog({ ...blog, comments: { ...comments, results: commentArray } })
                })
                .catch(error => {
                    console.log(error)
                })
        }
    }



    // function to handle the delete-comments
    const deleteComments = (e) => {
        e.target.setAttribute("disabled", true)
        console.log('click')


        axios.post(import.meta.env.VITE_SERVER_DOMAIN + "/delete-comment", { _id },
            {
                headers: {
                    'Authorization': `Bearer ${access_token}`
                }
            }
        )
            .then(() => {
                e.target.removeAttribute("disabled")

                removeCommentsCard(index + 1, true);
            })
            .catch((error) => {
                console.log(error)
                return (
                    toast.error(error?.message)
                )
            })

    }


    // functional-components for loadMOreReplies
    const LoadMoreReplies = () => {

        let parentIndex = getParentIndex()

        let button = (
            <button
                onClick={() => loadReplies({ skip: index - parentIndex, currentIndex: parentIndex })}
                className='text-dark-grey p-2 px-3 hover:bg-grey/60 rounded-md flex items-center gap-2'
            >
                Load More Replies
            </button>
        )

        if (commentArray[index + 1]) {
            if (commentArray[index + 1].childrenLevel < commentArray[index].childrenLevel) {
                if ((index - parentIndex) < commentArray[parentIndex].children.length) {
                    return button;
                }
            }
        } else {
            if (parentIndex) {
                if ((index - parentIndex) < commentArray[parentIndex].children.length) {
                    return button;
                }
            }
        }

    }





    return (
        <>
            <Toaster />
            <div
                className='w-full'
                style={{ paddingLeft: `${leftValue * 10}px` }}
            >
                <div className="my-5 p-6 rounded-md border border-grey">
                    <div className="flex gap-3 items-center mb-8">
                        <img
                            src={profile_img}
                            alt="IMG_PROFILE"
                            className='w-6 h-6 rounded-full'
                        />

                        <p className="line-clamp-1">
                            {fullname} @{commented_by_username}
                        </p>
                        <p className='min-w-fit'>
                            {getDateOfPublished(commentedAt)}
                        </p>
                    </div>


                    <p className='font-gelasio text-xl ml-3'>
                        {comment}
                    </p>

                    <div className="flex gap-5 items-center mt-5">
                        {/* creating the button for hiding the reply */}
                        {
                            commentData.isReplyLoaded ? (
                                <button
                                    className='text-dark-grey p-2 px-3 hover:bg-grey/30 rounded-md flex items-center gap-2'
                                    onClick={hideReply}
                                >
                                    <i className="fi fi-rs-comment-dots"></i>&nbsp;
                                    Hide Reply
                                </button>
                            ) : (
                                <button
                                    onClick={loadReplies}
                                    className='text-dark-grey p-2 px-3 hover:bg-grey/30 rounded-md flex items-center gap-2'
                                >
                                    <i className="fi fi-rs-comment-dots"></i> {children.length} Reply
                                </button>
                            )
                        }

                        <button
                            onClick={handleReplyClick}
                            className='underline'
                        >
                            Reply
                        </button>


                        {/* Showing the Delete Commnet option if the USER is "AUTHOR-OF-BLOG" or "AUTHOR-OF-THAT-COMMENT" */}
                        {
                            (username === commented_by_username || username === blog_author_username) && (
                                <button
                                    className='p-2 px-3 rounded-full border border-grey ml-auto hover:bg-red/30 hover:text-red flex items-center'
                                    onClick={deleteComments}
                                >
                                    <i className="fi fi-rr-trash pointer-events-none"></i>
                                </button>
                            )
                        }

                    </div>

                    {/* rendering the REPLY-BOX */}
                    {
                        isReplying && (
                            <div className="mt-8">
                                <CommentsField action="reply" replyingTo={_id} index={index} setIsReplying={setIsReplying} />
                            </div>
                        )
                    }
                </div>

                {/* button show the MOre-replies */}
                <LoadMoreReplies />


            </div>
        </>
    )
}

export default CommentsCard
