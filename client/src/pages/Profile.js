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
    const [isClaiming, setIsClaiming] = useState(false);

    if(user === null && localStorage.getItem("user")){
        setUser(JSON.parse(localStorage.getItem("user")));
    }

  if (user === null) {
    navigate("/login");
  }
  console.log(user);

  useEffect(() => {
    const init = async () => {
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
          RoyaltyCoin.abi,
          signer
        );
        const res = await contract.registerUser();
        await res.wait();
        if (res) {
          alert("Claimed 200 Royalty Coins");
        } else {
          alert("try again");
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
  //   const handleBuytoken = ()=>{

  //   }
  // console.log(user["claimed"], "claimed");
  return (
    <>
      <Header />
      <div style={{ marginLeft: "5vw", marginTop: "3vh", display: "flex" }}>
        <span>Current Balance : {balance}</span>
        {user && !user.claimed && (
          <Button
            variant="success"
            onClick={handleClaim}
            style={{ marginLeft: "70vw" }}
            disabled={isClaiming}
          >
            Claim 200 Royalty Coins
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
            ></input>
            <Button>Buy</Button>
          </div>
          <div className="gift-token">
            <span>Gift tokens:</span>
            <input
              placeholder="public-key"
              style={{ width: "17vw", marginLeft: "1.3vw", marginRight: "1vw" }}
            ></input>
            <input
              placeholder="amount"
              style={{ width: "12vw", marginRight: "2.8vw" }}
            ></input>
            <Button>Gift</Button>
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
      <div style={{ marginLeft: "10vw", fontWeight: "700" }}>History:</div>
      <History />
    </>
  );
};

export default Profile;
