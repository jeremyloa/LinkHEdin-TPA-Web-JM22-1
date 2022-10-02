import { useMutation, useQuery } from "@apollo/client"
import { useContext } from "react"
import { Link } from "react-router-dom"
import { UserContext } from "../contexts/UserContext"
import { GET_USER_ID, SEND_CONNECT_USER, TOGGLE_FOLLOW } from "../Queries"

export default function SmallProfile({profile, refetcher}){

    const {user, setUser} = useContext(UserContext)

    const {loading, error, data, refetch} = useQuery(GET_USER_ID, {variables: {id: user.id}})
    const temprof = useQuery(GET_USER_ID, {variables: {id: profile.id}})
    // if (temprof && temprof.data && temprof.data.UserbyID) console.log(temprof.data.UserbyID)
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
                // refetcher()
                // refetch()
                if (refetcher) refetcher()
                refetch().then(()=>{setUser(data.UserbyID)})

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
                // refetcher()
                if (refetcher) refetcher()
                refetch().then(()=>{setUser(data.UserbyID)})
            }).catch((m)=>{
                console.log("error: " + m.message)
            })
        }
    }

    return( temprof && temprof.data && temprof.data.UserbyID && data && data.UserbyID &&
        <div className="flex flex-col items-center bg-white rounded-md border-semitrans">
            { temprof.data.UserbyID.cover ? <img src={temprof.data.UserbyID.cover} className="w-full cover-picture"/> : <img src={`https://static-exp1.licdn.com/sc/h/55k1z8997gh8dwtihm11aajyq`} className="w-full cover-picture"/>}
            <Link to={`/in/profile/${profile.username}`} className="link flex flex-col items-center">
                {temprof.data.UserbyID.profile ? <img src={temprof.data.UserbyID.profile} className="w-16 profile-picture mt--25"/> : <img src={`https://static-exp1.licdn.com/sc/h/1c5u578iilxfi4m4dvc4q810q`} className="w-16 profile-picture mt--25"/>}
                <h3 className="mt-2 mb-2">{temprof.data.UserbyID.name}</h3>
            </Link>
            <h4 className="text-black mt-1 mb-4 text-center">{temprof.data.UserbyID.headline}</h4>
            <div className="flex flex-col ml-8 mr-8 my-1">
            
            {user && user.connected && user.connected.split(",").includes(profile.id) 
            ? 
            ( user.id != profile.id &&
            <div className="flex flex-row">
                <div className='bg-primary-adv border-primary rounded-md px-2 button-text-white py-1 mx-2 text-sm text-center hand' onClick={e => {console.log(e)}}>Message</div>
                <div className='bg-primary-adv border-primary rounded-md px-2 button-text-white py-1 mx-2 text-sm text-center hand' onClick={goConnect}>Disconnect</div>
            </div>)
            :
                (temprof && temprof.data && temprof.data.UserbyID && temprof.data.UserbyID.requestconnect && temprof.data.UserbyID.requestconnect.split(",").includes(user.id) 
                ?
                (user.id != profile.id && <div className='bg-white-adv border-primary rounded-md px-2 button-text py-1 mx-2 text-sm text-center hand' onClick={goConnect}>Pending</div>)
                :
                (user.id != profile.id && <div className='bg-white-adv border-primary rounded-md px-2 button-text py-1 mx-2 text-sm text-center hand' onClick={goConnect}>Connect</div>)
                )
            }

            {data.UserbyID.followed.split(",").includes(profile.id) 
            ? 
            (!user.connected.split(",").includes(profile.id) && user.id != profile.id && <div className='mt-2 bg-primary-adv border-primary rounded-md px-2 button-text-white py-1 mx-2 text-sm text-center hand' onClick={goFollow}>Unfollow</div>)
            :
            (!user.connected.split(",").includes(profile.id) && user.id != profile.id && <div className='mt-2 bg-white-adv border-primary rounded-md px-2 button-text py-1 mx-2 text-sm text-center hand' onClick={goFollow}>Follow</div>)
            }
            </div>
        </div>
    )
}