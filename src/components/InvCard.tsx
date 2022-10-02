import { useMutation, useQuery } from "@apollo/client";
import { CheckIcon } from "@heroicons/react/solid";
import { useContext, useState } from "react";
import { Link } from "react-router-dom";
import { UserContext } from "../contexts/UserContext";
import { ACCEPT_CONNECT, GET_USER_ID } from "../Queries";
import SmallProfile from "./SmallProfile";

export default function InvCard({profid, refetcher}){
    const [hoverProfile, setHoverProfile] = useState(false)
    const handleMouseOver = () => {setHoverProfile(true)}
    const handleMouseOut = () => {setHoverProfile(false)}

    
    const {user, setUser} = useContext(UserContext)
    const {loading, error, data, refetch} = useQuery(GET_USER_ID, {variables: {id: profid}})
    if (data && data.UserbyID) {
        console.log(data.UserbyID)
    }
    const [acceptConnect] = useMutation(ACCEPT_CONNECT, {
        variables: {
            id: user.id,
            id2: profid
        }
    })
    function goAccept(e){
        e.preventDefault()
        console.log({
            id: user.id,
            id2: profid
        })
        acceptConnect().then((x) => {
            console.log(x) 
            refetcher() 
        })
        .catch((m) => {
            console.log("out: " + m.message)
        })
    }

    return( data && data.UserbyID &&
        <div className="flex flex-row bg-white2 rounded-md py-3 my-2 w-full justify-between">
                {hoverProfile && <div className="absolute mt-14 w-48"><SmallProfile profile={data.UserbyID}/></div>}
            <div className="flex flex-row mx-4" onMouseOver={handleMouseOver} onMouseOut={handleMouseOut}>
                {data.UserbyID.profile ? <img src={data.UserbyID.profile} className="w-12 profile-picture" /> : <img src={`https://static-exp1.licdn.com/sc/h/1c5u578iilxfi4m4dvc4q810q`} className="w-12 profile-picture" />}
                <Link to={`../profile/${data.UserbyID.username}`} className="flex flex-col mx-4 link">
                    <h3 className="m-0">{data.UserbyID.name}</h3>
                    <h4 className="text-black m-0 text-center">{data.UserbyID.headline}</h4>
                </Link>
            </div>
            <CheckIcon className="w-6 link mx-4" onClick={goAccept}/>
        </div>
    )
}