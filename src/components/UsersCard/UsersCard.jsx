import React from 'react'

import { Link } from 'react-router-dom'




const UsersCard = ({ user }) => {

    const { personal_info: { username, profile_img, fullname } } = user

    return (
        // (/users/:username)
        <Link to={`/user/${username}`} className="flex gap-5 items-center mb-5">
            <img
                src={profile_img}
                alt="IMG"
                className='w-14 h-14 rounded-full'
            />

            <div>
                <h1 className="font-medium text-xl line-clamp-2">
                    {fullname}
                </h1>
                <p className="text-dark-grey">
                    @{username}
                </p>
            </div>
        </Link>
    )
}

export default UsersCard
