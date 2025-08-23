import { useState } from 'react';
import { X } from 'lucide-react';
import { useEditor } from '../context/EditorContext';
import { fileService } from '../services/fileService';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

const fileTypes = [
  { label: 'JavaScript (.js)', value: 'javascript', extension: '.js' },
  { label: 'TypeScript (.ts)', value: 'typescript', extension: '.ts' },
  { label: 'React (.jsx)', value: 'javascript', extension: '.jsx' },
  { label: 'TypeScript React (.tsx)', value: 'typescript', extension: '.tsx' },
  { label: 'CSS (.css)', value: 'css', extension: '.css' },
  { label: 'HTML (.html)', value: 'html', extension: '.html' },
  { label: 'JSON (.json)', value: 'json', extension: '.json' },
  { label: 'Markdown (.md)', value: 'markdown', extension: '.md' },
  { label: 'Python (.py)', value: 'python', extension: '.py' },
  { label: 'Text (.txt)', value: 'text', extension: '.txt' },
];

const getTemplate = (fileType) => {
  const templates = {
    javascript: '// JavaScript file\nconsole.log("Hello, World!");',
    typescript: '// TypeScript file\nconst message: string = "Hello, World!";\nconsole.log(message);',
    css: '/* CSS Stylesheet */\nbody {\n  margin: 0;\n  padding: 0;\n  font-family: Arial, sans-serif;\n}',
    html: '<!DOCTYPE html>\n<html lang="en">\n<head>\n  <meta charset="UTF-8">\n  <meta name="viewport" content="width=device-width, initial-scale=1.0">\n  <title>Document</title>\n</head>\n<body>\n  <h1>Hello, World!</h1>\n</body>\n</html>',
    json: '{\n  "name": "project",\n  "version": "1.0.0",\n  "description": ""\n}',
    markdown: '# New Document\n\nThis is a new markdown document.',
    python: '# Python file\nprint("Hello, World!")',
    text: 'New text file',
  };
  return templates[fileType] || '';
};

export default function NewFileModal() {
  const [fileName, setFileName] = useState('');
  const [selectedType, setSelectedType] = useState(fileTypes[0]);
  const [isCreating, setIsCreating] = useState(false);
  
  const { currentRoom, addFile, openFile, toggleNewFileModal } = useEditor();
  const { toast } = useToast();

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!fileName.trim()) {
      toast({
        title: "Error",
        description: "Please enter a file name",
        variant: "destructive",
      });
      return;
    }

    if (!currentRoom) {
      toast({
        title: "Error",
        description: "No active room found",
        variant: "destructive",
      });
      return;
    }

    setIsCreating(true);

    try {
      const finalFileName = fileName.endsWith(selectedType.extension) 
        ? fileName 
        : fileName + selectedType.extension;

      const fileData = {
        name: finalFileName,
        content: getTemplate(selectedType.value),
        language: selectedType.value,
        roomId: currentRoom.id,
      };

      const newFile = await fileService.createFile(fileData);
      addFile(newFile);
      openFile(newFile);
      toggleNewFileModal();
      
      toast({
        title: "File created",
        description: `${finalFileName} has been created successfully`,
      });

      // Reset form
      setFileName('');
      setSelectedType(fileTypes[0]);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create file",
        variant: "destructive",
      });
    } finally {
      setIsCreating(false);
    }
  };

  const handleClose = () => {
    setFileName('');
    setSelectedType(fileTypes[0]);
    toggleNewFileModal();
  };

  return (
    <div 
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
      data-testid="new-file-modal"
    >
      <div className="bg-github-surface border border-github-border rounded-lg p-6 w-96">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-github-text">Create New File</h3>
          <button
            onClick={handleClose}
            className="text-github-text-secondary hover:text-github-text"
            data-testid="button-close-modal"
          >
            <X size={20} />
          </button>
        </div>
        
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <Label htmlFor="fileName" className="block text-sm font-medium mb-2 text-github-text">
              File Name
            </Label>
            <Input
              id="fileName"
              type="text"
              placeholder="example.js"
              value={fileName}
              onChange={(e) => setFileName(e.target.value)}
              className="w-full bg-github-bg border-github-border text-github-text focus:ring-github-primary"
              data-testid="input-file-name"
            />
          </div>
          
          <div className="mb-6">
            <Label htmlFor="fileType" className="block text-sm font-medium mb-2 text-github-text">
              File Type
            </Label>
            <select
              id="fileType"
              value={selectedType.value}
              onChange={(e) => {
                const type = fileTypes.find(t => t.value === e.target.value);
                setSelectedType(type || fileTypes[0]);
              }}
              className="w-full bg-github-bg border border-github-border rounded px-3 py-2 text-sm text-github-text focus:outline-none focus:ring-2 focus:ring-github-primary"
              data-testid="select-file-type"
            >
              {fileTypes.map((type) => (
                <option key={type.value + type.extension} value={type.value}>
                  {type.label}
                </option>
              ))}
            </select>
          </div>
          
          <div className="flex justify-end space-x-3">
            <Button
              type="button"
              variant="ghost"
              onClick={handleClose}
              className="text-github-text-secondary hover:text-github-text"
              data-testid="button-cancel"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isCreating}
              className="bg-github-primary hover:bg-blue-600 text-white"
              data-testid="button-create-file"
            >
              {isCreating ? 'Creating...' : 'Create File'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
