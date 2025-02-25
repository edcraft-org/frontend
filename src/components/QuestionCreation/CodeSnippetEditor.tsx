import React from 'react';
import { Box, Typography } from '@mui/material';
import Editor from '@monaco-editor/react';

interface CodeSnippetEditorProps {
  codeSnippet: string;
  setCodeSnippet: (code: string) => void;
  title: string;
}

const CodeSnippetEditor: React.FC<CodeSnippetEditorProps> = ({ codeSnippet, setCodeSnippet, title }) => {

  return (
    <Box sx={{ marginBottom: 2 }}>
      <Typography variant="subtitle1" sx={{ marginBottom: 2 }}>
        {title}
      </Typography>
      <Box sx={{ marginBottom: 2, border: '1px solid #ccc', borderRadius: '4px' }}>
        <Editor
          height="300px"
          defaultLanguage="python"
          value={codeSnippet}
          onChange={(value) => setCodeSnippet(value || "")}
          theme="vs-dark"
          options={{
            folding: true,
            foldingStrategy: 'auto',
            foldingImportsByDefault: true,
            inlineSuggest: { enabled: true },
            fontSize: 16,
            formatOnType: true,
            autoClosingBrackets: 'always',
            minimap: { scale: 10 }
          }}
        />
      </Box>
    </Box>
  );
};

export default CodeSnippetEditor;
