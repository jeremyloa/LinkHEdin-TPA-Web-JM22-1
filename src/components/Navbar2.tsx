import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { MenuIcon, XIcon } from '@heroicons/react/solid'

export default function Navbar2({profile}){
    const navigate = useNavigate()
    
    const navigation = [
        {key: 1, name: 'Home', link: 'home'},
        {key: 2, name: 'Network', link: 'network'},
        {key: 3, name: 'Jobs', link: 'jobs'},
        {key: 4, name: 'Messaging', link: 'messaging'},
        {key: 5, name: 'Notification', link: 'notification'},
        {key: 6, name: 'Profile', link: `profile/${profile.username}`},
        {key: 7, name: 'Sign Out', link: `logout`},
    ]
    const [width, setWidth] = useState(0)
    const [open, setOpen] = useState(false)
    const openHandler = (e) => {
        e.preventDefault();
        setOpen(!open)
    } 
    useEffect(() => {
        updateWidth()
        window.addEventListener("resize", updateWidth)
        return () => window.removeEventListener("resize", updateWidth)
    }, [])

    const updateWidth = () => {
        setWidth(window.innerWidth)
        // console.log(window.innerWidth)
    }

    const [searchVal, setSearchVal] = useState('0')

    function goSearch(){
        console.log(searchVal)
        navigate(`/in/search/${searchVal}`)
    }

    return(
        <>
            <div className={`bg-primary shadow-lg flex flex-row py-2 h-10 ${width>900 ? 'px-32' : 'px-16'} justify-between items-center`}>
                <div className="flex flex-row w-35percent">
                    <Link to={'/in/home'} className="w-8 h-half justify-center items-center">
                        <img src="https://pnggrid.com/wp-content/uploads/2021/05/linkedin-logo-white-1024x1024.png" className="w-full "/>
                        {/* <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512">
                            <path d="M416 32H31.9C14.3 32 0 46.5 0 64.3v383.4C0 465.5 14.3 480 31.9 480H416c17.6 0 32-14.5 32-32.3V64.3c0-17.8-14.4-32.3-32-32.3zM135.4 416H69V202.2h66.5V416zm-33.2-243c-21.3 0-38.5-17.3-38.5-38.5S80.9 96 102.2 96c21.2 0 38.5 17.3 38.5 38.5 0 21.3-17.2 38.5-38.5 38.5zm282.1 243h-66.4V312c0-24.8-.5-56.7-34.5-56.7-34.6 0-39.9 27-39.9 54.9V416h-66.4V202.2h63.7v29.2h.9c8.9-16.8 30.6-34.5 62.9-34.5 67.2 0 79.7 44.3 79.7 101.9V416z"/>
                        </svg> */}
                    </Link>         
                    {width>1150 && <input type="search" name="search" id="search" placeholder="Search" title="Search" className="mx-2 w-full text-input justify-center items-center" required onChange={e => setSearchVal(e.target.value)} onKeyDown={e => e.keyCode === 13 ? goSearch() : <></>}/>}
                </div>
                {width>=900 && width <=1150 && <input type="search" name="search" id="search" placeholder="Search" title="Search" className={`mx-2 w-screen text-input justify-center items-center`} required onChange={e => setSearchVal(e.target.value)} onKeyDown={e => e.keyCode === 13 ? goSearch() : <></>}/>}
                <div>
                    {width>1150 && navigation.map(nv => (
                    <Link key={nv.key} to={`/in/${nv.link}`} className={`ml-1 bg-primary-adv w-52 rounded-md button-text-white text-sm py-3 px-3 text-center `}>
                        {nv.name != 'Profile' && <>{nv.name}</>}
                        {nv.name == 'Profile' && width<=1150 && <>{nv.name}</>}
                        {nv.name == 'Profile' && width>1150 && profile.profile && <img src={profile.profile} className="w-8 profile-picture"/>}
                        {nv.name == 'Profile' && width>1150 && !profile.profile && <img src={`https://static-exp1.licdn.com/sc/h/1c5u578iilxfi4m4dvc4q810q`} className="w-8 profile-picture"/>}
                    </Link>
                    ))}
                    {width<=1150 && 
                    <div className="flex flex-row">
                        <button onClick={openHandler}>
                            {open==false && <MenuIcon className="h-6 w-6 link-white"/>}
                            {open==true && <XIcon className="h-6 w-6 link-white"/>}
                        </button>
                    </div>}
                </div>
            </div>
            {width<=1150 && open==true &&
            <div className={`flex flex-col items-center justify-center`}>
                {width<900 && <input type="search" name="search" id="search" placeholder="Search" title="Search" className={`mx-2 ${width>=400 ? 'w-64' : 'w-screen'} text-input justify-center items-center`}/>}
                {navigation.map(nv => (
                <Link key={nv.key} to={`/in/${nv.link}`} className={`bg-primary-adv ${width>=600 ? 'w-56' : 'w-screen'} button-text-white text-sm py-3 px-3 text-center `}>
                    {nv.name}
                </Link>
                ))}
            </div>
            }
        </>
    )
}