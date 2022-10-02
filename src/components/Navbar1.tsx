import { MenuIcon, XIcon } from "@heroicons/react/solid";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

const navigation = [
    {key: 1, name: 'Join now', link: 'register'},
    {key: 2, name: 'Sign in', link: 'login'},
]
export default function Navbar1({page}){
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
    return(
        <>
            <div className={`bg-primary shadow-lg flex flex-row py-2 h-10 ${width>800 ? 'px-32' : 'px-16'} justify-between items-center`}>
                <div className="flex flex-row w-half">
                    <Link to={'/'} className="w-32 h-half justify-center items-center">
                        <img src="https://firebasestorage.googleapis.com/v0/b/tpa-web-jm22-1.appspot.com/o/logowhite.png?alt=media&token=694f2bc9-eb25-4e86-80de-179e0ffa93ce" className="w-full "/>
                    </Link>         
                </div>
                <div>
                    {width>600 && navigation.map(nv => (
                    <Link key={nv.key} to={`/${nv.link}`} className={`ml-1 bg-primary-adv w-52 rounded-md button-text-white text-sm py-3 px-3 text-center ${page === nv.link ? 'border-white' : ''}`}>{nv.name}</Link>
                    ))}
                    {width<=600 && 
                    <div className="flex flex-row">
                        <button onClick={openHandler}>
                            {open==false && <MenuIcon className="h-6 w-6 link-white"/>}
                            {open==true && <XIcon className="h-6 w-6 link-white"/>}
                        </button>
                    </div>}
                </div>
            </div>
            {width<=600 && open==true &&
            <div className={`flex flex-col items-center justify-center`}>
                {navigation.map(nv => (
                <Link key={nv.key} to={`/${nv.link}`} className={`bg-primary-adv ${width>=550 ? 'w-56' : 'w-screen'} button-text-white text-sm py-3 px-3 text-center ${page === nv.link ? 'border-white' : ''}`}>{nv.name}</Link>
                ))}
            </div>
            }
        </>
    )
}