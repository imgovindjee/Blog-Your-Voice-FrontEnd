import React from 'react'

import { Link } from 'react-router-dom';

import { getDateOfPublished } from '../../common/Date/Date';


const BlogCardPost = ({ author, content }) => {

    let { publishedAt, tags, title, description, banner, activity: { total_likes }, blog_id: id } = content
    let { fullname, username, profile_img } = author;


    return (
        <Link to={`/blog/${id}`} className='flex gap-8 items-center border-b border-grey pb-5 mb-4'>
            <div className='w-full'>
                <div className="flex gap-2 items-center mb-7">
                    <img
                        src={profile_img}
                        className='w-6 h-6 rounded-full'
                    />
                    <p className="line-clamp-1">
                        {fullname} @{username}
                    </p>
                    <p className='min-w-fit'>
                        {getDateOfPublished(publishedAt)}
                    </p>
                </div>


                <h1 className="blog-title">
                    {title}
                </h1>

                <p className="my-3 text-xl font-gelasio leading-7 max-sm:hidden md:max-[1100px]:hidden line-clamp-2">
                    {description}
                </p>

                <div className='flex gap-4 mt-7'>
                    {/* {tags.map((tag, index) => {
                    return (
                        <span className="btn-light py-1px-4 mr-4" key={index}>
                            {tag}
                        </span>
                    )
                    })} */}
                    <span className="btn-light py-1px-4">
                        {tags[0]}
                    </span>
                    <span className='ml-3 flex items-center gap-2 text-dark-grey'>
                        <i className="fi fi-rr-heart text-xl"></i>
                        {total_likes}
                    </span>
                </div>
            </div>

            {/* post-Blog Banner */}
            <div className='h-28 aspect-square bg-grey'>
                <img
                    src={banner}
                    className='w-full h-full aspect-square object-cover'
                />
            </div>
        </Link>
    )
}

export default BlogCardPost
