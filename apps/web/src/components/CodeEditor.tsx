"use client";

import Editor from "@monaco-editor/react";

export default function CodeEditor({
  value,
  language,
  path,
}: {
  value: string;
  language: string;
  path: string;
}) {
  return (
    <div className="h-full w-full overflow-hidden rounded-md border border-zinc-700">
      <Editor
        key={path}                 // 🔑 FORCE MODEL CHANGE
        path={path}               // 🔑 MONACO FILE ID
        height="100%"
        value={value}
        language={language}
        theme="vs-dark"
        options={{
          readOnly: true,
          domReadOnly: true,
          fontSize: 12,
          minimap: { enabled: false },
          scrollBeyondLastLine: false,
          automaticLayout: true,
          cursorStyle: "line-thin",
          renderLineHighlight: "none",
        }}
      />
    </div>
  );
}
