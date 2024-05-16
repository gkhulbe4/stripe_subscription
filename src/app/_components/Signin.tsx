"use client";
import React from "react";
import { signIn } from "next-auth/react";

function Signin() {
  return (
    <>
      <button
        className="bg-gray-200 border border-gray-300 py-4 px-6 rounded-2xl"
        onClick={() =>
          signIn("google", {
            callbackUrl: `${window.location.origin}`,
          })
        }
      >
        Signin
      </button>
    </>
  );
}

export default Signin;