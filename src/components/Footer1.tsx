import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

const navigation = [
    {key: 1, name: 'About', link: '/about'},
    {key: 2, name: 'Accessibility', link: '/accessibility'},
    {key: 3, name: 'User Agreement', link: '/user-agreement'},
    {key: 4, name: 'Privacy Policy', link: '/privacy-policy'},
    {key: 5, name: 'Get the LinkHEdIn app', link: 'https://play.google.com/store/apps/details?id=com.linkedin.android&hl=en&gl=US'},
]

export default function Footer1({footerfront}){
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
    return(
        <div className={`pt-3 pb-1 ${footerfront ? 'bg-primary shadow-lg-flip' : ''}`}>
            <div className={`flex ${footerfront ? `${width>550 ? 'flex-row': 'flex-col'}` : 'flex-col'} justify-center text-center`}>
                {navigation.map(nv => (
                   nv.key==5 
                   ? <a className={`${footerfront ? 'link-white' : 'link'} mx-2 text-sm ${width>550 ? '': 'my-2'}`} href={nv.link}>{nv.name}</a>
                   : <Link key={nv.key} to={nv.link} className={`${footerfront ? 'link-white' : 'link'} mx-2 text-sm ${width>550 ? '': 'my-2'}`}>{nv.name}</Link>
                ))}
            </div>
                <p className={`${footerfront ? 'text-white' : 'text-black'} text-center text-sm`}>© 2022 LinkHEdIn</p>
        </div>
    )
}