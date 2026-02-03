"use client";

import { InputBox } from "@/src/components/InputBox";
import { Navbar } from "@/src/components/Navbar";
import { Leva } from "leva";
import { useEffect, useRef, useState } from "react";
import Footer from "@/src/components/Footer";
import { GL } from "@/src/components/hero/components/gl";
import { Pill } from "@/src/components/hero/pill";
import Highlight from "@/src/components/ui/Highlight";
import { CardSpotlightSection } from "@/src/components/ui/CardSpotlightSection";
import PriceCards from "@/src/components/ui/PriceCards";
import { GlowingEffectDemoSecond } from "@/src/components/ui/GlowingEffect";

export default function Home() {
    const [hovering, setHovering] = useState(false);



    return (
        <div className="min-h-screen bg-black relative">
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

            <Highlight />
<section className="relative isolate bg-black py-32">
  <div className="pointer-events-none absolute inset-x-0 top-0 z-10 h-32 bg-gradient-to-b from-black to-transparent" />
  <div className="pointer-events-none absolute inset-x-0 bottom-0 z-10 h-32 bg-gradient-to-t from-black to-transparent" />

  <div className="relative z-20 mx-auto max-w-7xl px-6">
    <GlowingEffectDemoSecond />
  </div>
</section>


            <section className="mt-10">
                <CardSpotlightSection />
            </section>

            <PriceCards />

            {/* FOOTER */}
            <Footer />

            <Leva hidden />
        </div>
    );
}
