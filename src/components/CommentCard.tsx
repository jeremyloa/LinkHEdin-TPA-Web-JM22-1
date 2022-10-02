import { useMutation, useQuery } from "@apollo/client"
import { useContext, useEffect, useState } from "react"
import { Link } from "react-router-dom"
import { GET_COMMENTS, GET_HASHTAGS, GET_USERS, GET_USER_ID, NEW_COMMENT, TOGGLE_LIKE_COMMENT, TOGGLE_LIKE_POST } from "../Queries"
import SmallProfile from "./SmallProfile"
import { MentionsInput, Mention } from "react-mentions"
import { ChatIcon, PencilAltIcon, PhotographIcon, ShareIcon, ThumbUpIcon, VideoCameraIcon } from "@heroicons/react/solid"
import { UserContext } from "../contexts/UserContext"
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
        minHeight: 30,
    },
    input: {
        overflow: 'auto',
        border: '0px solid silver',
    },
    },
}

const BoxStyleCon = {
    
    '&multiLine': {
    control: {
        minHeight: 63,
    },
    highlighter: {
        
        padding: 9,
        border: '1px solid transparent',
        boxSizing: 'border-box',
        overflow: 'hidden',
        minHeight: 70,
    },
    input: {
        overflow: 'auto',
        padding: 9,
        border: '1px solid silver',
        minHeight: 70,

    },
    },

    suggestions: {
        position: 'absolute', 
        marginTop: '1.75rem',

    list: {
        backgroundColor: 'white',
        border: '1px solid rgba(0,0,0,0.15)',
        fontSize: 14,
    },
    item: {
        padding: '5px 15px',
        borderBottom: '1px solid rgba(0,0,0,0.15)',
        '&focused': {
        backgroundColor: '#0077b5',
        color: '#ffffff'
        },
    },
    },
}

export default function CommentCard({com, refetcher, users}){
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
    // console.log(allUsers)
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

    const [toggleLikeComment] = useMutation(TOGGLE_LIKE_COMMENT, {
        variables: {
            id: com.id,
            liker: user.id
        }
    })
    function goToggleLike(e){
        e.preventDefault()
        console.log({
            id: com.id,
            liker: user.id
        })
        toggleLikeComment().then((x) => {
            console.log(x) 
            refetcher() 
        })
        .catch((m) => {
            console.log("out: " + m.message)
        })
    }

    const [openWrite, setOpenWrite] = useState(false);
    const toggleOpenWrite = () => {setOpenWrite(!openWrite)}

    const comments = useQuery(GET_COMMENTS)
    const [postText, setPostText] = useState("");

    const [newRep] = useMutation(NEW_COMMENT, {
        variables: {
            parentPost: com.parentPost,
            parentComment: com.id,
            commenter: user.id, 
            content: postText,
            postdate: (new Date(Date.now()).toJSON()).toString()
        }
    })
    function goRep(e){
        e.preventDefault()
        console.log({
            parentPost: com.parentPost,
            parentComment: com.id,
            commenter: user.id, 
            content: postText,
            postdate: (new Date(Date.now()).toJSON()).toString()
        })
        if (postText != ''){
            newRep().then((x)=>{
                comments.refetch()
                refetcher()
                setOpenWrite(!openWrite)
            })
        }
    }

    return(

        <div className="flex flex-col justify-between">
            <div className="flex flex-row w-full">
                <Link to={`/in/profile/${users.data.Users.filter((idx)=>{return idx.id === com.commenter})[0].username}`} className="link">
                    <img src={users.data.Users.filter((idx)=>{return idx.id === com.commenter})[0].profile} className="w-10 profile-picture" />
                </Link>
                <div className="flex flex-col ml-2 w-full">
                    <Link to={`/in/profile/${users.data.Users.filter((idx)=>{return idx.id === com.commenter})[0].username}`} className="link font-bold">
                        <div>{users.data.Users.filter((idx)=>{return idx.id === com.commenter})[0].name}</div>
                    </Link>
                    <MentionsInput value={com.content} className="text-area-show m-0" style={BoxStyle} disabled>
                        <Mention data={allUsers} style={UserStyle} trigger="@" markup='@[__display__](__id__)'/>
                        <Mention data={allHashtags} style={HashtagStyle} trigger="#" markup='#[__display__](__id__)'/>
                    </MentionsInput>
                    <div className="flex flex-row mt--6 mb-1">
                        {com.liker.split(",").includes(user.id) ? <div className="link text-sm" onClick={goToggleLike}>Unlike</div> : <div className="link text-sm" onClick={goToggleLike}>Like</div>}
                        <div className="ml-2 text-sm">{"("}{com.liker.split(",").length - 1} {com.liker.split(",").length-1<=1 ? "Like" : "Likes"}{")"}</div>
                        <div className="ml-2 link text-sm" onClick={toggleOpenWrite}>Reply</div>
                    </div>
                    { openWrite && 
                    <div className="mb-4" >
                        <MentionsInput value={postText} onChange={e => {setPostText(e.target.value)}} className="text-area mt-2" style={BoxStyleCon}>
                            <Mention data={allUsers} style={UserStyle} trigger="@" markup='@[__display__](__id__)'/>
                            <Mention data={allHashtags} style={HashtagStyle} trigger="#" markup='#[__display__](__id__)'/>
                        </MentionsInput>
                        <div className="w-onefourth mt-2">
                            <div className={`${postText ? 'button-primarynew' : ''} flex flex-row rounded-md px-3 ${width>500 ? 'w-full' : 'mt-3'} py-2 mx-1`} onClick={goRep}>
                                <PencilAltIcon className={`h-6 w-6 ${postText ? 'text-white' : ''}`}/>
                                <div className={`ml-2 ${postText ? 'text-white' : ''}`}>Post</div>
                            </div>
                        </div>
                    </div>}
                </div>
            </div>

            {comments && comments.data && comments.data.Comment && 
            <div className="ml-12">
                {comments.data.Comment.map((rep)=>( rep.parentComment === com.id && 
                    <CommentCard com={rep} refetcher={comments.refetch} users={users}/>
                ))}
            </div>
            }
        </div>
    )

}