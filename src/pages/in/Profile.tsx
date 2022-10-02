import { useMutation, useQuery } from "@apollo/client"
import { useContext, useEffect, useState } from "react"
import { useNavigate, useParams } from "react-router-dom"
import BigProfile from "../../components/BigProfile"
import Education from "../../components/Education"
import Experience from "../../components/Experience"
import Footer1 from "../../components/Footer1"
import Navbar2 from "../../components/Navbar2"
import { UserContext } from "../../contexts/UserContext"
import { ADD_VIEW, GET_USER_UNAME } from "../../Queries"

export default function Profile (){
    const {unam} = useParams()
    // console.log(unam)
    const navigate = useNavigate()
    const {user, setUser} = useContext(UserContext)
    const {loading, error, data, refetch} = useQuery(GET_USER_UNAME, {variables: {username: unam}})
    const [prof, setProf] = useState({})
    
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
    
    const [addView] = useMutation(ADD_VIEW, {variables: {username: unam}})
    useEffect(()=>{
        if (data) {
            setProf(data.UserbyUname)
            console.log(data.UserbyUname)
            if (data.UserbyUname.id == user.id) return
            addView().then((x)=>{
                console.log(x)
            }).catch((m)=>{
                console.log(m.message)
            })
        }
    }, [data])
   
    return ( user &&
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
                       <BigProfile profile={prof} refetcher={refetch}/>
                       <Experience profile={prof} refetcher={refetch}/>
                       <Education profile={prof} refetcher={refetch}/>
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