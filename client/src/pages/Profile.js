import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../components/Navbar";
import Button from "react-bootstrap/esm/Button";
import { ethers } from "ethers";
import RoyaltyCoin from "../contract_data/RoyaltyCoin.json";
import History from "../components/History";
import axios from "axios";


const Profile = () =>{
    const contractaddress = process.env.REACT_APP_contract_address;
    const navigate = useNavigate();
    const [user, setUser] = useState(null);
    const [balance, setBalance] = useState(0);

    if(user === null && localStorage.getItem("user")){
        setUser(JSON.parse(localStorage.getItem("user")));
    }

    if(user === null) {
        navigate("/login");    
    }
    console.log(user);

    useEffect(() => {
        const init = async() => {
            try{
                if(window.ethereum) {
                    try {
                        const provider = new ethers.BrowserProvider(window.ethereum);
                        const signer = await provider.getSigner();
                        const contract = new ethers.Contract(
                            contractaddress,
                            RoyaltyCoin.abi,
                            signer
                        );
                        const res = await contract.balanceOf();
                        setBalance(Number(res));
                    } catch (error) {
                        console.log("Error: ", error);
                    }
                }
            }catch(err){
                console.log(err);
                console.log("error in profile");
            }}

        init();
    },[]);

    const handleClaim = async() => {
        if (window.ethereum) {
            try {
                const provider = new ethers.BrowserProvider(window.ethereum);
                const signer = await provider.getSigner();
                const contract = new ethers.Contract(
                    contractaddress,
                    RoyaltyCoin.abi,
                    signer
                );
                const res = await contract.registerUser();
                await res.wait();
                if(res) {
                    alert("Claimed 200 Royalty Coins");
                }
                else {
                    alert("try again");
                }
                const response = await axios.post('http://localhost:8080/api/auth/claim', {email: user.email});
                localStorage.removeItem("user");
                localStorage.setItem("user", JSON.stringify(response.data.user));
                window.location.reload();
            } catch (error) {
              console.log("Error: ", error);
            }
        }
    };
    // console.log(user["claimed"], "claimed");
    return (
        <>
            <Header/>
            <div style={{ display: 'flex', justifyContent: 'space-around', margin:"auto", marginTop:"2%" }}>
                <span>You have {balance} Royalty Coins</span>
                {
                    (user && !user.claimed) &&
                    <Button variant="success" onClick={handleClaim}>Claim 200 Royalty Coins</Button>
                }
            </div>
            <div style = {{marginLeft:"10vw", fontWeight:"700"}}>History:</div>
            <History/>
        </>
    )
};

export default Profile;