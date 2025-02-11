import React, { useEffect } from 'react';
import CodeSnippetEditor from '../CodeSnippetEditor';

interface QueryableCodeSnippetEditorProps {
    setQueryableCodeSnippet: (code: string) => void;
    setQueryableCodeRequiredLines: (lines: string[]) => void;
}
const queryableClassTemplate = `class SampleQueryable(Queryable):
    def query_method(self, input: Any) -> Any:
        # User code here
`;

const queryableClassRequiredLines: string[] = [];

const QueryableClassCodeSnippetEditor: React.FC<QueryableCodeSnippetEditorProps> = ({ setQueryableCodeSnippet, setQueryableCodeRequiredLines}) => {
  useEffect(() => {
    setQueryableCodeSnippet(queryableClassTemplate);
    setQueryableCodeRequiredLines(queryableClassRequiredLines);
  }, []);

  return (
    <CodeSnippetEditor
      codeSnippet = {queryableClassTemplate}
      setCodeSnippet={setQueryableCodeSnippet}
      title="QueryableClass"
    />
  );
};

export default QueryableClassCodeSnippetEditor;
