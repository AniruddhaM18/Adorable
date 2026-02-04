"use client";

import { InputBox } from "@/src/components/InputBox";
import { Navbar } from "@/src/components/Navbar";
import { Leva } from "leva";
import { useEffect, useRef, useState } from "react";
import Footer from "@/src/components/Footer";
import { GL } from "@/src/components/hero/components/gl";
import { Pill } from "@/src/components/hero/pill";
import LandingSection from "@/components/LandingSection";

export default function Home() {
    const [hovering, setHovering] = useState(false);
    return (
        <div className="min-h-screen bg-black relative">
            <Navbar />

            <section className="relative h-screen overflow-hidden">
                <div className="absolute inset-0 pointer-events-none z-0">
                    <GL hovering={hovering} />
                </div>

                <div className="relative z-10 max-w-7xl mx-auto px-8 pt-24 pb-32 text-center">
                    <div className="max-w-4xl mx-auto">

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
            <LandingSection /> 
            <Footer />

            <Leva hidden />
        </div>
    );
}
