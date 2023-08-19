import { ethers } from "ethers";
import abc from "../contract_data/abc.json";
import { useState, useEffect } from "react";

const History = () => {
    const contractaddress = process.env.REACT_APP_contract_address;
    const [transactionhistory, setTransactionhistory] = useState(null);
    const [history, setHistory] = useState(null);
    const [purchasehistory, setPurchasehistory] = useState(null);

    useEffect(() => {
        const init = async() => {
            try{
                if(window.ethereum) {
                    try {
                        const provider = new ethers.BrowserProvider(window.ethereum);
                        const signer = await provider.getSigner();
                        const contract = new ethers.Contract(
                            contractaddress,
                            abc.abi,
                            signer
                        );
                        const userAddress = (await signer).address;

                        // For Users
                        const HistFilter = contract.filters.history(userAddress);
                        const HistEvents = await contract.queryFilter(HistFilter);
                        setHistory(HistEvents);

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
            }}

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
                {(history && Object.keys(history).length > 0) ? Number(history[0].args[1]) : "Nothing to Show"}
            </div>
        </>
    );
};

export default History;