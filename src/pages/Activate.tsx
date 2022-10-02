import { useMutation } from "@apollo/client";
import { useContext, useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import Footer1 from "../components/Footer1";
import Navbar1 from "../components/Navbar1";
import { ACTIVATE_USER } from "../Queries";

export default function Activate(){
    const {id} = useParams()
    console.log(id)
    const navigate = useNavigate()
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

    const [vercode, setVerCode] = useState(id)
    const [errortxt2, setErrorTxt2] = useState('')
    const [successtxt2, setSuccessTxt2] = useState('')
    
    const [verUser] = useMutation(ACTIVATE_USER, {
        variables: {
            activationID: vercode
        },
    });
    
    function goVer(e){
        e.preventDefault()
        console.log({
            activationID: vercode
        })
        if (vercode == '') {
            setErrorTxt2("Code must not be empty.")
            return
        }
        verUser().then((x) => {
            console.log(x.data.activateUser) 
            setSuccessTxt2('Verification success.')
            setErrorTxt2('')
            navigate('/login')
        })
        .catch((m) => {
            console.log(`error: ${m.message}`)
            if (m.message.includes('which the schema does not allow')){
                setErrorTxt2("Incorrect key.")
                console.log("in1")
                console.log("incorrect key")
            } else if (m.message.includes('not found')){
                setErrorTxt2("Code is invalid.")
                console.log("in2")
                console.log("user not found")
            } else {
                setErrorTxt2(m.message)
                console.log("out: " + m.message)
            }
            setSuccessTxt2('')
        })
    }

    return(
        <div>
            {/* navbar */}
            <div className="fixed-top w-full">
            <Navbar1 page={'front'}/> 
            </div>
            <br/> <br/> <br/> 
            {/* body */}
            <div className={`flex ${width > 1000 ? 'flex-row mx-32' : 'flex-col mx-12'} mt-8 mb-16`}>
            <div className={`items-center bg-white rounded-md px-6 py-3 w-80 shadow-lg m-auto ${width > 1000 ? '' : 'my-12'}`}>
                    <h1 className="text-secondary">Verification</h1>
                    <h4>Check your e-mail for verification code.</h4>
                    <form className="flex flex-col">
                    <input type="text" name="code" id="code" placeholder="Verification Code" title="Verification Code" className="text-input my-2" value={id} onChange={(e) => setVerCode(e.target.value)}/>
                    <div className="flex flex-col justify-center items-center">
                        {errortxt2 != '' && <div className="mx-2 text-center py-2 sec-box border-secondary rounded-md w-72  my-1">Error: {errortxt2}</div>}
                        {successtxt2 != '' && <div className="mx-2 text-center py-2 green-box border-green rounded-md w-72  my-1">{successtxt2}</div>}
                        <div className='mx-2 bg-primary-adv border-primary rounded-md w-72 button-text-white py-3 text-center my-1 hand'onClick={goVer}>Verify</div>
                        {/* <div className="my-4 flex flex-row">Not receiving code? <div className="mx-2 link text-primary" onClick={resend}>Resend</div></div> */}
                    </div>
                    </form>
                </div>

            </div>
            {/* footer */}
            <br/> <br/> <br/> <Footer1 footerfront={true}/>
        </div>
    )
}