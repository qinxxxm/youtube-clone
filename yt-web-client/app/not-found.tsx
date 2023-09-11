import Link from "next/link";

export default function NotFound() {
  return (
    <>
      <h2>There was a problem</h2>
      <p>We could not find the page you were looking for.</p>
      <p>
        Go Back to the <Link href="/">Dashboard</Link>
      </p>
    </>
  );
}
