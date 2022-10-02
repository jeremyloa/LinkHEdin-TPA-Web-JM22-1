import { useMutation, useQuery } from "@apollo/client"
import { useContext, useEffect, useState } from "react"
import { Link } from "react-router-dom"
import { GET_COMMENTS, GET_HASHTAGS, GET_USERS, GET_USER_ID, NEW_COMMENT, TOGGLE_LIKE_COMMENT, TOGGLE_LIKE_POST } from "../Queries"
import SmallProfile from "./SmallProfile"
import { MentionsInput, Mention } from "react-mentions"
import { ChatIcon, PencilAltIcon, PhotographIcon, ShareIcon, ThumbUpIcon, VideoCameraIcon } from "@heroicons/react/solid"
import { UserContext } from "../contexts/UserContext"
import CommentCard from "./CommentCard"
// import JsxParser from 'react-jsx-parser'
// import ReactDOMServer from 'react-dom/server';

const UserStyle = {
    backgroundColor: '#0077b580',
}

const HashtagStyle = {
    backgroundColor: '#c877b580',
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

export default function Commentt({postid, setopenwr, openwr, settotalcom, totalcom}){
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


    const comments = useQuery(GET_COMMENTS)
    useEffect(()=>{
        if (comments && comments.data && comments.data.Comment) {
            settotalcom(
                comments.data.Comment.filter(cm => {
                    if (cm.parentPost === postid)  return true; return false;
                }).length
            )
            console.log("tes")
        }
    }, [comments.data])

    const users = useQuery(GET_USERS)    

    
    const [postText, setPostText] = useState("");

    const [newCom] = useMutation(NEW_COMMENT, {
        variables: {
            parentPost: postid,
            parentComment: '',
            commenter: user.id, 
            content: postText,
            postdate: (new Date(Date.now()).toJSON()).toString()
        }
    })
    function goCom(e){
        e.preventDefault()
        console.log({
            parentPost: postid,
            parentComment: '',
            commenter: user.id, 
            content: postText,
            postdate: (new Date(Date.now()).toJSON()).toString()
        })
        if (postText != ''){
            newCom().then((x)=>{
                comments.refetch()
                // refetcher()
                // setopenwr(!openwr)
            })
        }
    }



    return( comments && comments.data && comments.data.Comment && users && users.data && users.data.Users &&
        <div>
            <div className="mb-4" >
                <MentionsInput value={postText} onChange={e => {setPostText(e.target.value)}} className="text-area mt-2" style={BoxStyleCon}>
                    <Mention data={allUsers} style={UserStyle} trigger="@" markup='@[__display__](__id__)'/>
                    <Mention data={allHashtags} style={HashtagStyle} trigger="#" markup='#[__display__](__id__)'/>
                </MentionsInput>
                <div className="w-onefourth mt-2">
                    <div className={`${postText ? 'button-primarynew' : ''} flex flex-row rounded-md px-3 ${width>500 ? 'w-full' : 'mt-3'} py-2 mx-1`} onClick={goCom}>
                        <PencilAltIcon className={`h-6 w-6 ${postText ? 'text-white' : ''}`}/>
                        <div className={`ml-2 ${postText ? 'text-white' : ''}`}>Post</div>
                    </div>
                </div>
            </div>

            <div className="flex flex-col bg-white rounded-md p-3 my-2">
                {/* {console.log()} */}
                {comments.data.Comment.map((com)=>( com.parentPost === postid && !com.parentComment &&
                    <CommentCard com={com} refetcher={comments.refetch} users={users}/>
                ))}
            </div>
        </div>
    )
}