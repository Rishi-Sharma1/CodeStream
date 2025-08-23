import { Plus, Download, Save, Trash2, FileText } from 'lucide-react';
import { useEditor } from '../context/EditorContext';
import { fileService } from '../services/fileService';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';

const getFileIcon = (fileName) => {
  const ext = fileName.split('.').pop()?.toLowerCase();
  const iconColors = {
    js: 'text-github-primary',
    jsx: 'text-github-primary',
    ts: 'text-github-primary',
    tsx: 'text-github-primary',
    css: 'text-blue-400',
    html: 'text-orange-400',
    json: 'text-github-warning',
    md: 'text-github-accent',
    py: 'text-github-success',
    default: 'text-github-text-secondary'
  };
  
  return iconColors[ext] || iconColors.default;
};

export default function FileExplorer() {
  const { 
    files, 
    openFiles, 
    activeFile, 
    currentRoom, 
    openFile, 
    deleteFile, 
    toggleNewFileModal 
  } = useEditor();
  const { toast } = useToast();

  const handleFileClick = (file) => {
    openFile(file);
  };

  const handleDeleteFile = async (fileId, fileName) => {
    try {
      await fileService.deleteFile(fileId);
      deleteFile(fileId);
      toast({
        title: "File deleted",
        description: `${fileName} has been deleted successfully`,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete file",
        variant: "destructive",
      });
    }
  };

  const handleDownloadFile = (file) => {
    const element = document.createElement('a');
    const fileBlob = new Blob([file.content], { type: 'text/plain' });
    element.href = URL.createObjectURL(fileBlob);
    element.download = file.name;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  const saveAllFiles = async () => {
    try {
      await Promise.all(
        openFiles.map(file => fileService.updateFile(file.id, file.content))
      );
      toast({
        title: "Files saved",
        description: "All open files have been saved successfully",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save some files",
        variant: "destructive",
      });
    }
  };

  const downloadProject = () => {
    const projectData = {
      roomId: currentRoom?.id,
      files: files.map(file => ({
        name: file.name,
        content: file.content,
        language: file.language
      }))
    };
    
    const element = document.createElement('a');
    const fileBlob = new Blob([JSON.stringify(projectData, null, 2)], { type: 'application/json' });
    element.href = URL.createObjectURL(fileBlob);
    element.download = `project-${currentRoom?.id}.json`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  return (
    <>
      {/* File List */}
      <div className="flex-1 overflow-y-auto p-3">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-medium text-github-text-secondary uppercase tracking-wide">
            Project Files
          </h3>
          <button
            onClick={toggleNewFileModal}
            className="text-github-text-secondary hover:text-github-text p-1"
            title="New file"
            data-testid="button-new-file"
          >
            <Plus size={14} />
          </button>
        </div>

        <div className="space-y-1">
          {files.map((file) => (
            <div
              key={file.id}
              onClick={() => handleFileClick(file)}
              className={`flex items-center space-x-2 p-2 rounded cursor-pointer group transition-colors ${
                activeFile?.id === file.id ? 'bg-github-bg' : 'hover:bg-github-bg'
              }`}
              data-testid={`file-item-${file.id}`}
            >
              <FileText size={16} className={getFileIcon(file.name)} />
              <span className="text-sm flex-1 text-github-text">{file.name}</span>
              <div className="opacity-0 group-hover:opacity-100 flex space-x-1">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDownloadFile(file);
                  }}
                  className="text-github-text-secondary hover:text-github-text p-1"
                  title="Download"
                  data-testid={`button-download-${file.id}`}
                >
                  <Download size={12} />
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDeleteFile(file.id, file.name);
                  }}
                  className="text-github-text-secondary hover:text-github-danger p-1"
                  title="Delete"
                  data-testid={`button-delete-${file.id}`}
                >
                  <Trash2 size={12} />
                </button>
              </div>
            </div>
          ))}
          
          {files.length === 0 && (
            <div className="text-center py-8 text-github-text-secondary">
              <FileText size={48} className="mx-auto mb-4 opacity-50" />
              <p className="text-sm">No files yet</p>
              <p className="text-xs mt-1">Create your first file to get started</p>
            </div>
          )}
        </div>
      </div>

      {/* Room Actions */}
      <div className="p-3 border-t border-github-border space-y-2">
        <Button
          onClick={saveAllFiles}
          variant="outline"
          className="w-full bg-github-bg hover:bg-gray-700 border-github-border text-github-text"
          data-testid="button-save-all"
        >
          <Save size={16} className="mr-2" />
          Save All Files
        </Button>
        <Button
          onClick={downloadProject}
          className="w-full bg-github-success hover:bg-green-700 text-white"
          data-testid="button-download-project"
        >
          <Download size={16} className="mr-2" />
          Download Project
        </Button>
      </div>
    </>
  );
}
