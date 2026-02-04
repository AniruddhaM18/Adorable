import Image from "next/image";
import logo from "../../public/adlogo.png";
import Link from "next/link";
import LogoIcon from "@/components/ui/logo";

export function Navbar() {
  return (
    <nav className="absolute top-0 inset-x-0 z-50 bg-transparent">
      <div className="relative flex items-center justify-between px-8 py-4 max-w-7xl mx-auto">
        <div className="flex items-center gap-12">
          {/* Logo */}
          <div className="flex items-center gap-2">
<div
  className="
    w-12 h-12 rounded-md mr-2
    flex items-center justify-center
    drop-shadow-[0_0_6px_rgba(255,255,255,0.10)]
  "
>
  <LogoIcon className="w-10 h-10 text-neutral-300" />
</div>

            <span className="text-xl font-semibold text-gray-200">
              Adorable
            </span>
          </div>
        </div>
        
        <Link href="/auth/signup" className="hidden md:block">
          <button
            className="
              bg-neutral-700/70 text-white px-6 py-2.5 rounded-xl text-sm font-medium hover:bg-neutral-600/60 transition-colors ring-2 ring-inset ring-neutral-600/80 backdrop-blur-md">
            Get Started
          </button>
        </Link>
         {/* <Link href="/auth/signup" className="hidden md:block">
          <button
            className="grad-navy  px-6 py-2.5 rounded-xl">
            Get Started
          </button>
        </Link> */}
      </div>
    </nav>
  );
}
