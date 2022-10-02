import { useContext, useEffect, useState } from "react"
import Footer1 from "../components/Footer1"
import Navbar1 from "../components/Navbar1"
import Navbar2 from "../components/Navbar2"
import { UserContext } from "../contexts/UserContext"

export default function About(){

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

    const {user, setUser} = useContext(UserContext)

    return (
        <div>
            {/* navbar */}
            <div className="fixed w-full">
                {!user ? <Navbar1 page={'none'}/> : <Navbar2 profile={user}/> }
            </div>
            <br/> <br/> <br/> 
            {/* body */}
            <div className={`flex  ${width > 800 ? 'mx-32 flex-col' : 'mx-12 flex-col'} mt-8 mb-16 text-center`}>
                <div className="items-center">
                    <h1 className="text-secondary">About LinkHEdIn</h1>
                    <h4>Welcome to LinkHEdIn, the world's largest professional network with more than 830 million members in more than 200 countries and territories worldwide.</h4>
                    <img src="https://static-exp1.licdn.com/aero-v1/sc/h/dxf91zhqd2z6b0bwg85ktm5s4" className={`${width>800 ? 'w-half' : 'w-half my-10'}`}/>
                </div>

                <div className="items-center">
                    <h1 className="text-secondary">LinkHEdIn's Vision</h1>
                    <h4>Create economic opportunity for every member of the global workforce.</h4>
                </div>

                <div className="items-center">
                    <h1 className="text-secondary">LinkHEdIn's Mission</h1>
                    <h4>To connect the world’s professionals to make them more productive and successful.</h4>
                </div>

                <div className="items-center">
                    <h1 className="text-secondary">Who are we?</h1>
                    <h4>LinkHEdIn leads a diversified business with revenues from membership subscriptions, advertising sales and recruitment solutions under the leadership of Ryan Roslansky. In December 2016, Microsoft completed its acquisition of LinkHEdIn, bringing together the world’s leading professional cloud and the world’s leading professional network.</h4>
                </div>
            </div>

            {/* footer */}
            <br/> <br/> <br/> <Footer1 footerfront={true}/>
        </div>
    )
}