"use client"; //https://nextjs.org/docs/app/building-your-application/rendering
import { Fragment } from "react";
import { signInWithGoogle, signOut } from "../utils/firebase/firebase";
import styles from "./sign-in.module.css";
import { User } from "firebase/auth";
import Link from "next/link";

interface SignInProps {
  user: User | null;
}

export default function SignIn({ user }: SignInProps) {
  //destructuring props
  return (
    <Fragment>
      {user ? (
        <Link href="/">
          <button className={styles.signin} onClick={signOut}>
            Sign Out
          </button>
        </Link>
      ) : (
        <button className={styles.signin} onClick={signInWithGoogle}>
          Sign In
        </button>
      )}
    </Fragment>
  );
}
