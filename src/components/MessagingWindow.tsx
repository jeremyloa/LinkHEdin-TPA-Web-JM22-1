import { useQuery } from "@apollo/client"
import { useContext, useEffect, useState } from "react"
import { GET_USERS, GET_USER_ID } from "../Queries"
import { collection, doc, onSnapshot, orderBy, query } from "firebase/firestore";
import { db } from "../firebase";
import ChatWindow from "./ChatWindow";
import { UserContext } from "../contexts/UserContext";

export default function MsgWindow(){
    const {user, setUser} = useContext(UserContext)
    const currUser = useQuery(GET_USER_ID, {variables: {id: user.id}})
    const [open, setOpen] = useState(false)
    const allUsers = useQuery(GET_USERS)
    const [allChannels, setAllChannels] = useState([{id: '', lastmsg: '', lasttime: {}, user1: '', user2: ''}])
    const [selectedChannel, setSelectedChannel] = useState('')
    const [selectNewChat, setSelectNewChat] = useState('')
    const [selectedProfile, setSelectedProfile] = useState({})
    const [width, setWidth] = useState(0)
    useEffect(() => {
        updateWidth()
        window.addEventListener("resize", updateWidth)
        return () => window.removeEventListener("resize", updateWidth)
    }, [])

    const updateWidth = () => {
        setWidth(window.innerWidth)
    }

    const [searchText, setSearchTest] = useState('')
    useEffect(()=>{
        onSnapshot(query(collection(db, 'channels'), orderBy('lasttime', 'desc')), (ss)=>{
            let tempch = [{}]
            ss.docs.forEach((doc)=>{
                if (doc.data().user1 == user.id || doc.data().user2 == user.id) tempch.push({...doc.data(), id:doc.id})
            })
            if (tempch.length>1) setAllChannels(tempch.slice(1))
            // console.log(tempch.slice(1))
        })
    }, [])
    // console.log(allChannels)
    // const channels = onSnapshot(doc(db))  
    if (currUser && currUser.data && currUser.data.UserbyID) console.log(currUser.data.UserbyID)
    return (allUsers && allUsers.data && allUsers.data.Users && user && currUser && currUser.data && currUser.data.UserbyID &&
        <div className="grid-three bg-white rounded-md border-semitrans justify-between">
            <div>
                <input type="text" placeholder="Search Connected User" title="Search" className={`text-input mx-3 my-2 w-threefourth`} required onChange={e=> setSearchTest(e.target.value)}/>
                {searchText == '' && allUsers.data.Users.map((us)=>( currUser.data.UserbyID.connected.split(",").includes(us.id) &&
                <div className="button-semitrans2 flex flex-row p-4 justify-between" 
                    onClick={e => {
                        setSelectedChannel('')
                        setSelectNewChat(us)
                    }}>
                    <div className="flex flex-row">
                        <img src={us.profile} className="w-12 profile-picture" />
                        <div className="flex flex-col ml-2">
                            <div className="font-bold">{us.name}</div>
                            <div>{us.headline}</div>
                        </div>
                    </div>
                </div>
                ))}
                {searchText != '' && allUsers.data.Users.map((us)=>( currUser.data.UserbyID.connected.split(",").includes(us.id) && (us.name.includes(searchText) || us.username.includes(searchText)) &&
                <div className="button-semitrans2 flex flex-row p-4 justify-between" 
                    onClick={e => {
                        setSelectedChannel('')
                        setSelectNewChat(us)
                    }}>
                    <div className="flex flex-row">
                        <img src={us.profile} className="w-12 profile-picture" />
                        <div className="flex flex-col ml-2">
                            <div className="font-bold">{us.name}</div>
                            <div>{us.headline}</div>
                        </div>
                    </div>
                </div>
                ))}
            </div>
            <div>
                {allChannels[0].id != '' && allChannels.map((chn)=>(
                <div className="button-semitrans flex flex-row p-4 justify-between" 
                    onClick={e => {setSelectedChannel(chn.id); setSelectNewChat('');
                        setSelectedProfile(
                        {profile: (chn.user1 == user.id ? allUsers.data.Users.filter((i)=>{return i.id == chn.user2})[0].profile : allUsers.data.Users.filter((i)=>{return i.id == chn.user1})[0].profile)
                        , name: (chn.user1 == user.id ? allUsers.data.Users.filter((i)=>{return i.id == chn.user2})[0].name : allUsers.data.Users.filter((i)=>{return i.id == chn.user1})[0].name)
                        , id: (chn.user1 == user.id ? allUsers.data.Users.filter((i)=>{return i.id == chn.user2})[0].id : allUsers.data.Users.filter((i)=>{return i.id == chn.user1})[0].id)}
                    )}}>
                    <div className="flex flex-row">
                        <img src={chn.user1 == user.id ? allUsers.data.Users.filter((i)=>{return i.id == chn.user2})[0].profile : allUsers.data.Users.filter((i)=>{return i.id == chn.user1})[0].profile} className="w-12 profile-picture" />
                        <div className="flex flex-col ml-2">
                            <div className="font-bold">{chn.user1 == user.id ? allUsers.data.Users.filter((i)=>{return i.id == chn.user2})[0].name : allUsers.data.Users.filter((i)=>{return i.id == chn.user1})[0].name}</div>
                            <div>{chn.lastmsg}</div>
                        </div>
                    </div>
                    <div className="flex flex-col items-end">
                        <div>{chn.lasttime.toDate().toLocaleDateString('en-UK', { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric' })}</div>
                        <div>{chn.lasttime.toDate().toLocaleTimeString('en-UK')}</div>
                    </div>
                </div>
                ))}
            </div>
            
            {selectedChannel != '' && <ChatWindow channel={selectedChannel} profile={selectedProfile} user={user}/>}
            {selectedChannel == '' && selectNewChat.id && selectNewChat.id != '' && <ChatWindow channel={''} profile={selectNewChat} user={user}/>}
        </div>
    )
}