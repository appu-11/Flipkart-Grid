import { ethers } from "ethers";
import Sikka from "../contract_data/Sikka.json";
import { useState, useEffect } from "react";
import Container from "react-bootstrap/esm/Container";
import "./history.css";

const History = () => {
  const contractaddress = process.env.REACT_APP_contract_address;
  const [transactionhistory, setTransactionhistory] = useState([]);
  const [history, setHistory] = useState([]);
  const [purchasehistory, setPurchasehistory] = useState([]);
  const [flag, setFlag] = useState(true);
  useEffect(() => {
    const init = async () => {
      try {
        if (window.ethereum) {
          try {
            const user = JSON.parse(localStorage.getItem("user"));
            const provider = new ethers.BrowserProvider(window.ethereum);
            const signer = await provider.getSigner();
            const contract = new ethers.Contract(
              contractaddress,
              Sikka.abi,
              signer
            );
            const userAddress = (await signer).address;

            // For Users
            if (user.seller === false) {
              const HistFilter = contract.filters.history(userAddress, null);
              const HistEvents = await contract.queryFilter(HistFilter);
              const hist = [];
              const keys = Object.keys(HistEvents).reverse();
              console.log(contract);
              for (let i = 0; i < keys.length; i++) {
                const date = new Date(
                  Number(HistEvents[keys[i]].args[3]) * 1000
                );
                const temp = {
                  value: Number(HistEvents[keys[i]].args[1]),
                  reason: HistEvents[keys[i]].args[2],
                  timestamp: date.toLocaleString(),
                };
                hist.push(temp);
              }
              setHistory(hist);
            }

            // For Sellers
            if (user.seller === true) {
              const transferHistFilter =
                contract.filters.transferhist(userAddress);
              const transferHistEvents = await contract.queryFilter(
                transferHistFilter
              );
              const hist = [];
              const keys = Object.keys(transferHistEvents).reverse();
              for (let i = 0; i < keys.length; i++) {
                const date = new Date(
                  Number(transferHistEvents[keys[i]].args[3]) * 1000
                );
                const temp = {
                  value: Number(transferHistEvents[keys[i]].args[2]),
                  touser: transferHistEvents[keys[i]].args[1],
                  timestamp: date.toLocaleString(),
                };
                hist.push(temp);
              }
              setTransactionhistory(hist);
              const purchaseHistFilter =
                contract.filters.PurchasedTokens(userAddress);
              const purchaseHistEvents = await contract.queryFilter(
                purchaseHistFilter
              );
              const hist1 = [];
              const keys1 = Object.keys(purchaseHistEvents).reverse();
              for (let i = 0; i < keys1.length; i++) {
                const date = new Date(
                  Number(purchaseHistEvents[keys1[i]].args[2]) * 1000
                );
                const temp = {
                  value: Number(purchaseHistEvents[keys1[i]].args[1]),
                  timestamp: date.toLocaleString(),
                };
                hist1.push(temp);
              }
              // setPurchasehistory(purchaseHistEvents);
              setPurchasehistory(hist1);
            }
            if (
              history == 0 &&
              transactionhistory == 0 &&
              purchasehistory == 0
            ) {
              setFlag(false);
            }
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

  if (history) console.log(history, "redeemHistory");
  if (purchasehistory) {
    console.log(purchasehistory, "purchasehistory");
  }
  if (transactionhistory) {
    console.log(transactionhistory, "transactionhistory");
  }

  return (
    <>
      <div>
        {history.length > 0 ||
        transactionhistory.length > 0 ||
        purchasehistory.length > 0 ? (
          <>
             {history.length > 0 && (
              <>
                  <ul className="history-list">
                    {history.map((obj, index) => (
                      <li className="history-item" key={index}>
                        <div className="history-details">
                          <span className="history-value">Points: {obj.value}</span>
                          <span className="history-reason">{obj.reason}</span>
                          <span
                            className="history-timestamp"
                            style={{ marginLeft: "2" }}
                          >
                            {obj.timestamp}
                          </span>
                          </div>
                        </li>
                      ))
                      }
                  </ul>
              </>
            )}
            {transactionhistory.length > 0 && (
              <>
              <div style={{ marginLeft: "10vw", fontWeight: "700" }}>
                Transfer History:
              </div>
              <ul className="history-list">
                {transactionhistory.map((obj, index) => (
                  <li className="history-item" key={index}>
                    <div className="history-details">
                      <span className="history-value">Points: {obj.value}</span>
                      <span className="history-reason">To User address: {obj.touser}</span>
                      <span
                            className="history-timestamp"
                            style={{ marginRight: "2" }}
                          >
                            {obj.timestamp}
                          </span>
                    </div>
                  </li>
                ))}
              </ul>
            </>
            )}

            {purchasehistory.length > 0 && (
              <>
                <div style={{ marginLeft: "10vw", fontWeight: "700" }}>
                  Purchase History:
                </div>
                <ul className="history-list">
                  {purchasehistory.map((obj, index) => (
                    <li className="history-item" key={index}>
                      <div className="history-details">
                        <span className="history-value">Points: {obj.value}</span>
                        <span
                            className="history-timestamp"
                            style={{ marginRight: "2" }}
                          >
                            {obj.timestamp}
                          </span>
                      </div>
                    </li>
                  ))}
                </ul>
              </>
            )}
          </>
        ) : (
          <div>
            <h1 style={{ marginTop: "15vh", marginLeft: "37vw" }}>
              Nothing to show!
            </h1>
          </div>
        )}
      </div>
    </>
  );
};

export default History;
