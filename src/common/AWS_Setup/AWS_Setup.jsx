import axios from "axios"


export const uploadImage = async (img) => {

    let imageURL = null

    await axios.get(import.meta.env.VITE_SERVER_DOMAIN + "/get-upload-url")
        .then(async ({ data: { uploadURL } }) => {
            await axios({
                method: 'PUT',
                url: uploadURL,
                headers: {
                    'Content-Type': 'multpart/form-data'
                },
                data: img
            }).then(() => {
                // console.log(uploadURL);
                imageURL = uploadURL.split("?")[0]
            })
        })


    return imageURL;
}