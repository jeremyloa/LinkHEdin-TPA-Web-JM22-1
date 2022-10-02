import { useQuery } from "@apollo/client"
import { useContext, useEffect, useState } from "react"
import { UserContext } from "../contexts/UserContext"
import { GET_USER_ID } from "../Queries"
import InvCard from "./InvCard"

export default function Invitation({refetcher}){
    const {user, setUser} = useContext(UserContext)
    const [width, setWidth] = useState(0)
    const {loading, error, data, refetch} = useQuery(GET_USER_ID, {variables: {id: user.id}})
    refetcher()

    if (data && data.UserbyID) console.log(data.UserbyID.requestconnect)
    useEffect(() => {
        updateWidth()
        window.addEventListener("resize", updateWidth)
        return () => window.removeEventListener("resize", updateWidth)
    }, [])

    const updateWidth = () => {
        setWidth(window.innerWidth)
        // console.log(window.innerWidth)
    }

    if (data && data.UserbyID) console.log(data.UserbyID.requestconnect)
    return( data && data.UserbyID &&
        <div className="flex flex-col items-start bg-white rounded-md border-semitrans p-8 my-4">
            <div className="flex flex-row w-full justify-between">
                <h3 className="p-0 m-0">Invitations</h3>
            </div>
            {data && data.UserbyID && data.UserbyID.requestconnect.split(",").map(userid => (<InvCard profid={userid} refetcher={refetcher}/>))}
        </div>
    )
}