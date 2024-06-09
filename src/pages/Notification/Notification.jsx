import axios from 'axios'
import React, { useContext, useEffect, useState } from 'react'
import { UserContext } from '../../App'
import { filterPageInitationData } from '../../common/FilterPageInitation/FilterPageInitation'
import Loader from '../../components/Loader/Loader'
import NoDataPage from '../../components/NoDataPage/NoDataPage'
import PageAnimantionWrapper from '../../common/PageAnimationWrapper/PageAnimantionWrapper'
import NotificationCard from '../../components/NotificationCard/NotificationCard'
import LoadMoreDataButton from '../../components/LoadMoreDataButton/LoadMoreDataButton'





const Notification = () => {

    // all the possible filters for the user
    let filters = ['all', 'like', 'comment', 'reply']


    // accessing the GLOBAL CONTEXT of the website
    const { userAuth, userAuth: { access_token, new_notification_available }, setUserAuth } = useContext(UserContext);


    // HOOK
    // setting up the notifiactions...
    const [notifications, setNotifications] = useState(null)

    // for rendering of the notification
    const [filter, setFilter] = useState("all")

    // function to handle the filter whenever clicked
    const handleFilter = (e) => {
        const clickedButton = e.target;
        setFilter(clickedButton.innerHTML);

        setNotifications(null)
    }


    // function helping to fetch all the Notification form the server
    const fetchNotification = ({ page, deletedDocumnet = 0 }) => {

        axios.post(import.meta.env.VITE_SERVER_DOMAIN + "/notifications", { page, filter, deletedDocumnet },
            {
                headers: {
                    'Authorization': `Bearer ${access_token}`
                }
            }
        )
            .then(async ({ data: { notification: data } }) => {
                console.log(data)

                if (new_notification_available) {
                    setUserAuth({ ...userAuth, new_notification_available: false })
                }

                let formateData = await filterPageInitationData({
                    prevStateArr: notifications,
                    data,
                    page,
                    counteRoute: "/all-notifications-count",
                    data_to_send: { filter },
                    user: access_token
                })

                console.log(formateData)
                setNotifications(formateData)

            })
            .catch(error => {
                console.log(error);
            })
    }

    // Real time setting of the data for the notification page..
    useEffect(() => {
        if (access_token) {
            fetchNotification({ page: 1 })
        }
    }, [access_token, filter])



    return (
        <div>

            <h1 className="max-md:hidden">
                Recent Notifications
            </h1>

            <div className="my-8 flex gap-6">
                {
                    filters.map((filtersName, index) => {
                        return (
                            <button
                                key={index}
                                className={`py-2 ${filter === filtersName ? "btn-dark" : "btn-light"}`}
                                onClick={handleFilter}
                            >
                                {filtersName}
                            </button>
                        )
                    })
                }
            </div>


            {/* Loading all the notification.. */}
            {
                notifications === null ? (
                    <Loader />
                ) : (
                    <>
                        {
                            notifications.results.length ? (
                                notifications.results.map((notify, index) => {
                                    return (
                                        <PageAnimantionWrapper
                                            key={index}
                                            transition={{ delay: index * 0.08 }}
                                        >
                                            <NotificationCard
                                                data={notify}
                                                index={index}
                                                notificationState={{ notifications, setNotifications }}
                                            />
                                        </PageAnimantionWrapper>
                                    )
                                })
                            ) : (
                                <NoDataPage message="No Notification to show" />
                            )
                        }

                        {/* adding loadMOre Notification button */}
                        <LoadMoreDataButton
                            state={notifications}
                            fetchDataFunc={fetchNotification}
                            additionalParams={{ deletedDocumnet: notifications.deletedDocumnet }}
                        />
                    </>
                )
            }

        </div>
    )
}

export default Notification
