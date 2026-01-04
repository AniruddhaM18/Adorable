"use client";

import {
  ControlledTreeEnvironment,
  Tree,
  TreeItem,
  TreeItemIndex,
} from "react-complex-tree";
import { useMemo, useState } from "react";
import {
  FaChevronDown,
  FaChevronRight,
  FaFolder,
  FaFolderOpen,
  FaFileCode,
} from "react-icons/fa";

// =====================
// Types
// =====================
export type FileTreeNode = {
  id: string;
  name: string;
  type: "file" | "folder";
  children?: FileTreeNode[];
};

type FileTreeProps = {
  data: FileTreeNode[];
  onFileSelect?: (id: string) => void;
};

// =====================
// Component
// =====================
export function FileTree({ data, onFileSelect }: FileTreeProps) {
  // Normalize data → react-complex-tree format
  const items = useMemo<Record<TreeItemIndex, TreeItem>>(() => {
    const map: Record<TreeItemIndex, TreeItem> = {
      root: {
        index: "root",
        isFolder: true,
        children: data.map((node) => node.id), // Only add top-level items here
        data: "root",
      },
    };

    const walk = (nodes: FileTreeNode[]) => {
      for (const node of nodes) {
        // Add this node to the map
        map[node.id] = {
          index: node.id,
          isFolder: node.type === "folder",
          children: node.children?.map((c) => c.id) ?? [],
          data: node.name,
        };

        // Recursively process children
        if (node.children && node.children.length > 0) {
          walk(node.children);
        }
      }
    };

    walk(data);
    return map;
  }, [data]);

  // View state
  const [focusedItem, setFocusedItem] = useState<TreeItemIndex>();
  const [expandedItems, setExpandedItems] = useState<TreeItemIndex[]>([]);
  const [selectedItems, setSelectedItems] = useState<TreeItemIndex[]>([]);

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
          setExpandedItems((prev) => prev.filter((i) => i !== item.index))
        }
        onSelectItems={(selected) => {
          setSelectedItems(selected);

          const id = selected[0];
          if (!id || id === "root") return;

          const item = items[id];
          if (!item || item.isFolder) return;

          onFileSelect?.(String(id));
        }}
        renderItem={({ item, depth, context, children }) => (
          <div style={{ paddingLeft: depth * 14 }}>
            <div
              className={`flex items-center gap-1 rounded-sm px-1.5 py-0.5 text-sm cursor-pointer
                ${
                  context.isSelected
                    ? "bg-zinc-700 text-white"
                    : "hover:bg-zinc-800 rounded-sm"
                }
              `}
              {...context.interactiveElementProps}
            >
              {/* Arrow */}
              {item.isFolder ? (
                context.isExpanded ? (
                  <FaChevronDown className="text-zinc-400 text-xs" />
                ) : (
                  <FaChevronRight className="text-zinc-400 text-xs" />
                )
              ) : (
                <span className="w-3" />
              )}

              {/* Icon */}
              {item.isFolder ? (
                context.isExpanded ? (
                  <FaFolderOpen className="text-blue-500" />
                ) : (
                  <FaFolder className="text-blue-500" />
                )
              ) : (
                <FaFileCode className="text-emerald-400" />
              )}

              {/* Label */}
              <span className="truncate">{item.data}</span>
            </div>

            {children}
          </div>
        )}
      >
        <Tree treeId="tree" rootItem="root" />
      </ControlledTreeEnvironment>
    </div>
  );
}