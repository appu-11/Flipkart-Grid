import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../components/Navbar";
import Button from "react-bootstrap/esm/Button";
import { ethers } from "ethers";
import Sikka from "../contract_data/Sikka.json";
import History from "../components/History";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";

const Profile = () => {
  const contractaddress = process.env.REACT_APP_contract_address;
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [balance, setBalance] = useState(0);
  const [isClaiming, setIsClaiming] = useState(false);
  const [numberOfTokens, setNumberOfTokens] = useState(0);
  const [giftPublicKey, setGiftPublicKey] = useState("");
  const [giftToken, setGiftToken] = useState(0);

  if (user === null && localStorage.getItem("user")) {
    setUser(JSON.parse(localStorage.getItem("user")));
  }

  if (user === null) {
    navigate("/login");
  }
  console.log(user);

  const handleTokenChange = (event) => {
    let newValue = event.target.value;
    newValue = newValue.replace(/^0+/, "");

    if (
      newValue === "" ||
      (parseInt(newValue, 10) <= 100000 && parseInt(newValue, 10) > 0)
    ) {
      setNumberOfTokens(newValue);
    }
  };

  useEffect(() => {
    const init = async () => {
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
        else{
          alert("Please install metamask");
          window.open("https://metamask.io/","_blank");
        }
      } catch (err) {
        console.log(err);
        console.log("error in profile");
      }
    };

    init();
  }, []);

  const handleClaim = async () => {
    if (window.ethereum) {
      try {
        setIsClaiming(true);
        const provider = new ethers.BrowserProvider(window.ethereum);
        const signer = await provider.getSigner();
        const contract = new ethers.Contract(
          contractaddress,
          Sikka.abi,
          signer
        );
        const res = await contract.registerUser();
        await res.wait();
        if (res) {
          toast.success("Claimed 200 Sikke", {
            position: toast.POSITION.TOP_RIGHT,
          });
        } else {
          toast.error("Something went wrong!", {
            position: toast.POSITION.TOP_RIGHT,
          });
        }
        const response = await axios.post(
          "http://localhost:8080/api/auth/claim",
          { email: user.email }
        );
        localStorage.removeItem("user");
        localStorage.setItem("user", JSON.stringify(response.data.user));
        window.location.reload();
      } catch (error) {
        console.log("Error: ", error);
      }
    }
  };
  const handleBuyClick = async () => {
    try {
      if (window.ethereum) {
        const provider = new ethers.BrowserProvider(window.ethereum);
        const signer = await provider.getSigner();
        const contract = new ethers.Contract(
          contractaddress,
          Sikka.abi,
          signer
        );
        const res = await contract.purchaseTokens(numberOfTokens);
        await res.wait();
        const bal = await contract.balanceOf();
        setBalance(Number(bal));
        setNumberOfTokens(0);
      }
    } catch (err) {
      console.log(err);
    }
  };

  const handlegiftTokenChange = (event) => {
    let newValue = event.target.value;
    newValue = newValue.replace(/^0+/, "");

    if (
      newValue === "" ||
      (parseInt(newValue, 10) <= 500 && parseInt(newValue, 10) > 0)
    ) {
      setGiftToken(newValue);
    }
  };

  const handlegiftPublicKeyChange = (event) => {
    setGiftPublicKey(event.target.value);
  };

  const handleSubmitgift = async () => {
    try {
      if (window.ethereum) {
        const provider = new ethers.BrowserProvider(window.ethereum);
        const signer = await provider.getSigner();
        const contract = new ethers.Contract(
          contractaddress,
          Sikka.abi,
          signer
        );
        try {
          const res = await contract.Transfer(giftPublicKey, giftToken);
          await res.wait();
          const bal = await contract.balanceOf();
          setBalance(Number(bal));
          setGiftToken(0);
          setGiftPublicKey("");
        } catch (error) {
          console.log(error.message);
          toast.error(error.message, {
            position: toast.POSITION.TOP_RIGHT,
          });
        }
      }
    } catch (err) {
      console.log(err);
      console.log("error in sending gift");
    }
  };

  return (
    <>
      <Header />
      <ToastContainer />
      <div style={{ marginLeft: "5vw", marginTop: "3vh", display: "flex" }}>
        <span>Current Balance : {balance}</span>
        {user && !user.claimed && (
          <Button
            variant="success"
            onClick={handleClaim}
            style={{ marginLeft: "70vw" }}
            disabled={isClaiming}
          >
            Claim 200 Sikka
          </Button>
        )}
      </div>
      {user?.seller && (
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            marginTop: "8vh",
            marginLeft: "26vw",
          }}
        >
          <div className="buy-token" style={{ marginBottom: "2vh" }}>
            <span>Buy tokens:</span>
            <input
              placeholder="Number of tokens"
              style={{ marginRight: "3vw", width: "30vw", marginLeft: "1vw" }}
              type="number"
              min="1"
              value={numberOfTokens}
              onChange={handleTokenChange}
              max="100000"
              onKeyDown={(e) => {
                if (e.key === "-") {
                  e.preventDefault();
                }
              }}
              onSubmit={handleBuyClick}
            ></input>
            <Button onClick={handleBuyClick}>Buy</Button>
          </div>
          <div className="gift-token">
            <span>Gift tokens:</span>
            <input
              placeholder="public-key"
              style={{ width: "17vw", marginLeft: "1.3vw", marginRight: "1vw" }}
              type="text"
              value={giftPublicKey}
              onChange={handlegiftPublicKeyChange}
            ></input>
            <input
              placeholder="amount"
              style={{ width: "12vw", marginRight: "2.8vw" }}
              type="number"
              min="1"
              value={giftToken}
              onChange={handlegiftTokenChange}
              max="500"
              onKeyDown={(e) => {
                if (e.key === "-") {
                  e.preventDefault();
                }
              }}
              onSubmit={handleSubmitgift}
            ></input>
            <Button onClick={handleSubmitgift}>Gift</Button>
          </div>
        </div>
      )}
      <div
        style={{
          display: "flex",
          justifyContent: "space-around",
          margin: "auto",
          marginTop: "2%",
        }}
      ></div>

      <History />
    </>
  );
};

export default Profile;
