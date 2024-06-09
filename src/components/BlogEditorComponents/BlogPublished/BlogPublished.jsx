import React, { useContext } from 'react'

import axios from 'axios'

import { useNavigate, useParams } from 'react-router-dom'
import toast, { Toaster } from 'react-hot-toast'

import { UserContext } from '../../../App'

import PageAnimantionWrapper from '../../../common/PageAnimationWrapper/PageAnimantionWrapper'
import { EditorContext } from '../../../pages/EditorPage/EditorPage'
import _banner from "../../../assets/Images/blog banner.png"
import Tags from '../../Tags/Tags'




let characterLimit = 500;
let tagLimit = 10;




const BlogPublished = () => {

    // accessing the "blog_id" form the URL of the Site-page
    const { blog_id } = useParams();

    // importing the context of User[GLOBAL CONTEXT OF THE PAGE]
    let { userAuth: { access_token } } = useContext(UserContext)

    // import the context of the EDITOR-PAGE
    let { blog, blog: { banner, title, tags, description, content }, setBlog, setEditorState } = useContext(EditorContext);



    // Hook help to change the route of page
    let navigate = useNavigate();




    // handling the close(X)-button event 
    const handleCloseButton = () => {
        setEditorState("editor")
    }


    // function to handling the title-change event
    const handleTitleChangeOnPreview = (e) => {
        let input = e.target;
        console.log(input);

        setBlog({ ...blog, title: input.value })
    }


    // function to handling the description-change event
    const handleBlogDescriptionChangeOnPreview = (e) => {
        let input = e.target;
        console.log(input);

        setBlog({ ...blog, description: input.value })
    }


    // function to handle the REMOVE SOME EVENT
    const handleDescriptionKeyDown = (e) => {
        if (e.keyCode === 13) { // on "ENTER"-Press ASCII-value
            e.preventDefault();
        }
    }


    // function to handle key-down og Blog-Tag Section
    const handleKeyDown_BlogTag = (e) => {
        if (e.keyCode === 13 || e.keyCode === 188) { // keyCode of "ENTER" or "COMMA(,)"
            e.preventDefault();

            let _tag = e.target.value;
            // console.log(_tag);

            // adding the tag to the tag array block-state
            if (tags.length < tagLimit) {
                if (!tags.includes(_tag) && _tag.length) {
                    setBlog({ ...blog, tags: [...tags, _tag] })
                }
            } else {
                toast.error(`You can add maximum ${tagLimit} Tags Only`)
            }

            // undo the tag-input field to enter the new tag
            e.target.value = ""
        }
    }


    // function handling the plublish blog and storing the data to Database
    const publihBlogOnClick = (e) => {
        // inOrder to handle the multiple submit of SAME POST-ONLY
        if (e.target.className.includes("disable")) {
            return;
        }


        // checking some edge case...
        if (!title.length) {
            return toast.error("Write a Blog-Title to Publish it..")
        }
        if (!description.length || !description.length > characterLimit) {
            return toast.error(`Write description of Your Blog under ${characterLimit} Words-Characters.`)
        }
        if (!tags.length) {
            return toast.error("Enter atleast 1-tag to help us rank your post and keep track")
        }


        // showing the toasting effect...
        let loadingTest = toast.loading("Publishing Blog...")

        //handling the data to be submitted once only
        e.target.classList.add('disable');

        let _blogObjectModel = { //object model to store in db
            title,
            description,
            content,
            tags,
            banner,
            draft: false
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

                toast.dismiss(loadingTest);
                toast.success("Blog Published🎉🎉")

                setTimeout(() => {
                    navigate("/dashboard/blogs");
                }, 1000);
            })
            .catch(({ response }) => {
                e.target.classList.remove('disable');
                toast.dismiss(loadingTest);

                return (
                    toast.error(response.data.error)
                )
            })
    }





    return (
        <PageAnimantionWrapper>

            <section className='w-screen min-h-screen grid items-center lg:grid-cols-2 py-16 lg:gap-4'>
                <Toaster />

                <button
                    className='w-12 h-12 absolute right-[5vw] z-10 top-[5%] lg:top[10%]'
                    onClick={handleCloseButton}
                >
                    <i className="fi fi-br-cross"></i>
                </button>


                <div className='max-w-[550px] center'>
                    <p className="text-dark-grey mb-1">
                        Preview
                    </p>

                    <div className='w-full aspect-video rounded-lg overflow-hidden bg-grey mt-4'>
                        <img src={banner} alt={_banner} />
                    </div>

                    <h1 className='text-4xl font-medium mt-2 leading-tight line-clamp-2'>
                        {title}
                    </h1>

                    <p className='font-gelasio line-clamp-2 text-xl leading-7 mt-9'>
                        {description}
                    </p>
                </div>


                <div className='border-grey lg:border-1 lg:pl-8'>
                    {/* Blog-title section */}
                    <p className='text-dark-grey mb-2 mt-9'>
                        Blog Title:
                    </p>
                    <input
                        type="text"
                        placeholder='Blog Title'
                        defaultValue={title}
                        className='input-box pl-4'
                        onChange={handleTitleChangeOnPreview}
                    />


                    {/* Description section */}
                    <p className='text-dark-grey mb-2 mt-9'>
                        Short Description of the Blog-to-be-Publish:
                    </p>
                    <textarea
                        maxLength={characterLimit}
                        defaultValue={description}
                        className='h-40 resize-none leading-7 input-box pl-4'
                        onChange={handleBlogDescriptionChangeOnPreview}
                        onKeyDown={handleDescriptionKeyDown}
                    >
                    </textarea>
                    <p className='mt-1 text-dark-grey text-sm text-right'>
                        {characterLimit - description.length} character left
                    </p>


                    {/* Blog-Tags section */}
                    <p className="text-dark-grey mb-2 mt-9">
                        Topics[Tags] - ( Helps in Searching and Ranking Your Blogs ):
                    </p>
                    <div className="relative input-box pl-2 py-2 pb-4 mb-4">
                        <input
                            type="text"
                            placeholder='Topics'
                            className='sticky input-box bg-white top-0 left-0 pl-4 mb-3 focus:bg-white'
                            onKeyDown={handleKeyDown_BlogTag}
                        />
                        {
                            tags.map((tag, idx) => {
                                return (
                                    <Tags tag={tag} key={idx} tagIndex={idx} />
                                )
                            })
                        }
                        <p className='mt-1 text-dark-grey text-sm text-right'>
                            {tagLimit - tags.length} Tags left
                        </p>
                    </div>

                    <button className="btn-dark px-8" onClick={publihBlogOnClick}>
                        Publish
                    </button>

                </div>

            </section>

        </PageAnimantionWrapper>
    )
}

export default BlogPublished
