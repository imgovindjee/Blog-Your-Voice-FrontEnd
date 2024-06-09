import React, { useState } from 'react'




const Input = ({ name, type, id, value, placeholder, icon_name, disabled = false }) => {

    const [passwordVisibility, setPasswordVisibility] = useState(false);


    return (
        <div className='relative w-[100%] mb-4'>
            <input
                name={name}
                type={type === "password" ? passwordVisibility ? "text" : "password" : type}
                id={id}
                defaultValue={value}
                placeholder={placeholder}
                className='input-box'
                disabled={disabled}
            />
            <i className={`fi ${icon_name} input-icon`}></i>

            {
                type === "password" && (
                    <i
                        className={`fi fi-rr-eye${passwordVisibility ? "" : "-crossed"} input-icon left-[auto] right-4 cursor-pointer`}
                        onClick={() => setPasswordVisibility((curr) => !curr)}
                    ></i>
                )
            }
        </div>
    )
}

export default Input
