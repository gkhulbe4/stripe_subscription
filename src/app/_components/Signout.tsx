"use client";
import { signOut } from "next-auth/react";
import React from "react";

function Signout() {
  return (
    <>
      <button
        className="bg-gray-200 border border-gray-300 py-4 px-6 rounded-2xl"
        onClick={() => signOut({ callbackUrl: `${window.location.origin}` })}
      >
        Signout
      </button>
    </>
  );
}

export default Signout;