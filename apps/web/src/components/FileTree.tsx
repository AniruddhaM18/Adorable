"use client"
import { FileTree, FileTreeNode } from "../../components/ui/file-tree"

const FILES: FileTreeNode[] = [
  {
    id: "src",
    name: "src",
    type: "folder",
    children: [
      {
        id: "app",
        name: "app",
        type: "folder",
        children: [
          { id: "layout.tsx", name: "layout.tsx", type: "file" },
          { id: "page.tsx", name: "page.tsx", type: "file" },
        ],
      },
      {
        id: "components",
        name: "components",
        type: "folder",
        children: [
          {
            id: "ui",
            name: "ui",
            type: "folder",
            children: [
              { id: "button.tsx", name: "button.tsx", type: "file" },
              { id: "file-tree.tsx", name: "file-tree.tsx", type: "file" },
            ],
          },
        ],
      },
      {
        id: "lib",
        name: "lib",
        type: "folder",
        children: [{ id: "utils.ts", name: "utils.ts", type: "file" }],
      },
    ],
  },
]


export function FileTreeDemo() {
  return (
    <div className="h-full w-[220px]">
      <FileTree
        data={FILES}
        onFileSelect={(id) => {
          console.log("Open file:", id)
        }}
      />
    </div>
  )
}
