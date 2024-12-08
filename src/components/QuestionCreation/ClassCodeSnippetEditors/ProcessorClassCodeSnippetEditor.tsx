import React from 'react';
import CodeSnippetEditor from '../CodeSnippetEditor';

interface ProcessorCodeSnippetEditorProps {
  setProcessorCodeSnippet: (code: string) => void;
  setProcessorCodeRequiredLines: (lines: string[]) => void;
}

const processorClassTemplate = `class ClassName(Algo, Question, Output):
    def algo(self, input):
`;

const processorClassRequiredLines = [];

const ProcessorClassCodeSnippetEditor: React.FC<ProcessorCodeSnippetEditorProps> = ({ setProcessorCodeSnippet, setProcessorCodeRequiredLines }) => {
  setProcessorCodeSnippet(processorClassTemplate);
  setProcessorCodeRequiredLines(processorClassRequiredLines);
  return (
    <CodeSnippetEditor
      codeSnippet = {processorClassTemplate}
      setCodeSnippet={setProcessorCodeSnippet}
      title="ProcessorClass"
    />
  );
};

export default ProcessorClassCodeSnippetEditor;
