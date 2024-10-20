import React from 'react';
import CodeSnippetEditor from '../CodeSnippetEditor';

interface QueryableCodeSnippetEditorProps {
    setQueryableCodeSnippet: (code: string) => void;
    setQueryableCodeRequiredLines: (lines: string[]) => void;
}

const queryableClassTemplate = `from typing import Any
from question.queryable_class import QueryableClass


class ClassName(QueryableClass):
    def query_method(self, input: Any) -> Any:
        # User code here
`;

const queryableClassRequiredLines = [
  'from typing import Any',
  'from question.queryable_class import QueryableClass'
];

const QueryableClassCodeSnippetEditor: React.FC<QueryableCodeSnippetEditorProps> = ({ setQueryableCodeSnippet, setQueryableCodeRequiredLines}) => {
  setQueryableCodeSnippet(queryableClassTemplate);
  setQueryableCodeRequiredLines(queryableClassRequiredLines);

  return (
    <CodeSnippetEditor
      codeSnippet = {queryableClassTemplate}
      setCodeSnippet={setQueryableCodeSnippet}
      title="QueryableClass"
    />
  );
};

export default QueryableClassCodeSnippetEditor;
