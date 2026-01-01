import { Plus, Paperclip, ChevronDown, ArrowUp } from "lucide-react";

export function InputBox() {
  return (
    <div className="w-[640px] mt-6 rounded-2xl border border-neutral-800 bg-neutral-900/80 backdrop-blur px-4 py-4 shadow-lg ring-2 ring-neutral-700">
      {/* Top input area */}
      <div className="flex items-start gap-3">
        <textarea
          placeholder="Type your message..."
          rows={3}
          className="flex-1 resize-none bg-transparent text-neutral-100 placeholder-neutral-500 outline-none"
        />
      </div>

      {/* Bottom action bar */}
      <div className="mt-3 flex items-center justify-between">
        {/* Left actions */}
        <div className="flex items-center gap-2">
          <button className="flex h-8 w-8 items-center justify-center rounded-lg border border-neutral-800 bg-neutral-900 hover:bg-neutral-800 transition">
            <Plus className="h-5 w-5 text-neutral-400" />
          </button>

          <button className="flex items-center gap-1 rounded-lg border border-neutral-800 bg-neutral-900 px-3 py-1.5 text-sm text-neutral-300 hover:bg-neutral-800 transition">
            <span>GPT-4</span>
            <ChevronDown className="h-4 w-4" />
          </button>

          <button className="flex h-8 w-8 items-center justify-center rounded-lg border border-neutral-800 bg-neutral-900 hover:bg-neutral-800 transition">
            <Paperclip className="h-4 w-4 text-neutral-400" />
          </button>
        </div>

        {/* Send button */}
        <button className="gradient-button flex h-9 w-9 items-center justify-center rounded-lg bg-neutral-100 hover:bg-white transition">
          <ArrowUp className="h-5 w-5 text-neutral-200" />
        </button>
      </div>
    </div>
  );
}
