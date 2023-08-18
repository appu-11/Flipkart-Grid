import Container from "react-bootstrap/esm/Container";
import Header from "../components/Navbar";
import Image from 'react-bootstrap/Image';
import { useState, useEffect } from "react";
import axios from "axios";
import Button from "react-bootstrap/esm/Button";
import { useNavigate } from "react-router-dom";

const Cart = () =>{
    const navigate = useNavigate();
    const [data, setData] = useState(null);
    const [totalprice, setTotalprice] = useState(null);

    useEffect(() => {
        const fetchData = async() => {
            try{
                const user = JSON.parse(localStorage.getItem('user'));
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
                const user = JSON.parse(localStorage.getItem('user'));
                // const key = user.key
                const res = await axios.post('http://localhost:8080/api/wallet/getwallet', {email: user.email});
                if(res.data.success) {
                    console.log(res.data.data);
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
        if(localStorage.getItem('user') === null) {
            alert("Please login to view cart");
        }
        else{
            fetchData();
            // getwalletData();
        }
    },[]);

    const handleBuy = () => {

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
                <span>Earn {} Coins on this Order</span>
                <Button onClick={handleBuy} className="col-lg-2">Buy Now</Button>
            </Container>
        </>
    )
};

export default Cart;