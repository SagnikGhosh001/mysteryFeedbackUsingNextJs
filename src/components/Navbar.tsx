"use client";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { User } from "next-auth";
import { Button } from "./ui/button";

function Navbar() {
  const { data: session } = useSession();
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Static render until mounted (matches SSR with no session)
  if (!isMounted) {
    return (
      <nav className="p-4 md:p-6 shadow-md bg-gray-800">
        <div className="container mx-auto flex flex-col md:flex-row justify-between items-center">
          <Link href="/" className="text-xl font-bold mb-4 md:mb-0 text-white">
            Mystery Message
          </Link>
          <div className="flex gap-6 text-white">
          <Link href={"/sign-up"}>
              <Button className="bg-green-500 hover:bg-green-700">Register</Button>
            </Link>
            <Link href={"/sign-in"}>
              <Button className="bg-blue-500 hover:bg-blue-700">Login</Button>
            </Link>
          </div>
        </div>
      </nav>
    );
  }

  const user: User = session?.user as User;

  return (
    <nav className="p-4 md:p-6 shadow-md bg-gray-800">
      <div className="container mx-auto flex flex-col md:flex-row justify-between items-center">
        <Link href="/" className="text-xl font-bold mb-4 md:mb-0 text-white">
          Mystery Message
        </Link>
        {session ? (
          <>
            <span className="mr-4 text-white text-xl font-bold">
              Welcome, {user?.username || user?.email}
            </span>
            <Button className="w-full md:w-auto bg-red-600 hover:bg-white hover:text-black" onClick={() => signOut()}>
              Log Out
            </Button>
          </>
        ) : (
          <div className="flex gap-6 text-white">
            <Link href={"/sign-up"}>
              <Button className="bg-green-500 hover:bg-green-700">Register</Button>
            </Link>
            <Link href={"/sign-in"}>
              <Button className="bg-blue-500 hover:bg-blue-700">Login</Button>
            </Link>
          </div>
        )}
      </div>
    </nav>
  );
}

export default Navbar;