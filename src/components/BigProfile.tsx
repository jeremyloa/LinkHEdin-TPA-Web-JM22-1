import { useMutation, useQuery } from "@apollo/client"
import { PencilAltIcon, PhotographIcon, VideoCameraIcon, XIcon } from "@heroicons/react/solid"
import { getDownloadURL, ref, uploadBytes } from "firebase/storage"
import { storage } from "../firebase"
import { useContext, useEffect, useState } from "react"
import { UserContext } from "../contexts/UserContext"
import { ADD_VIEW, GET_USER_ID, GET_USER_UNAME, SEND_CONNECT_USER, TOGGLE_BLOCK, TOGGLE_FOLLOW, UPDATE_PROFILE } from "../Queries"
import uuid from "react-uuid"

export default function BigProfile({profile, refetcher}){
    
    const {user, setUser} = useContext(UserContext)
    // console.log(user.id + " " + profile.id)
    const {loading, error, data, refetch} = useQuery(GET_USER_ID, {variables: {id: user.id}})

    if (data) setUser(data.UserbyID)
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

    // if (user){
    //     console.log(user)
    // }
    // if (profile){
    //     console.log(profile)
    // }
    // if (user && user.connected) {
    //     console.log(user.connected.split(","))
    //     console.log(user.followed.split(","))
    // }
    // if (profile && profile.connected) {
    //     console.log(profile.connected.split(","))
    //     console.log(profile.requestconnect.split(","))

    // }

    const [name, setName] = useState(profile.name)
    const [headline, setHeadline] = useState(profile.headline)
    const [profpic, setProfpic] = useState({url: user.profile, blob: null})
    const [cover, setCover] = useState({url: user.cover, blob: null})

    const [sendConnect] = useMutation(SEND_CONNECT_USER, {
        variables: {
            id: user.id,
            id2: profile.id
        }
    })
    function goConnect(e){
        e.preventDefault()
        if (user.id && profile.id) {
            console.log({
                id: user.id,
                id2: profile.id
            })
            sendConnect().then((x)=>{
                // console.log(x)
                refetcher()
            }).catch((m)=>{
                console.log("error: " + m.message)
            })
        }
    }

    const [toggleFollow] = useMutation(TOGGLE_FOLLOW, {
        variables: {
            id: user.id,
            id2: profile.id
        }
    })
    function goFollow(e){
        e.preventDefault()
        if (user.id && profile.id) {
            console.log({
                id: user.id,
                id2: profile.id
            })
            toggleFollow().then((x)=>{
                // console.log(x)
                refetcher()
                refetch().then(()=>{setUser(data.UserbyID)})
            }).catch((m)=>{
                console.log("error: " + m.message)
            })
        }
    }

    const [toggleBlock] = useMutation(TOGGLE_BLOCK, {
        variables: {
            id: user.id,
            id2: profile.id
        }
    })
    function goBlock(e){
        e.preventDefault()
        if (user.id && profile.id) {
            console.log({
                id: user.id,
                id2: profile.id
            })
            toggleBlock().then((x)=>{
                // console.log(x)
                refetcher()
                refetch().then(()=>{setUser(data.UserbyID)})
            }).catch((m)=>{
                console.log("error: " + m.message)
            })
        }
    }

    const [openWrite, setOpenWrite] = useState(false);
    const toggleOpenWrite = () => {setOpenWrite(!openWrite)}
    
    const [updateProfile] = useMutation(UPDATE_PROFILE, {
        variables: {
            id: profile.id,
            name: name == null ? profile.name : name,
            profile: profpic.url,
            headline: headline == null ? profile.headline : headline,
            cover: cover.url
        }
    })

    function uploadProfile(e){
        console.log(e)
        e.preventDefault()
        if (e.target.files[0]) {
            console.log(e.target.files[0].name)
            const profRef = ref(storage, `profile/${profile.id}/${uuid() + e.target.files[0].name}`)
            uploadBytes(profRef, e.target.files[0]).then((snapshot)=>{
                console.log('uploaded profpic')
                getDownloadURL(snapshot.ref).then((downloadURL) => {
                    console.log('profpic link: ' + downloadURL)
                    setProfpic({url: downloadURL, blob: e.target.files[0]})
                })
            })
        } 
        // else {
        //     setProfpic({url: URL.createObjectURL(e.target.files[0]), blob: e.target.files[0]})
            
        // }
    }

    function uploadCover(e){
        console.log(e)
        e.preventDefault()
        if (e.target.files[0]) {
            console.log(e.target.files[0].name)
            const covRef = ref(storage, `cover/${profile.id}/${uuid() + e.target.files[0].name}`)
            uploadBytes(covRef, e.target.files[0]).then((snapshot)=>{
                console.log('uploaded cover')
                getDownloadURL(snapshot.ref).then((downloadURL) => {
                    console.log('cover link: ' + downloadURL)
                    setCover({url: downloadURL, blob: e.target.files[0]})
                })
            })
        } 
        // else {
        //     setCover({url: URL.createObjectURL(e.target.files[0]), blob: e.target.files[0]})
        // }
    }

    function goUpdate(e){
        e.preventDefault()
        console.log({
            id: profile.id,
            name: name == null ? profile.name : name,
            profile: profpic.url,
            headline: headline == null ? profile.headline : headline,
            cover: cover.url
        })
        updateProfile().then((x)=>{
            // console.log(x)
            refetcher()
            refetch().then(()=>{setUser(data.UserbyID)})
            setOpenWrite(!openWrite)
        }).catch((m)=>{
            console.log("error: " + m.message)
        })
    }

    return(
        <div className="flex flex-col items-start bg-white rounded-md border-semitrans pb-4">
            {/* modal */}
            { openWrite &&
            <div className="modal">
                <div className={`bg-white rounded-md border-semitrans px-3 py-2 mx-1 flex flex-col ${width>1000 ? 'w-half' : `${width>500 ? 'w-threefourth' : 'w-full'}`}`}>
                    <form>
                        <div className="flex flex-row justify-between my-2">
                            <div className="text-lg font-bold">Edit profile</div>
                            <XIcon className="h-6 w-6 link" onClick={toggleOpenWrite}/>
                        </div>
                        <div>
                            <label>Name: </label>
                            <input type="name" placeholder="Name" title="Name" className={`text-input mx-3 my-2 ${width>1000 ? 'w-half' : 'w-threefourth'}`} required onChange={e=> setName(e.target.value)} defaultValue={profile.name}/>
                        </div>
                        <div>
                            <label>Headline: </label>
                            <input type="text" placeholder="Headline" title="Headline" className={`text-input mx-3 my-2 ${width>1000 ? 'w-half' : 'w-threefourth'}`} required onChange={e=> setHeadline(e.target.value)} defaultValue={profile.headline}/>
                        </div>
                        <div>
                            <label>Profile Picture: </label>
                            <div className="flex flex-col">
                                <img src={profpic.url} className="w-32 py-2"/>
                                <input type="file" className="input-file font-bold text-sm" required accept="image/gif, image/jpeg, image/png" onChange={(e) => uploadProfile(e)}/>
                            </div>
                        </div>
                        <div>
                            <label>Cover Picture: </label>
                            <div className="flex flex-col">
                                <img src={cover.url} className="w-full py-2"/>
                                <input type="file" className="input-file font-bold text-sm" required accept="image/gif, image/jpeg, image/png" onChange={(e) => uploadCover(e)}/>
                            </div>
                        </div>
                        <div className="flex flex-row mt-2">
                            <button type="submit" className='bg-primary-adv border-primary rounded-md px-2 button-text-white py-1 mr-2 text-sm text-center hand' onClick={goUpdate}>Update Profile</button>
                            <div className='bg-white-adv border-primary rounded-md px-2 button-text py-1 mr-2 text-sm text-center hand' onClick={toggleOpenWrite}>Cancel</div>
                        </div>
                    </form>
                </div>
            </div>}    
            
            { profile.cover ? <img src={profile.cover} className="w-full cover-picture"/> : <img src={`https://static-exp1.licdn.com/sc/h/55k1z8997gh8dwtihm11aajyq`} className="w-full cover-picture"/>}
            <div className="flex flex-row w-full justify-between">
                <div className="flex flex-col items-start ml-8">
                    {profile.profile ? <img src={profile.profile} className="w-32 profile-picture mt--75"/> : <img src={`https://static-exp1.licdn.com/sc/h/1c5u578iilxfi4m4dvc4q810q`} className="w-32 profile-picture mt--75"/>}
                    <h2 className="mt-2 mb-0">{profile.name}</h2>
                    <h4 className="text-black mt-1 mb-0 text-center">{profile.headline}</h4>
                </div>
                <div className="flex flex-col items-end mr-8 mt-8">
                    <p className="text-black mt-1 mb-1">{profile.views} profile views</p>
                    <p className="text-black mt-1 mb-1">Current Company</p>
                    <p className="text-black mt-1 mb-1">Current Education</p>
                </div>
            </div>
            <div className="flex flex-col ml-8 mr-8 my-1">
                {user.id != profile.id &&
                    <div className="flex flex-row mb-1">
                        {user && user.connected && user.connected.split(",").includes(profile.id) 
                        ? 
                        <div className="flex flex-row">
                            <div className='bg-primary-adv border-primary rounded-md px-2 button-text-white py-1 mr-2 text-sm text-center hand' onClick={e => {console.log(e)}}>Message</div>
                            <div className='bg-primary-adv border-primary rounded-md px-2 button-text-white py-1 mr-2 text-sm text-center hand' onClick={goConnect}>Disconnect</div>
                        </div>
                        :
                            (profile && profile.requestconnect && profile.requestconnect.split(",").includes(user.id) 
                            ?
                            <div className='bg-white-adv border-primary rounded-md px-2 button-text py-1 mr-2 text-sm text-center hand' onClick={goConnect}>Pending</div>
                            :
                            <div className='bg-white-adv border-primary rounded-md px-2 button-text py-1 mr-2 text-sm text-center hand' onClick={goConnect}>Connect</div>

                            )
                        }
                        {user && user.followed && user.followed.split(",").includes(profile.id) 
                        ? 
                        (!user.connected.split(",").includes(profile.id) && <div className='bg-primary-adv border-primary rounded-md px-2 button-text-white py-1 mr-2 text-sm text-center hand' onClick={goFollow}>Unfollow</div>)
                        :
                        (!user.connected.split(",").includes(profile.id) && <div className='bg-white-adv border-primary rounded-md px-2 button-text py-1 mr-2 text-sm text-center hand' onClick={goFollow}>Follow</div>)
                        }
                        {user && user.blocked && user.blocked.split(",").includes(profile.id) 
                        ? 
                        <div className='bg-primary-adv border-primary rounded-md px-2 button-text-white py-1 mr-2 text-sm text-center hand' onClick={goBlock}>Unblock</div>
                        :
                        <div className='bg-white-adv border-primary rounded-md px-2 button-text py-1 mr-2 text-sm text-center hand' onClick={goBlock}>Block</div>
                        }
                        
                    </div>
                }

                <div className="flex flex-row mt-1">
                    {user.id == profile.id && 
                    <div className='bg-primary-adv border-primary rounded-md px-2 button-text-white py-1 mr-2 text-sm text-center hand' onClick={toggleOpenWrite}>Edit Profile</div>}

                    <div className='bg-white-adv border-primary rounded-md px-2 button-text py-1 mr-2 text-sm text-center hand' onClick={e => {console.log(e)}}>Save to PDF</div>
                    <div className='bg-white-adv border-primary rounded-md px-2 button-text py-1 mr-2 text-sm text-center hand' onClick={e => {console.log(e)}}>Share via Message</div>
                </div>
            </div>
        </div>
    )
}