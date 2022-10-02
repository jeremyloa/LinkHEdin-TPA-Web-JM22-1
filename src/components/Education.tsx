import { useMutation, useQuery } from "@apollo/client"
import { PlusIcon } from "@heroicons/react/solid"
import { useContext, useEffect, useState } from "react"
import { UserContext } from "../contexts/UserContext"
import { ADD_EDU, GET_EDUS_USER } from "../Queries"
import EduCard from "./EduCard"

export default function Education ({profile, refetcher}) {
    const [institution, setInstitution] = useState('')
    const [degree, setDegree] = useState('')
    const [field, setField] = useState('')
    const [grade, setGrade] = useState(0.0)
    const [start, setStart] = useState(2021)
    const [end, setEnd] = useState(2022)
    const [active, setActive] = useState(false)
    const [activities, setActivities] = useState('')
    const [desc, setDesc] = useState('')
    const [openNew, setOpenNew] = useState(false)

    const {user, setUser} = useContext(UserContext)
    const [errortxt, setErrorTxt] = useState('')
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
    const {loading, error, data, refetch} = useQuery(GET_EDUS_USER, {variables: {userID: profile.id}})

    const [addEdu] = useMutation(ADD_EDU, {
        variables: {
            userId: profile.id,
            institution: institution,
            degree: degree,
            field: field,
            grade: grade,
            isActive: active,
            startYear: start,
            endYear: end,
            activities: activities,
            desc: desc
        }
    })

    function goAdd(e){
        e.preventDefault()
        console.log({
            userId: profile.id,
            institution: institution,
            degree: degree,
            field: field,
            grade: grade,
            isActive: active,
            startYear: start,
            endYear: end,
            activities: activities,
            desc: desc
        })
        if (institution == '') {
            setErrorTxt('Institution must not be empty.')
            return
        } else if (degree == '') {
            setErrorTxt('Degree must not be empty.')
            return
        } else if (field == '') {
            setErrorTxt('Field must not be empty.')
            return
        } else if (!start) {
            setErrorTxt('Start year must not be empty.')
            return
        } else if (!end) {
            setErrorTxt('End year must not be empty.')
            return
        } else if (start > end){
            setErrorTxt('End year must not be before start year.')
            return
        }

        addEdu().then((x)=>{
            console.log(x)
            setErrorTxt('')
            refetch()
            setOpenNew(!openNew)
        }).catch((m)=>{
            setErrorTxt(m.message)
            console.log("out: " + m.message)
        })
    }
    return (
        <div className="flex flex-col items-start bg-white rounded-md border-semitrans p-8 my-4">
            <div className="flex flex-row w-full justify-between">
                <h3 className="p-0 m-0">Education</h3>
                {user && profile && user.id == profile.id &&
                <PlusIcon className="h-6 w-6 link" onClick={()=>{setOpenNew(!openNew)}}/>
                }
            </div>
            <div className="w-full my-2">
                { openNew &&
                    <div className="flex flex-col bg-white2 rounded-md py-3 my-2 w-full">
                        <input type="text" placeholder="Institution" title="Institution" className={`text-input mx-3 my-2 ${width>1000 ? 'w-half' : 'w-threefourth'}`} required onChange={e=> setInstitution(e.target.value)}/>
                        <input type="text" placeholder="Degree" title="Degree" className={`text-input mx-3 my-2 ${width>1000 ? 'w-half' : 'w-threefourth'}`} required onChange={e=> setDegree(e.target.value)}/>
                        <input type="text" placeholder="Field" title="Field" className={`text-input mx-3 my-2 ${width>1000 ? 'w-half' : 'w-threefourth'}`} required onChange={e=> setField(e.target.value)}/>
                        <input type="number" placeholder="Grade" title="Grade" step=".01" className={`text-input mx-3 my-2 ${width>1000 ? 'w-half' : 'w-threefourth'}`} required onChange={e=> setGrade(e.target.value)}/>
                        <div className="flex flex-row mx-3 my-2">
                            <input type="number" name="start" id="start" placeholder="Start Year" title="Start Year" className={`text-input w-20`} required onChange={e=> setStart(e.target.value)}/>
                            <h4 className="p-1 m-0 font-normal mx-3">until</h4>
                            <input type="number" name="end" id="end" placeholder="End Year" title="End Year" className={`text-input w-20`} required onChange={e=> setEnd(e.target.value)}/>
                            <div className="mt-1 ml-3 mr-4">
                                <input type="checkbox" name="active" id="active" placeholder="Active" onChange={e=> setActive(e.target.checked)}/>
                                <label htmlFor="active" className="mt-1">Currently Active</label>
                            </div>
                        </div>
                        <input type="text" placeholder="Activities" title="Activities" className={`text-input mx-3 my-2 ${width>1000 ? 'w-half' : 'w-threefourth'}`} required onChange={e=> setActivities(e.target.value)}/>
                        <input type="text" placeholder="Description" title="Description" className={`text-input mx-3 my-2 ${width>1000 ? 'w-half' : 'w-threefourth'}`} required onChange={e=> setDesc(e.target.value)}/>
                        { errortxt!='' &&
                        <div className="ml-3 my-1 text-left text-secondary">Error: {errortxt}</div>}
                        <div className="flex flex-row ml-3">
                            <div className='bg-primary-adv border-primary rounded-md px-2 button-text-white py-1 my-2 mr-3 text-sm text-center hand w-onefourth' onClick={goAdd}>Add Experience</div>
                            <div className='bg-white-adv border-primary rounded-md px-2 button-text py-1 my-2 text-sm text-center hand w-onefourth' onClick={()=>{setOpenNew(!openNew)}}>Cancel</div>
                        </div>
                    </div>
                }    
                {data && data.EducationsbyUserID && data.EducationsbyUserID.map(edu => (<EduCard edu={edu} refetcher={refetch}/>))}
            </div>

        </div>
    )
}