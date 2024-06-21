"use client";

import { useState, ChangeEvent, FormEvent } from "react";
import Navbar from "../components/Navbar";

export default function Login() {
  // State to store form input values
  const [formData, setFormData] = useState({
    email: "",
    password: ""
  });

  // Function to handle input changes
  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  // Function to handle form submission
  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // Log the form data to the console (or send it to a backend)
    console.log(formData);
  };

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