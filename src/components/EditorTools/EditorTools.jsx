// importing tools
import Embed from "@editorjs/embed"
import Image from "@editorjs/image"
import Header from "@editorjs/header"
import List from "@editorjs/list"
import Quote from "@editorjs/quote"
import Marker from "@editorjs/marker"
import InlineCode from "@editorjs/inline-code"

import { uploadImage } from "../../common/AWS_Setup/AWS_Setup"



// CUSTOM uploading the image through URL
const uploadImageByURL = (e) => {
    let link = new Promise((resolve, reject) => {
        try {
            resolve(e)
        } catch (error) {
            reject(error)
        }
    })
    return link.then(url => {
        return {
            success: 1,
            file: { url }
        }
    })
}


// CUSTOM uploading the image through FILE
const uploadImageByFile = (e) => {
    return uploadImage(e).then(url => {
        if (url) {
            return {
                success: 1,
                file: { url }
            }
        }
    })
}



export const tools = {
    embed: Embed,
    list: {
        class: List,
        inlineToolbar: true
    },
    image: {
        class: Image,
        config: {
            uploader: {
                uploadByUrl: uploadImageByURL,
                uploadByFile: uploadImageByFile,
            }
        }
    },
    header: {
        class: Header,
        config: {
            placeholder: "Type Heading ...",
            levels: [2, 3, 4, 5],
            defaultLevel: 2
        }
    },
    quote: {
        class: Quote,
        inlineToolbar: true
    },
    marker: Marker,
    inlineCode: InlineCode,
} 
