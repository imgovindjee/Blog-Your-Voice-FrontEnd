import React, { useEffect, useState, useContext } from 'react'

import axios from 'axios'
import { useParams, Link } from 'react-router-dom'

import { UserContext } from '../../App'

import PageAnimantionWrapper from '../../common/PageAnimationWrapper/PageAnimantionWrapper'
import Loader from '../../components/Loader/Loader'
import About from '../../components/AboutComponent/About'
import { filterPageInitationData } from '../../common/FilterPageInitation/FilterPageInitation'
import InPageNevigationEffect from '../../components/InPageNavigationEffect/InPageNevigationEffect'
import BlogCardPost from '../../components/BlogCardPost/BlogCardPost'
import NoDataPage from '../../components/NoDataPage/NoDataPage'
import LoadMoreDataButton from '../../components/LoadMoreDataButton/LoadMoreDataButton'
import PageNotFound from '../404_page/PageNotFound'




export const profile_DataStructure = {
    personal_info: {
        fullname: "",
        username: "",
        profile_img: "",
        bio: "",
    },
    account_info: {
        total_posts: 0,
        total_blogs: 0,
    },
    social_links: {},
    joinedAt: "",
}




const ProfilePage = () => {

    // Accesssing the global context
    let { userAuth: { username } } = useContext(UserContext)

    // accessing the "id" form the RENDERING [Route]-page
    let { id: profileId } = useParams()

    // state to set the profile
    let [profile, setProfile] = useState(profile_DataStructure);

    // Effect set-option while fetchinig the data form the server
    let [loading, setLoading] = useState(true);

    // setting the blogs for the user-profile...
    const [blogs, setBlogs] = useState(null);
    const [profileLoaded, setProfileLoaded] = useState("");


    // data De-Structure
    let {
        personal_info: { fullname, username: profile_username, profile_img, bio },
        account_info: { total_reads, total_posts },
        social_links,
        joinedAt
    } = profile;



    // fetching the data of user form the serever
    const fetchUserProfile = () => {
        axios.post(import.meta.env.VITE_SERVER_DOMAIN + "/get-profile", { username: profileId })
            .then(({ data }) => {
                // console.log(data.user)
                // console.log(data.user._id);
                if (data.user !== null) {
                    setProfile(data.user)
                }
                setProfileLoaded(profileId)
                getBlogs({ user_id: data.user._id })
                setLoading(false)
            })
            .catch(error => {
                console.log(error);
                setLoading(false)
            })
    }

    // function helping to reset the state back to normal
    const resetStates = () => {
        setProfile(profile_DataStructure)
        setLoading(true)
        setProfileLoaded("")
    }

    // getting the all the blogs-post for the particular users
    const getBlogs = ({ page = 1, user_id }) => {
        user_id = user_id === undefined ? blogs.user_id : user_id

        axios.post(import.meta.env.VITE_SERVER_DOMAIN + "/search-blogs", {
            author: user_id,
            page
        })
            .then(async ({ data }) => {
                let formatedData = await filterPageInitationData({
                    prevStateArr: blogs,
                    data: data.blogs,
                    page,
                    counteRoute: "/search-blogs-count",
                    data_to_send: { author: user_id }
                })

                formatedData.user_id = user_id;
                console.log(formatedData);
                setBlogs(formatedData);
            })
            .catch(error => {
                console.log(error);
            })
    }



    useEffect(() => {
        if (profileId !== profileLoaded) {
            setBlogs(null);
        }
        if (blogs === null) {
            resetStates();
            fetchUserProfile();
        }
    }, [profileId, blogs]);



    return (
        <PageAnimantionWrapper>
            {
                loading ? (
                    <Loader />
                ) : (
                    profile_username.length ? (
                        <section className='h-cover md:flex flex-row-reverse items-start gap-5 min-[1100px]:gap-12'>
                            <div className="flex flex-col max-md:items-center gap-5 min-w-[250px] md:w-[50%] md:pl-8 md:border-l border-grey md:sticky md:top-[100px] md:py-10">
                                <img
                                    src={profile_img}
                                    alt=""
                                    className='w-48 h-48 bg-grey rounded-full md:w-32 md:h-32'
                                />
                                <h1 className="text-2xl font-medium">
                                    @{profile_username}
                                </h1>
                                <p className="text-xl h-6 capitalize">
                                    {fullname}
                                </p>
                                <p>
                                    {total_posts.toLocaleString()} Blogs - {total_reads.toLocaleString()} Reads
                                </p>


                                <div className="flex gap-4 mt-2">
                                    {
                                        profileId === username && (
                                            <Link
                                                to="/settings/edit-profile"
                                                className="btn-light rounded-md"
                                            >
                                                Edit Profile
                                            </Link>
                                        )
                                    }
                                </div>

                                <About className="max-md:hidden" bio={bio} social_links={social_links} joinedAt={joinedAt} />
                            </div>


                            {/* RENDERING THE BLOGS?POST OF THE USER */}
                            <div className="max-md:mt-12 w-full">
                                <InPageNevigationEffect routes={["Blogs Published", 'About']} defaultHidden={["About"]}>
                                    {/* rendering the latest blogs... */}
                                    <>
                                        {

                                            blogs === null ? (
                                                <Loader />
                                            ) : (
                                                blogs?.results?.length ? (
                                                    blogs?.results?.map((blog, index) => {
                                                        return (
                                                            <PageAnimantionWrapper key={index} transition={{ duration: 1, delay: index * 0.1 }}>
                                                                <BlogCardPost content={blog} author={blog?.author?.personal_info} />
                                                            </PageAnimantionWrapper>
                                                        )
                                                    })
                                                ) : (
                                                    <NoDataPage message={`No Blog Published...`} />
                                                )
                                            )
                                        }

                                        <LoadMoreDataButton state={blogs} fetchDataFunc={getBlogs} />
                                    </>

                                    <About bio={bio} social_links={social_links} joinedAt={joinedAt} />
                                </InPageNevigationEffect>
                            </div>



                        </section>
                    ) : (
                        <PageNotFound />
                    )
                )
            }
        </PageAnimantionWrapper>
    )
}

export default ProfilePage
