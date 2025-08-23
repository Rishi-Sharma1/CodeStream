import { useEffect, useRef, useState } from 'react';
import { useEditor } from '../context/EditorContext';
import { fileService } from '../services/fileService';
import { useToast } from '@/hooks/use-toast';
import { debounce } from '../utils/codeUtils';

// Simple syntax highlighter for demonstration
const highlightCode = (code, language) => {
  if (language === 'javascript' || language === 'typescript') {
    return code
      .replace(/(const|let|var|function|class|if|else|for|while|return|import|export|from)\b/g, '<span class="text-purple-400">$1</span>')
      .replace(/(['"`])((?:\\.|[^\\])*?)\1/g, '<span class="text-green-300">$1$2$1</span>')
      .replace(/\/\/.*$/gm, '<span class="text-gray-500">$&</span>')
      .replace(/\/\*[\s\S]*?\*\//g, '<span class="text-gray-500">$&</span>')
      .replace(/\b(\d+)\b/g, '<span class="text-orange-400">$1</span>');
  }
  return code;
};

// Simple auto-suggestions for JavaScript
const getJavaScriptSuggestions = (text, cursorPosition) => {
  const textBeforeCursor = text.substring(0, cursorPosition);
  const words = textBeforeCursor.split(/\s+/);
  const currentWord = words[words.length - 1] || '';
  
  const suggestions = [
    { label: 'console.log()', type: 'method', insertText: 'console.log()' },
    { label: 'console.error()', type: 'method', insertText: 'console.error()' },
    { label: 'console.warn()', type: 'method', insertText: 'console.warn()' },
    { label: 'function', type: 'keyword', insertText: 'function ' },
    { label: 'const', type: 'keyword', insertText: 'const ' },
    { label: 'let', type: 'keyword', insertText: 'let ' },
    { label: 'var', type: 'keyword', insertText: 'var ' },
    { label: 'if', type: 'keyword', insertText: 'if () {\n  \n}' },
    { label: 'for', type: 'keyword', insertText: 'for (let i = 0; i < ; i++) {\n  \n}' },
    { label: 'while', type: 'keyword', insertText: 'while () {\n  \n}' },
  ];

  return suggestions.filter(suggestion => 
    suggestion.label.toLowerCase().includes(currentWord.toLowerCase())
  ).slice(0, 5);
};

export default function CodeEditor({ file }) {
  const textareaRef = useRef(null);
  const [content, setContent] = useState(file?.content || '');
  const [cursorPosition, setCursorPosition] = useState({ line: 1, column: 1 });
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [selectedSuggestion, setSelectedSuggestion] = useState(0);
  
  const { updateFile } = useEditor();
  const { toast } = useToast();

  // Debounced save function
  const debouncedSave = useRef(
    debounce(async (fileId, newContent) => {
      try {
        await fileService.updateFile(fileId, newContent);
        updateFile({ ...file, content: newContent });
      } catch (error) {
        toast({
          title: "Save failed",
          description: "Could not save file changes",
          variant: "destructive",
        });
      }
    }, 1000)
  );

  useEffect(() => {
    setContent(file?.content || '');
  }, [file]);

  const handleContentChange = (e) => {
    const newContent = e.target.value;
    setContent(newContent);
    
    // Auto-save
    if (file) {
      debouncedSave.current(file.id, newContent);
    }

    // Update cursor position
    const textarea = e.target;
    const lines = newContent.substring(0, textarea.selectionStart).split('\n');
    setCursorPosition({
      line: lines.length,
      column: lines[lines.length - 1].length + 1
    });

    // Show suggestions for JavaScript files
    if (file?.language === 'javascript' || file?.name?.endsWith('.js')) {
      const suggestions = getJavaScriptSuggestions(newContent, textarea.selectionStart);
      setSuggestions(suggestions);
      setShowSuggestions(suggestions.length > 0 && newContent.length > 0);
      setSelectedSuggestion(0);
    } else {
      setShowSuggestions(false);
    }
  };

  const handleKeyDown = (e) => {
    if (showSuggestions && suggestions.length > 0) {
      if (e.key === 'ArrowDown') {
        e.preventDefault();
        setSelectedSuggestion(prev => (prev + 1) % suggestions.length);
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        setSelectedSuggestion(prev => (prev - 1 + suggestions.length) % suggestions.length);
      } else if (e.key === 'Tab' || e.key === 'Enter') {
        e.preventDefault();
        insertSuggestion(suggestions[selectedSuggestion]);
      } else if (e.key === 'Escape') {
        setShowSuggestions(false);
      }
    }

    // Handle tab indentation
    if (e.key === 'Tab' && !showSuggestions) {
      e.preventDefault();
      const textarea = e.target;
      const start = textarea.selectionStart;
      const end = textarea.selectionEnd;
      const newContent = content.substring(0, start) + '  ' + content.substring(end);
      setContent(newContent);
      
      // Set cursor position after the inserted spaces
      setTimeout(() => {
        textarea.selectionStart = textarea.selectionEnd = start + 2;
      }, 0);
    }
  };

  const insertSuggestion = (suggestion) => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const newContent = content.substring(0, start) + suggestion.insertText + content.substring(end);
    setContent(newContent);
    setShowSuggestions(false);

    // Set cursor position after the inserted text
    setTimeout(() => {
      textarea.selectionStart = textarea.selectionEnd = start + suggestion.insertText.length;
      textarea.focus();
    }, 0);
  };

  if (!file) {
    return (
      <div className="flex-1 bg-github-bg flex items-center justify-center text-github-text-secondary">
        <div className="text-center">
          <i className="fas fa-file-code text-6xl mb-4 opacity-30"></i>
          <p className="text-lg">No file selected</p>
          <p className="text-sm mt-2">Open a file from the sidebar to start editing</p>
        </div>
      </div>
    );
  }

  const lines = content.split('\n');

  return (
    <div className="flex-1 relative bg-github-bg" data-testid="code-editor">
      <div className="absolute inset-0 flex">
        {/* Line Numbers */}
        <div className="w-12 bg-github-surface border-r border-github-border flex flex-col text-github-text-secondary text-sm font-mono overflow-hidden">
          {lines.map((_, index) => (
            <div
              key={index}
              className={`px-2 py-1 text-right leading-6 ${
                index + 1 === cursorPosition.line ? 'bg-github-bg text-github-text' : ''
              }`}
            >
              {index + 1}
            </div>
          ))}
        </div>
        
        {/* Editor Content */}
        <div className="flex-1 relative">
          <textarea
            ref={textareaRef}
            value={content}
            onChange={handleContentChange}
            onKeyDown={handleKeyDown}
            className="absolute inset-0 w-full h-full p-4 font-mono text-sm bg-transparent text-github-text resize-none outline-none leading-6"
            placeholder={`Start typing in ${file.name}...`}
            spellCheck="false"
            data-testid="code-textarea"
          />
          
          {/* Syntax highlighting overlay */}
          <div
            className="absolute inset-0 p-4 font-mono text-sm pointer-events-none leading-6 whitespace-pre-wrap overflow-hidden"
            dangerouslySetInnerHTML={{
              __html: highlightCode(content, file.language || 'javascript')
            }}
            style={{ color: 'transparent' }}
          />
        </div>
      </div>

      {/* Auto-suggestions */}
      {showSuggestions && suggestions.length > 0 && (
        <div 
          className="absolute bg-github-surface border border-github-border rounded shadow-xl z-10 w-64"
          style={{ 
            top: (cursorPosition.line * 24) + 100, 
            left: Math.min(cursorPosition.column * 8 + 50, window.innerWidth - 300)
          }}
          data-testid="suggestions-popup"
        >
          <div className="p-2">
            <div className="text-xs text-github-text-secondary mb-2">Suggestions</div>
            <div className="space-y-1">
              {suggestions.map((suggestion, index) => (
                <div
                  key={index}
                  onClick={() => insertSuggestion(suggestion)}
                  className={`flex items-center p-2 rounded text-sm cursor-pointer ${
                    index === selectedSuggestion ? 'bg-github-primary' : 'hover:bg-github-bg'
                  }`}
                  data-testid={`suggestion-${index}`}
                >
                  <i className="fas fa-cube mr-2 text-xs"></i>
                  <span className="flex-1">{suggestion.label}</span>
                  <span className="text-xs text-github-text-secondary">{suggestion.type}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
