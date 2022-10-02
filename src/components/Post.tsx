import { useMutation, useQuery } from "@apollo/client"
import { useContext, useEffect, useState } from "react"
import { Link } from "react-router-dom"
import { GET_COMMENTS, GET_HASHTAGS, GET_USERS, GET_USER_ID, NEW_COMMENT, TOGGLE_LIKE_POST } from "../Queries"
import SmallProfile from "./SmallProfile"
import TagHash from "./TagHash"
import TagUser from "./TagUser"
import { MentionsInput, Mention } from "react-mentions"
import { ChatIcon, PencilAltIcon, PhotographIcon, ShareIcon, ThumbUpIcon, VideoCameraIcon } from "@heroicons/react/solid"
import { UserContext } from "../contexts/UserContext"
import Commentt from "./Commentt"
// import JsxParser from 'react-jsx-parser'
// import ReactDOMServer from 'react-dom/server';

const UserStyle = {
    backgroundColor: '#0077b580',
}

const HashtagStyle = {
    backgroundColor: '#c877b580',
}

const BoxStyle = {
    
    '&multiLine': {
    highlighter: {
        boxSizing: 'border-box',
        overflow: 'hidden',
        height: 70,
    },
    input: {
        overflow: 'auto',
        border: '0px solid silver',
    },
    },
}



