import React, { useEffect, useRef, useState } from 'react';
import Navbar from './components/Navbar';
import { InputBox } from './components/InputBox';
import { BackgroundRippleEffect } from './components/ui/background-ripple-effect';

const Landing = () => {
    const [isVisible, setIsVisible] = useState(false);
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
        <div className="min-h-screen bg-white relative overflow-hidden">
            
            {/* Navigation */}
            <Navbar />

            {/* Background Ripple Effect (below navbar) */}
            <div className="absolute inset-x-0 top-[80px] -z-0 pointer-events-none">
                <BackgroundRippleEffect />
            </div>
            {/* Hero Section */}
            <section className="relative z-10 max-w-7xl mx-auto px-8 pt-24 pb-32 text-center">
                <h1 className="text-6xl md:text-7xl font-bold text-transparent bg-clip-text bg-linear-to-b from-gray-950 via-gray-800 to-gray-200 to-transparent mb-5 tracking-tight mt-10">
                    Build something Adorable
                </h1>
                <p className="text-2xl md:text-3xl text-gray-600 font-light mb-12">
                    Generate top-tier landing pages in seconds.
                </p>

                {/* CTA Buttons */}
                <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                    <InputBox />
                </div>
            </section>

            {/* Feature Section 1 - AI IDE Core */}
            <section
                ref={sectionRef}
                className={`relative z-10 max-w-[90rem] mx-auto px-8 py-24 mt-32 transition-all duration-1000 ease-out ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'
                    }`}
            >
                <div className="bg-gradient-to-br from-gray-50 to-blue-50/30 rounded-[3rem] p-12 md:p-16 shadow-sm">
                    <div className="grid md:grid-cols-2 gap-12 items-center">
                        <div>
                            <h2 className="text-5xl font-bold text-gray-900 mb-6">
                                AI IDE Core
                            </h2>
                            <p className="text-xl text-gray-600 leading-relaxed mb-8">
                                Experience the power of AI-assisted development with intelligent code completion,
                                real-time suggestions, and seamless integration with your workflow.
                            </p>
                            <ul className="space-y-4">
                                <li className="flex items-start gap-3">
                                    <div className="w-6 h-6 rounded-full bg-blue-500 flex items-center justify-center flex-shrink-0 mt-0.5">
                                        <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                        </svg>
                                    </div>
                                    <span className="text-gray-700 text-lg">Intelligent code completion</span>
                                </li>
                                <li className="flex items-start gap-3">
                                    <div className="w-6 h-6 rounded-full bg-blue-500 flex items-center justify-center flex-shrink-0 mt-0.5">
                                        <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                        </svg>
                                    </div>
                                    <span className="text-gray-700 text-lg">Real-time AI suggestions</span>
                                </li>
                                <li className="flex items-start gap-3">
                                    <div className="w-6 h-6 rounded-full bg-blue-500 flex items-center justify-center flex-shrink-0 mt-0.5">
                                        <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                        </svg>
                                    </div>
                                    <span className="text-gray-700 text-lg">Seamless workflow integration</span>
                                </li>
                            </ul>
                        </div>

                        {/* IDE Mockup */}
                        <div className="bg-gray-900 rounded-2xl p-6 shadow-2xl">
                            <div className="flex items-center gap-2 mb-4">
                                <div className="w-3 h-3 rounded-full bg-red-500" />
                                <div className="w-3 h-3 rounded-full bg-yellow-500" />
                                <div className="w-3 h-3 rounded-full bg-green-500" />
                            </div>
                            <div className="font-mono text-sm space-y-2">
                                <div className="text-purple-400">import <span className="text-blue-300">React</span> from <span className="text-green-400">'react'</span>;</div>
                                <div className="text-purple-400">import <span className="text-blue-300">{'{ useState }'}</span> from <span className="text-green-400">'react'</span>;</div>
                                <div className="h-4" />
                                <div className="text-purple-400">const <span className="text-blue-300">App</span> = () {'=> {'}</div>
                                <div className="pl-4 text-purple-400">const [<span className="text-blue-300">count</span>, <span className="text-blue-300">setCount</span>] = <span className="text-yellow-300">useState</span>(<span className="text-orange-400">0</span>);</div>
                                <div className="h-4" />
                                <div className="pl-4 text-purple-400">return (</div>
                                <div className="pl-8 text-gray-400">{'<'}div className=<span className="text-green-400">"app"</span>{'>'}</div>
                                <div className="pl-12 text-gray-400">{'<'}h1{'>'}Count: {'{'}count{'}'} {'<'}/h1{'>'}</div>
                                <div className="pl-12 text-gray-400">{'<'}button onClick={'{'}() {'=>'} setCount(count + 1){'}'}{'>'}</div>
                                <div className="pl-16 text-gray-400">Increment</div>
                                <div className="pl-12 text-gray-400">{'<'}/button{'>'}</div>
                                <div className="pl-8 text-gray-400">{'<'}/div{'>'}</div>
                                <div className="pl-4 text-purple-400">);</div>
                                <div className="text-purple-400">{'}'};</div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Feature Section 2 - Collaboration */}
            <section className="relative z-10 max-w-7xl mx-auto px-8 py-24">
                <div className="bg-gradient-to-br from-purple-50/30 to-pink-50/30 rounded-[3rem] p-12 md:p-16 shadow-sm">
                    <div className="grid md:grid-cols-2 gap-12 items-center">
                        {/* Mockup on left */}
                        <div className="bg-gray-900 rounded-2xl p-6 shadow-2xl order-2 md:order-1">
                            <div className="flex items-center gap-2 mb-4">
                                <div className="w-3 h-3 rounded-full bg-red-500" />
                                <div className="w-3 h-3 rounded-full bg-yellow-500" />
                                <div className="w-3 h-3 rounded-full bg-green-500" />
                            </div>
                            <div className="space-y-4">
                                <div className="bg-gray-800 rounded-lg p-4">
                                    <div className="flex items-start gap-3">
                                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 flex-shrink-0" />
                                        <div className="flex-1">
                                            <div className="text-gray-300 text-sm mb-2">How can I optimize this function?</div>
                                            <div className="bg-gray-700 rounded-lg p-3 text-xs text-gray-400 font-mono">
                                                function calculateTotal(items) {'{'}
                                                <br />
                                                {'  '}return items.reduce((sum, item) {'=>'} sum + item.price, 0);
                                                <br />
                                                {'}'}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="bg-blue-900/30 rounded-lg p-4">
                                    <div className="flex items-start gap-3">
                                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 via-purple-500 to-orange-500 flex-shrink-0" />
                                        <div className="flex-1">
                                            <div className="text-gray-300 text-sm">
                                                Your function is already well-optimized! The reduce method is efficient for this use case.
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="order-1 md:order-2">
                            <h2 className="text-5xl font-bold text-gray-900 mb-6">
                                Built-in AI Chat
                            </h2>
                            <p className="text-xl text-gray-600 leading-relaxed mb-8">
                                Get instant answers to your coding questions without leaving your IDE.
                                Our AI assistant understands your codebase and provides contextual help.
                            </p>
                            <ul className="space-y-4">
                                <li className="flex items-start gap-3">
                                    <div className="w-6 h-6 rounded-full bg-purple-500 flex items-center justify-center flex-shrink-0 mt-0.5">
                                        <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                        </svg>
                                    </div>
                                    <span className="text-gray-700 text-lg">Context-aware responses</span>
                                </li>
                                <li className="flex items-start gap-3">
                                    <div className="w-6 h-6 rounded-full bg-purple-500 flex items-center justify-center flex-shrink-0 mt-0.5">
                                        <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                        </svg>
                                    </div>
                                    <span className="text-gray-700 text-lg">Code explanations</span>
                                </li>
                                <li className="flex items-start gap-3">
                                    <div className="w-6 h-6 rounded-full bg-purple-500 flex items-center justify-center flex-shrink-0 mt-0.5">
                                        <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                        </svg>
                                    </div>
                                    <span className="text-gray-700 text-lg">Debugging assistance</span>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
            </section>

            {/* Pricing Section */}
            <section className="relative z-10 max-w-7xl mx-auto px-8 py-24">
                <h2 className="text-5xl font-bold text-gray-900 text-center mb-16">
                    Choose your plan
                </h2>

                <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
                    {/* For Developers */}
                    <div className="bg-white border-2 border-gray-200 rounded-[2rem] p-10 hover:border-gray-300 transition-colors">
                        <div className="inline-block bg-green-100 text-green-700 px-4 py-1.5 rounded-full text-sm font-medium mb-6">
                            Available at no charge
                        </div>
                        <h3 className="text-3xl font-bold text-gray-900 mb-4">
                            For developers
                        </h3>
                        <p className="text-gray-600 text-lg mb-8">
                            Everything you need to build amazing applications with AI assistance.
                        </p>
                        <ul className="space-y-4 mb-8">
                            <li className="flex items-start gap-3">
                                <svg className="w-6 h-6 text-green-500 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                </svg>
                                <span className="text-gray-700">Unlimited AI completions</span>
                            </li>
                            <li className="flex items-start gap-3">
                                <svg className="w-6 h-6 text-green-500 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                </svg>
                                <span className="text-gray-700">Built-in AI chat</span>
                            </li>
                            <li className="flex items-start gap-3">
                                <svg className="w-6 h-6 text-green-500 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                </svg>
                                <span className="text-gray-700">All language support</span>
                            </li>
                        </ul>
                        <button className="w-full bg-black text-white py-4 rounded-full font-medium hover:bg-gray-800 transition-colors">
                            Get started
                        </button>
                    </div>

                    {/* For Organizations */}
                    <div className="bg-white border-2 border-gray-200 rounded-[2rem] p-10 hover:border-gray-300 transition-colors">
                        <div className="inline-block bg-blue-100 text-blue-700 px-4 py-1.5 rounded-full text-sm font-medium mb-6">
                            Coming soon
                        </div>
                        <h3 className="text-3xl font-bold text-gray-900 mb-4">
                            For organizations
                        </h3>
                        <p className="text-gray-600 text-lg mb-8">
                            Advanced features and controls for teams and enterprises.
                        </p>
                        <ul className="space-y-4 mb-8">
                            <li className="flex items-start gap-3">
                                <svg className="w-6 h-6 text-blue-500 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                </svg>
                                <span className="text-gray-700">Team collaboration</span>
                            </li>
                            <li className="flex items-start gap-3">
                                <svg className="w-6 h-6 text-blue-500 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                </svg>
                                <span className="text-gray-700">Admin controls</span>
                            </li>
                            <li className="flex items-start gap-3">
                                <svg className="w-6 h-6 text-blue-500 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                </svg>
                                <span className="text-gray-700">Priority support</span>
                            </li>
                        </ul>
                        <button className="w-full bg-gray-100 text-gray-900 py-4 rounded-full font-medium hover:bg-gray-200 transition-colors">
                            Join waitlist
                        </button>
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="relative z-10 bg-gray-900 text-white mt-32">
                <div className="max-w-7xl mx-auto px-8 py-16">
                    <div className="text-6xl font-bold mb-12">Antigravity</div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                        <div>
                            <h4 className="font-semibold mb-4">Product</h4>
                            <ul className="space-y-2 text-gray-400">
                                <li><a href="#" className="hover:text-white transition-colors">Features</a></li>
                                <li><a href="#" className="hover:text-white transition-colors">Pricing</a></li>
                                <li><a href="#" className="hover:text-white transition-colors">Download</a></li>
                            </ul>
                        </div>

                        <div>
                            <h4 className="font-semibold mb-4">Resources</h4>
                            <ul className="space-y-2 text-gray-400">
                                <li><a href="#" className="hover:text-white transition-colors">Documentation</a></li>
                                <li><a href="#" className="hover:text-white transition-colors">Blog</a></li>
                                <li><a href="#" className="hover:text-white transition-colors">Community</a></li>
                            </ul>
                        </div>

                        <div>
                            <h4 className="font-semibold mb-4">Company</h4>
                            <ul className="space-y-2 text-gray-400">
                                <li><a href="#" className="hover:text-white transition-colors">About</a></li>
                                <li><a href="#" className="hover:text-white transition-colors">Careers</a></li>
                                <li><a href="#" className="hover:text-white transition-colors">Contact</a></li>
                            </ul>
                        </div>

                        <div>
                            <h4 className="font-semibold mb-4">Legal</h4>
                            <ul className="space-y-2 text-gray-400">
                                <li><a href="#" className="hover:text-white transition-colors">Privacy</a></li>
                                <li><a href="#" className="hover:text-white transition-colors">Terms</a></li>
                                <li><a href="#" className="hover:text-white transition-colors">Security</a></li>
                            </ul>
                        </div>
                    </div>

                    <div className="border-t border-gray-800 mt-12 pt-8 text-gray-400 text-sm">
                        © 2024 Antigravity. All rights reserved.
                    </div>
                </div>
            </footer>
        </div>
    );
};

export default Landing;
