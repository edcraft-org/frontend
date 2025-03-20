import { GenerateQuestionResponse } from '../utils/api/QuestionAPI';
import { Topic, Subtopic, Queryable, Variable, Quantifiable } from '../utils/api/QuestionGenerationAPI';

export type SubQuestionType = {
  description: string;
  context: ContextBlockType;
  marks: number;
  numOptions: number;
  queryables: Queryable[];
  inputQueryables: Queryable[];
  selectedQueryable: Queryable;
  selectedInputQueryable: Queryable;
  queryVariables: Variable;
  inputQueryVariables: Variable;
  userQueryableCode?: string;
  requiredLines: string[];
};

export type AlgoDetailsType = {
  selectedTopic: string;
  selectedSubtopic: string;
  selectedQuantifiables: { [key: string]: string };
  selectedSubclasses: { [key: string]: string };
  algoVariables: Variable;
  variableArguments: { [key: string]: { [arg: string]: unknown } };
  argumentsInit?: { [key: string]: { [arg: string]: unknown } };
  userEnvCode?: string[];
  userAlgoCode?: string;
};

export type InputDetailsType = {
  inputPath: { [key: string]: unknown };
  inputVariables: Variable;
  inputVariableArguments: { [key: string]: { [arg: string]: unknown } };
  inputInit?: { [key: string]: { [arg: string]: unknown } };
  selectedQuantifiables?: { [key: string]: string };
  userEnvCode?: string;
}

export type Detail = {
  type: 'algo' | 'input';
  details: AlgoDetailsType | InputDetailsType;
};

export type ContextBlockType = {
  topics: Topic[];
  subtopics: Subtopic[];
  quantifiables: Quantifiable[];
  details: Detail[]
  selectedDetail?: Detail
};

export type QuestionBlock = {
  description: string;
  context: ContextBlockType;
  queryables: Queryable[];
  inputQueryables: Queryable[];
  userQueryableCode?: string;
  subQuestions: SubQuestionType[];
  loading: boolean;
  tabValue: number;
  generatedQuestions: GenerateQuestionResponse;
};

export const initialState: QuestionBlock = {
  description: '',
  context: {
    topics: [],
    subtopics: [],
    quantifiables: [],
    details: [],
  },
  queryables: [],
  inputQueryables: [],
  userQueryableCode: '',
  subQuestions: [
    {
      description: '',
      context: {
        topics: [],
        subtopics: [],
        quantifiables: [],
        details: [],
      },
      marks: 1,
      numOptions: 4,
      queryables: [],
      inputQueryables: [],
      userQueryableCode: '',
      selectedQueryable: '',
      selectedInputQueryable: '',
      queryVariables: [],
      inputQueryVariables: [],
      requiredLines: [],
    },
  ],
  loading: false,
  tabValue: 0,
  generatedQuestions: { description: '', subquestions: [] },
};

export type Action =
  | { type: 'SET_FIELD'; field: keyof QuestionBlock; value: unknown }
  | { type: 'SET_CONTEXT_FIELD'; field: keyof ContextBlockType; value: unknown }
  | { type: 'SET_QUANTIFIABLES'; quantifiables: Quantifiable[] }
  | { type: 'SET_GENERATED_QUESTIONS'; generatedQuestions: GenerateQuestionResponse }
  | { type: 'SET_SUB_QUESTION_FIELD'; index: number; field: keyof SubQuestionType; value: unknown }
  | { type: 'SET_SUB_QUESTION_CONTEXT_FIELD'; index: number; field: keyof ContextBlockType; value: unknown }
  | { type: 'SET_SUB_QUESTION_CONTEXT_INPUT_DETAILS'; index: number; field: keyof InputDetailsType; value: unknown }
  | { type: 'ADD_SUB_QUESTION' }
  | { type: 'REMOVE_SUB_QUESTION'; index: number }
  | { type: 'RESET_STATE' };

export const reducer = (state: QuestionBlock, action: Action): QuestionBlock => {
  switch (action.type) {
    case 'SET_FIELD':
      return { ...state, [action.field]: action.value };
    case 'SET_CONTEXT_FIELD':
      return { ...state, context: { ...state.context, [action.field]: action.value } };
    case 'SET_QUANTIFIABLES':
      return { ...state, context: { ...state.context, quantifiables: action.quantifiables } };
    case 'SET_GENERATED_QUESTIONS':
      return { ...state, generatedQuestions: action.generatedQuestions };
    case 'SET_SUB_QUESTION_FIELD': {
      const updatedSubQuestions = [...state.subQuestions];
      updatedSubQuestions[action.index] = { ...updatedSubQuestions[action.index], [action.field]: action.value };
      return { ...state, subQuestions: updatedSubQuestions };
    }
    case 'SET_SUB_QUESTION_CONTEXT_FIELD': {
      const updatedSubQuestionsWithContext = [...state.subQuestions];
      updatedSubQuestionsWithContext[action.index] = {
        ...updatedSubQuestionsWithContext[action.index],
        context: { ...updatedSubQuestionsWithContext[action.index].context, [action.field]: action.value },
      };
      return { ...state, subQuestions: updatedSubQuestionsWithContext };
    }
    case 'SET_SUB_QUESTION_CONTEXT_INPUT_DETAILS': {
      const updatedSubQuestionsWithContext = [...state.subQuestions];
      updatedSubQuestionsWithContext[action.index] = {
        ...updatedSubQuestionsWithContext[action.index],
        context: {
          ...updatedSubQuestionsWithContext[action.index].context,
          details: updatedSubQuestionsWithContext[action.index].context.details.map((detail, i) =>
            i === action.index ? { ...detail, [action.field]: action.value } : detail
          ),
        },
      };
      return { ...state, subQuestions: updatedSubQuestionsWithContext };
    }
    case 'ADD_SUB_QUESTION':
      return {
        ...state,
        subQuestions: [
          ...state.subQuestions,
          {
            description: '',
            context: {
              topics: state.context.topics,
              subtopics: [],
              quantifiables: [],
              details: [],
            },
            marks: 1,
            numOptions: 4,
            queryables: state.queryables,
            inputQueryables: state.inputQueryables,
            selectedQueryable: '',
            selectedInputQueryable: '',
            queryVariables: [],
            inputQueryVariables: [],
            requiredLines: [],
          },
        ],
      };
    case 'REMOVE_SUB_QUESTION': {
      const newSubQuestions = state.subQuestions.filter((_, i) => i !== action.index);
      return {
        ...state,
        subQuestions: newSubQuestions,
      };
    }
    case 'RESET_STATE':
      return { ...initialState, tabValue: state.tabValue };
    default:
      return state;
  }
};