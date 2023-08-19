import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../components/Navbar";
import Button from "react-bootstrap/esm/Button";
import { ethers } from "ethers";
import abc from "../contract_data/abc.json";
import History from "../components/History";


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
                            abc.abi,
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
                    abc.abi,
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
            } catch (error) {
              console.log("Error: ", error);
            }
        }
    };
    

    return (
        <>
            <Header/>
            <Button variant="success" onClick={handleClaim}>Claim 200 Royalty Coins</Button>
            <span>You have {balance} Royalty Coins</span>
            <History/>
        </>
    )
};

export default Profile;