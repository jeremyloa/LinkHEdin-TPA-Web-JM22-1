import { useContext, useEffect, useState } from "react"
import Footer1 from "../components/Footer1"
import Navbar1 from "../components/Navbar1"
import Navbar2 from "../components/Navbar2"
import { UserContext } from "../contexts/UserContext"

export default function UserAgreement(){

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
                <div className="items-center text-center">
                    <h1 className="text-secondary">LinkHEdIn User Agreement</h1>
                    <h4>Effective on February 1, 2022</h4>
                    <h3>Our mission is to connect the world’s professionals to allow them to be more productive and successful. Our services are designed to promote economic opportunity for our members by enabling you and millions of other professionals to meet, exchange ideas, learn, and find opportunities or employees, work, and make decisions in a network of trusted relationships.</h3>
                </div>

                <div>
                    <h4>1.1 Contract</h4>
                    <p>
                    You agree that by clicking “Join Now”, “Join LinkHEdIn”, “Sign Up” or similar, registering, accessing or using our services (described below), you are agreeing to enter into a legally binding contract with LinkHEdIn (even if you are using our Services on behalf of a company). If you do not agree to this contract (“Contract” or “User Agreement”), do not click “Join Now” (or similar) and do not access or otherwise use any of our Services. If you wish to terminate this contract, at any time you can do so by closing your account and no longer accessing or using our Services.
                    <br/> <br/>
                    Services
                    This Contract applies to LinkHEdIn.com, LinkHEdIn-branded apps, LinkHEdIn Learning and other LinkHEdIn-related sites, apps, communications and other services that state that they are offered under this Contract (“Services”), including the offsite collection of data for those Services, such as our ads and the “Apply with LinkHEdIn” and “Share with LinkHEdIn” plugins. Registered users of our Services are “Members” and unregistered users are “Visitors”.
                    <br/> <br/>
                    LinkHEdIn
                    You are entering into this Contract with LinkHEdIn (also referred to as “we” and “us”). We use the term “Designated Countries” to refer to countries in the European Union (EU), European Economic Area (EEA), and Switzerland.
                    <br/> <br/>
                    If you reside in the “Designated Countries”, you are entering into this Contract with LinkHEdIn Ireland Unlimited Company (“LinkHEdIn Ireland”) and LinkHEdIn Ireland will be the controller of your personal data provided to, or collected by or for, or processed in connection with our Services.
                    <br/> <br/>
                    If you reside outside of the “Designated Countries”, you are entering into this Contract with LinkHEdIn Corporation (“LinkHEdIn Corp.”) and LinkHEdIn Corp. will be the controller of your personal data provided to, or collected by or for, or processed in connection with our Services.
                    <br/> <br/>
                    This Contract applies to Members and Visitors.
                    <br/> <br/>
                    As a Visitor or Member of our Services, the collection, use and sharing of your personal data is subject to this Privacy Policy (which includes our Cookie Policy and other documents referenced in this Privacy Policy) and updates.
                    <br/> <br/>
                    <br/>                  
                    </p>

                    <h4>1.2 Members and Visitors</h4>
                    <p>
                    When you register and join the LinkHEdIn Services, you become a Member. If you have chosen not to register for our Services, you may access certain features as a “Visitor.”
                    <br/> <br/>
                    <br/>
                    </p>

                    <h4>1.3 Change</h4>
                    <p>
                    We may make changes to the Contract. We may modify this Contract, our Privacy Policy and our Cookies Policy from time to time. If we make material changes to it, we will provide you notice through our Services, or by other means, to provide you the opportunity to review the changes before they become effective. We agree that changes cannot be retroactive. If you object to any changes, you may close your account. Your continued use of our Services after we publish or send a notice about our changes to these terms means that you are consenting to the updated terms as of their effective date.
                    <br/> <br/>
                    <br/>
                    </p>
                </div>
                
            </div>

            {/* footer */}
            <br/> <br/> <br/> <Footer1 footerfront={true}/>
        </div>
    )
}