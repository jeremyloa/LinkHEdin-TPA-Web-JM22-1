import { useQuery, useMutation } from "@apollo/client"
import { useContext, useEffect, useState } from "react"
import { useNavigate, useParams } from "react-router-dom"
import Footer1 from "../../components/Footer1"
import Navbar2 from "../../components/Navbar2"
import Post from "../../components/Post"
import SmallProfile from "../../components/SmallProfile"
import { UserContext } from "../../contexts/UserContext"
import { GET_POSTS, GET_USERS } from "../../Queries"

export default function Search(){
    const {quer} = useParams()
    const navigate = useNavigate()
    const {user, setUser} = useContext(UserContext)
    const allPosts = useQuery(GET_POSTS)
    const allUsers = useQuery(GET_USERS)
    
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
                        <div className="flex flex-col items-start bg-white rounded-md border-semitrans p-8 my-4">
                            <div className="flex flex-row w-full justify-between">
                                <h3 className="p-0 m-0">Users matching '{quer}'</h3>
                            </div>
                            <ul className="general-grid-container">
                            {allUsers && allUsers.data && allUsers.data.Users.map((us)=>(  (us.name.includes(quer) || us.username.includes(quer)) && <div className="my-2 mx-1"><SmallProfile profile={us} refetcher={allUsers.refetch}/></div>))}
                            </ul>
                        </div>
                        <h3 className="p-0 mt-3">Posts matching '{quer}'</h3>
                        {allPosts && allPosts.data && allPosts.data.Post.map((pos)=>( pos.content.includes(quer) && <Post pos={pos} refetcher={allPosts.refetch}/>))}
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