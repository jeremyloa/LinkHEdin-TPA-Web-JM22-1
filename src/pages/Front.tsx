import { useContext, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Footer1 from "../components/Footer1";
import Navbar1 from "../components/Navbar1";
import Navbar2 from "../components/Navbar2";
import { UserContext } from "../contexts/UserContext";

export default function Front(){
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

    const navigate = useNavigate()
    const {user, setUser} = useContext(UserContext)
    // console.log(user)
    if (user && user.id) {
        console.log(user)
        localStorage.setItem('user', JSON.stringify(user))
        navigate('/in/home')
    }
    return(
        <div>
            {/* navbar */}
            <div className="fixed w-full">
            <Navbar1 page={'front'}/> 
            </div>
            <br/> <br/> <br/> 
            {/* body */}
            <div className={`flex  ${width > 800 ? 'mx-32 flex-row' : 'mx-12 flex-col'} mt-8 mb-16`}>
                <div className="items-center">
                    <h1 className="text-secondary">Welcome to your professional community</h1>
                    <h4>LinkHEdIn is the world's largest professional network on the internet. You can use LinkedIn to find the right job or internship, connect and strengthen professional relationships, and learn the skills you need to succeed in your career.</h4>
                    <div className="flex flex-row">
                        <Link to={'/register'} className='mx-2 bg-white-adv border-primary rounded-md w-32 button-text py-3 text-center'>Register</Link>
                        <Link to={'/login'} className='mx-2 bg-primary-adv border-primary rounded-md w-32 button-text-white py-3 text-center'>Sign in</Link>
                    </div>
                </div>
                <img src="https://static-exp1.licdn.com/aero-v1/sc/h/dxf91zhqd2z6b0bwg85ktm5s4" className={`${width>800 ? 'w-half' : 'my-10'}`}/>
            </div>
            {/* footer */}
            <br/> <br/> <br/> <Footer1 footerfront={true}/>
        </div>
    )
}