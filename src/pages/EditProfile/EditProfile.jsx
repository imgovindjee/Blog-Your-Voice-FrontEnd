import React, { useContext, useEffect, useRef, useState } from 'react'
import { UserContext } from '../../App'
import axios from 'axios';
import { profile_DataStructure } from '../ProfilePages/ProfilePage';
import PageAnimantionWrapper from '../../common/PageAnimationWrapper/PageAnimantionWrapper';
import Loader from '../../components/Loader/Loader';
import toast, { Toaster } from 'react-hot-toast';
import Input from '../../components/InputBox/Input';
import { uploadImage } from '../../common/AWS_Setup/AWS_Setup';
import { storeInSession } from '../../common/Sessions/Sessions';
import { data } from 'autoprefixer';




const bioLimit = 200;



const EditProfile = () => {

    // accessing the GLOBAL-CONTEXT of the SITE
    const { userAuth, userAuth: { access_token }, setUserAuth } = useContext(UserContext);

    // setting up the profile-data in 
    // STATE HOOK
    const [profile, setProfile] = useState(profile_DataStructure)

    // effetcct for rendering the loading amination on the page...
    const [loading, setLoading] = useState(true)

    // Bio limit seting property..
    const [characterLeft, setCharacterLeft] = useState(bioLimit);

    // destructing the data form the profile-STATE
    const { personal_info: { fullname, username: profile_username, profile_img, bio, email }, social_links } = profile


    // Reference for the HTML components
    let profileImageRef = useRef()
    let editProfileForm = useRef()



    // state to connect the profile imga nad upload imag button
    const [updateProfileImage, setUpdatedProfileImage] = useState(null)

    // REAL-TIME Rendering of the data
    // Fetching the Data of user-login profile
    useEffect(() => {
        // getting the data only if user is logged-in...
        if (access_token) {
            axios.post(import.meta.env.VITE_SERVER_DOMAIN + "/get-profile", { username: userAuth.username })
                .then(({ data: { user } }) => {
                    console.log(user);
                    setProfile(user);
                    setLoading(false)
                })
                .catch((error) => {
                    console.log(error)
                })
        }
        console.log(profile)
    }, [access_token]);



    // setting the charctaerLimit-left for the bio
    const handleOnChangeCharacter = (e) => {
        setCharacterLeft(bioLimit - e.target.value.length)
    }


    // function handling profile photo update
    const handleProfileImageUpload = (e) => {
        console.log(e);
        console.log(e.target.files);
        console.log(e.target.files[0]);


        let img = (e.target.files[0]);

        const reader = new FileReader();
        reader.onload = () => {
            profileImageRef.current.src = reader.result;
            setUpdatedProfileImage(img);
        };
        reader.readAsDataURL(img)

        // console.log(img);
        // console.log(typeof img); // Should be "object"
        // console.log(img instanceof File); // Should be true
        // console.log(img instanceof Blob); // Should be true

        // profileImageRef.current.src = URL.createObjectURL(e.target.files["length"]);
        // setUpdatedProfileImage(img);
    }


    // function to update profile image..
    const handleImageUploadFunction = (e) => {
        e.preventDefault();

        // Runs when and only if "uploadProfileImage" is not "NULL"
        if (updateProfileImage) {
            let loadingToast = toast.loading("Uploading...")

            e.target.setAttribute("disabled", true);

            // making AWS request for storing the newProfile Image
            uploadImage(updateProfileImage)
                .then(url => {
                    console.log(url);
                    if (url) {
                        axios.post(import.meta.env.VITE_SERVER_DOMAIN + "/update-profile-img", { url },
                            {
                                headers: {
                                    'Authorization': `Bearer ${access_token}`
                                }
                            }
                        )
                            .then(({ data }) => {
                                console.log(data);
                                let newUserAuth = { ...userAuth, profile_img: data.profile_img }

                                storeInSession("user", JSON.stringify(newUserAuth))

                                setUserAuth(newUserAuth)
                                setUpdatedProfileImage(null)
                                toast.dismiss(loadingToast)
                                e.target.removeAttribute("disabled")
                                toast.success("Uploaded🎊")
                            })
                            .catch(({ response }) => {
                                toast.dismiss(loadingToast)
                                e.target.removeAttribute("disabled")
                                toast.error(response.data._message)
                            })
                    }
                })
                .catch(error => {
                    console.log(error)
                })
        }
    }




    // submitting the form with all the values of the field that user wants to update
    const handleSubmit = (e) => {
        e.preventDefault();

        // making the formData in the suitable manner
        let form = new FormData(editProfileForm.current);
        let formData = {}
        for (let [key, value] of form.entries()) {
            formData[key] = value
        }
        console.log(formData)

        // DeStructuring the Dtat from the formData..
        let { username, bio, youtube, facebook, instagram, github, website, twitter } = formData

        // SOME EDGE CASE CHECK...
        if (username.length < 3) {
            return (
                toast.error("Username must be of atleast 3 character length")
            )
        }
        if (bio.length > bioLimit) {
            return (
                toast.error(`Bio Shouldn't exceed more than ${bioLimit}`)
            )
        }



        // updating the data to the serevr witth server request...
        const loadingToast = toast.loading("Updating...")
        e.target.setAttribute("disabled", true)

        axios.post(import.meta.env.VITE_SERVER_DOMAIN + "/update-profile",
            {
                username,
                bio,
                social_links: { youtube, facebook, instagram, github, twitter, website }
            },
            {
                headers: {
                    'Authorization': `Bearer ${access_token}`
                }
            }
        )
            .then(({ data }) => {
                if (userAuth.username !== data.username) {
                    let newUserAuth = { ...userAuth, username: data.username }

                    storeInSession("user", JSON.stringify(newUserAuth))

                    setUserAuth(newUserAuth)
                }

                toast.dismiss(loadingToast)
                e.target.removeAttribute("disabled")
                toast.success("Profile Updated 🎊")
            })
            .catch(({ response }) => {
                toast.dismiss(loadingToast)
                e.target.removeAttribute("disabled")
                toast.error(response.data.message);
            })
    }




    return (
        <>
            <PageAnimantionWrapper>

                {
                    loading ? (
                        <Loader />
                    ) : (
                        <form ref={editProfileForm}>
                            <Toaster />

                            <h1 className='max-md:hidden'>
                                Edit Profile
                            </h1>

                            <div className="flex flex-col lg:flex-row items-start py-10 gap-8 lg:gap-10">
                                <div className="max-lg:center mb-5">
                                    <label
                                        htmlFor='uploadImg'
                                        id='profileImgLable'
                                        className='relative block w-48 h-48 bg-grey rounded-full overflow-hidden'
                                    >
                                        {/* craeting an hover Effect */}
                                        <div className="w-full h-full absolute top-0 left-0 flex items-center justify-center text-white bg-black/30 opacity-0 hover:opacity-100 cursor-pointer">
                                            Upload Image
                                        </div>

                                        <img
                                            ref={profileImageRef}
                                            src={profile_img}
                                        />
                                    </label>

                                    <input
                                        type="file"
                                        id='uploadImg'
                                        accept='.jpeg, .png, .jpg'
                                        hidden
                                        onChange={handleProfileImageUpload}
                                    />
                                    <button
                                        className='btn-light mt-5 max-lg:center lg:w-full px-10'
                                        onClick={handleImageUploadFunction}
                                    >
                                        Upload
                                    </button>
                                </div>


                                <div className="w-full">
                                    <div className="grid grid-cols-1 md:grid-cols-2 md:gap-5">
                                        <div>
                                            <Input
                                                name={fullname}
                                                type="text"
                                                value={fullname}
                                                placeholder="FullName"
                                                disabled={true}
                                                icon_name="fi-rr-user"
                                            />
                                        </div>
                                        <div>
                                            <Input
                                                name={email}
                                                type="email"
                                                value={email}
                                                placeholder="Email"
                                                disabled={true}
                                                icon_name="fi-rr-envelope"
                                            />
                                        </div>
                                    </div>


                                    <Input
                                        name="username"
                                        type="text"
                                        value={profile_username}
                                        placeholder="Username"
                                        icon_name="fi-rr-at"
                                    />
                                    <p className="text-dark-grey -mt-3">
                                        Username will use to search user and will be visible to all users.
                                    </p>


                                    <textarea
                                        name="bio"
                                        maxLength={bioLimit}
                                        placeholder="Bio..."
                                        defaultValue={bio}
                                        className='input-box h-64 lg:h-40 resize-none leading-7 mt-5 pl-5'
                                        onChange={handleOnChangeCharacter}
                                    ></textarea>
                                    <p className='mt-1 text-dark-grey'>
                                        {characterLeft} characters Left
                                    </p>


                                    {/* Rendering the Social Sites... */}
                                    <p className="my-6 text-dark-grey">
                                        Add Your Social handles Below..
                                    </p>
                                    <div className="md:grid md:grid-cols-2 gap-x-6">
                                        {
                                            Object.keys(social_links).map((key, index) => {
                                                let link = social_links[key];
                                                return (
                                                    <Input
                                                        key={index}
                                                        name={key}
                                                        type="text"
                                                        value={link}
                                                        placeholder={`https://${key}.com`}
                                                        icon_name={"fi " + (key !== 'website' ? "fi-brands-" + key : "fi-rr-globe")}
                                                    />
                                                )
                                            })
                                        }
                                    </div>

                                    <button
                                        className='btn-dark w-auto px-10'
                                        type='submit'
                                        onClick={handleSubmit}
                                    >
                                        Update
                                    </button>
                                </div>

                            </div>
                        </form>
                    )
                }

            </PageAnimantionWrapper>
        </>
    )
}



export default EditProfile