export default function Post({pos, refetcher}){
    const [openWrite, setOpenWrite] = useState(false);
    const {user, setUser} = useContext(UserContext)
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

    const {loading, error, data, refetch} = useQuery(GET_USER_ID, {variables: {id: pos.poster}})
    const alluserslist = useQuery(GET_USERS)
    const allhashtags = useQuery(GET_HASHTAGS)
    const [allUsers, setAllUsers] = useState([{}])
    const [allHashtags, setAllHashtags] = useState([{}])

    // if (alluserslist && alluserslist.data.Users) console.log(alluserslist.data.Users)
    useEffect(()=>{
        if (alluserslist && alluserslist.data && alluserslist.data.Users) {
            let temp = []
            for (let i = 0; i<alluserslist.data.Users.length; i++) {
                temp.push({display: alluserslist.data.Users[i].username, id: alluserslist.data.Users[i].id})
            }
            setAllUsers(temp)
        }
    }, [alluserslist.data])

    // if (allhashtags && allhashtags.data.Hashtag) console.log(allhashtags.data.Hashtag)
    useEffect(()=>{
        if (allhashtags && allhashtags.data && allhashtags.data.Hashtag) {
            let temp = []
            for (let i = 0; i<allhashtags.data.Hashtag.length; i++) {
                temp.push({display: allhashtags.data.Hashtag[i].content, id:allhashtags.data.Hashtag[i].id})
            }
            setAllHashtags(temp)
        }
    }, [allhashtags.data])

    const [hoverProfile, setHoverProfile] = useState(false)
    const handleMouseOver = () => {setHoverProfile(true)}
    const handleMouseOut = () => {setHoverProfile(false)}
    
    const [toggleLike] = useMutation(TOGGLE_LIKE_POST, {
        variables: {
            id: pos.id,
            liker: user.id
        }
    })
    function goToggleLike(e){
        e.preventDefault()
        console.log({
            id: pos.id,
            liker: user.id
        })
        toggleLike().then((x) => {
            console.log(x) 
            refetcher() 
        })
        .catch((m) => {
            console.log("out: " + m.message)
        })
    }

    const toggleOpenWrite = () => {setOpenWrite(!openWrite)}
    
    const [totalcom, settotalcom] = useState(0)

    const comments = useQuery(GET_COMMENTS)
    useEffect(()=>{
        if (comments && comments.data && comments.data.Comment) {
            settotalcom(
                comments.data.Comment.filter(cm => {
                    if (cm.parentPost === pos.id)  return true; return false;
                }).length
            )
        }
    }, [comments.data])


    // console.log(pos)
    return( data && data.UserbyID && alluserslist && alluserslist.data && alluserslist.data.Users && allhashtags && allhashtags.data && allhashtags.data.Hashtag && 
        <div className="flex flex-col bg-white rounded-md border-semitrans p-3 mb-2">
                {hoverProfile && <div className="absolute mt-14 w-48"><SmallProfile profile={data.UserbyID} refetcher={data.refetch}/></div>}
            <div className="flex flex-row justify-between">
                <Link to={`/in/profile/${data.UserbyID.username}`} className="link flex flex-row" onMouseOver={handleMouseOver} onMouseOut={handleMouseOut}>
                    <img src={data.UserbyID.profile} className="w-12 profile-picture" />
                    <div className="flex flex-col ml-2">
                        <div className="font-bold">{data.UserbyID.name}</div>
                        <div>{data.UserbyID.headline}</div>
                    </div>
                </Link>
                <div className="flex flex-col items-end">
                    <div>{new Date(pos.postdate).toLocaleDateString('en-UK', { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric' })}</div>
                    <div>{new Date(pos.postdate).toLocaleTimeString('en-UK')}</div>
                </div>
            </div>
            <div className="mt-4 w-full flex flex-row">
                <MentionsInput value={pos.content} className="text-area-show mt-2" style={BoxStyle} disabled>
                    <Mention data={allUsers} style={UserStyle} trigger="@" markup='@[__display__](__id__)'/>
                    <Mention data={allHashtags} style={HashtagStyle} trigger="#" markup='#[__display__](__id__)'/>
                </MentionsInput>
                {/* {pos.content} */}
                {/* <JsxParser onError={e => console.log(e)} jsx={pos.content}/> */}
                {/* <> Hello world! <TagUser profid={"8c3551b1-f5ef-4305-84b7-fd49568bb25f"} tag={"jeremyloa"} /> <TagHash hashid={"54c9d4ed-d566-47e1-b67a-1b5911c4446c"} tag={"#BINUSUNIVERSITY"}/> </> */}
            </div>
            {pos.image && <img src={pos.image} className="w-full py-2 rounded-md"/>}        
            {pos.video && <video src={pos.video} controls className="w-full py-2 rounded-md"/>}

            <div className={`flex ${width>500 ? 'mt-3 flex-row' : 'flex-col'}`}>
                {pos && user && 
                <div className={`flex flex-row ${width>500 ? 'w-full' : 'mt-3'} py-2 mx-1`}>
                    {pos.liker ? `${pos.liker.split(",").length - 1} ${pos.liker.split(",").length-1 <=1 ? "Like" : "Likes"}`: 'No likes'}
                </div>}
                {pos && user && 
                <div className={`flex flex-row ${width>500 ? 'w-full' : 'mt-3'} py-2 mx-1`}>
                    {totalcom > 0 ? `${totalcom} ${totalcom <=1 ? "Comment" : "Comments"}`: 'No comments'}
                </div>}
                {pos && user && 
                <div className={`flex flex-row ${width>500 ? 'w-full' : 'mt-3'} py-2 mx-1`}>
                    Shares
                </div>}
            </div>

            <div className={`flex ${width>500 ? 'flex-row' : 'flex-col'}`}>
                <div className={`button-semitrans flex flex-row rounded-md px-3 ${width>500 ? 'w-full' : 'mt-3'} py-2 mx-1`} onClick={goToggleLike}>
                    <ThumbUpIcon className="h-6 w-6 text-primary"/>
                    {pos && user && pos.liker && pos.liker.split(",").includes(user.id) 
                    ? 
                    <div className="ml-2">Unlike</div>
                    :
                    <div className="ml-2">Like</div>
                }
                {/* <div className='bg-primary-adv border-primary rounded-md px-2 button-text-white py-1 mr-2 text-sm text-center hand' onClick={goFollow}>Unfollow</div> */}
                {/* <div className='bg-white-adv border-primary rounded-md px-2 button-text py-1 mr-2 text-sm text-center hand' onClick={goFollow}>Follow</div> */}
                </div>
                <div className={`button-semitrans flex flex-row rounded-md px-3 ${width>500 ? 'w-full' : 'mt-3'} py-2 mx-1`} onClick={toggleOpenWrite}>
                    <ChatIcon className="h-6 w-6 text-secondary"/>
                    <div className="ml-2">Comment</div>
                </div>
                <div className={`button-semitrans flex flex-row rounded-md px-3 ${width>500 ? 'w-full' : 'mt-3'} py-2 mx-1`} >
                    <ShareIcon className="h-6 w-6 text-primary"/>
                    <div className="ml-2">Share</div>
                </div>
            </div>

           { openWrite &&  
           <div>
                <Commentt postid={pos.id} setopenwr={setOpenWrite} openwr={openWrite} settotalcom={settotalcom} totalcom={totalcom}/>
            </div>}
        </div>
    )
}