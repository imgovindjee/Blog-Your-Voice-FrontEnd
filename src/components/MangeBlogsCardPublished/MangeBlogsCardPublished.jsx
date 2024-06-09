import React, { useContext, useState } from 'react'
import { Link } from 'react-router-dom'
import { getFullDay } from '../../common/Date/Date'
import { UserContext } from '../../App'
import axios from 'axios'



const BlogStats = ({ stats }) => {
    return (
        <div className='flex gap-2 max-lg:mb-6 max-lg:pb-4 border-grey max-lg:border-b'>
            {
                Object.keys(stats).map((key, index) => {
                    return (
                        !key.includes("parental") && (
                            <div
                                key={index}
                                className={'flex flex-col items-center w-full h-full justify-center p-4 px-6 ' + (index !== 0 && "border-grey border-l")}
                            >
                                <h1 className='text-xl lg:text-2xl mb-2'>
                                    {stats[key].toLocaleString()}
                                </h1>
                                <p className='capitalize max-lg:text-dark-grey'>
                                    {key.split("_")[1]}
                                </p>
                            </div>
                        )
                    )
                })
            }
        </div>
    )
}



// Handles the Published Blogs Card
export const MangeBlogsCardPublished = ({ blog }) => {

    // accessing the GLOBAL CONTEXT of the WEBSITE
    const { userAuth: { access_token } } = useContext(UserContext);

    // destructuring the data
    const { banner, blog_id, title, publishedAt, activity } = blog;

    // hooks
    const [showStats, setShowStats] = useState(false);



    return (
        <>
            <div className="flex gap-10 border-b mb-6 max-md:px-4 border-grey pb-6 items center">

                <img
                    src={banner}
                    alt="BANNER"
                    className='max-md:hidden lg:hidden xl-block w-28 h-28 flex-none bg-grey object-cover rounded'
                />

                <div className="flex flex-col justify-between py-2 w-full min-w-[300px]">
                    <div>
                        <Link
                            to={`/blog/${blog_id}`}
                            className='blog-title mb-4 hover:text-dark-grey hover:underline'
                        >
                            {title}
                        </Link>

                        <p className='line-clamp-1'>
                            Published on {getFullDay(publishedAt)}
                        </p>
                    </div>

                    {/* giving the user-AUTHOR for manage their blogs.. */}
                    <div className="flex gap-6 mt-3">
                        <Link
                            to={`/editor/${blog_id}`}
                            className='pr-4 py-2'
                        >
                            <i className="fi fi-rr-file-edit"></i>
                            &nbsp;<span className='underline'>Edit</span>
                        </Link>

                        <button
                            className='lg-hidden pr-4 py-2 underline'
                            onClick={() => setShowStats(currentVal => !currentVal)}
                        >
                            Stats
                        </button>

                        <button
                            className='pr-4 py-2 underline text-red'
                            onClick={(e) => handleDeleteBlog(blog, access_token, e.target)}
                        >
                            Delete
                        </button>
                    </div>
                </div>

                {/* showing the stats.. */}
                <div className='max-lg:hidden'>
                    <BlogStats stats={activity} />
                </div>

            </div>

            {/* showing the below lager screen stats.. */}
            {
                showStats && (
                    <div className='lg:hidden'>
                        <BlogStats stats={activity} />
                    </div>
                )
            }
        </>
    )
}






// CARD FOR RENDERING THE DRAFTS BLOG CARD...
export const MangeBlogsCardDrafts = ({ blog }) => {

    // accessing the GLOBAL CONTEXT of the WEBSITE
    const { userAuth: { access_token } } = useContext(UserContext);

    // destructuring the data of the BLOGS
    const { title, description, blog_id, index } = blog

    return (
        <div className='flex gap-5 lg:gap-10 pb-6 border-b mb-6 border-grey'>

            <h1 className='blog-index text-center pl-4 md:pl-6 flex-none'>
                {
                    index < 9 ? (
                        "0" + (index + 1)
                    ) : (
                        index + 1
                    )
                }
            </h1>

            {/* Displying all the Details of the DRAFT-BLOGS */}
            <div>

                <h1 className='blog-title mb-3'>
                    {title}
                </h1>
                <p className='line-clamp-2 font-gelasio'>
                    {
                        description.length ? (
                            description
                        ) : (
                            "No Description"
                        )
                    }
                </p>


                <div className='flex gap-6 mt-3'>
                    <Link
                        to={`/editor/${blog_id}`}
                        className='pr-4 py-2'
                    >
                        <i className="fi fi-rr-file-edit"></i>
                        &nbsp;<span className='underline'>Edit</span>
                    </Link>

                    <button
                        className='pr-4 py-2 underline text-red'
                        onClick={(e) => handleDeleteBlog(blog, access_token, e.target)}
                    >
                        Delete
                    </button>
                </div>

            </div>


        </div>
    )
}





// FUNCTION TO HANDLE THE DELETING OF THE BLOGS
const handleDeleteBlog = (blog, access_token, target) => {

    // destructuring the data...
    let { index, blog_id, setStateFun } = blog

    target.setAttribute("disabled", true)

    axios.post(import.meta.env.VITE_SERVER_DOMAIN + "/delete-blog", { blog_id },
        {
            headers: {
                'Authorization': `Bearer ${access_token}`
            }
        }
    )
        .then(({ data }) => {
            target.removeAttribute("disabled")

            // setting adding up the new values in the PAGE..
            setStateFun((currentVal) => {
                // destructuring the data...
                let { deletedDocumnet, totalDocs, results } = currentVal

                results.splice(index, 1);

                if (!deletedDocumnet) {
                    deletedDocumnet = 0;
                }

                if (!results.length && totalDocs - 1 > 0) {
                    return null;
                }

                return { ...currentVal, totalDocs: totalDocs - 1, deletedDocumnet: deletedDocumnet + 1 }
            })
        })
        .catch(error => {
            console.log(error);
        })
}
