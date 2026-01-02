"use client"
import {
  ControlledTreeEnvironment,
  Tree,
  TreeItem,
  TreeItemIndex,
} from "react-complex-tree"
import { useMemo, useState } from "react"
import {
  FaChevronDown,
  FaChevronRight,
  FaFolder,
  FaFolderOpen,
  FaFileCode,
} from "react-icons/fa"

//types
export type FileTreeNode = {
  id: string
  name: string
  type: "file" | "folder"
  children?: FileTreeNode[]
}


type FileTreeProps = {
  data: FileTreeNode[]
  onFileSelect?: (id: string) => void
}

//components
export function FileTree({ data, onFileSelect }: FileTreeProps) {

  //normalize data 
  const items = useMemo<Record<TreeItemIndex, TreeItem>>(() => {
    const map: Record<TreeItemIndex, TreeItem> = {
      root: {
        index: "root",
        isFolder: true,
        children: [],
        data: "root",
      },
    }

    const walk = (nodes: FileTreeNode[], parent: TreeItemIndex) => {
      for (const node of nodes) {
        map[node.id] = {
          index: node.id,
          isFolder: !!node.children,
          children: node.children?.map((c) => c.id) ?? [],
          data: node.name,
        }

        ;(map[parent].children as TreeItemIndex[]).push(node.id)

        if (node.children) {
          walk(node.children, node.id)
        }
      }
    }

    walk(data, "root")
    return map
  }, [data])

  // state
  const [focusedItem, setFocusedItem] = useState<TreeItemIndex>()
  const [expandedItems, setExpandedItems] = useState<TreeItemIndex[]>([])
  const [selectedItems, setSelectedItems] = useState<TreeItemIndex[]>([])

  return (
    <div className="h-full w-[220px] rounded-md border border-zinc-700 bg-zinc-900 text-zinc-200">
      <ControlledTreeEnvironment
        items={items}
        getItemTitle={(item) => String(item.data)}
        viewState={{
          tree: {
            focusedItem,
            expandedItems,
            selectedItems,
          },
        }}
        onFocusItem={(item) => setFocusedItem(item.index)}
        onExpandItem={(item) =>
          setExpandedItems((prev) =>
            prev.includes(item.index) ? prev : [...prev, item.index]
          )
        }
        onCollapseItem={(item) =>
          setExpandedItems((prev) =>
            prev.filter((i) => i !== item.index)
          )
        }
        onSelectItems={(items) => {
          setSelectedItems(items)

          const id = items[0]
          if (!id) return

          const node = items[0]
          const treeItem = node && items.length === 1 ? items[0] : null

          if (treeItem && !items.includes("root")) {
            const itemDef = items[0]
            const isFile = !items.includes(itemDef)

            if (isFile) {
              onFileSelect?.(String(itemDef))
            }
          }
        }}
        renderItem={({ item, depth, context, children }) => (
          <div
            style={{ paddingLeft: depth * 14 }}
            className={`flex flex-col`}
          >
            <div
              className={`flex items-center gap-1 rounded-md px-1.5 py-0.5 text-sm
                ${
                  context.isSelected
                    ? "bg-zinc-700 text-white"
                    : "hover:bg-zinc-800"
                }
              `}
              {...context.itemContainerWithChildrenProps}
            >
              {/* arrow */}
              {item.isFolder ? (
                context.isExpanded ? (
                  <FaChevronDown className="text-zinc-400 text-xs" />
                ) : (
                  <FaChevronRight className="text-zinc-400 text-xs" />
                )
              ) : (
                <span className="w-3" />
              )}

              {/* icon */}
              {item.isFolder ? (
                context.isExpanded ? (
                  <FaFolderOpen className="text-indigo-400" />
                ) : (
                  <FaFolder className="text-indigo-400" />
                )
              ) : (
                <FaFileCode className="text-emerald-400" />
              )}

              {/* label */}
              <span className="truncate">
                {item.data}
              </span>
            </div>

            {children}
          </div>
        )}
      >
        <Tree treeId="tree" rootItem="root" />
      </ControlledTreeEnvironment>
    </div>
  )
}
