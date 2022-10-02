import { useQuery, useMutation } from "@apollo/client"
import { useContext, useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import Footer1 from "../../components/Footer1"
import Navbar2 from "../../components/Navbar2"
import { UserContext } from "../../contexts/UserContext"

export default function Notification(){
    const navigate = useNavigate()
    const {user, setUser} = useContext(UserContext)
    
    if (!user || !user.id) {
        navigate('/login')
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

    return( user &&
        <div>
            {/* navbar */}
            <div className="fixed-top w-full">
                <Navbar2 profile={user}/> 
            </div>
            <br/> 
            {/* body */}
            <div className={`mt-1 flex ${width > 900 ? 'mx-32' : 'mx-12'}`}>
                <div className={`${width > 1200 ? 'grid sec-grid-container-b' : `${width>1000 ? 'grid sec-grid-container-b' : 'flex flex-col'}`} w-full justify-center`}>
                    {/* left/center */}
                    <div className="flex flex-col mb-3">
                       Halo
                    </div>
                    {/* right */}
                    {width > 1000 &&
                    <div className="flex flex-col">
                        <img src="https://media.licdn.com/media/AAYQAgTPAAgAAQAAAAAAADVuOvKzTF-3RD6j-qFPqhubBQ.png" className="rounded-md border-semitrans mb-3"/>
                        <Footer1 footerfront={false}/>
                    </div>}
                </div>
            </div>
        </div>
    )
}