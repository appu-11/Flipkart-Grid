import { ethers } from "ethers";
import RoyaltyCoin from "../contract_data/RoyaltyCoin.json";
import { useState, useEffect } from "react";
import Container from "react-bootstrap/esm/Container";
import "./history.css";

const History = () => {
    const contractaddress = process.env.REACT_APP_contract_address;
    const [transactionhistory, setTransactionhistory] = useState([]);
    const [history, setHistory] = useState([]);
    const [purchasehistory, setPurchasehistory] = useState([]);

    useEffect(() => {
        const init = async() => {
            try{
                if(window.ethereum) {
                    try {
                        const provider = new ethers.BrowserProvider(window.ethereum);
                        const signer = await provider.getSigner();
                        const contract = new ethers.Contract(
                            contractaddress,
                            RoyaltyCoin.abi,
                            signer
                        );
                        const userAddress = (await signer).address;
                        console.log(userAddress);
                        // For Users
                        const HistFilter = contract.filters.history(userAddress, null);
                        const HistEvents = await contract.queryFilter(HistFilter);
                        const hist = []
                        const keys = Object.keys(HistEvents).reverse();
                        console.log(contract);
                        for(let i = 0; i < keys.length; i++) {
                            const date = new Date(Number(HistEvents[keys[i]].args[3])*1000);
                            const temp = {
                                value: Number(HistEvents[keys[i]].args[1]),
                                reason: HistEvents[keys[i]].args[2],
                                timestamp: date.toLocaleString()
                            }
                            hist.push(temp);
                        }
                        
                        setHistory(hist);

                        // For Sellers
                        // const transferHistFilter = contract.filters.transferhist(userAddress);
                        // const transferHistEvents = await contract.queryFilter(transferHistFilter);
                        // setTransactionhistory(transferHistEvents);
                        // const purchaseHistFilter = contract.filters.PurchasedTokens(userAddress);
                        // const purchaseHistEvents = await contract.queryFilter(purchaseHistFilter);
                        // setPurchasehistory(purchaseHistEvents);
                        
                    } 
                    catch (error) {
                        console.log("Error: ", error);
                    }
                }
            }catch(err){
                console.log(err);
                console.log("error in profile");
            }
        }

        init();
    },[]);
    
    if(history)
        console.log(history, "redeemHistory");

    return(
        <>
            {/* {redeemhistory && redeemhistory[0].args.map((item, index) => {
                <div>
                    hello
                    <span>{item}</span>
                </div>
            })} */}
            <div>
                {(history.length > 0) ? (
                   <ul className="history-list">
                   {history.map((obj, index) => (
                     <li className="history-item" key={index}>
                       <div className="history-details">
                         <span className="history-value">Points: {obj.value}</span>
                         <span className="history-reason">{obj.reason}</span>
                       </div>
                       <span className="history-timestamp" style={{marginRight: "2"}}>{obj.timestamp}</span>
                     </li>
                   ))}
                 </ul>
                ) : "Nothing to Show"}
            </div>
        </>
    );
};

export default History;