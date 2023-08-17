import { useAuth0 } from "@auth0/auth0-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../components/Navbar";

const Home = () => {
    const navigate = useNavigate();
    const { loginWithRedirect, logout } = useAuth0();
    const { user, isAuthenticated, isLoading } = useAuth0();
    const [User, setUser] = useState(null);
    const handleLogin = () => {
        navigate("/login");
    };

    const handleLogout = () => {
        if(user && isAuthenticated)
            logout({ returnTo: window.location.origin });
        if(localStorage.getItem("user") !== null) {
            localStorage.removeItem("user");
            setUser(null);
        }
    };

    const handleWallet = () => {
        navigate("/wallet");
    };

    if((isAuthenticated && user)) {
        const usera = {
            name: user.name,
            email: user.email,
        }
        if(localStorage.getItem("user") !== null){
            localStorage.removeItem("user");
        }
        localStorage.setItem("user", JSON.stringify(usera));
        setUser(usera);
    }

    if(User === null) {
        if(localStorage.getItem("user") !== null) {
            setUser(JSON.parse(localStorage.getItem("user")));
        }
    }

    return (
        <Header/>
    );
};
export default Home;
