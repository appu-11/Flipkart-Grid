import React, { useEffect, useState } from 'react';
import { useAuth0 } from "@auth0/auth0-react";
import { useNavigate } from 'react-router-dom';
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
  MDBCheckbox
}
from 'mdb-react-ui-kit';

const Login = () => {
  const navigate = useNavigate();
  const [justifyActive, setJustifyActive] = useState('tab1');;
  const [isChecked, setIsChecked] = useState(false);
  const [isChecked1, setIsChecked1] = useState(false);
  const { loginWithRedirect, user, isAuthenticated} = useAuth0();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');

  const handleJustifyClick = (value) => {
    if (value === justifyActive) {
      return;
    }
    setJustifyActive(value);
  };


  const handleCheckboxChange = () => {
    setIsChecked(!isChecked);
  };

  const handleCheckboxChange1 = ()=>{
    setIsChecked1(!isChecked1);
  }

  const handleLogin = async() => {
    await loginWithRedirect();
};

  const handleLogin1 = async()=>{
        const usera = {
            username: username,
            email: email,
        }
        localStorage.setItem('user',JSON.stringify(usera));
        navigate("/");

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

  return (
    <MDBContainer className="p-3 my-5 d-flex flex-column w-50">

      <MDBTabs pills justify className='mb-3 d-flex flex-row justify-content-between'>
        <MDBTabsItem>
          <MDBTabsLink onClick={() => handleJustifyClick('tab1')} active={justifyActive === 'tab1'}>
            Login
          </MDBTabsLink>
        </MDBTabsItem>
        <MDBTabsItem>
          <MDBTabsLink onClick={() => handleJustifyClick('tab2')} active={justifyActive === 'tab2'}>
            Register
          </MDBTabsLink>
        </MDBTabsItem>
      </MDBTabs>

      <MDBTabsContent>

        <MDBTabsPane show={justifyActive === 'tab1'}>

          <div className="text-center mb-3">
            <p>Sign in with:</p>

            <div className='d-flex justify-content-center mx-auto' style={{width: '20%'}}>
                <MDBBtn tag='a' color='none' className='m-1 w-100' style={{ color: '#1266f1' }} onClick={handleLogin}>
                    <MDBIcon fab icon='google' size="sm"/>
                </MDBBtn>
            </div>

            <p className="text-center mt-3">or:</p>
          </div>
          <MDBInput wrapperClass='mb-4' label='Email address' id='form1' type='email' value={email} onChange={handleEmailChange}/>
          <MDBInput wrapperClass='mb-4' label='Password' id='form2' type='password' value={password} onChange={handlePasswordChange}/>

          <div className="d-flex justify-content-end mx-4 mb-4">
            <MDBCheckbox name='flexCheck' value='' id='flexCheckDefault' label='Remember me' onChange={handleCheckboxChange}/>
          </div>

          <MDBBtn className="mb-4 w-100" onClick={handleLogin1}>Sign in</MDBBtn>
          <p className="text-center">Not a member? <a href="#!">Register</a></p>

        </MDBTabsPane>

        <MDBTabsPane show={justifyActive === 'tab2'}>

          <div className="text-center mb-3">
            <p>Sign un with:</p>

            <div className='d-flex justify-content-center mx-auto' style={{width: '20%'}}>
                <MDBBtn tag='a' color='none' className='m-1' style={{ color: '#1266f1' }}>
                    <MDBIcon fab icon='google' size="sm"/>
                </MDBBtn>
            </div>

            <p className="text-center mt-3">or:</p>
          </div>

          <MDBInput wrapperClass='mb-4' label='Username' id='form1' type='text' value={username} onChange={handleUsernameChange}/>
          <MDBInput wrapperClass='mb-4' label='Email' id='form1' type='email' value={email} onChange={handleEmailChange}/>
          <MDBInput wrapperClass='mb-4' label='Password' id='form1' type='password' value={password} onChange={handlePasswordChange}/>

          <div className="d-flex justify-content-end mx-4 mb-4">
            <MDBCheckbox name='flexCheck' value='' id='flexCheckDefault' label='Remember me' onChange={handleCheckboxChange1}/>
          </div>

          <MDBBtn className="mb-4 w-100">Sign up</MDBBtn>

        </MDBTabsPane>

      </MDBTabsContent>

    </MDBContainer>
  );
}

export default Login;