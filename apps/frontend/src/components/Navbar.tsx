
export function Navbar(){
    return (
        <nav className="relative z-10 flex items-center justify-between px-8 py-6 max-w-7xl mx-auto">
            <div className="flex items-center gap-12">
                {/* Logo */}
                <div className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-gradient-to-br from-blue-500 via-purple-500 to-orange-500 rounded-lg">

                    </div>
                    <span className="text-xl font-semibold text-gray-900">Adorable</span>
                </div>

                {/* Nav Links */}
                <div className="hidden md:flex items-center gap-8">
                    <a href="#product" className="text-gray-700 hover:text-gray-900 text-sm font-medium transition-colors">
                        Product
                    </a>
                    <a href="#use-cases" className="text-gray-700 hover:text-gray-900 text-sm font-medium transition-colors">
                        Use Cases
                    </a>
                    <a href="#pricing" className="text-gray-700 hover:text-gray-900 text-sm font-medium transition-colors">
                        Pricing
                    </a>
                    <a href="#blog" className="text-gray-700 hover:text-gray-900 text-sm font-medium transition-colors">
                        Blog
                    </a>
                    <a href="#resources" className="text-gray-700 hover:text-gray-900 text-sm font-medium transition-colors">
                        Resources
                    </a>
                </div>
            </div>

            {/* Download Button */}
            <button className="hidden md:block bg-black text-white px-6 py-2.5 rounded-xl text-sm font-medium hover:bg-gray-800 transition-colors ring-2 ring-inset ring-gray-700">
                Download
            </button>
        </nav>
    );
};

