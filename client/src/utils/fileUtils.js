export const getLanguageFromExtension = (filename) => {
  const ext = filename.split('.').pop()?.toLowerCase();
  
  const languageMap = {
    'js': 'javascript',
    'jsx': 'javascript',
    'ts': 'typescript',
    'tsx': 'typescript',
    'css': 'css',
    'html': 'html',
    'htm': 'html',
    'json': 'json',
    'md': 'markdown',
    'py': 'python',
    'txt': 'text',
    'xml': 'xml',
    'yaml': 'yaml',
    'yml': 'yaml',
  };
  
  return languageMap[ext] || 'text';
};

export const getFileIcon = (filename) => {
  const ext = filename.split('.').pop()?.toLowerCase();
  
  const iconMap = {
    'js': '📄',
    'jsx': '📄',
    'ts': '📘',
    'tsx': '📘',
    'css': '🎨',
    'html': '🌐',
    'htm': '🌐',
    'json': '📋',
    'md': '📝',
    'py': '🐍',
    'txt': '📄',
    'xml': '📄',
    'yaml': '⚙️',
    'yml': '⚙️',
  };
  
  return iconMap[ext] || '📄';
};

export const validateFileName = (filename) => {
  if (!filename || filename.trim().length === 0) {
    return { valid: false, error: 'Filename cannot be empty' };
  }
  
  // Check for invalid characters
  const invalidChars = /[<>:"/\\|?*]/;
  if (invalidChars.test(filename)) {
    return { valid: false, error: 'Filename contains invalid characters' };
  }
  
  // Check length
  if (filename.length > 255) {
    return { valid: false, error: 'Filename is too long' };
  }
  
  return { valid: true };
};

export const downloadFile = (filename, content, mimeType = 'text/plain') => {
  const element = document.createElement('a');
  const file = new Blob([content], { type: mimeType });
  element.href = URL.createObjectURL(file);
  element.download = filename;
  document.body.appendChild(element);
  element.click();
  document.body.removeChild(element);
};
