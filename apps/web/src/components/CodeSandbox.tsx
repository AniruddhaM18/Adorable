import CodeEditor from "./CodeEditor";
import { FileTreeDemo } from "./FileTree";

export function CodeSandbox() {
  return (
    <div className="h-full bg-neutral-900">
      <div className="flex h-full w-full rounded-md border border-slate-600 bg-neutral-800">
        <div className="w-[220px] h-full border-r border-slate-600">
          <FileTreeDemo />
        </div>
        <div className="flex-1 h-full">
          <CodeEditor />
        </div>
      </div>
    </div>
  );
}
