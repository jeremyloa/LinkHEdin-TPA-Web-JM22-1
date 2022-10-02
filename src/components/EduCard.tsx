import { useMutation } from "@apollo/client"
import { PencilIcon } from "@heroicons/react/solid"
import { useContext, useEffect, useState } from "react"
import { UserContext } from "../contexts/UserContext"
import { DEL_EDU, SET_EDU } from "../Queries"

export default function EduCard({edu, refetcher}) {
    const {user, setUser} = useContext(UserContext)
    const [errortxt, setErrorTxt] = useState('')

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

    useEffect(()=> {
        if (edu){
            setInstitution(edu.institution)
            setDegree(edu.degree)
            setField(edu.field)
            setGrade(edu.grade)
            setStart(edu.startYear)
            setEnd(edu.endYear)
            setActive(edu.isActive)
            setActivities(edu.activities)
            setDesc(edu.desc)
        }
    }, [])

    const [setEdu] = useMutation(SET_EDU, {
        variables: {
            id: edu.id,
            userId: edu.userID,
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

    function goSet(e){
        e.preventDefault()
        console.log({
            id: edu.id,
            userId: edu.userID,
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

        setEdu().then((x)=>{
            console.log(x)
            setErrorTxt('')
            refetcher()
            setOpenNew(!openNew)
        }).catch((m)=>{
            setErrorTxt(m.message)
            console.log("out: " + m.message)
        })
    }

    const [delEdu] = useMutation(DEL_EDU, {
        variables: {
            id: edu.id
        }
    })

    function goDel(e){
        e.preventDefault()
        console.log(edu.id)
        delEdu().then((x)=>{
            console.log(x)
            refetcher()
            setOpenNew(!openNew)
        }).catch((m)=>{
            setErrorTxt(m.message)
            console.log("out: " + m.message)
        })
    }

    return (
        <div className="flex flex-col bg-white2 rounded-md py-3 my-2 w-full">
            { openNew &&
                <div className="flex flex-col bg-white2 rounded-md py-3 my-2 w-full">
                    <input type="text" placeholder="Institution" title="Institution" className={`text-input mx-3 my-2 ${width>1000 ? 'w-half' : 'w-threefourth'}`} required onChange={e=> setInstitution(e.target.value)} defaultValue={edu.institution}/>
                    <input type="text" placeholder="Degree" title="Degree" className={`text-input mx-3 my-2 ${width>1000 ? 'w-half' : 'w-threefourth'}`} required onChange={e=> setDegree(e.target.value)} defaultValue={edu.degree} />
                    <input type="text" placeholder="Field" title="Field" className={`text-input mx-3 my-2 ${width>1000 ? 'w-half' : 'w-threefourth'}`} required onChange={e=> setField(e.target.value)} defaultValue={edu.field} />
                    <input type="number" placeholder="Grade" title="Grade" step=".01" className={`text-input mx-3 my-2 ${width>1000 ? 'w-half' : 'w-threefourth'}`} required onChange={e=> setGrade(e.target.value)} defaultValue={edu.grade} />
                    <div className="flex flex-row mx-3 my-2">
                        <input type="number" name="start" id="start" placeholder="Start Year" title="Start Year" className={`text-input w-20`} required onChange={e=> setStart(e.target.value)} defaultValue={edu.startYear}/>
                        <h4 className="p-1 m-0 font-normal mx-3">until</h4>
                        <input type="number" name="end" id="end" placeholder="End Year" title="End Year" className={`text-input w-20`} required onChange={e=> setEnd(e.target.value)} defaultValue={edu.endYear} />
                        <div className="mt-1 ml-3 mr-4">
                            <input type="checkbox" name="active" id="active" placeholder="Active" onChange={e=> setActive(e.target.checked)} defaultChecked={edu.isActive}/>
                            <label htmlFor="active" className="mt-1">Currently Active</label>
                        </div>
                    </div>
                    <input type="text" placeholder="Activities" title="Activities" className={`text-input mx-3 my-2 ${width>1000 ? 'w-half' : 'w-threefourth'}`} required onChange={e=> setActivities(e.target.value)} defaultValue={edu.activities}/>
                    <input type="text" placeholder="Description" title="Description" className={`text-input mx-3 my-2 ${width>1000 ? 'w-half' : 'w-threefourth'}`} required onChange={e=> setDesc(e.target.value)} defaultValue={edu.desc} />
                    { errortxt!='' &&
                    <div className="ml-3 my-1 text-left text-secondary">Error: {errortxt}</div>}
                    <div className="flex flex-row ml-3">
                        <div className='bg-primary-adv border-primary rounded-md px-2 button-text-white py-1 my-2 mr-3 text-sm text-center hand w-onefourth' onClick={goSet}>Update Experience</div>
                        <div className='bg-white-adv border-primary rounded-md px-2 button-text py-1 my-2 mr-3 text-sm text-center hand w-onefourth' onClick={()=>{setOpenNew(!openNew)}}>Cancel</div>
                        <div className='bg-white-adv border-primary rounded-md px-2 button-text py-1 my-2 text-sm text-center hand w-onefourth' onClick={goDel}>Delete</div>
                    </div>
                </div>
            } 
            { !openNew &&
            <div className="flex flex-row justify-between">
                <div>
                    <h4 className="p-1 m-0 font-bold mx-3">{edu.institution}</h4>
                    <div className="flex flex-row mx-3">
                        <h4 className="p-1 m-0 font-normal">{edu.degree}</h4>
                        <h4 className="p-1 m-0 font-normal">•</h4>
                        <h4 className="p-1 m-0 font-normal">{edu.field}</h4>
                        <h4 className="p-1 m-0 font-normal">•</h4>
                        <h4 className="p-1 m-0 font-normal">{edu.grade}</h4>
                    </div>
                    {edu.isActive && 
                    <h4 className="p-1 m-0 font-normal mx-3">Currently Active</h4>
                    }
                    <div className="flex flex-row mx-3">
                        <h4 className="p-1 m-0 font-normal">{edu.startYear}</h4>
                        <h4 className="p-1 m-0 font-normal">-</h4>
                        <h4 className="p-1 m-0 font-normal">{edu.endYear}</h4>
                    </div>
                    <h4 className="p-1 m-0 font-normal mx-3">{edu.activities}</h4>
                    <h4 className="p-1 m-0 font-normal mx-3">{edu.desc}</h4>
                </div>
                {
                edu.userID == user.id &&
                <PencilIcon className="h-6 w-6 link mx-4" onClick={()=>{setOpenNew(!openNew)}}/>
                }
            </div>}
        </div>
    )
}