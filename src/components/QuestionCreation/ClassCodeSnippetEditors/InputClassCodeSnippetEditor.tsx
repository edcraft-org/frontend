import React, { useEffect } from 'react';
import CodeSnippetEditor from '../CodeSnippetEditor';

interface InputCodeSnippetEditorProps {
  setInputCodeSnippet: (code: string) => void;
  setInputCodeRequiredLines: (lines: string[]) => void;
}

const inputClassTemplate = `from question_generation.input.input_class import Input

class InputEnv(Input):
`;

const inputClassRequiredLines: string[] = [];

const InputClassCodeSnippetEditor: React.FC<InputCodeSnippetEditorProps> = ({ setInputCodeSnippet, setInputCodeRequiredLines }) => {
  useEffect(() => {
    setInputCodeSnippet(inputClassTemplate);
    setInputCodeRequiredLines(inputClassRequiredLines);
  }, []);

  return (
    <CodeSnippetEditor
      codeSnippet = {inputClassTemplate}
      setCodeSnippet={setInputCodeSnippet}
      title="Input class"
    />
  );
};

export default InputClassCodeSnippetEditor;
