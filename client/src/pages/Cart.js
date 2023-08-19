import Container from "react-bootstrap/esm/Container";
import Header from "../components/Navbar";
import Image from 'react-bootstrap/Image';
import { useState, useEffect } from "react";
import axios from "axios";
import Button from "react-bootstrap/esm/Button";
import { useNavigate } from "react-router-dom";
import RoyaltyCoin from "../contract_data/RoyaltyCoin.json";
import { ethers } from "ethers";

const Cart = () =>{
    const contractaddress = process.env.REACT_APP_contract_address;
    const navigate = useNavigate();
    const [data, setData] = useState(null);
    const [totalprice, setTotalprice] = useState(null);
    const [balance, setBalance] = useState(0);

    useEffect(() => {
        const fetchData = async() => {
            try{
                const user = JSON.parse(localStorage.getItem('user'));
                console.log(user);
                const res = await axios.post('http://localhost:8080/api/cart/getcart', {email: user.email});
                if(res.data.success) {
                    setData(res.data.data);
                    let price = 0;
                    for(let i = 0; i < res.data.data.length; i++) {
                        price += res.data.data[i].price * res.data.data[i].quantity;
                    }
                    setTotalprice(price);
                }
                else{
                    alert("Try Again");
                }
            }
            catch(err){
                console.log(err);
                alert("Try again");
            }
        };

        const getwalletData = async() => {
            try{
                if (window.ethereum) {
                    try {
                        const provider = new ethers.BrowserProvider(window.ethereum);
                        const signer = await provider.getSigner();
                        const contract = new ethers.Contract(
                            contractaddress,
                            RoyaltyCoin.abi,
                            signer
                        );
                        // const signer = provider.getSigner();
                        // console.log("signer: ", signer)
                        // const address = (await signer).address;
                        //   const useraddress = "0x7c167Fd2Be04899589706afCdD22Ce269F71b9f1";
                        // const boo = await contract.registerUser();
                        // await boo.wait();
                        const res = await contract.balanceOf();
                        setBalance(Number(res));
                    } catch (error) {
                      console.log("Error: ", error);
                    }
                }
            }
            catch(err){
                console.log(err);
            }
        };
        if(localStorage.getItem('user') === null) {
            alert("Please login to view cart");
        }
        else{
            fetchData();
            getwalletData();
        }
    },[]);

    const handleBuy = async() => {
        try{
            if (window.ethereum) {
                try {
                    const provider = new ethers.BrowserProvider(window.ethereum);
                    const signer = await provider.getSigner();
                    const contract = new ethers.Contract(
                        contractaddress,
                        RoyaltyCoin.abi,
                        signer
                    );
                    // const signer = provider.getSigner();
                    // console.log("signer: ", signer)
                    // const address = (await signer).address;
                    //   const useraddress = "0x7c167Fd2Be04899589706afCdD22Ce269F71b9f1";
                    // const boo = await contract.registerUser();
                    // await boo.wait();
                    const res = await contract.redeem(balance);
                    await res.wait();
                    if(res){
                        alert("Transaction Successful");
                        setBalance(0);
                    }
                    else{
                        alert("try again");
                    }
                } catch (error) {
                  console.log("Error: ", error);
                }
            }
        }
        catch(err){
            console.log(err);
        }
    };
    
    if(data === null) {
        return(
            <div>Loading....</div>
        );
    }

    return(
        <>
            <Header/>
            <Container>

                {data.map((item, index) => (
                    <div className="d-flex flex-row" key={index}>
                        <div className="col-lg-2">
                            <Image src={require("../components/macbook.jpg")} alt="macbook" fluid />
                        </div>
                        <div className="d-flex flex-column mt-5">
                            <span>{item.name}</span>
                            <span>Quantity: {item.quantity}</span>
                            <span>Price: {item.price * item.quantity}</span>
                        </div>
                    </div>
                ))}
            </Container>
            <Container className="d-flex flex-column">
                <span>Total Price: {totalprice}</span>
                <span>Earn {} Royalty Coins on this Order</span>
                <span>You have {balance} Royalty Coins</span>
                <Button onClick={handleBuy} className="col-lg-2">Buy Now</Button>
            </Container>
        </>
    )
};

export default Cart;