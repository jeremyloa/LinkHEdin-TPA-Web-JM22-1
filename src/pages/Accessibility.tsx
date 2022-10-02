import { useContext, useEffect, useState } from "react"
import Footer1 from "../components/Footer1"
import Navbar1 from "../components/Navbar1"
import Navbar2 from "../components/Navbar2"
import { UserContext } from "../contexts/UserContext"

export default function Accessibility(){

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
            <div className={`flex  ${width > 800 ? 'mx-32 flex-col' : 'mx-12 flex-col'} mt-8 mb-16`}>
                <div className={`flex  ${width > 800 ? 'flex-row' : 'flex-col'} items-center`}>
                    <div className="items-center">
                        <h1 className="text-secondary">LinkHEdIn is a place where every member of the global workforce can find opportunity</h1>
                        <h3>Whatever your goals, ideas, and abilities are, we’re here to help you succeed.</h3>
                        <h4>No two LinkedIn members are the same—and it’s that diversity which makes our community so great. We’re on a journey to make accessibility and inclusive design part of our core principles, building accessibility from the ground up and testing our products with assistive technology to make sure that everyone can use LinkedIn to advance their professional goals.</h4>
                    </div>
                        <img src="https://media-exp1.licdn.com/dms/image/C4D08AQHk_6rU0Q14Fw/croft-frontend-shrinkToFit480/0/1603481593730?e=2147483647&v=beta&t=5Gz6gDqL40GuYJixbXbpqgD_uem2o9-GkhEL9hi5i8I" className={`${width>800 ? 'w-half' : 'w-half my-10'}`}/>
                </div>

                <div className={`flex  ${width > 800 ? 'flex-row' : 'flex-col'} items-center justify-between`}>
                    <img src="https://media-exp1.licdn.com/dms/image/C4D08AQFJqNWRM8CV5g/croft-frontend-shrinkToFit1024/0/1600383533421?e=2147483647&v=beta&t=O9jR8MCWFiMAWDR5bt-kE3IcETIaOkXWwWAOjl21bDQ" className={`${width>800 ? 'w-oneeighth' : 'w-oneeighth my-10'}`}/>
                    <div className="items-center ml-8">
                        <h2 className="text-secondary text-bold">Our Disability Answer Desk</h2>
                        <h4>Our teams are constantly working to improve the experience for all of LinkedIn’s products by adding new features and making changes to better serve all our members and customers. We’re always open to feedback and would love to hear from you as to how we can make our products even better.</h4>
                        <h4>If you find an accessibility bug or have trouble using LinkedIn's products with assistive technology, contact us and we’ll reach out to help you through it. We also offer support through Be My Eyes, a free app that connects blind and low-vision people with volunteers for visual assistance through a live video call..</h4>
                    </div>
                </div>

                <div className={`flex  ${width > 800 ? 'flex-row' : 'flex-col'} items-center  justify-between`}>
                    <img src="https://media-exp1.licdn.com/dms/image/C4D08AQHxNC95bXCesg/croft-frontend-shrinkToFit1024/0/1603481610997?e=2147483647&v=beta&t=qg93beZTv89sIZNBjL9RgBZ0M1aYiy1yMul5DOvrZMc" className={`${width>800 ? 'w-oneeighth' : 'w-oneeighth my-10'}`}/>
                    <div className="items-center ml-8">
                        <h2 className="text-secondary text-bold">Accessibility @ LinkedIn</h2>
                        <h4>As a Microsoft company, we've embraced digital inclusion, adopting the W3C (World Wide Web Consortium) WCAG (Web Content Accessibility Guidelines) V2.1 Level AA in the design and development of our products.</h4>
                        <h4>As part of our commitment to accessibility we continuously audit our products—internally and through a third party—using assistive technology such as screen reading software (e.g., JAWS, NVDA, VoiceOver and TalkBack).</h4>
                    </div>
                </div>

                <div className={`flex  ${width > 800 ? 'flex-row' : 'flex-col'} items-center justify-between`}>
                    <img src="https://media-exp1.licdn.com/dms/image/C4D08AQHDPESgCTS_0g/croft-frontend-shrinkToFit1024/0/1606258489568?e=2147483647&v=beta&t=oFxjds6s5za5MFNDxhhqPzERHYzfC5_vUXsMZmjH7m4" className={`${width>800 ? 'w-oneeighth' : 'w-oneeighth my-10'}`}/>
                    <div className="items-center ml-8">
                        <h2 className="text-secondary text-bold">Want even more info?</h2>
                        <h4>We have policies and conformance documentation to help explain our commitment and the current state of our products.</h4>
                        <h4>Policies: Accessibility Policy for Employees in Ontario </h4>
                        <h4> Conformance reports: Need a Section 508, WCAG, or EN 301 549 conformance report about one of our products? All of them are available through Microsoft’s Trust Center.</h4>
                    </div>
                </div>
            </div>

            {/* footer */}
            <br/> <br/> <br/> <Footer1 footerfront={true}/>
        </div>
    )
}