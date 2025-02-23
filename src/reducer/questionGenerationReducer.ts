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

export type ContextBlockType = {
  topics: Topic[];
  subtopics: Subtopic[];
  selectedTopic: string;
  selectedSubtopic: string;
  inputPath: { [key: string]: any };
  algoVariables: Variable;
  inputVariables: Variable;
  quantifiables: Quantifiable[];
  selectedQuantifiables: { [key: string]: string };
  selectedSubclasses: { [key: string]: string };
  variableArguments: { [key: string]: { [arg: string]: any } };
  argumentsInit?: { [key: string]: { [arg: string]: any } };
  inputVariableArguments: { [key: string]: { [arg: string]: any } };
  inputInit?: { [key: string]: { [arg: string]: any } };
  userAlgoCode?: string;
  userEnvCode?: string;
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
    selectedTopic: '',
    selectedSubtopic: '',
    inputPath: {},
    algoVariables: [],
    inputVariables: [],
    quantifiables: [],
    selectedQuantifiables: {},
    selectedSubclasses: {},
    variableArguments: {},
    argumentsInit: {},
    inputVariableArguments: {},
    inputInit: {},
    userAlgoCode: '',
    userEnvCode: '',
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
        selectedTopic: '',
        selectedSubtopic: '',
        inputPath: {},
        algoVariables: [],
        inputVariables: [],
        quantifiables: [],
        selectedQuantifiables: {},
        selectedSubclasses: {},
        variableArguments: {},
        argumentsInit: {},
        inputVariableArguments: {},
        inputInit: {},
        userAlgoCode: '',
        userEnvCode: '',
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
  | { type: 'SET_FIELD'; field: keyof QuestionBlock; value: any }
  | { type: 'SET_CONTEXT_FIELD'; field: keyof ContextBlockType; value: any }
  | { type: 'SET_ALGO_VARIABLES'; algoVariables: Variable }
  | { type: 'SET_QUANTIFIABLES'; quantifiables: Quantifiable[] }
  | { type: 'SET_GENERATED_QUESTIONS'; generatedQuestions: GenerateQuestionResponse }
  | { type: 'SET_SUB_QUESTION_FIELD'; index: number; field: keyof SubQuestionType; value: any }
  | { type: 'SET_SUB_QUESTION_CONTEXT_FIELD'; index: number; field: keyof ContextBlockType; value: any }
  | { type: 'ADD_SUB_QUESTION' }
  | { type: 'REMOVE_SUB_QUESTION'; index: number }
  | { type: 'RESET_STATE' };

export const reducer = (state: QuestionBlock, action: Action): QuestionBlock => {
  switch (action.type) {
    case 'SET_FIELD':
      return { ...state, [action.field]: action.value };
    case 'SET_CONTEXT_FIELD':
      return { ...state, context: { ...state.context, [action.field]: action.value } };
    case 'SET_ALGO_VARIABLES':
      return { ...state, context: { ...state.context, algoVariables: action.algoVariables } };
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
              selectedTopic: '',
              selectedSubtopic: '',
              inputPath: {},
              algoVariables: [],
              inputVariables: [],
              quantifiables: [],
              selectedQuantifiables: {},
              selectedSubclasses: {},
              variableArguments: {},
              argumentsInit: {},
              inputVariableArguments: {},
              inputInit: {},
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
      return initialState;
    default:
      return state;
  }
};