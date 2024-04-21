
import { useState, useEffect } from 'react';
import { useNavigation } from 'next/navigation';
import { useClient } from 'next/client';

export default function Signup() {
  const router = useNavigation();
  const { client } = useClient(); 
  const { PrismaClient } = require('@prisma/client');

  const prisma = new PrismaClient();
  
  const [redirectToOtp, setRedirectToOtp] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [nameError, setnameError] = useState(false);
  const [emailError, setEmailError] = useState(false);
  const [passwordError, setPasswordError] = useState(false);
  const [password, setPassword] = useState("");
  const otp = cryptoRandomString({ length: 8, type: "numeric" });
  const [signupList, setSignupList] = useState([]);
  const [redirect, setRedirect] = useState(false);

  
  useEffect(() => {
    async function fetchUsers() {
      const users = await prisma.user.findMany();
      setSignupList(users);
    }

    fetchUsers();
  }, []);




 
async function createUser(username, email, customData) {
  try {
     await prisma.user.create({
      data: {
        username,
        email,
        password,
        customData: JSON.stringify(customData)// Convert object to JSON string before storing
      }
    });
   
  } catch (error) {
    console.error('Error creating user:', error);
  } finally {
    await prisma.$disconnect();
  }
}

const userData = [];



  // Handling the name change
  const handleName = (e) => {
    setName(e.target.value);
  };

  // Handling the email change
  const handleEmail = (e) => {
    setEmail(e.target.value);
  };

  const onLogin = () => {
    console.log("Clickeddd");
    setRedirect(true);
  };

  if (redirect) {
    return router.push('/signin');
  }

  // Handling the password change
  const handlePassword = (e) => {
    setPassword(e.target.value);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!name) {
      setnameError(true);
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setEmailError(true);
    }
    if (!password) {
      setPasswordError(true);
    }
    if (
      name &&
      /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) &&
      password &&
      signupList.length == 0
    ) {
     createUser(name, email, password, userData);

      const otpValue = JSON.stringify(otp);
      client.localStorage.setItem("otp", otpValue);
      const parsed = JSON.stringify([...signupList, item]);
      client.localStorage.setItem("usersList", parsed);
      const emailValue = JSON.stringify(email);
      client.localStorage.setItem("email", emailValue);

      setRedirectToOtp(true);
    }

    if (
      name &&
      /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) &&
      password &&
      signupList.length > 0
    ) {
      const foundUser = signupList.find((item) => item.email ===email);
      if (foundUser) {
        alert("User Already Exists");
      } else {
        createUser(name, email, password, userData);

        const otpValue = JSON.stringify(otp);
        client.localStorage.setItem("otp", otpValue);
        const parsed = JSON.stringify([...signupList, item]);
        client.localStorage.setItem("usersList", parsed);
        const emailValue = JSON.stringify(email);
        client.localStorage.setItem("email", emailValue);
        setRedirectToOtp(true);
      }
    }
  };

  if (redirectToOtp) {
    return router.push('/otp');
  }

  return (
    <div className="pb-3">
      <Header />
      <div className=" con m-0 p-0 d-flex flex-column justify-content-center align-items-center mt-3">
        <form className=" form-con p-4 w-25 mt-2 d-flex flex-column">
          <h4 className="text-center">Create your account</h4>
          <label className="label">Name</label>
          <input
            onChange={handleName}
            placeholder="Enter"
            className="input mb-3"
            value={name}
            type="text"
            required
          />
          {name || nameError == false ? null : (
            <p className="text-danger">Please enter the name</p>
          )}
          <label className="label">Email</label>
          <input
            onChange={handleEmail}
            placeholder="Enter"
            className="input  mb-3"
            value={email}
            type="email"
            required
          />
          {/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) ||
          emailError == false ? null : (
            <p className="text-danger">Please enter the valid email</p>
          )}
          <label className="label">Password</label>
          <input
            onChange={handlePassword}
            className="input mb-3"
            value={password}
            placeholder="Enter"
            type="password"
            required
          />
          {password || passwordError == false ? null : (
            <p className="text-danger">Please enter the password</p>
          )}
          <button
            onClick={handleSubmit}
            type="submit"
            className="btn btn-dark  mb-3"
          >
            Create account
          </button>
          <div className="d-flex justify-content-center">
            <p className="mr-2">Have an account?</p>
            <p className="h-over" onClick={onLogin}>
              LOGIN
            </p>
          </div>
        </form>
      </div>
    </div>
  );
}
