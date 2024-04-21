import { useState, useEffect } from 'react';
import { useNavigation } from 'next/navigation';
import { useClient } from 'next/client';


const Login = () => {
  const router = useNavigation();
const { client } = useClient(); 
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [emailError, setEmailError] = useState(false);
  const [passwordError, setPasswordError] = useState(false);
  const [key, setKey] = useState(false);
  const [redirect, setRedirect] = useState(false);
  const [redirectSignup, setRedirectSignup] = useState(false);
  const type = key ? "text" : "password";
  const text = key ? "Hide" : "Show";

  const onSignup = () => {
    setRedirectSignup(true);
  };

  if (redirectSignup) {
    return router.push('/signup');
   
  }

  const onLogin = async() => {
    let stringifiedUsersList =await prisma.user.findMany();
    let parsedUsersList = JSON.parse(stringifiedUsersList);

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setEmailError(true);
    }
    if (!password) {
      setPasswordError(true);
    }
    if (
      /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) &&
      password &&
      parsedUsersList.length > 0
    ) {
      const foundUser = parsedUsersList.find(
        (item) => item.email === email && item.password === password
      );
      if (foundUser) {
        localStorage.setItem("loginUser", JSON.stringify(foundUser.id));
        setRedirect(true);
      } else {
        alert("User not found.Please create your account");
        setRedirectSignup(true);
      }
    }
  };

  if (redirect) {
   return router.push('/UserInterests');
  }

  return (
    <div>
      <Header />
      <div className=" con m-0 p-0 d-flex flex-column justify-content-center align-items-center mt-3">
        <form className=" form-con p-5  mt-2 d-flex flex-column">
          <h4 className="text-center">Login</h4>
          <h5 className="text-center">Welcome back to ECOMMERCE</h5>
          <p className="text-center mt-3">The next gen business marketplace</p>

          <label className="label">Email</label>
          <input
            placeholder="Enter"
            className="input  mb-3"
            value={email}
            type="email"
            required
            onChange={(e) => setEmail(e.target.value)}
          />
          {/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) ||
          emailError == false ? null : (
            <p className="text-danger">Please enter the email</p>
          )}

          <label className="label">Password</label>
          <div className=" d-flex border border-secondary  mb-3">
            <input
              className=" input-element mr-2"
              value={password}
              required
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter"
              type={type}
            />
            <p className="m-0 text" onClick={() => setKey(!key)}>
              {text}
            </p>
          </div>
          {password || passwordError == false ? null : (
            <p className="text-danger">Please enter the password</p>
          )}

          <button
            className="btn btn-dark  mb-3"
            type="submit"
            onClick={onLogin}
          >
            Login
          </button>
          <div className="d-flex justify-content-center">
            <p className="mr-2">Don't have an Account?</p>
            <p className="h-over" onClick={onSignup}>
              SIGN UP
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};
export default Login;
