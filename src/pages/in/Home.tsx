import { useContext, useEffect, useState } from "react";
import Navbar2 from "../../components/Navbar2";

import SmallProfile from "../../components/SmallProfile";
import { Link, useNavigate } from "react-router-dom";
import CreatePost from "../../components/CreatePost";
import Footer1 from "../../components/Footer1";
import Post from "../../components/Post";
import { useQuery } from "@apollo/client";
// import { GET_USERS } from "../../Queries";
import { UserContext } from "../../contexts/UserContext";
import { GET_POSTS, GET_USERS, GET_USER_ID } from "../../Queries";

// const tempProfile = {
//     profile: '../../src/assets/jer.jpg',
//     name: 'Jeremy Loa',
//     username: 'jeremyloa',
//     id: 123,
//     headline: 'Headline',
//     job: 'Current Job',
//     cover: '../../src/assets/jercover.jpg'
// }


export default function Home(){
    const navigate = useNavigate()
    const {user, setUser} = useContext(UserContext)
    const allpostsquery = useQuery(GET_POSTS)
    const [allPosts, setAllPosts] = useState([{}])
    // console.log(allpostsquery)
    const currUser = useQuery(GET_USER_ID, {variables: {id: user.id}})
    useEffect(()=>{
        if (allpostsquery && allpostsquery.data && allpostsquery.data.Post) {
            // console.log(allpostsquery.data.Post)
            setAllPosts(allpostsquery.data.Post)
        }
    }, [allpostsquery])
    const tempPost = {
        poster: '8c3551b1-f5ef-4305-84b7-fd49568bb25f',
        content: `@[jeremyloa](8c3551b1-f5ef-4305-84b7-fd49568bb25f) #[#BINUSUNIVERSITY](54c9d4ed-d566-47e1-b67a-1b5911c4446c) aaaaa a`,
        image:  '../../src/assets/tesfoto.jpg',
        postdate: '2016-07-20T17:30:15+05:30',
        video: '../../src/assets/tesvideo.mp4',
        liker: ',58b9b5b8-34f7-4142-934d-b5a8a83bb500,'
    }
    // console.log(user)
    if (!user || !user.id) {
        navigate('/login')
    }

    
    const [width, setWidth] = useState(0)

    const [allUserList, setAllUserList] = useState([{}])
    // const {loading, data} = useQuery(GET_USERS)
    const {loading, error, data, refetch} = useQuery(GET_USERS)
    // if (data) console.log(data.Users)
    // if (loading){
    //     console.log("lagi loading")
    // } else {
    //     console.log(data)
    // }

    useEffect(()=>{
        if (data && data.Users) {
            let temp = []
            for (let i = 0; i<data.Users.length; i++) {
                temp.push({display: data.Users[i].username, id: data.Users[i].id})
                // data.Users[i].display = data.Users[i].username
            }
            setAllUserList(temp)
            // console.log(temp)
        }
    }, [data])
    
    useEffect(() => {
        updateWidth()
        window.addEventListener("resize", updateWidth)
        return () => window.removeEventListener("resize", updateWidth)
    }, [])

    const updateWidth = () => {
        setWidth(window.innerWidth)
        // console.log(window.innerWidth)
    }
    return( user && currUser && currUser.data && currUser.data.UserbyID &&
        <>
            {/* navbar */}
            <div className="fixed-top w-full">
            {user && <Navbar2 profile={user}/>}
            </div>
            <br/> 
            {/* body */}
            <div className={`mt-1 flex ${width > 900 ? 'mx-32' : 'mx-12'}`}>
                <div className={`${width > 1200 ? 'grid main-grid-container' : `${width>900 ? 'grid sec-grid-container' : 'flex flex-col'}`} w-full justify-center`}>
                    {/* left */}
                    <div className="flex flex-col mb-3">
                        {<SmallProfile profile={user}/>}
                        {width < 1220 && width > 900 &&
                        <div className="flex flex-col mt-3">
                            <img src="https://media.licdn.com/media/AAYQAgTPAAgAAQAAAAAAADVuOvKzTF-3RD6j-qFPqhubBQ.png" className="rounded-md border-semitrans mb-3"/>
                            <Footer1 footerfront={false}/>
                        </div>}
                    </div>
                    {/* mid */}
                    <div className="flex flex-col">
                        {allUserList && <CreatePost profile={user} userslist={allUserList} refetcher={allpostsquery.refetch}/>}
                        {allPosts && allPosts.map((pos)=>( (currUser.data.UserbyID.followed.split(",").includes(pos.poster) || currUser.data.UserbyID.connected.split(",").includes(pos.poster) || pos.poster == user.id) && <Post pos={pos} refetcher={allpostsquery.refetch}/>))}
                        {/* <Post pos={tempPost}/> */}
                    </div>
                    {/* right */}
                    {width > 1220 &&
                    <div className="flex flex-col">
                        <img src="https://media.licdn.com/media/AAYQAgTPAAgAAQAAAAAAADVuOvKzTF-3RD6j-qFPqhubBQ.png" className="rounded-md border-semitrans mb-3"/>
                        <Footer1 footerfront={false}/>
                    </div>}
                </div>
            </div>
        </>
    )
}