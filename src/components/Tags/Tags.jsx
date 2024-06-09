import React, { useContext } from 'react'

import { EditorContext } from '../../pages/EditorPage/EditorPage'



const Tags = ({ tag, tagIndex }) => {


    // imporing the context-hook of EditorSection
    let { blog, blog: { tags }, setBlog } = useContext(EditorContext);



    // function to handle the tag-DELETE
    const handleTagDelete = () => {
        tags = tags.filter(t => t !== tag)

        setBlog({ ...blog, tags })
    }

    // function to handle the edit-tag-attribute set BY CUSTOM
    const handleEditTabe = (e) => {
        e.target.setAttribute("contentEditable", true);
        e.target.focus();
    }

    // function to handle the tag-EDIT on CLICK
    const HandleTagEditChanges = (e) => {
        if (e.keyCode === 13 || e.keyCode === 188) {
            e.preventDefault();

            let currentTag = e.target.innerText;
            // console.log(currentTag)
            tags[tagIndex] = currentTag;

            setBlog({ ...blog, tags }); //updating the data to the blog-DB
            // console.log(tags);
            e.target.setAttribute("contentEditable", false);
        }
    }



    return (
        <div className='relative p-2 mt-2 mr-2 px-5 bg-white rounded-full inline-block hover:bg-opacity-50 pr-10'>
            <p
                className="outline-none"
                onClick={handleEditTabe}
                onKeyDown={HandleTagEditChanges}
            >
                {tag}
            </p>
            <button
                className='mt-[2px] rounded-full absolute right-3 top-1/2 -translate-y-1/2'
                onClick={handleTagDelete}
            >
                <i className="fi fi-rr-cross text-sm pointer-events-none"></i>
            </button>
        </div>
    )
}

export default Tags
