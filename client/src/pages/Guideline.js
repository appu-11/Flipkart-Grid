import Header from "../components/Navbar";
import "./Guideline.css";
const Guideline = () => {
  return (
    <>
      <Header />
      <div className="info-box">
        <div className="content">
          <span style={{ marginLeft: "15%" }}>
            For enjoying the beneifits of sikka you have to create a metamask
            wallet.
          </span>
          <h2 style={{ marginTop: "3vh", fontSize: "large" }}>For Customers</h2>
          <ul>
            <li>1) Value of 20 sikka is equivalent to 1INR</li>
            <li>2) You can hold upto 5000 sikkas at any given time </li>
            <li>3) On sign up every user gets 200 sikka</li>
            <li>
              4) On every purchase a user can get up to 2.5% of the order value
              to a maximum of 200 sikka
            </li>
            <li>
              5) You can also earn sikka by refering us to your friends and earn
              upto 100 sikka on a succesful referal
            </li>
            <li>6) On each review you write you will get upto 50 sikka</li>
            <li>
              7) Inorder to redeem sikka you will get a opiton to do so during
              the payment of your order, on any order you can redeem upto 2000
              sikka or 5% of order value whichever is minimum.
            </li>
            <li>
              8) Keep using your sikka regularly as after some time they will
              start decaying.
            </li>
          </ul>
        </div>
        <div className="content">
          <h2 style={{ marginTop: "2vh", fontSize: "large" }}>For Sellers</h2>
          <ul>
            <li>1) Value of 20 sikka is equivalent to 1INR</li>
            <li>
              2) You can hold upto 100000 sikka at any given time, and you
              cannot buy more than 100000 per month.
            </li>
            <li>3) You can directly buy the sikka from your profile.</li>
            <li>4) You can give upto 500 sikka per user per month</li>
            <li>5) You will get 1000 sikka on successfull registeration.</li>
            <li>
              6) Keep using your sikka regularly as after some time they will
              start decaying.
            </li>
          </ul>
        </div>
      </div>
    </>
  );
};

export default Guideline;
