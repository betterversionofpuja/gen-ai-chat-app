import { memo, useState, useCallback } from "react";
import {
  ChevronDown,
  ChevronRight,
  Folder,
  FolderOpen,
  FileCode2,
  Search,
  MoreHorizontal,
  X,
} from "lucide-react";

const Workspace = ({ fileTree = {} }) => {
  const [openFiles, setOpenFiles] = useState([]);
  const [activeFile, setActiveFile] = useState(null);

  const [expandedFolders, setExpandedFolders] = useState({
    project: true,
  });

  const toggleFolder = (path) => {
    setExpandedFolders((prev) => ({
      ...prev,
      [path]: !prev[path],
    }));
  };

  const openFile = useCallback((name, contents) => {
    const file = {
      name,
      content: contents,
    };

    setOpenFiles((prev) => {
      if (prev.some((f) => f.name === name)) {
        return prev;
      }

      return [...prev, file];
    });

    setActiveFile(file);
  }, []);

  const renderTree = useCallback(
    (tree, path = "") => {
      if (!tree || typeof tree !== "object") return null;

      return Object.entries(tree).map(([name, value]) => {
        const currentPath = path ? `${path}/${name}` : name;

        // File
        if (value?.file) {
          return (
            <div
              key={currentPath}
              onClick={() => openFile(currentPath, value.file.contents)}
              className="ml-5 flex cursor-pointer items-center gap-2 rounded px-2 py-1 text-gray-300 hover:bg-white/5"
            >
              <FileCode2 size={15} className="text-gray-400" />
              <span>{name}</span>
            </div>
          );
        }

        if (!value || typeof value !== "object") return null;

        const expanded = expandedFolders[currentPath];

        return (
          <div key={currentPath} className="ml-4">
            <div
              onClick={() => toggleFolder(currentPath)}
              className="flex cursor-pointer items-center gap-1 rounded px-2 py-1 text-white hover:bg-white/5"
            >
              {expanded ? (
                <ChevronDown size={14} />
              ) : (
                <ChevronRight size={14} />
              )}

              {expanded ? (
                <FolderOpen size={16} className="text-blue-400" />
              ) : (
                <Folder size={16} className="text-blue-400" />
              )}

              <span>{name}</span>
            </div>

            {expanded && (
              <div className="ml-4 border-l border-white/10 pl-2">
                {renderTree(value, currentPath)}
              </div>
            )}
          </div>
        );
      });
    },
    [expandedFolders, openFile]
  );

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
          {/* Root Project */}

          <div
            onClick={() => toggleFolder("project")}
            className="flex cursor-pointer items-center gap-1 rounded px-2 py-1 text-white hover:bg-white/5"
          >
            {expandedFolders.project ? (
              <ChevronDown size={14} />
            ) : (
              <ChevronRight size={14} />
            )}

            {expandedFolders.project ? (
              <FolderOpen size={17} className="text-blue-400" />
            ) : (
              <Folder size={17} className="text-blue-400" />
            )}

            <span className="font-medium">project</span>
          </div>

          {expandedFolders.project && (
            <div className="ml-4 border-l border-white/10 pl-3">
              {renderTree(fileTree)}
            </div>
          )}
        </div>
      </aside>

      {/* Editor */}
      <section className="flex flex-1 flex-col">
        <div className="flex h-11 overflow-x-auto border-b border-white/10 bg-[#16181d]">
          {openFiles.map((file) => (
            <button
              key={file.name}
              onClick={() => setActiveFile(file)}
              className={`flex shrink-0 items-center gap-2 border-r border-white/10 px-4 text-sm ${activeFile?.name === file.name
                  ? "bg-[#1f232b] text-white"
                  : "text-gray-400 hover:bg-white/5"
                }`}
            >
              <span>{file.name}</span>
              <X size={13} />
            </button>
          ))}
        </div>

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

export default memo(Workspace);