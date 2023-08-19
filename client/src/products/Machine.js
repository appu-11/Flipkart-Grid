import Container from 'react-bootstrap/Container';
import Image from 'react-bootstrap/Image';
import "./Product.css";
import Header from '../components/Navbar';
import Button from 'react-bootstrap/esm/Button';
import machine from './images/machine.jpg';
import machine1 from './images/machine1.jpg';
import machine2 from './images/machine2.jpg';
import machine3 from './images/machine3.jpg';
import { useState } from 'react';
import axios from 'axios';
import {useNavigate} from 'react-router-dom';

const Machine = () => {
    const [img, setImg] = useState(machine);
    const navigate = useNavigate();
    const [quantity, setQuantity] = useState(0);
    const price = 36990;
    const [user, setUser] = useState(null);
    const name = "SAMSUNG 8 kg 5 Star, AI Ecobubble,Wi-Fi,Hygiene Steam,Digital Inverter Fully Automatic Front Load Washing Machine with In-built Heater Black  (WW80T504DAB1TL)";
    const onhover = (imageSrc) => {
        setImg(imageSrc);
    };

    if(user === null && localStorage.getItem('user')) {
        setUser(JSON.parse(localStorage.getItem('user')));
    }

    const handleAddtocart = async() => {
        if(user === null) {
            alert("Please login to add to cart");
            navigate("/login");
        }
        else{
            const email = user.email;
            console.log(email);
            const res = await axios.post('http://localhost:8080/api/cart/addtocart', {name, quantity, email, price});
            if(res.data.success) {
                alert("Added to cart");
            }
            else{
                alert("Error in adding to cart");
            }
        }
    };

    const handlebuy = () => {
        navigate("/cart");
    };

    const handleAddquant = () =>{
        setQuantity(quantity + 1);
    };

    const handleSubquant = () => {
        if(quantity >= 1) {
            setQuantity(quantity - 1); 
        }
    };
    
    return (
        <>
            <Header/>
            <div className = "product">
                <Container className='d-flex flex-col'>
                    <div  className='image mr-2'>
                        <Image src = {machine} alt='macbook' onMouseEnter={() => onhover(machine)} className='mt-4' fluid/>
                        <Image src = {machine1} alt='macbook' onMouseEnter={() => onhover(machine1)} className='mt-2' fluid/>
                        <Image src = {machine2} alt='macbook' onMouseEnter={() => onhover(machine2)} className='mt-2' fluid/>
                        <Image src = {machine3} alt='macbook' onMouseEnter={() => onhover(machine3)} className='mt-2' fluid/>
                    </div>
                    <div>
                        <Image src = {img} alt='image' width={"90%"} className='mt-5' style={{marginLeft:"2vw"}} fluid/>
                    </div>
                </Container>
                <Container className="details">
                    <div>
                        <span>{name}</span>
                    </div>
                    <div style={{marginTop:"1vh", display:"flex", flexDirection:"row"}}>
                        <span>Price: &#8377;36,990</span>&nbsp;&nbsp;
                        <p style={{textDecoration:"line-through", opacity:"0.8"}}>44,900</p>
                    </div>
                    <div style={{marginTop:"1vh"}}>
                        Highlights:
                        <div className='highlights' >
                            <ul  className='highlist'>
                                <li>
                                    Fully Automatic Front Load Washing Machines have Great Wash Quality with very less running cost
                                </li>
                                <li>
                                    1400 rpm : Higher the spin speed, lower the drying time
                                </li>
                                <li>
                                    5 Star Rating
                                </li>
                                <li>
                                    8 kg
                                </li>
                            </ul>
                        </div>
                    </div>
                    <div className='mt-3'>
                        <span>You can earn Upto 2000 Reward Points</span>
                    </div>
                    <div>
                        <Button onClick={handleSubquant} className='minus' variant='light'><svg xmlns="http://www.w3.org/2000/svg" height="1em" viewBox="0 0 448 512"><path d="M432 256c0 17.7-14.3 32-32 32L48 288c-17.7 0-32-14.3-32-32s14.3-32 32-32l352 0c17.7 0 32 14.3 32 32z"/></svg></Button>
                        {quantity}
                        <Button onClick={handleAddquant} className='plus' variant='light'><svg xmlns="http://www.w3.org/2000/svg" height="1em" viewBox="0 0 448 512"><path d="M256 80c0-17.7-14.3-32-32-32s-32 14.3-32 32V224H48c-17.7 0-32 14.3-32 32s14.3 32 32 32H192V432c0 17.7 14.3 32 32 32s32-14.3 32-32V288H400c17.7 0 32-14.3 32-32s-14.3-32-32-32H256V80z"/></svg></Button>
                    </div>
                    <div className='buy'>
                        <Button className='cart' variant='light' size='lg' onClick={handleAddtocart}>Add to Cart</Button>
                        <Button variant='dark' size='lg' onClick={handlebuy}>Buy Now</Button>
                    </div>
                </Container>
            </div>
        </>
    );
};

export default Machine;