import Container from "react-bootstrap/esm/Container";
import Header from "../components/Navbar";
import Image from "react-bootstrap/Image";
import { useState, useEffect } from "react";
import axios from "axios";
import Button from "react-bootstrap/esm/Button";
import { useNavigate } from "react-router-dom";
import Sikka from "../contract_data/Sikka.json";
import { ethers } from "ethers";
import "./cart.css";
import { toast, ToastContainer} from "react-toastify";

const Cart = () => {
  const contractaddress = process.env.REACT_APP_contract_address;
  const navigate = useNavigate();
  const [data, setData] = useState(null);
  const [totalprice, setTotalprice] = useState(null);
  const [discount, setDiscount] = useState(0);
  const [balance, setBalance] = useState(0);
  const [maxcoin, setMaxcoin] = useState(0);
  const [inprocess, setInprocess] = useState(false);
  const [earncoins, setEarncoins] = useState(0);
  const [showReview, setShowReview] = useState(false);

  useEffect(() => {
    const getwalletData = async () => {
      try {
        if (window.ethereum) {
          try {
            const provider = new ethers.BrowserProvider(window.ethereum);
            const signer = await provider.getSigner();
            const contract = new ethers.Contract(
              contractaddress,
              Sikka.abi,
              signer
            );
            const res = await contract.balanceOf();
            setBalance(Number(res));
          } catch (error) {
            console.log("Error: ", error);
          }
        }
      } catch (err) {
        console.log(err);
      }
    };
    if (localStorage.getItem("user") === null) {
      toast.error("Please Login to view cart", {
        position: toast.POSITION.TOP_RIGHT
      });
    } else {
      getwalletData();
    }
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const user = JSON.parse(localStorage.getItem("user"));
        console.log(user);
        const res = await axios.post("http://localhost:8080/api/cart/getcart", {
          email: user.email,
        });
        if (res.data.success) {
          setData(res.data.data);
          let price = 0;
          for (let i = 0; i < res.data.data.length; i++) {
            price += res.data.data[i].price * res.data.data[i].quantity;
          }
          let temp = Math.min(100, Math.ceil((price / 100) * 5));
          let x = Math.min(balance, temp * 20);
          temp = Math.floor(x / 20);
          setTotalprice(price);
          setMaxcoin(x);
          setDiscount(temp);
          setEarncoins(Math.min(100, Math.ceil((price / 100) * 2.5)));
          console.log(x, "x");
          console.log(temp, "temp");
          console.log(balance, "balance");
        } else {
          toast.success("No items in cart");
          setData([]);
        }
      } catch (err) {
        console.log(err);
        toast.error("Try Again!", {
          position: toast.POSITION.TOP_RIGHT
      });
      }
    };
    fetchData();
  }, [balance]);

  const handleRedeem = async () => {
    try {
      if (window.ethereum) {
        try {
          setInprocess(true);
          const provider = new ethers.BrowserProvider(window.ethereum);
          const signer = await provider.getSigner();
          const contract = new ethers.Contract(
            contractaddress,
            Sikka.abi,
            signer
          );
          // const signer = provider.getSigner();
          const res = await contract.redeem(balance);
          await res.wait();
          if (res) {
            toast.success("Sikke Redeemed Successfully!", {
              position: toast.POSITION.TOP_RIGHT
          });
            setBalance(balance - maxcoin);
            handleBuy();
          } else {
            toast.error("Try Again!", {
              position: toast.POSITION.TOP_RIGHT
            });
          }
        } catch (error) {
          console.log("Error: ", error);
        }
      }
    } catch (err) {
      console.log(err);
    }
  };

  const handleBuy = async () => {
    try {
      const user = JSON.parse(localStorage.getItem("user"));
      const response = await axios.post(
        "http://localhost:8080/api/cart/emptycart",
        { email: user.email }
      );
      if (response) {
        toast.success("Trasaction Successful", {
          position: toast.POSITION.TOP_RIGHT
        });
        const provider = new ethers.BrowserProvider(window.ethereum);
        const signer = await provider.getSigner();
        const contract = new ethers.Contract(
          contractaddress,
          Sikka.abi,
          signer
        );
        const earn = await contract.earn(earncoins);
        await earn.wait();
        toast.success("You Earned Sikke", {
          position: toast.POSITION.TOP_RIGHT
        });
        setShowReview(true);
      } else {
        toast.error("Try Again", {
          position: toast.POSITION.TOP_RIGHT
        });
      }
    } catch (err) {
      console.log(err);
    }
  };

  const handleSubmit = () => {
    navigate("/profile");
  }

  const handleSubmitreward = async() => {
    try{
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const contract = new ethers.Contract(
        contractaddress,
        Sikka.abi,
        signer
      );
      const earn = await contract.earn(50);
      await earn.wait();
      
      toast.success("Review Submitted",{
        position: toast.POSITION.TOP_RIGHT
      });
    }
    catch(err){
      toast.error("Try Again",{
        position: toast.POSITION.TOP_RIGHT
      });
    }
    
    navigate("/profile");
  }

  if (data === null) {
    return (
      <div class="balls">
        <div></div>
        <div></div>
        <div></div>
      </div>
    );
  }

  if(showReview) {
    return(
      <>
      <Header />
      <Container className = "d-flex flex-direction-row">
      <Container className="mt-5 ml-5">
        <span>Submit a Review</span>
      <input
        type="text"
        className="review-input form-control mt-3 "
        />
      <Button variant="light" style={{marginRight:"2vw", marginLeft:"35vw", marginTop:"4vh"}} onClick={handleSubmit}>Cancel</Button>
      <Button variant="success" onClick={handleSubmitreward}>Submit</Button>
      </Container>
      <div
          className="right-conatiner"
          style={{
            width: "30vw",
            display: "flex",
            flexDirection: "column",
            marginLeft: "3vw",
            border: "solid",
            marginTop: "10vh",
            padding: "2%",
            borderRadius: "10px",
          }}
        >
          <span
            style={{ marginTop: "2vh", fontWeight: "bold", textAlign:"center" }}
          >
            COIN BALANCE : {balance} <i class="bi bi-coin"></i>
          </span>
          <span
            style={{ marginTop: "10vh", fontSize: "large", fontWeight: "bold" }}
          >
            Total Price ({data.length} items): &#8377; 0
          </span>
        </div>
      </Container>
        
      </>
    );
  }
  return (
    <>
      <Header />
      <ToastContainer/>
      <div
        className="class-conatainer"
        style={{
          display: "flex",
          flexDirection: "row",
          paddingLeft: "5%",
          paddingRight: "5%",
        }}
      >
        {data && data.length > 0 ? (
        <Container className="mt-4">{
          data.map((item, index) => (
            <div style={{ marginTop: "5vh", display:"flex", flexDirection:"column" }}>
              <Container>
                <div className="d-flex flex-row" key={index}>
                  <div className="col-lg-2">
                    {item.name ===
                    "APPLE 2020 Macbook Air M1 - (8 GB/256 GB SSD/Mac OS Big Sur) MGN63HN/A  (13.3 inch, Space Grey, 1.29 kg)" ? (
                      <Image
                        src={require("../components/macbook.jpg")}
                        alt="macbook"
                        fluid
                      />
                    ) : (
                      <Image
                        src={require("../products/images/machine.jpg")}
                        alt="machine"
                        fluid
                      />
                    )}
                  </div>
                  <div className="d-flex flex-column mt-4">
                    <span>{item.name}</span>
                    <span>Quantity: {item.quantity}</span>
                    <span>Price: &#8377; {item.price * item.quantity}</span>
                  </div>
                </div>
              </Container>
            </div>
          ))}
          </Container>
        ) : (
          <Container className="mt-5">Shop Now to add items to cart</Container>
        )}
        <div
          className="right-conatiner"
          style={{
            width: "30vw",
            display: "flex",
            flexDirection: "column",
            marginLeft: "3vw",
            border: "solid",
            marginTop: "10vh",
            padding: "2%",
            borderRadius: "10px",
          }}
        >
          <span
            style={{ marginTop: "2vh", fontWeight: "bold", textAlign:"center" }}
          >
            COIN BALANCE : {balance} <i class="bi bi-coin"></i>
          </span>
          <span
            style={{ marginTop: "10vh", fontSize: "large", fontWeight: "bold" }}
          >
            Total Price ({data.length} items): &#8377; {totalprice}
          </span>
          <span style={{ marginTop: "3vh" }}>
            Redeem {maxcoin} Coins to avail<br></br>
            &#8377; {discount} Discount
          </span>
          <Button
            onClick={handleRedeem}
            className="col-lg-2"
            disabled={inprocess}
            style={{ marginTop: "10vh", width: "100%" }}
          >
            Redeem Now
          </Button>
          <Button
            onClick={handleBuy}
            className="col-lg-2"
            disabled={inprocess}
            style={{ marginTop: "5vh", width: "100%" }}
          >
            {" "}
            Buy Now
          </Button>
        </div>
      </div>
    </>
  );
};

export default Cart;
