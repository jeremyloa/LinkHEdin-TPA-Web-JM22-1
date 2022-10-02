import { Link } from "react-router-dom";
import { PencilAltIcon, PhotographIcon, TrashIcon, VideoCameraIcon, XIcon } from "@heroicons/react/solid"
import { useContext, useEffect, useState } from "react";
import { MentionsInput, Mention } from "react-mentions"
import { useMutation, useQuery } from "@apollo/client";
import { GET_HASHTAGS, NEW_POST } from "../Queries";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { storage } from "../firebase";
import uuid from "react-uuid"
import { UserContext } from "../contexts/UserContext";

const tempUsers = [
    {
        id: "123",
        name: "Name",
        username: "username",
        display: "halo"
    },
    {
        id: "456",
        name: "Name2",
        username: "username2"
    }
]

const UserStyle = {
    backgroundColor: '#0077b580',
}

const HashtagStyle = {
    backgroundColor: '#c877b580',
}

const BoxStyle = {
    
    '&multiLine': {
    control: {
        minHeight: 63,
    },
    highlighter: {
        
        padding: 9,
        border: '1px solid transparent',
        boxSizing: 'border-box',
        overflow: 'hidden',
        height: 70,
    },
    input: {
        overflow: 'auto',
        padding: 9,
        border: '1px solid silver',
    },
    },

    '&singleLine': {
    display: 'inline-block',
    width: 180,

    highlighter: {
        padding: 1,
        border: '2px inset transparent',
        boxSizing: 'border-box',
        overflow: 'hidden',
        height: 70,
    },
    input: {
        padding: 1,
        border: '2px inset',
        overflow: 'auto',
    },
    },

    suggestions: {
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

export default function CreatePost({profile, userslist, refetcher}){
    const {user, setUser} = useContext(UserContext)

    const {loading, error, data, refetch} = useQuery(GET_HASHTAGS)
    const [allHashtags, setAllHashtags] = useState([{}])
    useEffect(()=>{
        if (data && data.Hashtag) {
            let temp = []
            for (let i = 0; i<data.Hashtag.length; i++) {
                temp.push({display: data.Hashtag[i].content, id: data.Hashtag[i].id})
                // data.Users[i].display = data.Users[i].username
            }
            setAllHashtags(temp)
            // console.log(temp)
        }
    }, [data])
    // console.log(data.Hashtag)
    const [openWrite, setOpenWrite] = useState(false);
    const toggleOpenWrite = () => {setOpenWrite(!openWrite)}
    const [postText, setPostText] = useState("");
    const [openImg, setOpenImg] = useState(false)
    const toggleOpenImg = () => {setOpenWrite(true);setOpenImg(!openImg)}
    const [upImg, setUpImg] = useState({url: '', blob: null})
    const upImgChange = (e) => {
        e.preventDefault()
        if (!e.target.files[0]) {
            alert(`Please only choose image.`);
            return;
        } else {
            // console.log(e.target.files[0].name)
            const posimgRef = ref(storage, `post/${profile.id}/${uuid() + e.target.files[0].name}`)
            uploadBytes(posimgRef, e.target.files[0]).then((snapshot)=>{
                console.log('uploaded img')
                getDownloadURL(snapshot.ref).then((downloadURL) => {
                    console.log('img link: ' + downloadURL)
                    setUpImg({url: downloadURL, blob: e.target.files[0]})
                })
            })
        }
    }
    const [openVid, setOpenVid] = useState(false)
    const toggleOpenVid = () => {setOpenWrite(true);setOpenVid(!openVid)}
    const [upVid, setUpVid] = useState({url: '', blob: null})
    const upVidChange = (e) => {
        e.preventDefault()
        if (!e.target.files[0]) {
            alert(`Please only choose video.`);
            return;
        } else {
            // console.log(e.target.files[0].name)
            const posvidRef = ref(storage, `post/${profile.id}/${uuid() + e.target.files[0].name}`)
            uploadBytes(posvidRef, e.target.files[0]).then((snapshot)=>{
                console.log('uploaded vid')
                getDownloadURL(snapshot.ref).then((downloadURL) => {
                    console.log('vid link: ' + downloadURL)
                    setUpVid({url: downloadURL, blob: e.target.files[0]})
                })
            })
        }
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
    
    const [newPost] = useMutation(NEW_POST, {
        variables: {
            poster: user.id,
            content: postText,
            image: upImg.url,
            video: upVid.url,
            postdate: (new Date(Date.now()).toJSON()).toString()
        }
    })
    function goPost(e){
        e.preventDefault()
        console.log({
            poster: user.id,
            content: postText,
            image: upImg.url,
            video: upVid.url,
            postdate: (new Date(Date.now()).toJSON()).toString()
        })
        if (postText != '') {
            newPost().then((x)=>{
                refetcher()
                setOpenWrite(!openWrite)
            })
        }
    }
    return(
        <div className="flex flex-col bg-white rounded-md border-semitrans p-3 mb-2">
            { openWrite===true &&
            <div className="modal absolute">
                <div className={`bg-white rounded-md border-semitrans px-3 py-2 mx-1 flex flex-col ${width>1000 ? 'w-half' : `${width>500 ? 'w-threefourth' : 'w-full'}`}`}>
                    <div className="flex flex-row justify-between my-2">
                        <div className="text-lg font-bold">Create a post</div>
                        <XIcon className="h-6 w-6 link" onClick={toggleOpenWrite}/>
                    </div>
                    <div className="flex flex-row my-2">
                        <img src={profile.profile} className="w-12 profile-picture"/>
                        <div className="flex flex-col ml-3">
                            <div className="font-bold">{profile.name}</div>
                            <div className="">{profile.headline}</div>
                        </div>
                    </div>
                    <div>
                        {/* <textarea className="text-area mt-2" placeholder="What do you want to talk about?" value={postText} autoFocus={true} onChange={(e) => setPostText(e.target.value)}/> */}
                        <MentionsInput value={postText} onChange={e => {setPostText(e.target.value)}} className="text-area mt-2" style={BoxStyle}>
                            <Mention data={userslist} style={UserStyle} trigger="@" markup='@[__display__](__id__)'/>
                            <Mention data={allHashtags} style={HashtagStyle} trigger="#" markup='#[__display__](__id__)'/>
                        </MentionsInput>
                        { openImg === true &&
                        <div className="flex flex-row justify-center">
                            {upImg && <TrashIcon className="h-6 w-6 link px-2" onClick={e => {setUpImg({url: '', blob: null}); setOpenImg(!openImg)}}/>}
                            <div className="flex flex-row">
                                <div className="px-2">Image: </div>
                                <input type={`file`} className="input-file font-bold text-sm" accept="image/gif, image/jpeg, image/png" name="image" onChange={upImgChange}/>
                            </div>
                        </div>}
                        {openImg === true && upImg && upImg.url != '' &&
                        <img src={upImg.url} className="w-half py-2"/>}
                        { openVid === true &&
                        <div className="flex flex-row justify-center">
                            {upVid && <TrashIcon className="h-6 w-6 link px-2" onClick={e => {setUpVid({url: '', blob: null}); setOpenVid(!openVid)}}/>}
                            <div className="flex flex-row">
                                <div className="px-2">Video: </div>
                                <input type={`file`} className="input-file font-bold text-sm" accept="video/mp4" name="video" onChange={upVidChange}/>    
                            </div>
                        </div>}
                        {openVid === true && upVid && upVid.url != '' &&
                        <video src={upVid.url} controls className="w-half py-2"/>}
                    </div>
                    <div className={`flex ${width>500 ? 'mt-3 flex-row' : 'flex-col'}`}>
                        <div className={`button-semitrans flex flex-row rounded-md px-3 ${width>500 ? 'w-full' : 'mt-3'} py-2 mx-1`} onClick={toggleOpenImg}>
                            <PhotographIcon className="h-6 w-6 text-primary"/>
                            <div className="ml-2">Picture</div>
                        </div>
                        <div className={`button-semitrans flex flex-row rounded-md px-3 ${width>500 ? 'w-full' : 'mt-3'} py-2 mx-1`} onClick={toggleOpenVid}>
                            <VideoCameraIcon className="h-6 w-6 text-secondary"/>
                            <div className="ml-2">Video</div>
                        </div>
                        <div className={`${postText ? 'button-primarynew' : ''} flex flex-row rounded-md px-3 ${width>500 ? 'w-full' : 'mt-3'} py-2 mx-1`} onClick={goPost}>
                            <PencilAltIcon className={`h-6 w-6 ${postText ? 'text-white' : ''}`}/>
                            <div className={`ml-2 ${postText ? 'text-white' : ''}`}>Post</div>
                        </div>
                    </div>
                </div>
            </div>}
            <div className="flex flex-row">
                <Link to={`/in/profile/${profile.username}`}>
                    <img src={profile.profile} className="w-12 profile-picture"/>
                </Link>
                <button onClick={toggleOpenWrite} className="pl-3 border-semitrans button-semitrans w-full rounded-md ml-2 text-left text-lg">Start a post</button>
            </div>
            <div className={`flex ${width>500 ? 'mt-3 flex-row' : 'flex-col'}`}>
                <div className={`button-semitrans flex flex-row rounded-md px-3 ${width>500 ? 'w-full' : 'mt-3'} py-2 mx-1`} onClick={toggleOpenImg}>
                    <PhotographIcon className="h-6 w-6 text-primary"/>
                    <div className="ml-2">Picture</div>
                </div>
                <div className={`button-semitrans flex flex-row rounded-md px-3 ${width>500 ? 'w-full' : 'mt-3'} py-2 mx-1`} onClick={toggleOpenVid}>
                    <VideoCameraIcon className="h-6 w-6 text-secondary"/>
                    <div className="ml-2">Video</div>
                </div>
                <div className={`button-semitrans flex flex-row rounded-md px-3 ${width>500 ? 'w-full' : 'mt-3'} py-2 mx-1`} onClick={toggleOpenWrite}>
                    <PencilAltIcon className="h-6 w-6 text-primary"/>
                    <div className="ml-2">Post</div>
                </div>
            </div>
        </div>
    )
}