"use client";
import Image from "next/image";
import Link from "next/link";
import styles from "./navbar.module.css";
import SignIn from "./sign-in";
import { onAuthStateChangedHelper } from "../utils/firebase/firebase";
import { useEffect, useState } from "react";
import { User } from "firebase/auth";
import Upload from "./upload";

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
        {user && <Upload />}
        {user && (
          <Image
            width={40}
            height={40}
            src={user.photoURL!}
            alt="Profile Picture"
            className={styles.profile_picture}
          />
        )}
        <SignIn user={user} />
      </div>
    </nav>
  );
}
