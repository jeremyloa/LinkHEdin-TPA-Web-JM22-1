import { useMutation } from "@apollo/client";
import { useContext, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Footer1 from "../components/Footer1";
import Navbar1 from "../components/Navbar1";
import { UserContext } from "../contexts/UserContext";
import { ACTIVATE_USER, LOGIN_USER, RESET_USER } from "../Queries";

export default function Forgot1(){
    const [width, setWidth] = useState(0)
    useEffect(() => {
        updateWidth()
        window.addEventListener("resize", updateWidth)
        return () => window.removeEventListener("resize", updateWidth)
    }, [])

    const updateWidth = () => {
        setWidth(window.innerWidth)
        // console.log(window.innerWidth)
    }

    const [mail, setMail] = useState('')
    const [errortxt, setErrorTxt] = useState('')
    const [successtxt, setSuccessTxt] = useState('')
    const {user, setUser} = useContext(UserContext)
    // console.log(user)
    const navigate = useNavigate()
    if (user && user.id) {
        console.log(user)
        localStorage.setItem('user', JSON.stringify(user))
        navigate('/in/home')
    }
   
    const [sendUser] = useMutation(RESET_USER, {
        variables: {
            email: mail
        },
      });

    function goSendReset(e){
        e.preventDefault()
        console.log({
            email: mail
        })
        if (mail == '') {
            setErrorTxt("Email must not be empty.")
            return
        } else if (!mail.includes('@') || mail.length<=6) {
            setErrorTxt('Email is invalid.')
            return
        } 
        sendUser().then((x) => {
            console.log(x.data.Login) 
            setSuccessTxt('Send password reset link success. Please check your email.')
            setErrorTxt('')
        })
        .catch((m) => {
            console.log(`error: ${m.message}`)
            if (m.message.includes('not found')){
                setErrorTxt("User is not found.")
                console.log("in2")
                console.log("user not found")
            } else {
                setErrorTxt(m.message)
                console.log("out: " + m.message)
            }
            setSuccessTxt('')
        })
    }
    if (successtxt != '') console.log(user)

    return(
        <div>
            {/* navbar */}
            <div className="fixed-top w-full">
            <Navbar1 page={'front'}/> 
            </div>
            <br/> <br/> <br/> 
            {/* body */}
            <div className={`flex ${width > 1000 ? 'flex-row mx-32' : 'flex-col mx-12'} mt-8 mb-16`}>
                <div className="items-center bg-white rounded-md px-6 py-3 w-80 shadow-lg m-auto">
                    <h1 className="text-secondary">Reset Password</h1>
                    <h4>An email will be sent to you for resetting password.</h4>
                    <form className="flex flex-col">
                    <input type="email" name="email" id="email" placeholder="E-mail" title="email" className="text-input my-2" onChange={(e) => setMail(e.target.value)}/>
                    <div className="flex flex-col justify-center items-center">
                        {errortxt != '' && <div className="mx-2 text-center py-2 sec-box border-secondary rounded-md w-72  my-1">Error: {errortxt}</div>}
                        {successtxt != '' && <div className="mx-2 text-center py-2 green-box border-green rounded-md w-72  my-1">{successtxt}</div>}
                        <div className='mx-2 bg-primary-adv border-primary rounded-md w-72 button-text-white py-3 text-center my-1 hand'onClick={goSendReset}>Send Reset Password Request</div>
                        <Link to='/login' className="link text-primary py-1">Sign In</Link>

                    </div>
                    </form>
                </div>
            </div>
            {/* footer */}
            <br/> <br/> <br/> <Footer1 footerfront={true}/>
        </div>
    )
}