import Editor from "@monaco-editor/react";

export default function CodeEditor() {
  return (
    <div className="h-full w-full overflow-hidden border border-zinc-700 rounded-md">
      <Editor
        height="100%"
        defaultLanguage="javascript"
        defaultValue={`// Start typing\nconsole.log("Hello Ani");`}
        theme="vs-dark"
        options={{
          fontSize: 14,
          minimap: { enabled: false },
          scrollBeyondLastLine: false,
          automaticLayout: true,
        }}
      />
    </div>
  );
}
