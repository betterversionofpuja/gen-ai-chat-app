import { useState } from "react";
import {
  ChevronDown,
  FolderOpen,
  FileCode2,
  Search,
  MoreHorizontal,
  X,
} from "lucide-react";

const Workspace = ({ fileTree = {} }) => {
  const [openFiles, setOpenFiles] = useState([]);
  const [activeFile, setActiveFile] = useState(null);

  const renderTree = (tree) => {
    if (!tree || typeof tree !== "object") return null;

    return Object.entries(tree).map(([name, value]) => {
      // File
      if (value?.file) {
        return (
          <div
            key={name}
            onClick={() => {
              const file = {
                name,
                content: value.file.contents,
              };

              if (!openFiles.some((f) => f.name === name)) {
                setOpenFiles((prev) => [...prev, file]);
              }

              setActiveFile(file);
            }}
            className="ml-5 flex cursor-pointer items-center gap-2 rounded px-2 py-1 text-gray-300 hover:bg-white/5"
          >
            <FileCode2 size={15} className="text-gray-400" />
            <span>{name}</span>
          </div>
        );
      }

      // Skip invalid values
      if (!value || typeof value !== "object") {
        return null;
      }

      // Folder
      return (
        <div key={name} className="ml-4">
          <div className="flex items-center gap-1 rounded px-2 py-1 text-white hover:bg-white/5">
            <ChevronDown size={14} />
            <FolderOpen size={16} className="text-blue-400" />
            <span>{name}</span>
          </div>

          <div className="ml-4 border-l border-white/10 pl-2">
            {renderTree(value)}
          </div>
        </div>
      );
    });
  };

  return (
    <div className="flex h-full w-full bg-[#0b0b0d]">
      {/* Explorer */}
      <aside className="w-80 shrink-0 border-r border-white/10 bg-[#111111]">
        <div className="flex items-center justify-between border-b border-white/10 px-4 py-3">
          <span className="text-xs font-semibold uppercase tracking-[0.2em] text-gray-400">
            Explorer
          </span>

          <div className="flex items-center gap-3 text-gray-500">
            <Search size={16} className="cursor-pointer hover:text-white" />
            <MoreHorizontal
              size={16}
              className="cursor-pointer hover:text-white"
            />
          </div>
        </div>

        <div className="px-2 py-2 text-sm">
          <div className="flex items-center gap-1 rounded px-2 py-1 text-white hover:bg-white/5">
            <ChevronDown size={14} />
            <FolderOpen size={17} className="text-blue-400" />
            <span className="font-medium">project</span>
          </div>

          <div className="ml-4 border-l border-white/10 pl-3">
            {renderTree(fileTree)}
          </div>
        </div>
      </aside>

      {/* Editor */}
      <section className="flex flex-1 flex-col">
        {/* Tabs */}
        <div className="flex h-11 overflow-x-auto border-b border-white/10 bg-[#16181d]">
          {openFiles.map((file) => (
            <button
              key={file.name}
              onClick={() => setActiveFile(file)}
              className={`flex shrink-0 items-center gap-2 border-r border-white/10 px-4 text-sm ${
                activeFile?.name === file.name
                  ? "bg-[#1f232b] text-white"
                  : "text-gray-400 hover:bg-white/5"
              }`}
            >
              <span>{file.name}</span>
              <X size={13} />
            </button>
          ))}
        </div>

        {/* Editor */}
        <div className="flex-1 overflow-auto p-6">
          {activeFile ? (
            <pre className="whitespace-pre-wrap font-mono text-sm text-gray-300">
              {activeFile.content}
            </pre>
          ) : (
            <div className="flex h-full items-center justify-center text-gray-600">
              Select a file to view its contents.
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default Workspace;