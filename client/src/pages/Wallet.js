import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ethers } from "ethers";

const Wallet = () => {
    const navigate = useNavigate();
    const [account, setAccount] = useState("");
    const [balance, setBalance] = useState(null);

    const handleWallet = async() => {
        const provider = new ethers.BrowserProvider(window.ethereum);
        try{
            const accounts = await provider.send("eth_requestAccounts");
            const seletedAccount = accounts[0];
            setAccount(seletedAccount);
            const signer = provider.getSigner();
            const bal= await signer.getBalance();
            setBalance(bal);
        }catch(error){
            console.log(error);
        }
    };

    const handleHome = () => {
        navigate("/");
    };

    return (
        <>
            <button onClick={handleWallet}>Connect a MetaMask Wallet</button>
            Address:{account}
            balance:{balance}
            <button onClick={handleHome}>Home</button>
        </>
    );
};

export default Wallet;
