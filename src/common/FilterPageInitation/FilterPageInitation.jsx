import axios from "axios";



export const filterPageInitationData = async ({ create_new_array = false, prevStateArr, data, page, counteRoute, data_to_send = {}, user = undefined }) => {

    let obj;

    let headers = {}
    if (user) {
        headers.headers = {
            'Authorization': `Bearer ${user}`
        }
    }


    if (prevStateArr !== null && !create_new_array) {
        obj = { ...prevStateArr, results: [...prevStateArr.results, ...data], page: page }
    } else {
        await axios.post(import.meta.env.VITE_SERVER_DOMAIN + counteRoute, data_to_send, headers)
            .then(({ data: { totalDocs } }) => {
                // console.log(data)
                obj = { results: data, page: 1, totalDocs }
            })
            .catch(error => {
                console.log(error)
            })
    }

    return obj;
}