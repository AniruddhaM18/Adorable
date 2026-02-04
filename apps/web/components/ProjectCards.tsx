import { CardSpotlight } from "@/src/components/ui/card-spotlight";
import { FaRegTrashAlt } from "react-icons/fa";
import { MdArrowOutward } from "react-icons/md";

export default function ProjectCard() {
  return (
    <div
      className="
        group relative h-64 w-80 rounded-lg
        bg-neutral-950
        transition-all duration-300
        hover:shadow-[0_0_50px_rgba(255,255,255,0.06)]
      "
    >
      <CardSpotlight className="h-full w-full rounded-md">
        <div className="relative z-20 h-full w-full rounded-md bg-neutral-950 flex flex-col overflow-hidden">
          
          <div
            className="
              flex-1 rounded-md
              bg-neutral-900
              border border-white/10
              overflow-hidden
              transition-all duration-300
              group-hover:-translate-y-1
              group-hover:shadow-[0_16px_40px_rgba(0,0,0,0.85)]
              mx-1 mt-1
            "
          >
            <div className="flex items-center gap-2 px-3 py-2 bg-neutral-950 border-b border-white/5">
              <span className="h-2.5 w-2.5 rounded-full bg-red-500/60" />
              <span className="h-2.5 w-2.5 rounded-full bg-yellow-500/60" />
              <span className="h-2.5 w-2.5 rounded-full bg-green-500/60" />
            </div>

            <div className="p-4">
              <div className="h-28 w-full rounded-md bg-neutral-800/70" />
              <div className="mt-4 h-3 w-1/2 rounded-full bg-neutral-700/60" />
            </div>
          </div>

          <div className="flex items-center justify-between px-3 py-2 border-t border-white/5">
            <p className="text-sm font-medium text-neutral-300 line-clamp-1">
              100xdevs Landing Page Project
            </p>

            <div className="flex items-center gap-2 text-neutral-500">
              <button className="hover:text-neutral-300 transition">
                <FaRegTrashAlt size={14} />
              </button>
              <button className="hover:text-neutral-300 transition">
                <MdArrowOutward size={14} />
              </button>
            </div>
          </div>
          
        </div>
      </CardSpotlight>
    </div>
  );
}
