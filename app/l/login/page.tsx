"use client";

import { useState, ChangeEvent, FormEvent } from "react";
import Navbar from "../components/Navbar";
import bcrypt from "bcryptjs";


interface FormData {
  email: string;
  password: string;
}


async function comparePasswords(enteredPassword: string, hashedPassword: string): Promise<boolean> {
  return await bcrypt.compare(enteredPassword, hashedPassword);
}


async function fetchStripeCustomer(formData: FormData) {
  const formDataWithoutPassword = {
    ...formData,
    password: ""
  };

  const queryParams = new URLSearchParams(formDataWithoutPassword as any).toString();
  const response = await fetch(`https://stripe-manager.vercel.app/fetch-stripe-customer?${queryParams}`, {
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
  if (!formData.email || !formData.password) {
    return 'Please fill in all fields.';
  }

  // Email validation using regex
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(formData.email)) {
    return 'Please enter a valid email address.';
  }

  return false;
}


export default function Login() {
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [formData, setFormData] = useState<FormData>({
    email: "",
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
      const data = await fetchStripeCustomer(formData); // Await the async function call

      if (data.code === 0) {
        const customer = data.customer

        const passwordsMatch = await comparePasswords(formData.password, customer.password);
        if (passwordsMatch) {
          window.location.href = customer.billing_portal_url;
        } else {
          setErrorMessage('Incorrect password. Please try again.');
        }
      } else if (data.code === 4) {
        setErrorMessage(data.message);
      }
    } catch (error) {
      console.error('Error:', error);
      setErrorMessage('An error occurred. Please try again later.');
    }
  }


  return (
    <div>
      <Navbar />
      <div className="flex flex-col items-center mt-10">
        <div>
          <h2 className="text-2xl">Login</h2>
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
          <button type="submit" className="btn btn-outline btn-primary mt-3 w-40">
            Login
          </button>
        </form>

        {/* Error message display */}
        {errorMessage && (
          <div className="mb-3">
            <strong className="text-red-700">{errorMessage}</strong>
          </div>
        )}

        <p>
          Don&apos;t have an account?
          <a href="/l/sign-up" className="link link-primary ml-2">
            Create Accouunt
          </a>
        </p>
      </div>


    </div>
  );
}