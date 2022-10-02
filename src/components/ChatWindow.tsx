import { useQuery } from "@apollo/client"
import { addDoc, collection, doc, onSnapshot, orderBy, query, Timestamp, updateDoc, where } from "firebase/firestore"
import { useEffect, useState } from "react"
import { db } from "../firebase"
import { GET_USER_ID } from "../Queries"

export default function ChatWindow({channel, profile, user}) {
    // console.log(channel)
    // console.log(profile)
    // console.log(user)

    const toUser = useQuery(GET_USER_ID, {variables: {id: profile.id}})
    const [newChat, setNewChat] = useState('')
    const [allChats, setAllChats] = useState([{id: '', channel: '', content: '', sender: '', sent: ''}])
    useEffect(()=>{
        if (channel == '') return
        onSnapshot(query(collection(db, 'messages'), orderBy('sent', 'asc')), (ss)=>{
            let tempch = [{}]
            // console.log(tempch)
            ss.docs.forEach((doc)=>{
                if (doc.data().channel == channel) tempch.push({...doc.data(), id:doc.id})
            })
            setAllChats(tempch.slice(1))
            // console.log(tempch.slice(1))
        })
    }, [])

    function sendChat(){
        if (newChat == '') return
        let usetime = Timestamp.now()
        if (channel == '') {
            addDoc(collection(db, 'channels'), {
                user1: user.id,
                user2: profile.id,
                lasttime: usetime,
                lastmsg: newChat
            }).then((res)=>{
                addDoc(collection(db, 'messages'), {
                    channel: res.id,
                    content: newChat,
                    sender: user.id,
                    sent: usetime
                }).then(()=>{
                    onSnapshot(query(collection(db, 'messages'), orderBy('sent', 'asc')), (ss)=>{
                        let tempch = [{}]
                        // console.log(tempch)
                        ss.docs.forEach((doc)=>{
                            if (doc.data().channel == res.id) tempch.push({...doc.data(), id:doc.id})
                        })
                        setAllChats(tempch.slice(1))
                        // console.log(tempch.slice(1))
                    })
                    setNewChat('')
                    return
                })
            })
        }
        addDoc(collection(db, 'messages'), {
            channel: channel,
            content: newChat,
            sender: user.id,
            sent: usetime
        }).then(()=>{
            updateDoc(doc(db, 'channels', channel), {
                lasttime: usetime,
                lastmsg: newChat
            })
        }).then(()=>{
            setNewChat('')
        })
    }

    return (  
        <div>
            <div className="flex flex-row p-4 justify-between">
                <div className="flex flex-row">
                    <img src={profile.profile} className="w-12 profile-picture" />
                    <div className="flex flex-col ml-2">
                        <div className="font-bold">{profile.name}</div>
                    </div>
                </div>
                <div className="flex flex-col items-end">
                    <div></div>
                </div>
            </div>
            <div>
                {channel != '' && allChats[0].id != '' && allChats.map((cht)=>(
                <div className="flex flex-row p-4 justify-between">
                    <div className="flex flex-row">
                        <img src={cht.sender == user.id ? user.profile : toUser.data.UserbyID.profile} className="w-8 h-8 profile-picture" />
                        <div className="flex flex-col ml-2">
                            <div className="font-bold">{cht.sender == user.id ? user.name : toUser.data.UserbyID.name}</div>
                            <div>{cht.content}</div>
                        </div>
                    </div>
                    <div className="flex flex-col items-end">
                        <div>{cht.sent.toDate().toLocaleDateString('en-UK', { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric' })}</div>
                        <div>{cht.sent.toDate().toLocaleTimeString('en-UK')}</div>
                    </div>
                </div>
                ))}
                <input type="text" placeholder="Chat" title="Chat" className={`text-input mx-3 my-2 w-threefourth`} required onChange={e=> setNewChat(e.target.value)} onKeyDown={e => e.keyCode === 13 ? sendChat() : <></>} value={newChat}/>
            </div>
        </div>
    )
}