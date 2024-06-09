import React, { useContext, useEffect, useState } from 'react'

import { Link, Navigate, Outlet, useNavigate } from 'react-router-dom'

import { ThemeContext, UserContext } from '../../App';


import darkLogo from "../../assets/light_dark Images/logo-dark.png"
import lightLogo from "../../assets/light_dark Images/logo-light.png"
import _darklogo from "../../assets/new Images/logo-light.png"
import _lightlogo from "../../assets/new Images/logo-dark.png"
import logo from "../../assets/Images/logo.png"
import UserNavigationPanel from '../UserNaviagtionPanel/UserNavigationPanel';
import axios from 'axios';
import { storeInSession } from '../../common/Sessions/Sessions';







const Navbar = () => {

    const navigate = useNavigate();

    const [searchBoxVisibility, setSearchBoxVisibility] = useState(false);
    const [userNavPanel, setUserNavPanel] = useState(false)

    // getting the access of the global page CONTEXT
    const { userAuth, userAuth: { access_token, profile_img, new_notification_available }, setUserAuth } = useContext(UserContext);

    // accessing the GLOBAL WEBSITE THEME-CONTEXT
    const { theme, setTheme } = useContext(ThemeContext)

    // function handling the "userNavPanel"
    const handleUsernavPanel = () => {
        setUserNavPanel(currentState => !currentState);
    }

    // function handling the "userNavPanel" when clicked on screen
    const handleBlur = () => {
        setTimeout(() => {
            setUserNavPanel(false);
        }, 500);
    }

    // function to handle the "searchSection" when used
    const handleSearch = (e) => {
        let query = e.target.value;
        if (e.keyCode === 13 && query.length) {
            navigate(`/search/${query}`)
        }
    }



    // Checking fo th notification... once user is logged-in...
    useEffect(() => {
        if (access_token) {
            axios.get(import.meta.env.VITE_SERVER_DOMAIN + "/new-notification",
                {
                    headers: {
                        'Authorization': `Bearer ${access_token}`
                    }
                }
            )
                .then(({ data }) => {
                    console.log(data);
                    setUserAuth({ ...userAuth, ...data })
                })
                .catch(error => {
                    console.log(error);
                })
        }
    }, [access_token])
    // console.log(new_notification_available)



    // Function to handle the Change of theme
    const ChangeTheme = () => {
        const newTheme = theme === 'light' ? 'dark' : 'light'
        setTheme(newTheme);

        document.body.setAttribute("data-theme", newTheme)

        storeInSession("theme", newTheme)
    }



    return (
        <>
            <nav className="navbar z-50">
                <Link to="/" className='flex-none w-10'>
                    <img
                        src={theme === 'light' ? _darklogo : _lightlogo}
                        alt={logo}
                        className='w-full'
                    />
                </Link>

                <div className={"absoulte bg-white w-full left-0 top-full mt-0.5 border-b border-grey py-4 px-[5vw] md:border-0 md:block md:relative md:inset-0 md:p-0 md:w-auto md:show " + (searchBoxVisibility ? "show" : "hide")}>
                    <input
                        type="text"
                        placeholder='Search'
                        className='w-full md:w-auto p-4 bg-grey pl-6 pr-[12%] md:pr-6 rounded-full placeholder:text-dark-grey md:pl-12'
                        onKeyDown={handleSearch}
                    />

                    <i className="fi fi-rr-search absolute right-[10%] md:pointer-events-none md:left-5 top-1/2 -translate-y-1/2 text-dark-grey text-xl"></i>
                </div>

                <div className="flex item-center gap-3 md:gap-6 ml-auto">
                    <button
                        className='md:hidden bg-grey w-12 h-12 rounded-full flex items-center justify-center'
                        onClick={() => setSearchBoxVisibility(curr => !curr)}
                    >
                        <i className="fi fi-rr-search text-xl"></i>
                    </button>



                    <Link to="/editor" className='hidden md:flex gap-2 link'>
                        <i className="fi fi-rr-file-edit"></i>
                        <p>Write</p>
                    </Link>

                    {/* THEME CHANGING MODE.... */}
                    <button className='w-12 h-12 rounded-full bg-grey relative hover:bg-black/10' onClick={ChangeTheme}>
                        <i className={"fi fi-rr-" + (theme === 'light' ? "moon-stars" : "sun") + " text-2xl block mt-1"}></i>
                    </button>

                    {
                        access_token ? (
                            <>
                                <Link to='/dashboard/notifications'>
                                    <button className='w-12 h-12 rounded-full bg-grey relative hover:bg-black/10'>
                                        <i className="fi fi-rr-bell text-2xl block mt-1"></i>
                                        {
                                            new_notification_available && (
                                                <span className="bg-red w-3 h-3 rounded-full absolute z-10 top-2 right-2"></span>
                                            )
                                        }
                                    </button>
                                </Link>
                                <div className="relative" onClick={handleUsernavPanel} onBlur={handleBlur}>
                                    <button className="w-12 h-12 mt-1" >
                                        <img
                                            src={profile_img}
                                            alt="https://cdn-icons-png.flaticon.com/512/3237/3237472.png"
                                            className='w-full h-full object-cover rounded-full'
                                        />
                                    </button>

                                    {
                                        userNavPanel && <UserNavigationPanel />
                                    }
                                </div>
                            </>
                        ) : (
                            <>
                                <Link className='btn-dark py-2' to="/signin">
                                    Sign In
                                </Link>
                                <Link className="btn-light py-2 hidden md:block" to="signup">
                                    Sign Up
                                </Link>
                            </>
                        )
                    }

                </div>
            </nav>


            <Outlet />
        </>
    )
}

export default Navbar
