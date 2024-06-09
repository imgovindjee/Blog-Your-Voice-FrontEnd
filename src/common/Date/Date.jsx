let months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
let Days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"]


export const getDateOfPublished = (timeStamp) => {
    let data = new Date(timeStamp);

    return `${data.getDate()} ${months[data.getMonth()]}`
}


export const getFullDay = (timeStamp)=>{
    let date = new Date(timeStamp)

    return `${date.getDate()} ${months[date.getMonth()]} ${date.getFullYear()}`
}