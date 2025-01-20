import Link from 'next/link';

export default function Home() {
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-4xl font-bold">Welcome to the About Us App</h1>
      <Link href="/about">
        <span className="text-blue-600 hover:underline">Go to About Us Page</span>
      </Link>
    </div>
  );
}