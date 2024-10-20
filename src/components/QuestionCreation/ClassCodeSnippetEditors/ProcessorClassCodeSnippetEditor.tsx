import React from 'react';
import CodeSnippetEditor from '../CodeSnippetEditor';

interface ProcessorCodeSnippetEditorProps {
  setProcessorCodeSnippet: (code: string) => void;
  setProcessorCodeRequiredLines: (lines: string[]) => void;
}

const processorClassTemplate = `from functools import singledispatchmethod
from typing import Any
from question.processor_class import ProcessorClass
from question.queryable_class import QueryableClass
from question.queryable_subclasses.output import OutputQueryableClass
from question.queryable_subclasses.step import StepQueryableClass


class ClassName(ProcessorClass):
    @singledispatchmethod
    @classmethod
    def process_method(cls, queryable: QueryableClass, input: Any) -> Any:
        return super().process_method(queryable, input)

    @process_method.register
    @classmethod
    def _(cls):
        # User code here
`;

const processorClassRequiredLines = [
  'from functools import singledispatchmethod',
  'from typing import Any',
  'from question.processor_class import ProcessorClass',
  'from question.queryable_class import QueryableClass',
  'from question.queryable_subclasses.output import OutputQueryableClass',
  'from question.queryable_subclasses.step import StepQueryableClass'
];

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
