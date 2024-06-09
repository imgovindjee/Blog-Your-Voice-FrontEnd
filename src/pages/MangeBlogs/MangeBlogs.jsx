import React, { useContext, useEffect, useState } from 'react'
import axios from 'axios'
import { UserContext } from "../../App"
import { filterPageInitationData } from '../../common/FilterPageInitation/FilterPageInitation';
import { Toaster } from 'react-hot-toast';
import InPageNevigationEffect from '../../components/InPageNavigationEffect/InPageNevigationEffect';
import NoDataPage from '../../components/NoDataPage/NoDataPage';
import PageAnimantionWrapper from '../../common/PageAnimationWrapper/PageAnimantionWrapper';
import Loader from '../../components/Loader/Loader';
import { MangeBlogsCardPublished } from '../../components/MangeBlogsCardPublished/MangeBlogsCardPublished.jsx';
import { MangeBlogsCardDrafts } from '../../components/MangeBlogsCardPublished/MangeBlogsCardPublished.jsx';
import LoadMoreDataButton from '../../components/LoadMoreDataButton/LoadMoreDataButton.jsx';
import { useSearchParams } from 'react-router-dom';



const MangeBlogs = () => {

    // accessing the GLOBAL-WEBSITE context
    const { userAuth: { access_token } } = useContext(UserContext);

    // Hooks
    // Setting the default values for the some DATA-Details Containers
    const [blogs, setBlogs] = useState(null)
    const [query, setQuery] = useState("")
    const [drafts, setDrafts] = useState(null)

    // getting some Queries form the URL of the DRAFT PAGE
    let activeTab = useSearchParams()[0].get("tab")
    console.log(activeTab);
    console.log(activeTab != 'drafts' ? 0 : 1);

    // getting all the blogs.. form the server[backend]
    const getBlogs = ({ page, draft, deletedDocumnet = 0 }) => {
        axios.post(import.meta.env.VITE_SERVER_DOMAIN + "/user-written-blogs",
            { page, draft, query, deletedDocumnet },
            {
                headers: {
                    'Authorization': `Bearer ${access_token}`
                }
            }
        )
            .then(async ({ data }) => {
                console.log(data)

                // formating the data..
                let formateData = await filterPageInitationData({
                    prevStateArr: draft ? drafts : blogs,
                    data: data.blogs,
                    page,
                    user: access_token,
                    counteRoute: "/user-written-blogs-count",
                    data_to_send: { draft, query }
                })
                console.log(formateData)

                // setting the blogs-data basic of [published, to-be-published(draft)]
                if (draft) {
                    setDrafts(formateData)
                } else {
                    setBlogs(formateData)
                }
            })
            .catch(error => {
                console.log(error);
            })
    }


    // Real-time rendering of the blogs whenever their is change in the [...]
    useEffect(() => {
        // runs only if
        // user-is loggedin
        if (access_token) {
            if (blogs === null) {
                getBlogs({ page: 1, draft: false });
            }
            if (drafts === null) {
                getBlogs({ page: 1, draft: true })
            }
        }
    }, [access_token, blogs, drafts, query])



    // function to handle the search input "query" change 
    const handleChangeSearch = (e) => {
        if (!e.target.value.length) {
            setQuery("")
            setBlogs(null)
            setDrafts(null)
        }
    }


    // function to handle the search WHENEVER THE "key-is-down"
    // major WORK IS TO UPDATE THE "query state" of the input...
    const handleKeyDownSearch = (e) => {
        // setting up the USER-SEARCHED in the "query-state"
        let querySearch = e.target.value
        setQuery(querySearch);

        // New Search setUp... for upcomming data
        if (e.keyCode == 13 && querySearch.length) {
            setBlogs(null)
            setDrafts(null)
        }
    }




    return (
        <>

            <h1 className='max-md:hidden'>
                Manage Blogs
            </h1>

            <Toaster />

            <div className='relative max-md:mt-5 md:mt-8 mb-10'>
                <input
                    type="search"
                    placeholder="Search Blogs"
                    className="w-full bg-grey p-4 pl-12 pr-6 rounded-full placeholder:text-dark-grey"
                    onChange={handleChangeSearch}
                    onKeyDown={handleKeyDownSearch}
                />
                <i className="fi fi-rr-search absolute right-[10%] md:pointer-events-none md:left-5 top-1/2 -translate-y-1/2 text-xl"></i>
            </div>


            {/* Rendering the "Published" or "Draft" components.. */}
            <InPageNevigationEffect
                routes={["Published Blogs", "Drafts Blogs"]}
                defaultActiveIndex={activeTab != 'drafts' ? 0 : 1}
            >

                {/* published blogs */}
                {
                    blogs === null ? (
                        <Loader />
                    ) : (
                        blogs.results.length ? (
                            <>
                                {
                                    blogs.results.map((blog, index) => {
                                        return (
                                            <PageAnimantionWrapper
                                                key={index}
                                                transition={{ delay: index * 0.04 }}
                                            >
                                                <MangeBlogsCardPublished blog={{ ...blog, index: index, setStateFun: setBlogs }} />
                                            </PageAnimantionWrapper>
                                        )
                                    })
                                }

                                {/* Loading the Load-More Buttons */}
                                <LoadMoreDataButton
                                    state={blogs}
                                    fetchDataFunc={getBlogs}
                                    additionalParams={{ draft: false, deletedDocumnet: blogs.deletedDocumnet }}
                                />
                            </>
                        ) : (
                            <NoDataPage message="No Blogs Published" />
                        )
                    )
                }







                {/* Drafts blogs */}
                {
                    drafts === null ? (
                        <Loader />
                    ) : (
                        drafts.results.length ? (
                            <>
                                {
                                    drafts.results.map((blog, index) => {
                                        return (
                                            <PageAnimantionWrapper
                                                key={index}
                                                transition={{ delay: index * 0.04 }}
                                            >
                                                <MangeBlogsCardDrafts blog={{ ...blog, index: index, setStateFun: setDrafts }} />
                                            </PageAnimantionWrapper>
                                        )
                                    })
                                }

                                {/* Load More Buttons Functionality */}
                                <LoadMoreDataButton
                                    state={drafts}
                                    fetchDataFunc={getBlogs}
                                    additionalParams={{ draft: true, deletedDocumnet: drafts.deletedDocumnet }}
                                />
                            </>
                        ) : (
                            <NoDataPage message="No Drafts-Blogs Published" />
                        )
                    )
                }
            </InPageNevigationEffect>

        </>
    )
}

export default MangeBlogs
