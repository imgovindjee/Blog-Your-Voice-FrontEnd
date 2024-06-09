import React, { useEffect, useState } from 'react'

import axios from 'axios'

import PageAnimantionWrapper from '../../common/PageAnimationWrapper/PageAnimantionWrapper'
import InPageNevigationEffect, { activeTabRef } from '../../components/InPageNavigationEffect/InPageNevigationEffect'
import Loader from '../../components/Loader/Loader'
import BlogCardPost from '../../components/BlogCardPost/BlogCardPost'
import TrendingSideBar_HomePage from '../../components/TrendingSideBar_HomePage/TrendingSideBar_HomePage'
import NoDataPage from '../../components/NoDataPage/NoDataPage'
import { filterPageInitationData } from '../../common/FilterPageInitation/FilterPageInitation'
import LoadMoreDataButton from '../../components/LoadMoreDataButton/LoadMoreDataButton'



const Home = () => {

    const categories = ["cooking", "food", "news", "finance", "nature", "technology", "cricket", "stocks", "travel", "movies", "science", "education"]


    // state to store the data for rendering
    const [blogs, setBlogs] = useState(null);
    const [trendingBlogs, setTrendingBlogs] = useState(null);
    const [pageState, setPageState] = useState("home");


    // fetching the post-blog from the server
    const fetchBlogFromServer = ({ page = 1 }) => {
        axios.post(import.meta.env.VITE_SERVER_DOMAIN + "/latest-blogs", { page })
            .then(async ({ data }) => {
                // console.log(data);
                // console.log(data.blogs)
                // setBlogs(data.blogs)

                // formating the data for the "load-more effect"
                let formatedData = await filterPageInitationData({
                    prevStateArr: blogs,
                    data: data.blogs,
                    page,
                    counteRoute: "/all-latest-blogs-count"
                })
                // console.log(formatedData)
                setBlogs(formatedData)
            })
            .catch((error) => {
                console.log(error)
            })
    }

    // fetching the post-blog based on the category
    const fetchBlogsByCategory = ({ page = 1 }) => {
        axios.post(import.meta.env.VITE_SERVER_DOMAIN + "/search-blogs", { tag: pageState, page })
            .then(async ({ data }) => {
                // console.log(data.blogs)
                // setBlogs(data.blogs)

                // formating the data for the "load-more effect"
                let formatedData = await filterPageInitationData({
                    prevStateArr: blogs,
                    data: data.blogs,
                    page,
                    counteRoute: "/search-blogs-count",
                    data_to_send: { tag: pageState }
                })
                // console.log(formatedData)
                setBlogs(formatedData)
            })
            .catch((error) => {
                console.log(error)
            })
    }


    // fetching the trending-blog from the server
    const fetchTrendingBlogsFromServer = () => {
        axios.get(import.meta.env.VITE_SERVER_DOMAIN + "/trending-blogs")
            .then(({ data }) => {
                // console.log(data.blogs)
                setTrendingBlogs(data.blogs)
            })
            .catch((error) => {
                console.log(error)
            })
    }



    // rendenring the blog-post on the bsic of category
    const renderTheBlogWithCategory = (e) => {
        // console.log(e);
        // console.log(e.target.innerText)

        let category = e.target.innerText.toLowerCase();
        // console.log(category);
        setBlogs(null);

        // resetting the page back to default
        // when double clicked
        if (pageState === category) {
            setPageState("home");
            return;
        }
        setPageState(category);
    }





    // activating the server-request using REAL-Time Rendering...
    useEffect(() => {
        // changing the <hr/>tag of the page whenever it is changed
        activeTabRef.current.click();

        if (pageState === 'home') {
            fetchBlogFromServer({ page: 1 });
        } else {
            fetchBlogsByCategory({ page: 1 });
        }

        if (!trendingBlogs) {
            fetchTrendingBlogsFromServer()
        }
    }, [pageState]);






    return (
        <>
            <PageAnimantionWrapper>

                <section className='h-cover flex justify-center gap-10'>
                    {/* latest blog posted */}
                    <div className="w-full">
                        <InPageNevigationEffect routes={[pageState, 'trending blogs']} defaultHidden={["trending blogs"]}>
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

                                <LoadMoreDataButton state={blogs} fetchDataFunc={pageState === "home" ? fetchBlogFromServer : fetchBlogsByCategory} />
                            </>

                            {
                                trendingBlogs === null ? (
                                    <Loader />
                                ) : (
                                    trendingBlogs.length ? (
                                        trendingBlogs.map((blog, index) => {
                                            return (
                                                <PageAnimantionWrapper key={index} transition={{ duration: 1, delay: index * 0.1 }}>
                                                    <TrendingSideBar_HomePage blog={blog} index={index} />
                                                </PageAnimantionWrapper>
                                            )
                                        })
                                    ) : (
                                        <NoDataPage message={`No Trending Blogs`} />
                                    )
                                )
                            }
                        </InPageNevigationEffect>
                    </div>

                    {/* trending or filter option on Blog-post */}
                    <div className='min-w-[40%] lg:min-w-[400px] max-w-min border-l border-grey pl-8 pt-3 max-md:hidden'>

                        <div className="flex flex-col gap-10">
                            <div>
                                <h1 className='text-xl mb-8 font-medium'>
                                    Stories From All Intrests
                                </h1>

                                <div className="flex gap-3 flex-wrap">
                                    {
                                        categories.map((cat, index) => {
                                            // console.log(cat);
                                            return (
                                                <button
                                                    key={index}
                                                    className={"tag " + (pageState === cat ? "bg-black text-white" : "")}
                                                    onClick={renderTheBlogWithCategory}
                                                >
                                                    {cat}
                                                </button>
                                            )
                                        })
                                    }
                                </div>
                            </div>

                            <div>
                                <h1 className="font-medium text-xl mb-8">
                                    Trending
                                    <i className="fi fi-rr-arrow-trend-up"></i>
                                </h1>
                                {
                                    trendingBlogs === null ? (
                                        <Loader />
                                    ) : (
                                        trendingBlogs.length ? (
                                            trendingBlogs.map((blog, index) => {
                                                return (
                                                    <PageAnimantionWrapper key={index} transition={{ duration: 1, delay: index * 0.1 }}>
                                                        <TrendingSideBar_HomePage blog={blog} index={index} />
                                                    </PageAnimantionWrapper>
                                                )
                                            })
                                        ) : (
                                            <NoDataPage message={`No Trending Blogs`} />
                                        )
                                    )
                                }
                            </div>
                        </div>

                    </div>
                </section>

            </PageAnimantionWrapper>
        </>
    )
}

export default Home
