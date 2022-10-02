import { useContext, useEffect, useState } from "react"
import Footer1 from "../components/Footer1"
import Navbar1 from "../components/Navbar1"
import Navbar2 from "../components/Navbar2"
import { UserContext } from "../contexts/UserContext"

export default function PrivacyPolicy(){

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
                    <h1 className="text-secondary">LinkHEdIn Privacy Policy</h1>
                    <h4>Effective August 11, 2020</h4>
                    <h3>LinkedIn’s mission is to connect the world’s professionals to allow them to be more productive and successful. Central to this mission is our commitment to be transparent about the data we collect about you, how it is used and with whom it is shared.
                        <br/><br/>
                    This Privacy Policy applies when you use our Services (described below). We offer our users choices about the data we collect, use and share as described in this Privacy Policy, Cookie Policy, Settings and our Help Center.</h3>
                </div>

                <div>
                    <h4>1. Data You Provide To Us</h4>
                    <p>
                    Registration
                    <br/> <br/>
                    To create an account you need to provide data including your name, email address and/or mobile number, and a password. If you register for a premium Service, you will need to provide payment (e.g., credit card) and billing information.
                    <br/> <br/>
                    Profile
                    <br/> <br/>
                    You have choices about the information on your profile, such as your education, work experience, skills, photo, city or area and endorsements. Some Members may choose to complete a separate ProFinder profile. You don’t have to provide additional information on your profile; however, profile information helps you to get more from our Services, including helping recruiters and business opportunities find you. It’s your choice whether to include sensitive information on your profile and to make that sensitive information public. Please do not post or add personal data to your profile that you would not want to be publicly available.
                    <br/> <br/>
                    Posting and Uploading
                    <br/> <br/>
                    We collect personal data from you when you provide, post or upload it to our Services, such as when you fill out a form, e.g., with demographic data or salary, respond to a survey, or submit a resume or fill out a job application on our Services. If you opt to import your address book, we receive your contacts including contact information your service provider or app automatically added to your address book when you communicated with addresses or numbers not already in your list.
                    <br/> <br/>
                    If you sync your contacts or calendars with our Services, we will collect your address book and calendar meeting information to keep growing your network by suggesting connections for you and others, and by providing information about events, e.g. times, places, attendees and contacts.
                    <br/> <br/>
                    You don’t have to post or upload personal data; though if you don’t, it may limit your ability to grow and engage with your network over our Services.
                    <br/> <br/>
                    <h4>2. How We Use Your Data</h4>
                    Services
                    <br/> <br/>
                    Our Services allow you to stay in touch and up to date with colleagues, partners, clients, and other professional contacts. To do so, you can “connect” with the professionals who you choose, and who also wish to “connect” with you. Subject to your and their settings, when you connect with other Members, you will be able to search each others’ connections in order to exchange professional opportunities.
                    <br/> <br/>
                    We use data about you (such as your profile, profiles you have viewed or data provided through address book uploads or partner integrations) to help others find your profile, suggest connections for you and others (e.g. Members who share your contacts or job experiences) and enable you to invite others to become a Member and connect with you. You can also opt-in to allow us to use your precise location or proximity to others for certain tasks (e.g. to suggest other nearby Members for you to connect with, calculate the commute to a new job, or notify your connections that you are at a professional event).
                    <br/> <br/>
                    Our Services allow you to explore careers, evaluate educational opportunities, and seek out, and be found for, career opportunities. Your profile can be found by those looking to hire (for a job or a specific task) or be hired by you. We will use your data to recommend jobs or mentees, show you and others relevant professional contacts (e.g., who work at a company, in an industry, function or location or have certain skills and connections). You can signal that you are interested in changing jobs and share information with recruiters. We will use your data to recommend jobs to you and you to recruiters. We may use automated systems to provide content and recommendations to help make our Services more relevant to our Members, Visitors and customers. Keeping your profile accurate and up-to-date may help you better connect to others and to opportunities through our Services.
                    <br/> <br/>
                    Communications
                    <br/> <br/>
                    We will contact you through email, mobile phone, notices posted on our websites or apps, messages to your LinkedIn inbox, and other ways through our Services, including text messages and push notifications. We will send you messages about the availability of our Services, security, or other service-related issues. We also send messages about how to use our Services, network updates, reminders, job suggestions and promotional messages from us and our partners. You may change your communication preferences at any time. Please be aware that you cannot opt out of receiving service messages from us, including security and legal notices.
                    <br/> <br/>
                    Advertising
                    <br/> <br/>
                    We will show you ads called sponsored content which look similar to non-sponsored content, except that they are labeled as advertising (e.g., as “ad” or “sponsored”). If you take a social action (such as like, comment or share) on these ads, your action is associated with your name and viewable by others, including the advertiser. Subject to your settings, if you take a social action on the LinkedIn Services, that action may be mentioned with related ads. For example, when you like a company we may include your name and photo when their sponsored content is shown.
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