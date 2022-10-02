import { useContext } from "react";
import { Route, Routes, useNavigate } from "react-router-dom";
import { UserContext } from "../../contexts/UserContext";
import Logout from "../Logout";
import Home from "./Home";
import Jobs from "./Jobs";
import Messaging from "./Messaging";
import Network from "./Network";
import Notification from "./Notification";
import Profile from "./Profile";
import Search from "./Search";

export default function In(){
    
    return(
        <Routes>
            <Route path='logout' element={<Logout/>}/>
            <Route path="home" element={<Home/>}/>
            <Route path="network" element={<Network/>}/>
            <Route path="jobs" element={<Jobs/>}/>
            <Route path="messaging" element={<Messaging/>}/>
            <Route path="notification" element={<Notification/>}/>
            <Route path="profile/:unam" element={<Profile/>}/>
            <Route path="search/:quer" element={<Search/>}/>
        </Routes>
    )
}