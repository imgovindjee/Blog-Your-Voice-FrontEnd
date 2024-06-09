import React, { useContext, useEffect } from 'react'

import axios from 'axios';

import { Link } from 'react-router-dom';
import { Toaster, toast } from 'react-hot-toast';

import { UserContext } from '../../App';
import { BlogContext } from '../../pages/BlogPages/BlogPage'



const BlogInteraction = () => {

    // accessing the global-context hook
    let { userAuth: { username, access_token } } = useContext(UserContext);


    // getting the data form the Blog-context hook
    let { blog, blog: { _id, title, blog_id, activity, activity: { total_likes, total_comments }, author: { personal_info: { username: auther_username } } }, setBlog, isLikedByUser, setIsLikedByUser, setCommentWrapper } = useContext(BlogContext);



    // fatching the data of current user liked the post or not in real-time while loading the page
    useEffect(() => {
        // if user is logged-in
        if (access_token) {
            // resquest to the server
            axios.post(import.meta.env.VITE_SERVER_DOMAIN + "/isliked-by-user", { _id },
                {
                    headers: {
                        'Authorization': `Bearer ${access_token}`
                    }
                }
            )
                .then(({ data: { result } }) => {
                    setIsLikedByUser(Boolean(result))
                })
                .catch(error => {
                    console.log(error)
                })
        }
    }, [])



    const handleLikeClick = () => {
        // user is logged-in
        if (access_token) {
            console.log("logged-in");
            setIsLikedByUser(currentState => !currentState);

            // updating the like count
            !isLikedByUser ? total_likes++ : total_likes--;
            setBlog({ ...blog, activity: { ...activity, total_likes } })


            axios.post(import.meta.env.VITE_SERVER_DOMAIN + "/like-blog", { _id, isLikedByUser },
                {
                    headers: {
                        'Authorization': `Bearer ${access_token}`
                    }
                }
            )
                .then(({ data }) => {
                    console.log(data)
                })
                .catch(error => {
                    console.log(error);
                })

        } else { //if user is not logged-in
            toast.error("Please Log-in to liked the blog")
        }
    }




    return (
        <>
            <Toaster />
            <hr className='border-grey my-2' />

            <div className="flex gap-6 justify-between">
                <div className="flex gap-3 items-center">
                    {/* Like */}
                    <button
                        className={`w-10 h-10 rounded-full flex items-center justify-center ${isLikedByUser ? "bg-red/20 text-red" : "bg-grey/80"}`}
                        onClick={handleLikeClick}
                    >
                        <i className={`fi ${isLikedByUser ? "fi-sr-heart" : "fi-rr-heart"}`}></i>

                    </button>
                    <p className="text-xl text-dark-grey">
                        {total_likes}
                    </p>

                    {/* Comments */}
                    <button
                        onClick={() => setCommentWrapper(prevState => !prevState)}
                        className='w-10 h-10 rounded-full flex items-center justify-center bg-grey/80'
                    >
                        <i className="fi fi-rr-comment-dots"></i>
                    </button>
                    <p className="text-xl text-dark-grey">
                        {total_comments}
                    </p>
                </div>

                <div className="flex gap-6 items-center">
                    {/* enabling the edit-button option if the user is author of teh post */}
                    {
                        username === auther_username && (
                            <Link
                                to={`/editor/${blog_id}`}
                                className='underline hover:text-purple'
                            >
                                Edit
                            </Link>
                        )
                    }


                    {/* link to post the article to the twitter */}
                    <Link
                        to={`https://twitter.com/intent/tweet?text=Read ${title}&url=${location.href}`}
                    >
                        <i className="fi fi-brands-twitter text-xl hover:text-twitter"></i>
                    </Link>
                </div>
            </div>

            <hr className='border-grey my-2' />
        </>
    )
}

export default BlogInteraction
