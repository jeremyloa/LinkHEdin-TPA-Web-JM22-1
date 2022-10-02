import { useQuery } from "@apollo/client"
import { useState } from "react"
import { Link } from "react-router-dom"

export default function TagHash({hashid, tag}){
    return( 
        <div className="mx-2 mb-1">
            <Link to={`/in/search/${tag}`} className="mention-2 link px-1 w-max" >{tag}</Link>
        </div>
    )
}