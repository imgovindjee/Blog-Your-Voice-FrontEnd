import React, { createContext, useEffect, useState } from 'react'

import axios from 'axios'

import { Link, useParams } from 'react-router-dom'

import PageAnimantionWrapper from '../../common/PageAnimationWrapper/PageAnimantionWrapper'
import Loader from '../../components/Loader/Loader'
import { getDateOfPublished } from '../../common/Date/Date'
import BlogInteraction from '../../components/BlogInteraction/BlogInteraction'
import BlogCardPost from '../../components/BlogCardPost/BlogCardPost'
import BlogContent from '../../components/BlogContent/BlogContent'
import CommentsBox, { fetchComments } from '../../components/CommentsBox/CommentsBox'




// default structure for the blogs-data
export const blogStructure = {
    title: '',
    description: '',
    content: [],
    banner: '',
    publishedAt: '',
    author: { personal_info: {} }
}



// creating an Context of the Blog
export const BlogContext = createContext({});




const BlogPage = () => {

    const { blog_id } = useParams();

    // State HOOKS
    // setting the blog data whenver needed using state-hook
    const [blog, setBlog] = useState(blogStructure);
    const [similarBlogs, setSimilarBlogs] = useState(null);

    const [loading, setLoading] = useState(true);

    // state to take a track of the logged-in user has liked post or not
    const [isLikedByUser, setIsLikedByUser] = useState(false);

    // state for the comment-portion, when to show and hide it
    const [commentWrapper, setCommentWrapper] = useState(false);
    const [totalParentCommentsLoaded, setTotalParentCommentsLoaded] = useState(0);

    // Destructuring the data-of-blog
    const { title, content, banner, author: { personal_info: { fullname, username: author_username, profile_img } }, publishedAt } = blog;

    // function to Fetch the blog-data 
    const fetchBlog = () => {
        axios.post(import.meta.env.VITE_SERVER_DOMAIN + "/get-blog", { blog_id })
            .then(async ({ data: { blog } }) => {
                console.log(blog)


                // adding the comment of the blog after fetching....
                blog.comments = await fetchComments({ blog_id: blog._id, setparentCommentCount_Function: setTotalParentCommentsLoaded })

                console.log(blog)

                // fetching the similar blogs form the server on the based on the "Tags"
                axios.post(import.meta.env.VITE_SERVER_DOMAIN + "/search-blogs", { tag: blog.tags[0], limit: 6, eliminate_blog: blog_id })
                    .then(({ data }) => {
                        console.log(data.blogs)
                        setSimilarBlogs(data.blogs); //holding the similar-blog to array for rendering
                    })


                setBlog(blog) // holding the particular-blog for rendering
                console.log(blog)

                setLoading(false)
            })
            .catch(error => {
                console.log(error)
            })
    }

    // function to reset-all-the-previous state
    const resetAllStates = () => {
        setBlog(blogStructure)
        setSimilarBlogs(null)
        setLoading(true)
        setIsLikedByUser(false);
        setCommentWrapper(false);
        setTotalParentCommentsLoaded(0);
    }

    // real-time updating the blog-data whenevre clicked
    useEffect(() => {
        console.log(blog_id);
        resetAllStates();
        fetchBlog()
    }, [blog_id])




    return (
        <>
            <PageAnimantionWrapper>
                {
                    loading ? (
                        <Loader />
                    ) : (
                        <BlogContext.Provider value={{ blog, setBlog, isLikedByUser, setIsLikedByUser, commentWrapper, setCommentWrapper, totalParentCommentsLoaded, setTotalParentCommentsLoaded }}>

                            {/* comments container */}
                            <CommentsBox />

                            <div className="max-w-[900px] center py-10 max-lg:px-[5vw]">
                                <img
                                    src={banner}
                                    alt="BANNER_IMG"
                                    className="aspect-video"
                                />

                                <div className="mt-12">
                                    <h2>
                                        {title}
                                    </h2>

                                    <div className='flex max-sm:flex-col justify-between my-8'>
                                        <div className="flex gap-5 items-start">
                                            <img
                                                className='w-12 h-12 rounded-full'
                                                src={profile_img}
                                                alt=""
                                            />

                                            <p className='capitalize'>
                                                {fullname}
                                                <br />
                                                @
                                                <Link to={`/user/${author_username}`}>
                                                    {author_username}
                                                </Link>
                                            </p>
                                        </div>

                                        <p className='text-dark-grey opacity-75 max-sm:mt-6 max-sm:ml-12 max-sm:pl-5'>
                                            Published on {getDateOfPublished(publishedAt)}
                                        </p>
                                    </div>
                                </div>


                                <BlogInteraction />

                                {/* Blog Content Over Here */}
                                <div className="my-12 font-galasio blog-page-content">
                                    {
                                        content[0].blocks.map((block, index) => {
                                            return (
                                                <div key={index} className="my-4 md:my-8">
                                                    <BlogContent block={block} />
                                                </div>
                                            )
                                        })
                                    }
                                </div>


                                <BlogInteraction />



                                {/* Similar Components-Blogs */}
                                {
                                    (similarBlogs !== null && similarBlogs.length) ? (
                                        <>
                                            <h1 className="text-2xl mt-14 mb-10 font-medium">
                                                Similar Blogs
                                            </h1>
                                            {
                                                similarBlogs.map((blog, index) => {
                                                    let { author: { personal_info } } = blog

                                                    return (
                                                        <PageAnimantionWrapper
                                                            key={index}
                                                            transition={{ duration: 1, delay: index * 0.08 }}
                                                        >
                                                            <BlogCardPost content={blog} author={personal_info} />
                                                        </PageAnimantionWrapper>
                                                    )
                                                })
                                            }
                                        </>
                                    ) : (
                                        ""
                                    )
                                }


                            </div>
                        </BlogContext.Provider>
                    )
                }
            </PageAnimantionWrapper>
        </>
    )
}

export default BlogPage
