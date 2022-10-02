import { useMutation } from "@apollo/client";
import { useContext, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Footer1 from "../components/Footer1";
import Navbar1 from "../components/Navbar1";
import { UserContext } from "../contexts/UserContext";
import { REGISTER_USER } from "../Queries";
import { GoogleLogin } from '@react-oauth/google';
import jwtDecode from "jwt-decode";

export default function Register(){
    const [errortxt, setErrorTxt] = useState('')
    const [successtxt, setSuccessTxt] = useState('')
    
    const [name, setName] = useState('')
    const [mail, setMail] = useState('')
    const [uname, setUname] = useState('')
    const [pass, setPass] = useState('')
    const [google, setGoogle] = useState('')
    const [profile, setProfile] = useState('')
    const navigate = useNavigate()
    const {user, setUser} = useContext(UserContext)
    // console.log(user)
    if (user && user.id) {
        console.log(user)
        localStorage.setItem('user', JSON.stringify(user))
        navigate('/in/home')
    }
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

    const [addUser, { data, loading, error }] = useMutation(REGISTER_USER, {
        variables: {
            name: name,
            email: mail,
            username: uname,
            password: pass,
            google: google,
            profile: profile
        },
    });
    
    if (loading) console.log("loading")
    if (data) console.log(data)
    function goRegister(e) {
        e.preventDefault()
        console.log({
            name: name,
            email: mail,
            username: uname,
            password: pass,
            google: google,
            profile: 'https://static-exp1.licdn.com/sc/h/1c5u578iilxfi4m4dvc4q810q'
        })
        if (name == '') {
            setErrorTxt("Name must not be empty.")
            return
        } else if (uname == '') {
            setErrorTxt("Username must not be empty.")
            return
        } else if (mail == '') {
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
        addUser().then((x) => {
            console.log(x) 
            setSuccessTxt('Register success. Verification code is sent to your email.')
            setErrorTxt('')
        })
        .catch((m) => {
            console.log(`error: ${m.message}`)
            if (m.message.includes('which the schema does not allow')){
                setErrorTxt("User already exists.")
                console.log("in")
                console.log("user exists")
            } else {
                setErrorTxt(m.message)
                console.log("out: " + m.message)
            }
            setSuccessTxt('')
        })
    }
    
    const [jwtdec, setJWTDec] = useState({name: '', email: '', password: '', picture: '', aud: ''})
    const [addGoogleUser] = useMutation(REGISTER_USER, {
        variables: {
            name: jwtdec.name,
            email: jwtdec.email,
            username: (jwtdec.name.replace(/\s/g, '')),
            password: pass,
            google: jwtdec.aud,
            profile: jwtdec.picture
        },
      });

    useEffect(()=>{
        // console.log(jwtdec)
        console.log({
            name: jwtdec.name,
            email: jwtdec.email,
            username: (jwtdec.name.replace(/\s/g, '')),
            password: pass,
            google: jwtdec.aud,
            profile: jwtdec.picture
        })

        if (jwtdec.aud != '') {
            addGoogleUser().then((x) => {
                console.log(x.data.createUser) 
                setSuccessTxt('Authentication success.')
                setErrorTxt('')
                setUser(x.data.createUser)
            })
            .catch((m) => {
                console.log(`error: ${m.message}`)
                if (m.message.includes('which the schema does not allow')){
                    setErrorTxt("User already exists.")
                    console.log("in")
                    console.log("user exists")
                } else {
                    setErrorTxt(m.message)
                    console.log("out: " + m.message)
                }
                setSuccessTxt('')
            })
        }

    }, [jwtdec])

    return(
        <div>
            {/* navbar */}
            <div className="fixed top w-full">
            <Navbar1 page={'front'}/> 
            </div>
            <br/> <br/> <br/> 
            {/* body */}
            <div className={`flex ${width > 1000 ? 'flex-row mx-32' : 'flex-col mx-12'} mt-8 mb-16`}>
                <div className="items-center bg-white rounded-md px-6 py-3 w-80 shadow-lg m-auto">
                    <h1 className="text-secondary">Register</h1>
                    <h4>Make the most of your professional life</h4>
                    <form className="flex flex-col">
                    <input type="name" name="name" id="name" placeholder="Full Name" title="Full Name" className="text-input my-2" required onChange={(e) => setName(e.target.value)}/>
                    <input type="username" name="username" id="username" placeholder="Username" title="Username" className="text-input my-2" required onChange={(e) => setUname(e.target.value)}/>
                    <input type="email" name="email" id="email" placeholder="E-mail" title="E-mail" className="text-input my-2" required onChange={(e) => setMail(e.target.value)}/>
                    <input type="password" name="password" id="password" placeholder="Password (6 or more characters)" title="Password" className="text-input my-2" required onChange={(e) => setPass(e.target.value)}/>
                    

                    <div className="flex flex-col justify-center items-center">
                        {errortxt != '' && <div className="mx-2 text-center py-2 sec-box border-secondary rounded-md w-72  my-1">Error: {errortxt}</div>}
                        {successtxt != '' && <div className="mx-2 text-center py-2 green-box border-green rounded-md w-72  my-1">{successtxt}</div>}
                        <GoogleLogin 
                        onSuccess={credentialResponse => {
                            setJWTDec(jwtDecode(credentialResponse.credential))
                        }}
                        onError={() => {
                            console.log('Login Failed');
                        }}
                        useOneTap
                        />
                        <div className='mx-2 bg-primary-adv border-primary rounded-md w-72 button-text-white py-3 text-center my-1 hand' onClick={goRegister}>Register</div>
                        {/* <Link to={'/'} className='mx-2 bg-white-adv border-primary rounded-md w-72 button-text py-3 text-center my-1'>Continue with Google</Link> */}
                        <div className="my-4">Already on LinkHEdIn? <Link to='/login' className="link text-primary">Sign in</Link></div>
                    </div>
                    </form>
                </div>
                
            </div>
            {/* footer */}
            <br/> <br/> <br/> <Footer1 footerfront={true}/>
        </div>
    )
}