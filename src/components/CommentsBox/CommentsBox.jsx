import React, { useContext } from 'react'
import { BlogContext } from '../../pages/BlogPages/BlogPage'
import CommentsField from '../CommentsField/CommentsField'
import axios from 'axios'
import NoDataPage from '../NoDataPage/NoDataPage'
import PageAnimantionWrapper from '../../common/PageAnimationWrapper/PageAnimantionWrapper'
import CommentsCard from '../CommentsCard/CommentsCard'


// fetching all the comment in the post
export const fetchComments = async ({ skip = 0, blog_id, setparentCommentCount_Function, comment_array = null }) => {

    let res;

    // making the request to server for the comment-retrival of data
    await axios.post(import.meta.env.VITE_SERVER_DOMAIN + "/get-blog-comments", { blog_id, skip })
        .then(({ data }) => {
            console.log(data);

            // adding the nested comment structure.....
            data.map(comment => {
                comment.childrenLevel = 0;
            })
            console.log(data)


            setparentCommentCount_Function(preVal => preVal + data.length);

            if (comment_array === null) {
                res = { results: data }
            } else {
                res = { results: [...comment_array, ...data] }
            }
        })

    return res;
}




const CommentsBox = () => {

    // accessing the context-hook from the blog-page
    let { blog, blog: { _id, title, comments: { results: commentArray }, activity: { total_parental_comments } }, setBlog, commentWrapper, setCommentWrapper, totalParentCommentsLoaded, setTotalParentCommentsLoaded } = useContext(BlogContext)
    console.log(commentWrapper)

    // function handling the loadMore button functionality
    const loadMoreComment = async () => {
        let newCommentsArray = await fetchComments({ skip: totalParentCommentsLoaded, blog_id: _id, setparentCommentCount_Function: setTotalParentCommentsLoaded, comment_array: commentArray })
        setBlog({ ...blog, comments: newCommentsArray })
    }



    return (
        <div
            className={"max-sm:w-full fixed " + (commentWrapper ? " top-0 sm:right-0" : " top-[100%] sm:right-[-100%]") + " duration-700 max-sm:right-0 sm:top-0 w-[30%] min-w-[350px] h-full z-50 bg-white shadow-2xl p-8 px-16 overflow-y-auto overflow-x-hidden"}
        >
            <div className="relative">
                <h1 className='text-xl font-medium'>
                    Comments
                </h1>

                <p className='text-lg mt-2 w-[70%] text-dark-grey line-clamp-1'>
                    {title}
                </p>


                <button
                    className="absolute top-0 right-0 flex justify-center items-center w-12 h-12 rounded-full bg-grey duration-300"
                    onClick={() => setCommentWrapper(currentState => !currentState)}
                >
                    <i className="fi fi-br-cross text-2xl mt-1"></i>
                </button>
            </div>

            <hr className='border-grey my-8 w-[120%] -ml-10' />

            <CommentsField action="comment" />

            {/* making the present comment rendering */}
            {
                (commentArray && commentArray.length) ? (
                    commentArray.map((comment, index) => {
                        return (
                            <PageAnimantionWrapper key={index}>
                                <CommentsCard index={index} commentData={comment} leftValue={comment.childrenLevel * 4} />
                            </PageAnimantionWrapper>
                        )
                    })
                ) : (
                    <NoDataPage message="No Comments" />
                )
            }

            {/* load more comment effect [OPTIONS.....] */}
            {
                (total_parental_comments > totalParentCommentsLoaded) && (
                    <button
                        className='text-dark-grey p-2 px-3 hover:bg-grey/80 rounded-md flex items-center gap-2'
                        onClick={loadMoreComment}
                    >
                        Load More
                    </button>
                )
            }

        </div >
    )
}

export default CommentsBox
