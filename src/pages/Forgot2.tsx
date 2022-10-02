import { useMutation } from "@apollo/client";
import { useContext, useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import Footer1 from "../components/Footer1";
import Navbar1 from "../components/Navbar1";
import { UserContext } from "../contexts/UserContext";
import { ACTIVATE_USER, GET_RESET_CODE, LOGIN_USER, RESET_USER, SET_PASS } from "../Queries";


export default function Forgot2(){
    const {id} = useParams()
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

    const [pass, setPass] = useState('')
    const [confpass, setConfPass] = useState('')

    const [errortxt, setErrorTxt] = useState('')
    const [successtxt, setSuccessTxt] = useState('')
    const {user, setUser} = useContext(UserContext)
    const [tempuser, setTempUser] = useState({})
    // console.log(user)
    const navigate = useNavigate()
    if (user && user.id) {
        console.log(user)
        localStorage.setItem('user', JSON.stringify(user))
        navigate('/in/home')
    }

    const [act, setAct] = useState(false)
    const [vercode, setResCode] = useState(id)
    const [errortxt2, setErrorTxt2] = useState('')
    const [successtxt2, setSuccessTxt2] = useState('')

    const [verUser] = useMutation(GET_RESET_CODE, {
        variables: {
            resetID: vercode
        },
      });

    function goVer(e){
        e.preventDefault()
        console.log({
            resetID: vercode
        })
        if (vercode == '') {
            setErrorTxt2("Code must not be empty.")
            return
        }
        verUser().then((x) => {
            console.log(x.data.resetCode) 
            setTempUser(x.data.resetCode)
            setSuccessTxt2('Reset code verified.')
            setErrorTxt2('')
            setAct(true)
        })
        .catch((m) => {
            console.log(`error: ${m.message}`)
            if (m.message.includes('which the schema does not allow')){
                setErrorTxt2("Incorrect key.")
                console.log("in1")
                console.log("incorrect key")
            } else if (m.message.includes('not found')){
                setErrorTxt2("Reset code is not found.")
                console.log("in2")
                console.log("reset code not found")
            } else {
                setErrorTxt2(m.message)
                console.log("out: " + m.message)
            }
            setSuccessTxt2('')
        })
    }
   
    const [resetPassword] = useMutation(SET_PASS, {
        variables: {
            email: tempuser.email,
            password: pass
        },
      });

    function goReset(e){
        e.preventDefault()
        console.log({
            email: tempuser.email,
            password: pass,
            confpass: confpass
        })
        if (pass == '') {
            setErrorTxt("Password must not be empty.")
            return
        } else if (pass.length<6) {
            setErrorTxt('Password should be more than 6 chars.')
            return
        } else if (confpass != pass) {
            setErrorTxt("Password and confirm password are not matching.")
            return
        } 
        resetPassword().then((x) => {
            console.log(x.data.setPass) 
            setTempUser(x.data.setPass)
            setSuccessTxt('Reset password success.')
            setErrorTxt('')
            navigate('/login')
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
                <div className={`items-center bg-white rounded-md px-6 py-3 w-80 shadow-lg m-auto ${width > 1000 ? '' : 'my-12'}`}>
                    <h1 className="text-secondary">Reset Code</h1>
                    <h4>Check your e-mail for reset password code.</h4>
                    <form className="flex flex-col">
                    <input type="text" name="code" id="code" placeholder="Reset Code" title="Reset Code" className="text-input my-2" value={id} onChange={(e) => setResCode(e.target.value)}/>
                    <div className="flex flex-col justify-center items-center">
                        {errortxt2 != '' && <div className="mx-2 text-center py-2 sec-box border-secondary rounded-md w-72  my-1">Error: {errortxt2}</div>}
                        {successtxt2 != '' && <div className="mx-2 text-center py-2 green-box border-green rounded-md w-72  my-1">{successtxt2}</div>}
                        <div className='mx-2 bg-primary-adv border-primary rounded-md w-72 button-text-white py-3 text-center my-1 hand'onClick={goVer}>Attempt Reset Code</div>
                    </div>
                    </form>
                </div>

                { act == true &&
                <div className="items-center bg-white rounded-md px-6 py-3 w-80 shadow-lg m-auto">
                    <h1 className="text-secondary">Set New Password</h1>
                    <h4>Input your new password here.</h4>
                    <form className="flex flex-col">
                    <input type="password" name="password" id="password" placeholder="Password" title="Password" className="text-input my-2" onChange={(e) => setPass(e.target.value)}/>
                    <input type="password" name="confpassword" id="confpassword" placeholder="Confirm Password" title="Confirm Password" className="text-input my-2" onChange={(e) => setConfPass(e.target.value)}/>
                    <div className="flex flex-col justify-center items-center">
                        {errortxt != '' && <div className="mx-2 text-center py-2 sec-box border-secondary rounded-md w-72  my-1">Error: {errortxt}</div>}
                        {successtxt != '' && <div className="mx-2 text-center py-2 green-box border-green rounded-md w-72  my-1">{successtxt}</div>}
                        <div className='mx-2 bg-primary-adv border-primary rounded-md w-72 button-text-white py-3 text-center my-1 hand'onClick={goReset}>Reset Password</div>
                    </div>
                    </form>
                </div>
}

            </div>
            {/* footer */}
            <br/> <br/> <br/> <Footer1 footerfront={true}/>
        </div>
    )
}