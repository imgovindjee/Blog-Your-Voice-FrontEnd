import React, { useContext, useEffect, useRef } from 'react'

import axios from 'axios'

import { useParams } from 'react-router-dom'
import { Link, useNavigate } from 'react-router-dom'
import { Toaster, toast } from 'react-hot-toast'

import EditorJS from '@editorjs/editorjs'

import { ThemeContext, UserContext } from '../../../App'
import logo from '../../../assets/Images/logo.png'
import lightLogo from '../../../assets/light_dark Images/logo-light.png'
import darkLogo from '../../../assets/light_dark Images/logo-dark.png'
import _banner from "../../../assets/Images/blog banner.png"
import _banner_light from "../../../assets/light_dark Images/blog banner light.png"
import _banner_dark from "../../../assets/light_dark Images/blog banner dark.png"
import PageAnimantionWrapper from '../../../common/PageAnimationWrapper/PageAnimantionWrapper'
import { uploadImage } from '../../../common/AWS_Setup/AWS_Setup'
import { EditorContext } from '../../../pages/EditorPage/EditorPage'
import { tools } from '../../EditorTools/EditorTools'

import _darklogo from "../../../assets/new Images/logo-light.png"
import _lightlogo from "../../../assets/new Images/logo-dark.png"




const BlogEditor = () => {

    // accesiing the blog_id from the URL
    const { blog_id } = useParams()


    // Accessing the HTML-Componets using useRef-hook
    let blogBannerRef = useRef();

    // Hook help to change the route of page
    let navigate = useNavigate();


    // accessing the User-context-hook[GLOBAL CONTEXT PROVIDER FOR THE BLOG WEBSITE]
    const { userAuth: { access_token } } = useContext(UserContext);

    // accessing the GLOBAL WEBSITE THEME Context
    const { theme } = useContext(ThemeContext)

    // accesing the blog-context-hook
    const { blog, blog: { title, banner, content, tags, description }, setBlog, textEditor, setTextEditor, setEditorState } = useContext(EditorContext);
    // console.log(blog);



    // function to handle the bannerUpload to the page
    const handleBannerUpload = (e) => {
        // console.log(e);

        // getting the exact location of the image file uploaded...
        const img = e.target.files[0]
        // console.log(img);

        if (img) {
            // adding the effect before the uploading starts
            let loadingToast = toast.loading("Uploading....")

            uploadImage(img)
                .then((url) => {
                    if (url) { //displaying the image to the user-banner-page
                        toast.dismiss(loadingToast) //making the effect disable
                        toast.success("Uploaded Successfully🎉🎉")
                        setBlog({ ...blog, banner: url });
                    }
                })
                .catch((error) => {
                    toast.dismiss(loadingToast)
                    return toast.error(error);
                })
        }
    }

    // handling the banner error
    const handleBannerError = (e) => {
        let image = e.target;
        // console.log(image)
        image.src = theme === 'light' ? _banner_light : _banner_dark
    }


    // making the title Responsive with some cases
    const handleTitleKeyDown = (e) => {
        // console.log(e);
        if (e.keyCode === 13) { // "13" is the {keyCode}(ASCII-VALUE) of ENTER
            e.preventDefault();
        }
    }


    // making the height of the title responsive
    const handleTitleChange = (e) => {
        // console.log(e);

        let input = e.target; //selecting the current input data
        // console.log(input.scrollHeight);
        input.style.height = 'auto'
        input.style.height = input.scrollHeight + "px";

        setBlog({ ...blog, title: input.value })
    }



    // useEffect hook for handling the exitor section
    useEffect(() => {
        if (!textEditor.isReady) {
            setTextEditor(new EditorJS({
                holderId: "textEditor",
                data: Array.isArray(content) ? content[0] : content,
                tools: tools,
                placeholder: "Share Your Story Here !!",
            }))
        }
    }, []);



    // handling the publish button functionality
    const handlePublih = () => {
        // Error handling while publish

        // 1. don't have an banner for the BLOG
        if (!banner.length) {
            return toast.error(`Upload a banner for "${!title.length ? "Blog" : title.substring(0, 6) + "..."}" to publish it`)
        }

        // 2.Title isn't written
        if (!title.length) {
            return toast.error("Write a Blog-Title to Publish it")
        }

        //3. changing the textEditor State
        if (textEditor.isReady) {
            textEditor.save()
                .then(data => {
                    console.log(data);
                    if (data.blocks.length) {
                        setBlog({ ...blog, content: data })
                        setEditorState("publish")
                    } else {
                        return toast.error("Write Something in Your Blog to Publish it")
                    }
                })
                .catch(error => {
                    console.log(error);
                    return toast.error(error.message)
                })
        }
    }



    // function inOrder to save the Data of the Writing Blog to the Draft
    // onClick to "Draft"-Button
    const handleSaveDraft = (e) => {
        // inOrder to handle the multiple draft of SAME POST-ONLY
        if (e.target.className.includes("disable")) {
            return;
        }


        // checking some edge case...
        if (!title.length) {
            return toast.error("Write a Blog-Title before SAVING IT TO DRAFT..")
        }



        let loadingToast = toast.loading("Saving Draft...")

        //handling the data to be submitted once only
        e.target.classList.add('disable');


        if (textEditor.isReady) {
            textEditor.save()
                .then(content => {
                    let _blogObjectModel = { //object model to store in db
                        title,
                        description,
                        content,
                        tags,
                        banner,
                        draft: true
                    }
                    axios.post(import.meta.env.VITE_SERVER_DOMAIN + "/create-blog", { ..._blogObjectModel, id: blog_id },
                        {
                            headers: {
                                'Authorization': `Bearer ${access_token}`
                            }
                        }
                    )
                        .then(() => {
                            e.target.classList.remove('disable');

                            toast.dismiss(loadingToast);
                            toast.success("Saved to Draft👍")

                            setTimeout(() => {
                                navigate("/dashboard/blogs?tab=draft");
                            }, 1000);
                        })
                        .catch(({ response }) => {
                            e.target.classList.remove('disable');
                            toast.dismiss(loadingToast);

                            return (
                                toast.error(response.data.error)
                            )
                        })
                })
        }
    }



    return (
        <>
            <nav className="navbar">
                <Link to="/" className='flex-none w-10'>
                    <img
                        src={theme === 'light' ? _darklogo : _lightlogo}
                        alt={logo}
                    />
                </Link>

                <p className="max-md:hidden text-black line-clamp-1 w-full">
                    {
                        title.length !== 0 ? (
                            title
                        ) : (
                            "New Blog"
                        )
                    }
                </p>

                <div className='flex gap-4 ml-auto'>
                    <button className='btn-dark py-2' onClick={handlePublih}>
                        Publish
                    </button>
                    <button className='btn-light py-2' onClick={handleSaveDraft}>
                        Save Draft
                    </button>
                </div>
            </nav>


            <Toaster />
            <PageAnimantionWrapper>

                <section>
                    <div className="mx-auto max-w-[900px] w-full">
                        <div className="relative aspect-video hover:opacity-80 bg-white border-4 border-grey">
                            <label htmlFor="uploadBanner">
                                <img
                                    src={banner}
                                    alt="Banner"
                                    className='z-20'
                                    onError={handleBannerError}
                                />
                                <input
                                    type="file"
                                    accept=".png, .jpg, .jpeg, .hice"
                                    id="uploadBanner"
                                    hidden
                                    onChange={handleBannerUpload}
                                />
                            </label>
                        </div>

                        <textarea
                            placeholder='Blog Title'
                            className='text-4xl font-medium w-full h-20 outline-none resize-none mt-10 leading-tight placeholder:opacity-40 bg-white'
                            onKeyDown={handleTitleKeyDown}
                            onChange={handleTitleChange}
                            defaultValue={title}
                        >
                        </textarea>

                        <hr className='w-full opacity-20 my-5' />

                        {/* Text-Editor Section */}
                        <div id="textEditor" className="font-gelasio"></div>

                    </div>
                </section>

            </PageAnimantionWrapper>
        </>
    )
}

export default BlogEditor
