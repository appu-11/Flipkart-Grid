import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../components/Navbar";

const Profile = () =>{
    const navigate = useNavigate();
    const [user, setUser] = useState(null);

    if(user === null && localStorage.getItem("user")){
        setUser(JSON.parse(localStorage.getItem("user")));
    }

    if(user === null) {
        navigate("/login");    
    }

    return (
        <>
            <Header/>
            {user.email}
        </>
    )
};

export default Profile;