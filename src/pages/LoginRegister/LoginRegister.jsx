import React, { useContext, useRef } from 'react'

import axios from 'axios'
import { Link, Navigate } from 'react-router-dom'
import { Toaster, toast } from 'react-hot-toast'


import { UserContext } from '../../App'
import { googleAuth } from '../../common/FireBaseSetUp/FirebaseSetup'

import Input from '../../components/InputBox/Input'
import PageAnimantionWrapper from '../../common/PageAnimationWrapper/PageAnimantionWrapper'
import { storeInSession } from '../../common/Sessions/Sessions'


import google_icon from "../../assets/Images/google.png"



const LoginRegister = ({ type }) => {

    // selecting the html content
    const authForm = useRef();


    // regex for email
    let emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    // regex for password
    let passwordRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,20}$/;



    // using the context-Hook
    let { userAuth: { access_token }, setUserAuth } = useContext(UserContext)
    // console.log(access_token);


    // function to handle the send data to DB
    const userAuthThroughServer = (serverRoute, _formData) => {

        axios.post(import.meta.env.VITE_SERVER_DOMAIN + serverRoute, _formData)
            .then(({ data }) => {
                console.log(data)
                toast.success(data.message);
                storeInSession("user", JSON.stringify(data.user_info)); //stroing the data to session
                console.log(sessionStorage);
                setUserAuth(data?.user_info); //setting up with the new sessionStorage
            })
            .catch(({ response }) => {
                // console.log(response)
                toast.error(response.data.message)
            })
    }



    // Making form submit from the frontend to backend
    const handleSubmit = (e) => {
        e.preventDefault();

        // retriving the details inside the form(signin/signup)
        // NOTE:- SELECTING THE HTML-ELEMENT using "id"->"formElement"
        let form = new FormData(formElement)
        let _formData = {};
        for (let [key, value] of form.entries()) {
            _formData[key] = value;
        }
        console.log(_formData);

        let { fullname, email, password } = _formData;

        // validating the data from the frontend
        // 1. name of the user is valid or not
        if ((fullname || type === "SIGN UP") && fullname.length < 3) { // making valid for both signin and signUp page
            return toast.error("Fullname must contains atleast 3-letters")
        }

        // 2. email entered by the user is valid or not
        if (!email.length || !emailRegex.test(email)) {
            return toast.error("Enter E-mail")
        }
        if (!emailRegex.test(email)) {
            return toast.error("Invalid E-mail")
        }

        // 3. password entered by user is valid or not
        if (!password.length || !passwordRegex.test(password)) {
            return toast.error("password should be 6-20 characters long with a NUMERIC, 1-LOWERCASE and 1-UPPERCASE")
        }


        // function-call
        // to handle the DB-data-store REQUEST
        let serverRoute = type === "SIGN IN" ? "/signin" : "/signup";
        userAuthThroughServer(serverRoute, _formData);
    }




    // handling the google auth using firebase
    const handleGoogleAuth = (e) => {
        e.preventDefault();

        googleAuth()
            .then((user) => {
                let serverRoute = "/google-auth"
                // console.log(user)
                let _formData = {
                    access_token: user.accessToken
                }
                userAuthThroughServer(serverRoute, _formData);
            })
            .catch((error) => {
                toast.error("Trouble login using Google")
                return console.log(error)
            })
    }





    return (
        <>
            {
                access_token ? (
                    <Navigate to="/" />
                ) : (
                    <PageAnimantionWrapper keyValue={type}>

                        <section className="h-cover flex items-center justify-center">
                            <Toaster />
                            <form id="formElement" className='w-[80%] max-w-[400px]'>
                                {/* mb-24 */}
                                <h1 className='text-center text-4xl capitalize font-gelasio mb-12'>
                                    {
                                        type === "SIGN IN" ? (
                                            "WELCOME BACK"
                                        ) : (
                                            "JOIN US NOW, GET CONNECTED"
                                        )
                                    }
                                </h1>

                                {
                                    type === "SIGN UP" ? (
                                        <Input name="fullname" type="text" placeholder="Full Name" id="fullname" icon_name="fi-rr-user" />
                                    ) : (
                                        ""
                                    )
                                }
                                <Input name="email" type="email" placeholder="Email" icon_name="fi-rr-envelope" id="email" />
                                <Input name="password" type="password" placeholder="Password" icon_name="fi-rr-key" id="password" />



                                <button
                                    className='btn-dark center mt-14'
                                    type='submit'
                                    onClick={handleSubmit}
                                >
                                    {type}
                                </button>

                                {/* my-10 */}
                                <div className="relative w-full flex items-center gap-2 my-6 opacity-10 uppercase text-black font-bold">
                                    <hr className="w-1/2 border-black" />
                                    <p style={{ color: "red" }}>or</p>
                                    <hr className="w-1/2 border-black" />
                                </div>

                                <button
                                    className="btn-dark flex items-center justify-center gap-4 w-[90%] center"
                                    onClick={handleGoogleAuth}
                                >
                                    <img
                                        src={google_icon}
                                        alt="GOOGLE"
                                        className='w-5'
                                    />
                                    continue With Google
                                </button>


                                {
                                    type === "SIGN IN" ? (
                                        <p className='mt-6 text-dark-grey text-xl text-center'>
                                            Don't have an account?&nbsp;
                                            <Link to="/signup" className="underline text-black text-xl ml-1">
                                                JOIN US TODAY
                                            </Link>
                                        </p>
                                    ) : (
                                        <p className='mt-6 text-dark-grey text-xl text-center'>
                                            Already a member?&nbsp;
                                            <Link to="/signin" className="underline text-black text-xl ml-1">
                                                Sign in here
                                            </Link>
                                        </p>
                                    )
                                }

                            </form>

                        </section>

                    </PageAnimantionWrapper>
                )
            }
        </>
    )
}

export default LoginRegister
