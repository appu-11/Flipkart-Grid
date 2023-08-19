import Container from 'react-bootstrap/Container';
import Image from 'react-bootstrap/Image';
import macbook from './macbook.jpg';
import box from './box.jpg';
import m2chip from './m2chip.jpg';
import macbookdisplay from './macbookdisplay.jpg';
import macbooks from './macbooks.jpg';
import "./Product.css";
import Header from './Navbar';
import Button from 'react-bootstrap/esm/Button';
import { useState } from 'react';
import axios from 'axios';
import {useNavigate} from 'react-router-dom';

const Product = () => {
    const [img, setImg] = useState(macbook);
    const navigate = useNavigate();
    const [quantity, setQuantity] = useState(0);
    const price = 102000;
    const [user, setUser] = useState(null);
    const name = "APPLE 2020 Macbook Air M1 - (8 GB/256 GB SSD/Mac OS Big Sur) MGN63HN/A  (13.3 inch, Space Grey, 1.29 kg)";
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
                    <div  className='image'>
                        <Image src = {macbook} alt='macbook' onMouseEnter={() => onhover(macbook)} fluid/>
                        <Image src = {macbooks} alt='macbook' onMouseEnter={() => onhover(macbooks)} fluid/>
                        <Image src = {m2chip} alt='macbook' onMouseEnter={() => onhover(m2chip)} fluid/>
                        <Image src = {macbookdisplay} alt='macbook' onMouseEnter={() => onhover(macbookdisplay)} fluid/>
                        <Image src = {box} alt='macbook' onMouseEnter={() => onhover(box)} fluid/>
                    </div>
                    <div>
                        <Image src = {img} alt='image' fluid/>
                    </div>
                </Container>
                <Container className="details">
                    <div>
                        <span>{name}</span>
                    </div>
                    <div style={{marginTop:"1vh"}}>
                        Price: &#8377;{price}
                    </div>
                    <div style={{marginTop:"1vh"}}>
                        Highlights:
                        <div className='highlights' >
                            <ul  className='highlist'>
                                <li>
                                    Stylish & Portable Thin and Light Laptop
                                </li>
                                <li>
                                    13.3 inch Quad LED Backlit IPS Display (227 PPI, 400 nits Brightness, Wide Colour (P3), True Tone Technology)
                                </li>
                                <li>
                                    Light Laptop without Optical Disk Drive
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

export default Product;