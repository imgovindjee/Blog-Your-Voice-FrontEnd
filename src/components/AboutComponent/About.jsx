import React from 'react'


import { Link } from 'react-router-dom';


import { getFullDay } from '../../common/Date/Date';



const About = ({ bio, social_links, joinedAt, className }) => {
    return (
        <div className={"md:w-[90%] md:mt-7 " + className}>
            <p className="text-xl leading-7">
                {
                    bio.length ? (
                        bio
                    ) : (
                        "Nothing to Read Here..."
                    )
                }
            </p>

            <div className="flex gap-x-7 gap-y-2 flex-wrap my-7 items-center text-dark-grey">
                {
                    Object.keys(social_links).map((key) => {
                        let link = social_links[key];

                        return (
                            link && (
                                <Link to={link} target="_blank" key={key}>
                                    <i className={"fi " + (key !== "website" ? "fi-brands-" + key : "fi-rr-globe") + " text-2xl hover:text-black"}></i>
                                </Link>
                            )
                        )
                    })
                }
            </div>

            <p className='text-xl leading-7 text-dark-grey'>
                Joined On&nbsp;
                {getFullDay(joinedAt)}
            </p>
        </div>
    )
}

export default About
