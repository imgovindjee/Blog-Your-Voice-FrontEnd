import React, { createContext, useContext, useEffect, useState } from 'react'

import axios from 'axios';

import { Navigate, useParams } from 'react-router-dom';

import { UserContext } from '../../App'

import BlogEditor from '../../components/BlogEditorComponents/BlogEditor/BlogEditor';
import BlogPublished from '../../components/BlogEditorComponents/BlogPublished/BlogPublished';
import Loader from '../../components/Loader/Loader';




const blogStructure = {
    title: '',
    banner: '',
    content: [],
    tags: [],
    description: '',
    authot: {
        personal_info: {}
    }
}

// context creation
export const EditorContext = createContext({})


const EditorPage = () => {

    // Accessing the context-user datail using Context-hook
    let { userAuth: { access_token } } = useContext(UserContext)
    // console.log(access_token);

    // getting the blog_id from the URL-link
    const { blog_id } = useParams();


    // state-hook 
    // making the state of the current rendering page on the editor-section
    const [editorState, setEditorState] = useState("editor")
    const [textEditor, setTextEditor] = useState({ isReady: false })

    // state hooks
    // making the hook of the loading-effect
    const [loading, setLoading] = useState(true);

    // props states creation for the context
    const [blog, setBlog] = useState(blogStructure);


    // real-time endering of the data
    // finding the differnce of page between the "WRITE"-post or "EDIT"-post
    useEffect(() => {
        if (!blog_id) {
            return setLoading(false);
        }

        // making the "EDIT"-post request to the server
        axios.post(import.meta.env.VITE_SERVER_DOMAIN + "/get-blog", { blog_id, draft: true, mode: 'edit' })
            .then(({ data: { blog } }) => {
                // console.log(blog);
                setBlog(blog);
                setLoading(false)
            })
            .catch((error) => {
                setBlog(null);
                setLoading(false)
                console.log(error);
            })
    }, [])



    return (
        <EditorContext.Provider value={{ blog, setBlog, editorState, setEditorState, textEditor, setTextEditor }}>
            {
                access_token === null ? (
                    <Navigate to='/signin' />
                ) : (
                    loading ? (
                        <Loader />
                    ) : (
                        editorState === 'editor' ? (
                            <BlogEditor />
                        ) : (
                            <BlogPublished />
                        )
                    )
                )
            }
        </EditorContext.Provider>
    )
}

export default EditorPage
