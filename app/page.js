
import Link from 'next/link';

const HomePage = () => {
  return (
    <div>
      <h1>Home Page</h1>
      <Link href="/signup">
        Sign Up
      </Link>
      <br />
      <Link href="/signin">
        Sign In
      </Link>
    </div>
  );
};

export default HomePage;