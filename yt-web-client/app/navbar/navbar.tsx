"use client";
import Image from "next/image";
import Link from "next/link";
import styles from "./navbar.module.css";
import SignIn from "./sign-in";
import { onAuthStateChangedHelper } from "../utils/firebase/firebase";
import { Fragment, useEffect, useState } from "react";
import { User } from "firebase/auth";

export default function Navbar() {
  const [user, setUser] = useState<User | null>(null); //without the generics there will be error

  useEffect(() => {
    const unsubscribe = onAuthStateChangedHelper((user) => {
      setUser(user);
      console.log(user);
    }); //so this (user) => setUser(user) is called when the auth state changes

    //cleanup subscription to onAuthStateChange on unmount
    return () => unsubscribe();
  });

  return (
    <nav className={styles.nav}>
      <Link href="/">
        <Image
          width={90}
          height={20}
          src="/youtube-logo.svg"
          alt="Youtube Logo"
        />
      </Link>
      <div className={styles.nav_right}>
        {user && (
          <Fragment>
            <Link href="/my-videos" className={styles.uploadButton}>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.2}
                stroke="currentColor"
                className="w-6 h-6"
              >
                <path
                  strokeLinecap="round"
                  d="M15.75 10.5l4.72-4.72a.75.75 0 011.28.53v11.38a.75.75 0 01-1.28.53l-4.72-4.72M4.5 18.75h9a2.25 2.25 0 002.25-2.25v-9a2.25 2.25 0 00-2.25-2.25h-9A2.25 2.25 0 002.25 7.5v9a2.25 2.25 0 002.25 2.25z"
                />
              </svg>
            </Link>
            <Image
              width={40}
              height={40}
              src={user.photoURL!}
              alt="Profile Picture"
              className={styles.profile_picture}
            />
          </Fragment>
        )}
        <SignIn user={user} />
      </div>
    </nav>
  );
}
