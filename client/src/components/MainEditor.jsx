import { X, Plus, Search, Wand2, AlignLeft } from 'lucide-react';
import { useEditor } from '../context/EditorContext';
import { Button } from '@/components/ui/button';
import CodeEditor from './CodeEditor';
import { getLanguageFromExtension } from '../utils/fileUtils';

export default function MainEditor() {
  const { openFiles, activeFile, closeFile, setActiveFile, connectionStatus } = useEditor();

  const handleTabClick = (file) => {
    setActiveFile(file);
  };

  const handleCloseFile = (fileId) => {
    closeFile(fileId);
  };

  const formatCode = () => {
    // TODO: Implement code formatting
    console.log('Format code');
  };

  const toggleWordWrap = () => {
    // TODO: Implement word wrap toggle
    console.log('Toggle word wrap');
  };

  const findReplace = () => {
    // TODO: Implement find & replace
    console.log('Find & Replace');
  };

  return (
    <main className="flex-1 flex flex-col" data-testid="main-editor">
      {/* Editor Tabs */}
      <div className="bg-github-surface border-b border-github-border flex items-center overflow-x-auto">
        <div className="flex">
          {openFiles.map((file) => (
            <div
              key={file.id}
              onClick={() => handleTabClick(file)}
              className={`flex items-center min-w-max cursor-pointer group border-r border-github-border px-4 py-2 ${
                activeFile?.id === file.id
                  ? 'bg-github-bg text-github-text'
                  : 'text-github-text-secondary hover:bg-github-bg hover:text-github-text'
              } transition-colors`}
              data-testid={`tab-${file.id}`}
            >
              <i className="fas fa-file-code text-sm mr-2"></i>
              <span className="text-sm">{file.name}</span>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleCloseFile(file.id);
                }}
                className="ml-2 text-github-text-secondary hover:text-github-text opacity-0 group-hover:opacity-100 transition-opacity"
                data-testid={`button-close-tab-${file.id}`}
              >
                <X size={14} />
              </button>
            </div>
          ))}
        </div>
        
        {openFiles.length === 0 && (
          <div className="flex-1 flex items-center justify-center py-8 text-github-text-secondary">
            <div className="text-center">
              <i className="fas fa-file-code text-4xl mb-4 opacity-50"></i>
              <p>No files open</p>
              <p className="text-sm mt-1">Select a file from the sidebar to start editing</p>
            </div>
          </div>
        )}
      </div>

      {activeFile && (
        <>
          {/* Editor Toolbar */}
          <div className="bg-github-surface border-b border-github-border px-4 py-2 flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <select 
                  className="bg-github-bg border border-github-border rounded px-2 py-1 text-sm text-github-text focus:outline-none focus:ring-2 focus:ring-github-primary"
                  value={activeFile.language || 'javascript'}
                  onChange={(e) => {
                    // TODO: Update file language
                    console.log('Language changed:', e.target.value);
                  }}
                  data-testid="language-selector"
                >
                  <option value="javascript">JavaScript</option>
                  <option value="typescript">TypeScript</option>
                  <option value="python">Python</option>
                  <option value="html">HTML</option>
                  <option value="css">CSS</option>
                  <option value="json">JSON</option>
                  <option value="markdown">Markdown</option>
                </select>
              </div>
              <div className="h-4 w-px bg-github-border"></div>
              <div className="flex items-center space-x-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={formatCode}
                  className="p-1 text-github-text-secondary hover:text-github-text"
                  title="Format code"
                  data-testid="button-format"
                >
                  <Wand2 size={16} />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={toggleWordWrap}
                  className="p-1 text-github-text-secondary hover:text-github-text"
                  title="Toggle word wrap"
                  data-testid="button-word-wrap"
                >
                  <AlignLeft size={16} />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={findReplace}
                  className="p-1 text-github-text-secondary hover:text-github-text"
                  title="Find & Replace"
                  data-testid="button-find-replace"
                >
                  <Search size={16} />
                </Button>
              </div>
            </div>
            
            <div className="flex items-center space-x-2 text-sm text-github-text-secondary">
              <span data-testid="cursor-position">Line 1, Column 1</span>
              <span>•</span>
              <span>UTF-8</span>
              <span>•</span>
              <span className="flex items-center">
                <div className={`w-2 h-2 rounded-full mr-1 ${
                  connectionStatus === 'connected' ? 'bg-github-success' : 'bg-github-danger'
                }`}></div>
                {connectionStatus === 'connected' ? 'Connected' : 'Disconnected'}
              </span>
            </div>
          </div>

          {/* Code Editor */}
          <CodeEditor file={activeFile} />
        </>
      )}
    </main>
  );
}
