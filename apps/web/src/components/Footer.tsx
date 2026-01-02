"use client";
import Image from "next/image";
import logo from "../../public/adlogo.png";
import { FaSquareGithub, FaLinkedin, FaSquareXTwitter } from "react-icons/fa6";
import { SiGmail } from "react-icons/si";

export default function Footer() {
  return (
    <footer className="bg-neutral-950/50 text-white mt-40 border-t border-t-neutral-800">
      <div className="max-w-7xl mx-auto px-6">

        <div className="flex justify-between pt-20">
          <div className="h-25 w-25 ring-1 ring-inset ring-neutral-300/10 rounded-3xl">
            <Image src={logo} alt="Logo" width={200} height={200} />
          </div>

          <div className="flex gap-8">
            <a
              href="https://github.com/AniruddhaM18/Adorable/"
              target="_blank"
              rel="noopener noreferrer"
              className="block text-neutral-400 hover:text-neutral-300 transition"
            >
              <FaSquareGithub className="h-12 w-auto" />
            </a>

            <a
              href="mailto:aniruddhamaradwar9@gmail.com"
              className="block text-neutral-400 hover:text-neutral-300 transition"
            >
              <SiGmail className="h-12 w-auto" />
            </a>

            <a
              href="https://www.linkedin.com/in/aniruddha-m18/"
              target="_blank"
              rel="noopener noreferrer"
              className="block text-neutral-400 hover:text-neutral-300 transition"
            >
              <FaLinkedin className="h-12 w-auto" />
            </a>

            <a
              href="https://x.com/Aniruddha18M"
              target="_blank"
              rel="noopener noreferrer"
              className="block text-neutral-400 hover:text-neutral-300 transition"
            >
              <FaSquareXTwitter className="h-12 w-auto" />
            </a>
          </div>
        </div>

        <div className="flex justify-center items-center pt-32 pb-18">
          <h1 className="text-[22vw] leading-none font-normal text-center text-transparent bg-clip-text bg-linear-to-b from-neutral-400 via-neutral-600 to-neutral-950 ">
            Adorable
          </h1>
        </div>

        <div className="flex justify-between items-center pb-8 text-sm text-white">
          <span>Adorable by Aniruddha</span>
          <span>© 2026 Adorable. All rights reserved.</span>
        </div>

      </div>
    </footer>
  );
}
