import { useState } from "react";
import { Mention, MentionsInput } from "react-mentions";

const users = [
    {
        id: "123",
        name: "Name",
        username: "username"
    },
    {
        id: "456",
        name: "Name2",
        username: "username2"
    }
]
export default function RichText () {
    const [value, setValue] = useState("")
    return (
        <div >
            <MentionsInput className="text-area mt-2" value={value} onChange={e => setValue(e.target.value)}>
                <Mention data={users}/>
            </MentionsInput>
        </div>
    )
}