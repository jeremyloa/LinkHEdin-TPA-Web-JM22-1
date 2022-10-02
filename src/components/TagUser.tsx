import { useQuery } from "@apollo/client"
import { useState } from "react"
import { Link } from "react-router-dom"
import { GET_USER_ID } from "../Queries"
import SmallProfile from "./SmallProfile"

export default function TagUser({profid, tag}){

    const [hoverProfile, setHoverProfile] = useState(false)
    const handleMouseOver = () => {setHoverProfile(true)}
    const handleMouseOut = () => {setHoverProfile(false)}
    const {loading, error, data, refetch} = useQuery(GET_USER_ID, {variables: {id: profid}}) 
    return( data && data.UserbyID && 
        <div className="mx-2 mb-1">
            {hoverProfile && <div className="absolute mt-14 w-48"><SmallProfile profile={data.UserbyID}/></div>}
            <Link to={`/in/profile/${tag}`} className="mention-1 link px-1 w-max"  onMouseOver={handleMouseOver} onMouseOut={handleMouseOut}>{tag}</Link>
        </div>
    )
}