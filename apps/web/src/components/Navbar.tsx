import Image from "next/image";
import logo from "../../public/adlogo.png"

export function Navbar() {
    return (
        <nav className="relative z-10 flex items-center justify-between px-8 py-4 max-w-7xl mx-auto ">
            <div className="flex items-center gap-12">

                <div className="flex items-center gap-2">
                    <div className="w-12 h-12 rounded-md mr-2 flex items-center justify-center
                              drop-shadow-[0_0_6px_rgba(255,255,255,0.10)]">
                        <Image src={logo} alt="Logo" width={200} height={200} />
                    </div>
                    <span className="text-xl font-semibold text-gray-200">Adorable</span>
                </div>

                <div className="hidden md:flex items-center gap-8">
                    <a href="#product" className="text-gray-300 hover:text-gray-900 text-sm font-medium transition-colors">
                        Product
                    </a>
                    <a href="#use-cases" className="text-gray-300 hover:text-gray-900 text-sm font-medium transition-colors">
                        Use Cases
                    </a>
                    <a href="#pricing" className="text-gray-300 hover:text-gray-900 text-sm font-medium transition-colors">
                        Pricing
                    </a>
                    <a href="#blog" className="text-gray-300 hover:text-gray-900 text-sm font-medium transition-colors">
                        Blog
                    </a>
                    <a href="#resources" className="text-gray-300 hover:text-gray-900 text-sm font-medium transition-colors">
                        Resources
                    </a>
                </div>
            </div>

            <button className=" hidden md:block bg-neutral-700  text-white px-6 py-2.5 rounded-xl text-sm font-medium hover:bg-neutral-600/60 transition-colors ring-2 ring-inset ring-neutral-600/80">
                Get Started
            </button>
        </nav>
    );
};

