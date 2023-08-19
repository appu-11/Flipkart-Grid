import { Auth0Provider } from "@auth0/auth0-react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Wallet from "./pages/Wallet";
import Product from "./components/Product";
import Cart from "./pages/Cart";
import Profile from "./pages/Profile";
import Guideline from "./pages/Guideline";
function App() {
  return (
    <Auth0Provider
      domain={process.env.REACT_APP_domain_url}
      clientId={process.env.REACT_APP_client_id}
      authorizationParams={{
        redirect_uri: window.location.origin,
      }}
    >
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/wallet" element={<Wallet />} />
          <Route path="/laptop" element={<Product />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/profile" element={<Profile />}></Route>
          <Route path="/guideline" element={<Guideline />} />
        </Routes>
      </BrowserRouter>
    </Auth0Provider>
  );
}

export default App;
