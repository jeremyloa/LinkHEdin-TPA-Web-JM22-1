import { useContext, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Footer1 from "../components/Footer1";
import Navbar1 from "../components/Navbar1";
import { UserContext } from "../contexts/UserContext";

export default function Logout(){
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
    const [msg, setMsg] = useState('')
    const {user, setUser} = useContext(UserContext)
    // console.log(user)
    const navigate = useNavigate()
    if (user && user.id) {
        localStorage.removeItem('user')
        setUser({})
    }

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
                    <h1 className="text-secondary">Sign out</h1>
                    <h4>You have been signed out.</h4>
                    <div className="flex flex-col justify-center items-center">
                        <Link to='/login' className="link text-primary py-1">Sign In</Link>
                    </div>
                </div>
            </div>
            {/* footer */}
            <br/> <br/> <br/> <Footer1 footerfront={true}/>
        </div>
    )
}