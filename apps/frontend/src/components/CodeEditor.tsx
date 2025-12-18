import Editor from "@monaco-editor/react";

export default function CodeEditor() {
  return (
    <div style={{ marginLeft: "240px", height: "100vh" }}>
      <Editor
        height="100%"
        defaultLanguage="javascript"
        defaultValue={`// Start typing\nconsole.log("Hello Monaco");`}
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
