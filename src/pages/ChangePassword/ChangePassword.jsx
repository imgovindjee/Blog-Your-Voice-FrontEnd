import React, { useRef, useContext } from 'react'
import PageAnimantionWrapper from '../../common/PageAnimationWrapper/PageAnimantionWrapper'
import Input from '../../components/InputBox/Input'
import toast, { Toaster } from 'react-hot-toast'
import axios from 'axios'
import { UserContext } from '../../App'


// Password-making-creatria
let passwordRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,20}$/;


const ChangePassword = () => {

    // accesssing the GLOBAL page Context
    const { userAuth: { access_token } } = useContext(UserContext);

    // creating the form-HTML reference
    let changePassword_Form = useRef()


    // function to handle the change password event
    const handleSubmit_ChangePassword = (e) => {
        e.preventDefault();

        const form = new FormData(changePassword_Form.current)
        const formData = {};
        for (let [key, value] of form.entries()) {
            formData[key] = value;
        }

        // destructuring the current and pervious password...
        let { currentPassword, newPassword } = formData

        // EDGE CASES

        // 1.
        // password fields aren't empty
        if (!currentPassword.length || !newPassword.length) {
            return (
                toast.error("Please Fill all the Inputs inOrder to Change Password..")
            )
        }

        // 2.
        // if newPassword is following the Password-making-Rule
        if (!passwordRegex.test(currentPassword) || !passwordRegex.test(newPassword)) {
            return (
                toast.error("Password should be 6 to 20 characters long with 1 numeric, 1 lowerCase and 1 upperCase letters")
            )
        }


        // Changing the password....

        // making the request once-only... avoiding the multiple clicks[submits]
        e.target.setAttribute("disabled", true)
        
        // showing the effect of updatig the password..
        let loadingToast = toast.loading("Updating password...")

        // making the request to the server to update the passwrod...
        axios.post(import.meta.env.VITE_SERVER_DOMAIN + "/change-password", formData,
            {
                headers: {
                    'Authorization': `Bearer ${access_token}`
                }
            }
        )
            .then(() => {
                toast.dismiss(loadingToast)
                e.target.removeAttribute("disabled");
                return (
                    toast.success("Password Updated")
                )
            })
            .catch(({ response }) => {
                toast.dismiss(loadingToast)
                e.target.removeAttribute("disabled")
                return (
                    toast.error(response.data.message)
                )
            })
    }



    return (
        <>
            <PageAnimantionWrapper>

                <Toaster />

                <form ref={changePassword_Form}>
                    <h1 className="max-md:hidden">
                        Change Password
                    </h1>

                    <div className='py-10 w-full md:max-w-[400px]'>
                        <Input
                            name="currentPassword"
                            type="password"
                            className="profile-edit-input"
                            placeholder="Current password"
                            icon_name="fi-rr-unlock"
                        />

                        <Input
                            name="newPassword"
                            type="password"
                            className="profile-edit-input"
                            placeholder="New password"
                            icon_name="fi-rr-unlock"
                        />


                        <button
                            className='btn-dark px-10'
                            type='submit'
                            onClick={handleSubmit_ChangePassword}
                        >
                            Change Password
                        </button>
                    </div>
                </form>

            </PageAnimantionWrapper>
        </>
    )
}

export default ChangePassword
