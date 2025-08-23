export const debounce = (func, delay) => {
  let timeoutId;
  return function (...args) {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => func.apply(this, args), delay);
  };
};

export const throttle = (func, limit) => {
  let inThrottle;
  return function (...args) {
    if (!inThrottle) {
      func.apply(this, args);
      inThrottle = true;
      setTimeout(() => (inThrottle = false), limit);
    }
  };
};

export const formatCode = (code, language) => {
  // Basic code formatting - in a real app, you'd use a proper formatter
  switch (language) {
    case 'javascript':
    case 'typescript':
      return formatJavaScript(code);
    case 'json':
      try {
        return JSON.stringify(JSON.parse(code), null, 2);
      } catch {
        return code;
      }
    default:
      return code;
  }
};

const formatJavaScript = (code) => {
  // Very basic formatting - in production, use prettier or similar
  return code
    .replace(/;/g, ';\n')
    .replace(/\{/g, '{\n  ')
    .replace(/\}/g, '\n}')
    .replace(/,/g, ',\n  ')
    .split('\n')
    .map(line => line.trim())
    .filter(line => line.length > 0)
    .join('\n');
};

export const getIndentation = (text, cursorPosition) => {
  const lines = text.substring(0, cursorPosition).split('\n');
  const currentLine = lines[lines.length - 1];
  const match = currentLine.match(/^(\s*)/);
  return match ? match[1] : '';
};

export const autoIndent = (text, cursorPosition) => {
  const beforeCursor = text.substring(0, cursorPosition);
  const afterCursor = text.substring(cursorPosition);
  const currentIndent = getIndentation(text, cursorPosition);
  
  // Check if we need to increase indentation
  if (beforeCursor.endsWith('{') || beforeCursor.endsWith('[') || beforeCursor.endsWith('(')) {
    return beforeCursor + '\n' + currentIndent + '  ' + afterCursor;
  }
  
  return beforeCursor + '\n' + currentIndent + afterCursor;
};

export const matchBrackets = (text, position) => {
  const brackets = {
    '(': ')',
    '[': ']',
    '{': '}',
    '"': '"',
    "'": "'",
  };
  
  const char = text[position - 1];
  if (brackets[char]) {
    return {
      before: text.substring(0, position),
      insert: brackets[char],
      after: text.substring(position)
    };
  }
  
  return null;
};
