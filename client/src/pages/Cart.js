import Container from "react-bootstrap/esm/Container";
import Header from "../components/Navbar";
import Image from "react-bootstrap/Image";
import { useState, useEffect } from "react";
import axios from "axios";
import Button from "react-bootstrap/esm/Button";
import { useNavigate } from "react-router-dom";
import RoyaltyCoin from "../contract_data/RoyaltyCoin.json";
import { ethers } from "ethers";
import "./cart.css";
import { toast } from "react-hot-toast";

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

  useEffect(() => {
    const getwalletData = async () => {
      try {
        if (window.ethereum) {
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
      } catch (err) {
        console.log(err);
      }
    };
    if (localStorage.getItem("user") === null) {
      alert("Please login to view cart");
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
        alert("Try again");
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
            RoyaltyCoin.abi,
            signer
          );
          // const signer = provider.getSigner();
          const res = await contract.redeem(balance);
          await res.wait();
          if (res) {
            alert("Coins Redeemed Successful");
            setBalance(balance - maxcoin);
            handleBuy();
          } else {
            alert("try again");
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
        alert("Transaction Successful");
        const provider = new ethers.BrowserProvider(window.ethereum);
        const signer = await provider.getSigner();
        const contract = new ethers.Contract(
          contractaddress,
          RoyaltyCoin.abi,
          signer
        );
        const earn = await contract.earn(earncoins);
        await earn.wait();
        alert("You Earned Royalty Coins");
        navigate("/profile");
      } else {
        alert("try again");
      }
    } catch (err) {
      console.log(err);
    }
  };

  if (data === null) {
    return (
      <div class="balls">
        <div></div>
        <div></div>
        <div></div>
      </div>
    );
  }

  return (
    <>
      <Header />
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
          data.map((item, index) => (
            <div style={{ marginTop: "5vh" }}>
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
                  <div className="d-flex flex-column mt-5">
                    <span>{item.name}</span>
                    <span>Quantity: {item.quantity}</span>
                    <span>Price: &#8377; {item.price * item.quantity}</span>
                  </div>
                </div>
              </Container>
            </div>
          ))
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
            style={{ marginTop: "2vh", marginLeft: "5vw", fontWeight: "bold" }}
          >
            COIN BALANCE : {balance} <i class="bi bi-coin"></i>
          </span>
          <span
            style={{ marginTop: "10vh", fontSize: "large", fontWeight: "bold" }}
          >
            Total Price ({data.length} items): &#8377; {totalprice}
          </span>
          <span style={{ marginTop: "3vh" }}>
            Redeem {maxcoin} Coins to avail &#8377; {discount} Discount
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
