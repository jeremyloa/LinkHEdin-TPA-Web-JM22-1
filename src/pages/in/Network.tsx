import { useQuery, useMutation } from "@apollo/client"
import { useContext, useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import Footer1 from "../../components/Footer1"
import Invitation from "../../components/Invitation"
import Navbar2 from "../../components/Navbar2"
import { UserContext } from "../../contexts/UserContext"
import { GET_USER_ID } from "../../Queries"

export default function Network(){
    const navigate = useNavigate()
    const {user, setUser} = useContext(UserContext)
    const {loading, error, data, refetch} = useQuery(GET_USER_ID, user ? {variables: {id: user.id}} : {variables: {id: ''}})
    if (data && data.UserbyID) setUser(data.UserbyID)
    // console.log(user)
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
                       <Invitation refetcher={refetch}/>
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