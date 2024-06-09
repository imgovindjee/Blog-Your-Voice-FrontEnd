import React, { useContext } from 'react'

import { Link } from 'react-router-dom'

import pageNotFoundImage from '../../assets/Images/404.png'
import lightPageNotFoundImage from '../../assets/light_dark Images/404-light.png'
import darkPageNotFoundImage from '../../assets/light_dark Images/404-dark.png'
import fullLogo from '../../assets/Images/full-logo.png'
import lightFullLogo from "../../assets/light_dark Images/full-logo-light.png"
import darkFullLogo from "../../assets/light_dark Images/full-logo-dark.png"
import { ThemeContext } from '../../App'





const PageNotFound = () => {

    // accessing the GLOBAL THEM-context
    const { theme } = useContext(ThemeContext)

    return (
        <section className="h-cover relative p-10 flex flex-col items-center gap-20 text-center">
            <img
                src={theme === 'light' ? darkPageNotFoundImage : lightPageNotFoundImage}
                alt={pageNotFoundImage}
                className='select-non border-2 border-grey w-72 aspect-square object-cover rounded'
            />

            <h1 className="text-4xl font-gelasio leading-7">
                Page not Found ☣️
            </h1>

            <p className='text-dark-grey text-xl leading-7 -mt-8'>
                The page you are looking for doesn't exists. Head back to the&nbsp;
                <Link to="/" className='text-black underline'>
                    HOME PAGE
                </Link>
            </p>


            <div className="mt-auto">
                <img
                    src={theme === 'light' ? darkFullLogo : lightFullLogo}
                    alt={fullLogo}
                    className='h-8 object-contain bloack mx-auto select-none'
                />

                <p className='mt-5 text-dark-grey'>
                    Read Thousands of Stories around the World
                </p>
            </div>

        </section>
    )
}

export default PageNotFound
