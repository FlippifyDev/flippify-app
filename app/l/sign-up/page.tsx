"use client";

import { useState } from "react";
import Navbar from "../components/Navbar";
import bcrypt from "bcryptjs";
import { handleClientScriptLoad } from "next/script";


interface FormData {
  email: string;
  discordUsername: string;
  password: string;
}


async function createStripeCustomer(formData: FormData) {
  const salt = bcrypt.genSaltSync(10);
  const hashedPassword = bcrypt.hashSync(formData.password, salt);

  const formDataWithHashedPassword = {
    ...formData,
    password: hashedPassword
  };

  const queryParams = new URLSearchParams(formDataWithHashedPassword as any).toString();
  const response = await fetch(`https://stripe-manager.vercel.app/create-new-stripe-customer?${queryParams}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    throw new Error('Network response was not ok');
  }

  return await response.json();
}


function checkInputError(formData: FormData) {
  // Confirm all fields are filled in
  if (!formData.email || !formData.discordUsername || !formData.password) {
    return 'Please fill in all fields.';
  }

  // Email validation using regex
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(formData.email)) {
    return 'Please enter a valid email address.';
  }

  // Password validation
  if (formData.password.length < 8) {
    return 'Password must be at least 8 characters long.';
  }

  // Optional: Additional password complexity checks (e.g., uppercase, lowercase, numbers, special characters)
  const passwordRegex = /^(?=.*[@$!%*?&])(?=.*[0-9])(?=.*[A-Z])(?=.*[a-z]).{8,}$/;
  if (!passwordRegex.test(formData.password)) {
    return "Password requires at least one of (@$!%*?&), (0-9), Upper & Lower";
  }

  return false;
}


export default function SignUp() {
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [formData, setFormData] = useState<FormData>({
    email: "",
    discordUsername: "",
    password: ""
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    // Validate all inputs
    const inputError = checkInputError(formData);
    if (inputError !== false) {
      setErrorMessage(inputError)
      return;
    } 

    try {
      const data = await createStripeCustomer(formData); // Await the async function call
      const customer = data.customer

      if (data.code === 0) {
        window.location.href = customer.billing_portal_url;
      } else if (data.code === 1) {
        setErrorMessage('An account already exists with this email address.');
      } else if (data.code === 3) {
        setErrorMessage("The username you entered doesn't exist");
      } else {
        console.error('Error: Redirect URL not found in server response');
      }

    } catch (error) {
      console.error('Error:', error);
      setErrorMessage('An error occurred. Please try again later.');
    }
  };
  
  return (
    <div>
      <Navbar />
      <div className="flex flex-col items-center mt-10">
        <div>
          <h2 className="text-2xl">Create an Account</h2>
        </div>

        <form onSubmit={handleSubmit} className="max-w-md mx-auto mt-6 p-4 space-y-4 flex flex-col items-center">
          <label className="input input-bordered flex items-center gap-2 w-72">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 16 16"
              fill="currentColor"
              className="w-4 h-4 opacity-70"
            >
              <path d="M2.5 3A1.5 1.5 0 0 0 1 4.5v.793c.026.009.051.02.076.032L7.674 8.51c.206.1.446.1.652 0l6.598-3.185A.755.755 0 0 1 15 5.293V4.5A1.5 1.5 0 0 0 13.5 3h-11Z" />
              <path d="M15 6.954 8.978 9.86a2.25 2.25 0 0 1-1.956 0L1 6.954V11.5A1.5 1.5 0 0 0 2.5 13h11a1.5 1.5 0 0 0 1.5-1.5V6.954Z" />
            </svg>
            <input
              type="text"
              name="email"
              className="grow"
              placeholder="Email"
              value={formData.email}
              onChange={handleInputChange}
            />
          </label>
          <label className="input input-bordered flex items-center gap-2 w-72">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 16 16"
              fill="currentColor"
              className="w-4 h-4 opacity-70"
            >
              <path d="M8 8a3 3 0 1 0 0-6 3 3 0 0 0 0 6ZM12.735 14c.618 0 1.093-.561.872-1.139a6.002 6.002 0 0 0-11.215 0c-.22.578.254 1.139.872 1.139h9.47Z" />
            </svg>
            <input
              type="text"
              name="discordUsername"
              className="grow"
              placeholder="Discord Username"
              value={formData.discordUsername}
              onChange={handleInputChange}
            />
          </label>
          <label className="input input-bordered flex items-center gap-2 w-72">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 16 16"
              fill="currentColor"
              className="w-4 h-4 opacity-70"
            >
              <path
                fillRule="evenodd"
                d="M14 6a4 4 0 0 1-4.899 3.899l-1.955 1.955a.5.5 0 0 1-.353.146H5v1.5a.5.5 0 0 1-.5.5h-2a.5.5 0 0 1-.5-.5v-2.293a.5.5 0 0 1 .146-.353l3.955-3.955A4 4 0 1 1 14 6Zm-4-2a.75.75 0 0 0 0 1.5.5.5 0 0 1 .5.5.75.75 0 0 0 1.5 0 2 2 0 0 0-2-2Z"
                clipRule="evenodd"
              />
            </svg>
            <input
              type="password"
              name="password"
              className="grow"
              placeholder="Password"
              value={formData.password}
              onChange={handleInputChange}
            />
          </label>
          <button type="submit" className="btn btn-outline btn-primary mt-5 w-40">
            Create Account
          </button>
        </form>

        {/* Error message display */}
        {errorMessage && (
          <div className="mb-3">
            <strong className="text-red-700">{errorMessage}</strong>
          </div>
        )}

        <p>
          Already have an account?
          <a href="/l/login" className="link link-primary ml-2">
            Login
          </a>
        </p>
      </div>


    </div>
  );
  
}