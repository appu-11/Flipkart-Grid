import React, { useEffect, useState } from "react";
import { useAuth0 } from "@auth0/auth0-react";
import { useNavigate } from "react-router-dom";
import {toast, ToastContainer} from 'react-toastify';
import axios from "axios";
import {
  MDBContainer,
  MDBTabs,
  MDBTabsItem,
  MDBTabsLink,
  MDBTabsContent,
  MDBTabsPane,
  MDBBtn,
  MDBIcon,
  MDBInput,
  MDBCheckbox,
} from "mdb-react-ui-kit";

const Login = () => {
  const navigate = useNavigate();
  const [justifyActive, setJustifyActive] = useState("tab1");
  const [isChecked, setIsChecked] = useState(false);
  const [isChecked1, setIsChecked1] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setUsername] = useState("");
  const [public_key, setPublic_key] = useState("");
  const [seller, setSeller] = useState(false);
  const handleJustifyClick = (value) => {
    if (value === justifyActive) {
      return;
    }
    setJustifyActive(value);
  };

  const handleCheckboxChange = () => {
    setIsChecked(!isChecked);
  };

  const handleCheckboxChange1 = () => {
    setIsChecked1(!isChecked1);
  };
  const handleSignup = async () => {
    try {
      const res = await axios.post("http://localhost:8080/api/auth/signup", {
        name,
        email,
        password,
        seller,
      });
      console.log(res.data);
      if (res.data.success) {
        toast.success(res.data.message);
        localStorage.setItem("user", JSON.stringify(res.data.user));
        navigate("/profile");
      } else {
        toast.error(res.data.meassage);
      }
    } catch (error) {
      console.log(error);
      toast.error("Something went wrong!");
    }
  };
  const handleLogin1 = async () => {
    try {
      const res = await axios.post("http://localhost:8080/api/auth/login", {
        email,
        password,
      });
      if (res && res.data.success) {
        toast.success("Login successfull!");
        // setAuth({
        //   ...auth,
        //   user: res.data.user,
        //   token: res.data.token,
        // });
        localStorage.setItem("user", JSON.stringify(res.data.user));
        navigate("/profile");
      } else if (res.data.flag === 2) {
        toast.error("Retry!!");
        navigate("/login");
      } else {
        navigate("/login");
        toast.error("No user found!");
      }
    } catch (error) {
      console.log(error);
      navigate("/login");
      toast.error("Something went wrong!");
    }
  };

  const handleEmailChange = (event) => {
    setEmail(event.target.value);
  };

  const handleUsernameChange = (event) => {
    setUsername(event.target.value);
  };

  const handlePasswordChange = (event) => {
    setPassword(event.target.value);
  };
  const handlePublickeyChange = (event) => {
    setPublic_key(event.target.value);
  };
  const handleSeller = () => {
    setSeller(!seller);
  };
  return (
    <>
    <ToastContainer/>
    <MDBContainer className="p-3 my-5 d-flex flex-column w-50">
      <MDBTabs
        pills
        justify
        className="mb-3 d-flex flex-row justify-content-between"
      >
        <MDBTabsItem>
          <MDBTabsLink
            onClick={() => handleJustifyClick("tab1")}
            active={justifyActive === "tab1"}
          >
            Login
          </MDBTabsLink>
        </MDBTabsItem>
        <MDBTabsItem>
          <MDBTabsLink
            onClick={() => handleJustifyClick("tab2")}
            active={justifyActive === "tab2"}
          >
            Register
          </MDBTabsLink>
        </MDBTabsItem>
      </MDBTabs>

      <MDBTabsContent>
        <MDBTabsPane show={justifyActive === "tab1"}>
          <MDBInput
            wrapperClass="mb-4"
            label="Email address"
            id="form1"
            type="email"
            value={email}
            onChange={handleEmailChange}
          />
          <MDBInput
            wrapperClass="mb-4"
            label="Password"
            id="form2"
            type="password"
            value={password}
            onChange={handlePasswordChange}
          />

          <div className="d-flex justify-content-end mx-4 mb-4">
            <MDBCheckbox
              name="flexCheck"
              value=""
              id="flexCheckDefault"
              label="Remember me"
              onChange={handleCheckboxChange}
            />
          </div>

          <MDBBtn className="mb-4 w-100" onClick={handleLogin1}>
            Sign in
          </MDBBtn>
          <p className="text-center">
            Not a member? <a href="#!">Register</a>
          </p>
        </MDBTabsPane>

        <MDBTabsPane show={justifyActive === "tab2"}>
          <MDBInput
            wrapperClass="mb-4"
            label="Username"
            id="form1"
            type="text"
            value={name}
            onChange={handleUsernameChange}
          />
          <MDBInput
            wrapperClass="mb-4"
            label="Email"
            id="form1"
            type="email"
            value={email}
            onChange={handleEmailChange}
          />
          <MDBInput
            wrapperClass="mb-4"
            label="Password"
            id="form1"
            type="password"
            value={password}
            onChange={handlePasswordChange}
          />

          <div
            className="bottom-conatainer"
            style={{
              display: "flex",
              flexDirection: "row",
              marginBottom: "2vh",
            }}
          >
            <div style={{ width: "80%" }}>
              <span>Are you a seller?</span>
              <input
                type="checkbox"
                id="switch"
                className="checkbox"
                style={{ width: "2.2vw", height: "2.2vh" }}
                onChange={handleSeller}
              />
            </div>
            <MDBCheckbox
              name="flexCheck"
              value=""
              id="flexCheckDefault"
              label="Remember me"
              onChange={handleCheckboxChange1}
            />
          </div>

          <MDBBtn className="mb-4 w-100" onClick={handleSignup}>
            Sign up
          </MDBBtn>
        </MDBTabsPane>
      </MDBTabsContent>
    </MDBContainer>
    </>
  );
};

export default Login;
