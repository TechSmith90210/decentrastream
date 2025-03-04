// components/Navbar.tsx
import Image from "next/image";
import Link from "next/link";

export default function NavBar() {
  return (
    <nav className="w-full flex items-center justify-start py-2 px-7 bg-background">
      <Link href="/" className="flex items-center space-x-2">
        <Image
          src="/logo.svg" // Update with your actual logo path
          alt="DecentraStream Logo"
          width={35}
          height={35}
        />
        <span className="text-white text-xl font-normal font-heading">DecentraStream</span>
      </Link>
    </nav>
  );
}
