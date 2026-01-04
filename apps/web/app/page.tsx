"use client";

import { InputBox } from "@/src/components/InputBox";
import { Navbar } from "@/src/components/Navbar";
import { Leva } from "leva";
import { useEffect, useRef, useState } from "react";
import Footer from "@/src/components/Footer";
import { GL } from "@/src/components/hero/components/gl";
import { Pill } from "@/src/components/hero/pill";

export default function Home() {
    const [isVisible, setIsVisible] = useState(false);
    const [hovering, setHovering] = useState(false);
    const sectionRef = useRef<HTMLElement>(null);

    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setIsVisible(true);
                }
            },
            { threshold: 0.1 }
        );

        if (sectionRef.current) {
            observer.observe(sectionRef.current);
        }

        return () => {
            if (sectionRef.current) {
                observer.unobserve(sectionRef.current);
            }
        };
    }, []);

    return (
        <div className="min-h-screen bg-neutral-950 relative">
            {/* NAVBAR (transparent / glass) */}
            <Navbar />

            <section className="relative h-screen overflow-hidden">
                <div className="absolute inset-0 pointer-events-none z-0">
                    <GL hovering={hovering} />
                </div>

                <div className="relative z-10 max-w-7xl mx-auto px-8 pt-24 pb-32 text-center">
                    <div className="max-w-4xl mx-auto">
                        {/* <h1 className="text-6xl md:text-8xl font-bold text-transparent bg-clip-text bg-linear-to-b from-gray-50 via-gray-200 to-gray-800 tracking-wider mt-10">
              Build something
            </h1> */}
                        <h1 className="text-4xl md:text-7xl mt-[260px] font-semibold text-transparent text-white  mb-5">
                            Build something Adorable
                        </h1>
                    </div>

                    <Pill >
                        <p className="text-gray-200 font-light">
                            Generate top-tier landing pages in seconds.
                        </p>
                    </Pill>


                    <div
                        className="flex justify-center"
                        onMouseEnter={() => setHovering(true)}
                        onMouseLeave={() => setHovering(false)}
                    >
                        <InputBox />
                    </div>
                </div>
            </section>

            <section
                ref={sectionRef}
                className={`relative z-10 max-w-[90rem] mx-auto px-8 py-8 mt-16 transition-all duration-1000 ease-out ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-12"
                    }`}
            >
                <div className="bg-gradient-to-br from-neutral-800 to-neutral-600/50 rounded-[3rem] p-12 md:p-16 shadow-md">
                    <div className="grid md:grid-cols-2 gap-12 items-center">
                        <div>
                            <h2 className="text-5xl font-bold text-gray-100 mb-6">
                                Make anything
                            </h2>
                            <p className="text-xl text-gray-400 leading-relaxed mb-8">
                                AI landing page builder that creates stunning designs in seconds.
                            </p>

                            <ul className="space-y-4">
                                {[
                                    "Intelligent code completion",
                                    "Real-time AI suggestions",
                                    "Seamless workflow integration",
                                    "Seamless workflow integration",
                                ].map((text, i) => (
                                    <li key={i} className="flex items-start gap-3">
                                        <div className="w-6 h-6 rounded-full bg-blue-500 flex items-center justify-center mt-0.5">
                                            <svg
                                                className="w-4 h-4 text-white"
                                                fill="none"
                                                stroke="currentColor"
                                                viewBox="0 0 24 24"
                                            >
                                                <path
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    strokeWidth={2}
                                                    d="M5 13l4 4L19 7"
                                                />
                                            </svg>
                                        </div>
                                        <span className="text-gray-300 text-lg">{text}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                </div>
            </section>

            <section className="relative z-10 max-w-7xl mx-auto px-8 py-24">
                <div className="bg-gradient-to-br from-neutral-800/70 to-neutral-800/40 rounded-[3rem] p-12 md:p-16 shadow-md">
                    <div className="grid md:grid-cols-2 gap-12 items-center">
                        {/* MOCKUP */}
                        <div className="bg-gray-900 rounded-2xl p-6 shadow-2xl order-2 md:order-1">
                            <div className="flex items-center gap-2 mb-4">
                                <div className="w-3 h-3 rounded-full bg-red-500" />
                                <div className="w-3 h-3 rounded-full bg-yellow-500" />
                                <div className="w-3 h-3 rounded-full bg-green-500" />
                            </div>

                            <div className="space-y-4">
                                <div className="bg-gray-800 rounded-lg p-4">
                                    <div className="flex items-start gap-3">
                                        <div className="w-8 h-8 rounded-full bg-blue-400" />
                                        <div className="flex-1">
                                            <div className="text-gray-300 text-sm mb-2">
                                                How can I optimize this function?
                                            </div>
                                            <div className="bg-gray-700 rounded-lg p-3 text-xs text-gray-400 font-mono">
                                                function calculateTotal(items) {"{"}
                                                <br />
                                                {"  "}return items.reduce((sum, item) =&gt; sum + item.price, 0);
                                                <br />
                                                {"}"}
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="bg-blue-900/30 rounded-lg p-4">
                                    <div className="flex items-start gap-3">
                                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 via-purple-500 to-orange-500" />
                                        <div className="flex-1">
                                            <div className="text-gray-300 text-sm">
                                                Your function is already well-optimized!
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* TEXT */}
                        <div className="order-1 md:order-2">
                            <h2 className="text-5xl font-bold text-gray-100 mb-6">
                                Built-in AI Chat
                            </h2>
                            <p className="text-xl text-gray-400 leading-relaxed mb-8">
                                Get instant answers to your coding questions without leaving
                                your IDE.
                            </p>

                            <ul className="space-y-4">
                                {[
                                    "Context-aware responses",
                                    "Code explanations",
                                    "Debugging assistance",
                                ].map((text, i) => (
                                    <li key={i} className="flex items-start gap-3">
                                        <div className="w-6 h-6 rounded-full bg-blue-500 flex items-center justify-center mt-0.5">
                                            <svg
                                                className="w-4 h-4 text-white"
                                                fill="none"
                                                stroke="currentColor"
                                                viewBox="0 0 24 24"
                                            >
                                                <path
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    strokeWidth={2}
                                                    d="M5 13l4 4L19 7"
                                                />
                                            </svg>
                                        </div>
                                        <span className="text-gray-300 text-lg">{text}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                </div>
            </section>

            <section className="relative z-10 max-w-7xl mx-auto px-8 py-24">
                <h2 className="text-5xl font-bold text-gray-100 text-center mb-16">
                    Choose your plan
                </h2>

                <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
                    {/* For Developers */}
                    <div className="bg-neutral-900 border-2 border-gray-800 rounded-[2rem] p-10 hover:border-gray-700 transition-colors">
                        <div className="inline-block bg-green-900 text-green-300 px-4 py-1.5 rounded-full text-sm font-medium mb-6">
                            Available at no charge
                        </div>
                        <h3 className="text-3xl font-bold text-gray-100 mb-4">
                            For developers
                        </h3>
                        <p className="text-gray-400 text-lg mb-8">
                            Everything you need to build amazing applications with AI assistance.
                        </p>
                        <ul className="space-y-4 mb-8">
                            <li className="flex items-start gap-3">
                                <svg className="w-6 h-6 text-green-500 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                </svg>
                                <span className="text-gray-300">Unlimited AI completions</span>
                            </li>
                            <li className="flex items-start gap-3">
                                <svg className="w-6 h-6 text-green-500 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                </svg>
                                <span className="text-gray-300">Built-in AI chat</span>
                            </li>
                            <li className="flex items-start gap-3">
                                <svg className="w-6 h-6 text-green-500 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                </svg>
                                <span className="text-gray-300">All language support</span>
                            </li>
                        </ul>
                        <button className="w-full bg-white text-black py-4 rounded-full font-medium hover:bg-gray-200 transition-colors">
                            Get started
                        </button>
                    </div>

                    {/* For Organizations */}
                    <div className="bg-neutral-900 border-2 border-gray-800 rounded-[2rem] p-10 hover:border-gray-700 transition-colors">
                        <div className="inline-block bg-blue-900 text-blue-300 px-4 py-1.5 rounded-md text-sm font-medium mb-6">
                            Coming soon
                        </div>
                        <h3 className="text-3xl font-bold text-gray-100 mb-4">
                            For organizations
                        </h3>
                        <p className="text-gray-400 text-lg mb-8">
                            Advanced features and controls for teams and enterprises.
                        </p>
                        <ul className="space-y-4 mb-8">
                            <li className="flex items-start gap-3">
                                <svg className="w-6 h-6 text-blue-500 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                </svg>
                                <span className="text-gray-300">Team collaboration</span>
                            </li>
                            <li className="flex items-start gap-3">
                                <svg className="w-6 h-6 text-blue-500 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                </svg>
                                <span className="text-gray-300">Admin controls</span>
                            </li>
                            <li className="flex items-start gap-3">
                                <svg className="w-6 h-6 text-blue-500 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                </svg>
                                <span className="text-gray-300">Priority support</span>
                            </li>
                        </ul>
                        <button className="w-full bg-gray-800 text-gray-100 py-4 rounded-full font-medium hover:bg-gray-700 transition-colors">
                            Join waitlist
                        </button>
                    </div>
                </div>
            </section>
            {/* FOOTER */}
            <Footer />

            <Leva hidden />
        </div>
    );
}
