"use client";

import { useEffect, useState } from "react";
import {
  Terminal,
  TypingAnimation,
  AnimatedSpan,
} from "@/components/ui/terminal";

interface LoaderProps {
  statusMessage?: string;
}

/* ---------- top status steps ---------- */
const statusSteps = [
  "Understanding your request",
  "Agent working",
  "Generating code",
  "Preparing preview",
];

/* ---------- terminal steps ---------- */
const terminalSteps = [
  { text: "Booting build environment", type: "info" },
  { text: "Resolving dependencies", type: "success" },
  { text: "Validating configuration", type: "success" },
  { text: "Compiling application", type: "success" },
  { text: "Optimizing output", type: "success" },
];

export default function TerminalLoader({ statusMessage }: LoaderProps) {
  const [statusIndex, setStatusIndex] = useState(0);
  const [terminalIndex, setTerminalIndex] = useState(0);
  const [showTerminal, setShowTerminal] = useState(false);
  const [dots, setDots] = useState("");

  /* ---------- animated dots ---------- */
  useEffect(() => {
    const i = setInterval(() => {
      setDots((d) => (d.length >= 3 ? "" : d + "."));
    }, 500);
    return () => clearInterval(i);
  }, []);

  /* ---------- status loop ---------- */
  useEffect(() => {
    if (!statusMessage) {
      const i = setInterval(() => {
        setStatusIndex((s) => (s + 1) % statusSteps.length);
      }, 3000);
      return () => clearInterval(i);
    }
  }, [statusMessage]);

  /* ---------- delay before terminal ---------- */
  useEffect(() => {
    const t = setTimeout(() => setShowTerminal(true), 3000);
    return () => clearTimeout(t);
  }, []);

  /* ---------- terminal loop ---------- */
  useEffect(() => {
    if (!showTerminal) return;
    const i = setInterval(() => {
      setTerminalIndex((s) =>
        s + 1 >= terminalSteps.length ? 0 : s + 1
      );
    }, 2600);
    return () => clearInterval(i);
  }, [showTerminal]);

  return (
    <div className="absolute inset-0 z-50 flex items-center justify-center bg-neutral-950/90 backdrop-blur-sm">
      <div className="w-full max-w-md px-4">
        <div className="rounded-lg border border-neutral-800 bg-neutral-900 shadow-xl">
          
          {/* HEADER */}
          <div className="px-5 pt-5 pb-4 space-y-3">
            <h3 className="text-sm font-medium text-white">
              Building your project
            </h3>

            <p className="text-xs text-neutral-400 min-h-[16px]">
              {(statusMessage || statusSteps[statusIndex])}
              {dots}
            </p>

            <div className="h-1 rounded bg-neutral-700 overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-neutral-400 to-neutral-200 transition-all duration-700"
                style={{
                  width: `${((statusIndex + 1) / statusSteps.length) * 100}%`,
                }}
              />
            </div>
          </div>

          {/* FAKE TERMINAL BAR */}
          <div className="flex items-center gap-2 px-4 py-2 border-y border-neutral-800">
            <div className="h-2.5 w-2.5 rounded-full bg-blue-500/70" />
            <div className="h-2.5 w-2.5 rounded-full bg-blue-700/60" />
            <div className="h-2.5 w-2.5 rounded-full bg-blue-800/50" />
            <span className="ml-2 text-[11px] font-mono text-neutral-400">
              adorable@agent
            </span>
          </div>

          {/* TERMINAL BODY */}
          <div className="px-4 py-4 min-h-[180px]">
            {!showTerminal ? (
              <p className="text-xs font-mono text-neutral-500">
                Initializing build process…
              </p>
            ) : (
              <Terminal
                key={terminalIndex}
                className="bg-transparent font-mono text-[13px] leading-relaxed text-neutral-200"
              >
                <TypingAnimation>&gt; pnpm run build</TypingAnimation>

                <AnimatedSpan className="text-neutral-400">
                  node v20.11.0 · pnpm v9.0.0
                </AnimatedSpan>

                {terminalSteps
                  .slice(0, terminalIndex + 1)
                  .map((step, i) => (
                    <AnimatedSpan
                      key={i}
                      className={
                        step.type === "success"
                          ? "text-emerald-400"
                          : "text-sky-400"
                      }
                    >
                      {step.type === "success" ? "✔" : "ℹ"} {step.text}
                    </AnimatedSpan>
                  ))}

                <TypingAnimation className="text-neutral-400">
                  Working...
                </TypingAnimation>
              </Terminal>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
