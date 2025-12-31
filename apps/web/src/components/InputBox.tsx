import { Plus, Paperclip, ChevronDown, ArrowUp } from "lucide-react";

export function InputBox() {
  return (
    <div className="w-[640px] rounded-2xl bg-slate-200 px-3 py-4 mt-5.5 border-2 border-slate-300">
      {/* Top input area */}
      <div className="flex items-start gap-3">


        {/* Text input */}
        <textarea
          placeholder="Type your message..."
          className="flex-1 resize-none bg-transparent text-slate-900 placeholder-slate-500 outline-none"
          rows={3}
        />
      </div>

      {/* Bottom action bar */}
      <div className="mt-3 flex items-center justify-between">
        {/* Left actions */}
        <div className="flex items-center gap-2">
        <button className="flex h-8 w-8 items-center justify-center rounded-lg bg-white shadow-sm hover:bg-slate-100">
          <Plus className="h-5 w-5 text-slate-700" />
        </button>
          <button className="flex items-center gap-1 rounded-lg bg-white px-3 py-1.5 text-sm text-slate-700 shadow-sm hover:bg-slate-100">
            <span>GPT-4</span>
            <ChevronDown className="h-4 w-4" />
          </button>

          <button className="flex h-8 w-8 items-center justify-center rounded-lg bg-white shadow-sm hover:bg-slate-100">
            <Paperclip className="h-4 w-4 text-slate-700" />
          </button>
        </div>

        {/* Send button */}
        <button className="gradient-button flex h-9 w-9 items-center justify-center rounded-lg">
          <ArrowUp className="h-5 w-5 font-semibold text-white" />
        </button>
      </div>
    </div>
  );
}
