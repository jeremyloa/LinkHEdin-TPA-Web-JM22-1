import { useMutation } from "@apollo/client";
import { GoogleLogin } from "@react-oauth/google";
import jwtDecode from "jwt-decode";
import { useContext, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Footer1 from "../components/Footer1";
import Navbar1 from "../components/Navbar1";
import { UserContext } from "../contexts/UserContext";
import { ACTIVATE_USER, LOGIN_USER, REGISTER_USER } from "../Queries";

export default function Login(){
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
    const [pass, setPass] = useState('')
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
   
    const [logUser] = useMutation(LOGIN_USER, {
        variables: {
            email: mail,
            password: pass,
            google: ''
        },
      });

    function goLogin(e){
        e.preventDefault()
        console.log({
            email: mail,
            password: pass
        })
        if (mail == '') {
            setErrorTxt("Email must not be empty.")
            return
        } else if (!mail.includes('@') || mail.length<=6) {
            setErrorTxt('Email is invalid.')
            return
        } else if (pass == '') {
            setErrorTxt("Password must not be empty.")
            return
        } else if (pass.length<6) {
            setErrorTxt('Password should be more than 6 chars.')
            return
        }
        logUser().then((x) => {
            console.log(x.data.Login) 
            setErrorTxt('')
            if (x.data.Login.activated == false) {
                setAct(true)
                setErrorTxt('You are not activated yet.')
            } else {
                setUser(x.data.Login)
                setSuccessTxt('Login success.')
            }
        })
        .catch((m) => {
            console.log(`error: ${m.message}`)
            if (m.message.includes('which the schema does not allow')){
                setErrorTxt("Incorrect password.")
                console.log("in1")
                console.log("incorrect password")
            } else if (m.message.includes('not found')){
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
    const [act, setAct] = useState(false)
    const [vercode, setVerCode] = useState('')
    const [errortxt2, setErrorTxt2] = useState('')
    const [successtxt2, setSuccessTxt2] = useState('')

    const [verUser] = useMutation(ACTIVATE_USER, {
        variables: {
            activationID: vercode
        },
      });

    function goVer(e){
        e.preventDefault()
        console.log({
            activationID: vercode
        })
        if (vercode == '') {
            setErrorTxt2("Code must not be empty.")
            return
        }
        verUser().then((x) => {
            console.log(x.data.activateUser) 
            setUser(x.data.activateUser)
            setSuccessTxt2('Verification success.')
            setErrorTxt2('')
        })
        .catch((m) => {
            console.log(`error: ${m.message}`)
            if (m.message.includes('which the schema does not allow')){
                setErrorTxt2("Incorrect key.")
                console.log("in1")
                console.log("incorrect key")
            } else if (m.message.includes('not found')){
                setErrorTxt2("User is not found.")
                console.log("in2")
                console.log("user not found")
            } else {
                setErrorTxt2(m.message)
                console.log("out: " + m.message)
            }
            setSuccessTxt2('')
        })
    }

    const [jwtdec, setJWTDec] = useState({name: '', email: '', password: '', picture: '', aud: ''})
    const [logGoogleUser] = useMutation(LOGIN_USER, {
        variables: {
            email: jwtdec.email,
            password: '',
            google: jwtdec.aud,
        },
      });

    useEffect(()=>{
        console.log(jwtdec)
        console.log({
            email: jwtdec.email,
            password: '',
            google: jwtdec.aud
        })

        if (jwtdec.aud != '') {
            logGoogleUser().then((x) => {
                console.log(x.data.Login) 
                setSuccessTxt('Authentication success.')
                setErrorTxt('')
                setUser(x.data.Login)
            })
            .catch((m) => {
                console.log(`error: ${m.message}`)
                if (m.message.includes('which the schema does not allow')){
                    setErrorTxt("User not exists.")
                    console.log("in")
                    console.log("user not exists")
                } else {
                    setErrorTxt(m.message)
                    console.log("out: " + m.message)
                }
                setSuccessTxt('')
            })
        }

    }, [jwtdec])

    // const [country, setCountry] = useState('')
    // const [job, setJob] = useState('')
    // const [employment, setEmployment] = useState('')
    // const [company, setCompany] = useState('')
    // const [sub, setSub] = useState(false)
    // const [errortxt3, setErrorTxt3] = useState('')
    // const [successtxt3, setSuccessTxt3] = useState('')

    // const [initUser] = useMutation(ACTIVATE_USER, {
    //     variables: {
    //         activationID: vercode
    //     },
    //   });

    // function goInit(e){
    //     e.preventDefault()
    //     console.log(country)

    //     // console.log({
    //     //     activationID: vercode
    //     // })
    //     // if (vercode == '') {
    //     //     setErrorTxt2("Code must not be empty.")
    //     //     return
    //     // }
    //     // verUser().then((x) => {
    //     //     console.log(x.data.activateUser) 
    //     //     setUser(x.data.activateUser)
    //     //     setSuccessTxt2('Verification success.')
    //     //     setErrorTxt2('')
    //     // })
    //     // .catch((m) => {
    //     //     console.log(`error: ${m.message}`)
    //     //     if (m.message.includes('which the schema does not allow')){
    //     //         setErrorTxt2("Incorrect key.")
    //     //         console.log("in1")
    //     //         console.log("incorrect key")
    //     //     } else if (m.message.includes('not found')){
    //     //         setErrorTxt2("User is not found.")
    //     //         console.log("in2")
    //     //         console.log("user not found")
    //     //     } else {
    //     //         setErrorTxt2(m.message)
    //     //         console.log("out: " + m.message)
    //     //     }
    //     //     setSuccessTxt2('')
    //     // })
    // }

    return(
        <div>
            {/* navbar */}
            <div className="fixed-top w-full">
            <Navbar1 page={'front'}/> 
            </div>
            <br/> <br/> <br/> 
            {/* body */}
            <div className={`flex ${width > 1200 ? 'flex-row mx-32' : 'flex-col mx-12'} mt-8 mb-16`}>
                <div className="items-center bg-white rounded-md px-6 py-3 w-80 shadow-lg m-auto">
                    <h1 className="text-secondary">Sign In</h1>
                    <h4>Stay updated on your professional world</h4>
                    <form className="flex flex-col">
                    <input type="email" name="email" id="email" placeholder="E-mail" title="email" className="text-input my-2" onChange={(e) => setMail(e.target.value)}/>
                    <input type="password" name="password" id="password" placeholder="Password" title="password" className="text-input my-2" onChange={(e) => setPass(e.target.value)}/>
                    <div className="flex flex-col justify-center items-center">
                        <Link to='/forgot' className="link text-primary py-1">Forgot password?</Link>
                        {errortxt != '' && <div className="mx-2 text-center py-2 sec-box border-secondary rounded-md w-72  my-1">Error: {errortxt}</div>}
                        {successtxt != '' && <div className="mx-2 text-center py-2 green-box border-green rounded-md w-72  my-1">{successtxt}</div>}
                        <div className='mx-2 bg-primary-adv border-primary rounded-md w-72 button-text-white py-3 text-center mt-1 mb-4 hand'onClick={goLogin}>Sign in</div>
                        <GoogleLogin 
                        onSuccess={credentialResponse => {
                            setJWTDec(jwtDecode(credentialResponse.credential))
                        }}
                        onError={() => {
                            console.log('Login Failed');
                        }}
                        useOneTap
                        />
                        {/* <Link to={'/'} className='mx-2 bg-white-adv border-primary rounded-md w-72 button-text py-3 text-center my-1'>Sign in with Google</Link> */}
                        <div className="my-4">Not on LinkHEdIn yet? <Link to='/register' className="link text-primary">Register</Link></div>
                    </div>
                    </form>
                </div>

                { act == true &&
                <div className={`items-center bg-white rounded-md px-6 py-3 w-80 shadow-lg m-auto ${width > 1000 ? '' : 'my-12'}`}>
                    <h1 className="text-secondary">Verification</h1>
                    <h4>Check your e-mail for verification code.</h4>
                    <form className="flex flex-col">
                    <input type="text" name="code" id="code" placeholder="Verification Code" title="Verification Code" className="text-input my-2" onChange={(e) => setVerCode(e.target.value)}/>
                    <div className="flex flex-col justify-center items-center">
                        {errortxt2 != '' && <div className="mx-2 text-center py-2 sec-box border-secondary rounded-md w-72  my-1">Error: {errortxt2}</div>}
                        {successtxt2 != '' && <div className="mx-2 text-center py-2 green-box border-green rounded-md w-72  my-1">{successtxt2}</div>}
                        <div className='mx-2 bg-primary-adv border-primary rounded-md w-72 button-text-white py-3 text-center my-1 hand'onClick={goVer}>Verify</div>
                        {/* <div className="my-4 flex flex-row">Not receiving code? <div className="mx-2 link text-primary">Resend</div></div> */}
                    </div>
                    </form>
                </div>}
            </div>
            {/* footer */}
            <br/> <br/> <br/> <Footer1 footerfront={true}/>
        </div>
    )
}