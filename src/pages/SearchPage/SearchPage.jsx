import React, { useEffect, useState } from 'react'

import axios from 'axios';

import { useParams } from 'react-router-dom'

import InPageNevigationEffect from '../../components/InPageNavigationEffect/InPageNevigationEffect';
import Loader from '../../components/Loader/Loader';
import PageAnimantionWrapper from '../../common/PageAnimationWrapper/PageAnimantionWrapper';
import BlogCardPost from '../../components/BlogCardPost/BlogCardPost';
import NoDataPage from '../../components/NoDataPage/NoDataPage';
import LoadMoreDataButton from '../../components/LoadMoreDataButton/LoadMoreDataButton';
import { filterPageInitationData } from '../../common/FilterPageInitation/FilterPageInitation';
import UsersCard from '../../components/UsersCard/UsersCard';



const SearchPage = () => {

    const { query } = useParams();

    const [blogs, setBlogs] = useState(null);
    const [users, setUsers] = useState(null);



    // fetching the post-blog based on the category
    const searchBlogs = ({ page = 1, create_new_array = false }) => {
        axios.post(import.meta.env.VITE_SERVER_DOMAIN + "/search-blogs", { query, page })
            .then(async ({ data }) => {
                // formating the data for the "load-more effect"
                let formatedData = await filterPageInitationData({
                    prevStateArr: blogs,
                    data: data.blogs,
                    page,
                    counteRoute: "/search-blogs-count",
                    data_to_send: { query },
                    create_new_array
                })

                setBlogs(formatedData);
            })
            .catch(error => {
                console.log(error)
            })
    }


    // function to make the user-call
    const fetchUser = () => {
        axios.post(import.meta.env.VITE_SERVER_DOMAIN + "/search-users", { query })
            .then(({ data: { users } }) => {
                setUsers(users);
            })
    }



    // function to reset-all the available state to normal
    const resetState = () => {
        setBlogs(null);
        setUsers(null);
    }


    // Real time renderig whenever the query isChanged....
    useEffect(() => {
        resetState();
        searchBlogs({ page: 1, create_new_array: true });
        fetchUser();
    }, [query])


    // functional-components for rendering the search-user components
    const SearchWrapperResults= () => {
        return (
            <>
                {
                    users === null ? (
                        <Loader />
                    ) : (
                        users.length ? (
                            users.map((user, index) => {
                                // console.log(user)
                                return (
                                    <PageAnimantionWrapper key={index} transition={{ duration: 1, delay: index * 0.08 }}>
                                        <UsersCard user={user} />
                                    </PageAnimantionWrapper>
                                )
                            })
                        ) : (
                            <NoDataPage message="No users Found" />
                        )
                    )
                }
            </>
        )
    }




    return (
        <section className="h-cover flex justify-center gap-10">
            <div className="w-full">
                <InPageNevigationEffect routes={[`Search Results from "${query}"`, "Accounts Matched"]} defaultHidden={["Accounts Matched"]}>
                    {/* rendering the search-results */}
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
                        <LoadMoreDataButton state={blogs} fetchDataFunc={searchBlogs} />
                    </>

                    {/* rendering the user-search results */}
                    <SearchWrapperResults/>
                </InPageNevigationEffect>
            </div>


            <div className="min-w-[40%] lg:min-w-[350px] max-w-min border-l border-grey pl-8 pt-3 max-md:hidden">
                <h1 className="font-medium text-xl mb-8">
                    User Related to Search&nbsp;
                    <i className="fi fi-rr-user mt-1"></i>
                </h1>
                <SearchWrapperResults/>
            </div>

        </section>
    )
}

export default SearchPage
