import { useContext, useState } from 'react';
import { Box, Typography, Button, Alert } from '@mui/material';
import { generateQuestion, GenerateQuestionRequest } from '../../utils/api/QuestionGenerationAPI';
import QuestionCreation from './QuestionCreation';
import { createQuestion, NewQuestion } from '../../utils/api/QuestionAPI';
import { addExistingQuestionToAssessment } from '../../utils/api/AssessmentAPI';
import { addExistingQuestionToQuestionBank } from '../../utils/api/QuestionBankAPI';
import { AuthContext } from '../../context/Authcontext';
import { convertArguments, convertInputArguments } from '../../utils/format';
import CodeBlock from './QuestionGeneration/CodeBlock';
import SubQuestion from './QuestionGeneration/SubQuestion';
import useQuestionGeneration from '../../hooks/useQuestionGeneration';
import { AlgoDetailsType, initialState, InputDetailsType } from '../../reducer/questionGenerationReducer';

interface QuestionGenerationProps {
  project: { id: string, title: string };
  assessmentId?: string;
  questionBankId?: string;
}

const QuestionGeneration: React.FC<QuestionGenerationProps> = ({
  project,
  assessmentId,
  questionBankId
}) => {

  const {
    state,
    dispatch,
    handleSubQuestionQueryableChange,
    handleSubQuestionInputQueryableChange,
    handleTopicChange,
    handleSubtopicChange,
    handleInputPathChange,
    handleQuantifiableChange,
    handleInputQuantifiableChange,
    handleSubclassChange,
    handleArgumentChange,
    handleInputArgumentChange,
    copyInputDetails,
    handleArgumentInit,
    handleInputInit,
    handleDescriptionChange,
    handleNumOptionsChange,
    setUserAlgoCode,
    setUserEnvCode,
    setUserQueryableCode,
    setInputQueryable,
    addDetailsItem,
    removeDetailsItem,
    copyInputDetailsItem,
    setSelectedDetail,
    // resetState,
    handleAddGeneratedOutput,
  } = useQuestionGeneration();

  const { user } = useContext(AuthContext);
  const [generatedContext, setGeneratedContext] = useState<Array<{ id: string, type: 'input' | 'algo', context: { [key: string]: unknown }, context_init: { [key: string]: unknown }, has_output: boolean, name?: string }>>([]);
  const [validationError, setValidationError] = useState<string | null>(null);

  const handleGenerate = async () => {
    const { description, subQuestions } = state;
    const requestPayload: GenerateQuestionRequest = {
      description,
      context: {
        selectedTopic: '',
        selectedSubtopic: '',
        inputPath: {},
        selectedSubclasses: {},
        selectedQuantifiables: {},
        arguments: {},
        inputArguments: {},
        argumentsInit: {},
        inputInit: {},
        userAlgoCode: '',
        userEnvCode: [],
      },
      sub_questions: subQuestions.map(subQuestion => ({
        description: subQuestion.description,
        queryable: subQuestion.selectedQueryable,
        inputQueryable: subQuestion.selectedInputQueryable,
        userQueryableCode: subQuestion.userQueryableCode || '',
        context: subQuestion.context.selectedDetail ? (
          subQuestion.context.selectedDetail.type === 'algo' ? {
            selectedTopic: (subQuestion.context.selectedDetail.details as AlgoDetailsType).selectedTopic,
            selectedSubtopic: (subQuestion.context.selectedDetail.details as AlgoDetailsType).selectedSubtopic,
            inputPath: {},
            selectedSubclasses: (subQuestion.context.selectedDetail.details as AlgoDetailsType).selectedSubclasses,
            selectedQuantifiables: (subQuestion.context.selectedDetail.details as AlgoDetailsType).selectedQuantifiables || {},
            arguments: convertArguments((subQuestion.context.selectedDetail.details as AlgoDetailsType).variableArguments, (subQuestion.context.selectedDetail.details as AlgoDetailsType).algoVariables, (subQuestion.context.selectedDetail.details as AlgoDetailsType).selectedSubclasses),
            inputArguments: {},
            argumentsInit: (subQuestion.context.selectedDetail.details as AlgoDetailsType).argumentsInit || {},
            inputInit: {},
            userAlgoCode: (subQuestion.context.selectedDetail.details as AlgoDetailsType).userAlgoCode || '',
            userEnvCode: (subQuestion.context.selectedDetail.details as AlgoDetailsType).userEnvCode || [],
          } : {
            selectedTopic: '',
            selectedSubtopic: '',
            inputPath: (subQuestion.context.selectedDetail.details as InputDetailsType).inputPath,
            selectedSubclasses: {},
            selectedQuantifiables: (subQuestion.context.selectedDetail.details as InputDetailsType).selectedQuantifiables || {},
            arguments: {},
            inputArguments: convertInputArguments((subQuestion.context.selectedDetail.details as InputDetailsType).inputVariableArguments, (subQuestion.context.selectedDetail.details as InputDetailsType).inputVariables),
            argumentsInit: {},
            inputInit: (subQuestion.context.selectedDetail.details as InputDetailsType).inputInit || {},
            userAlgoCode: '',
            userEnvCode: (subQuestion.context.selectedDetail.details as InputDetailsType).userEnvCode ? [(subQuestion.context.selectedDetail.details as InputDetailsType).userEnvCode ?? ''] : [],
          }
        ) : {
          selectedTopic: '',
          selectedSubtopic: '',
          inputPath: {},
          selectedSubclasses: {},
          selectedQuantifiables: {},
          arguments: {},
          inputArguments: {},
          argumentsInit: {},
          inputInit: {},
          userAlgoCode: '',
          userEnvCode: [],
        },
        questionDetails: {
          marks: subQuestion.marks,
          number_of_options: subQuestion.numOptions,
        },
      })),
    };
    for (const subq of subQuestions) {
      if (subq.selectedQueryable == "" && subq.selectedInputQueryable == "") {
        setValidationError("Please select a query for all sub-questions");
        return;
      }
    }
    setValidationError(null);
    try {
      dispatch({ type: 'SET_FIELD', field: 'loading', value: true });
      const data = await generateQuestion(requestPayload);
      dispatch({ type: 'SET_GENERATED_QUESTIONS', generatedQuestions: data });
    } catch (error) {
      console.error('Error generating question:', error);
    } finally {
      dispatch({ type: 'SET_FIELD', field: 'loading', value: false });
    }
  };

  const onAddQuestion = async (newQuestion: NewQuestion) => {
    try {
      // TODO: To be updated when authentication logic is implemented
      if (!user) {
        throw new Error('User is not logged in');
      }
      // Create the question
      const question = await createQuestion(newQuestion);

      if (assessmentId) {
        // Add the question to the assessment
        await addExistingQuestionToAssessment(assessmentId, question._id);
      } else if (questionBankId) {
        // Add the question to the question bank
        await addExistingQuestionToQuestionBank(questionBankId, question._id);
      } else {
        throw new Error('Assessment ID or Question Bank ID is missing');
      }
      console.log('Questions added to assessment successfully');
    } catch (error) {
      console.error('Error adding questions to assessment:', error);
    }
  };

  const addSubQuestion = () => {
    dispatch({ type: 'ADD_SUB_QUESTION' });
  };

  const removeSubQuestion = (index: number) => {
    dispatch({ type: 'REMOVE_SUB_QUESTION', index });
  };


  const contextActions = {
    setTopic: handleTopicChange,
    setSubtopic: handleSubtopicChange,
    setInputPath: handleInputPathChange,
    handleQuantifiableChange: handleQuantifiableChange,
    handleInputQuantifiableChange: handleInputQuantifiableChange,
    handleSubclassChange: handleSubclassChange,
    handleArgumentChange: handleArgumentChange,
    handleInputArgumentChange: handleInputArgumentChange,
    copyInputDetails: copyInputDetails,
    handleArgumentInit: handleArgumentInit,
    handleInputInit: handleInputInit,
    setUserAlgoCode: setUserAlgoCode,
    setUserEnvCode: setUserEnvCode,
    setInputQueryable: setInputQueryable,
    addDetailsItem: addDetailsItem,
    removeDetailsItem: removeDetailsItem,
    copyInputDetailsItem: copyInputDetailsItem,
    handleAddGeneratedOutput: handleAddGeneratedOutput,
  };

  const getSubQuestionActions = (index: number) => ({
    setTopic: (topic: string) => handleTopicChange(topic, index),
    setSubtopic: (subtopic: string) => handleSubtopicChange(subtopic, index),
    setInputPath: (inputPath: { [key: string]: unknown }) => handleInputPathChange(inputPath, index),
    handleQuantifiableChange: (variableName: string, value: string) => handleQuantifiableChange(variableName, value, index),
    handleInputQuantifiableChange: (variableName: string, value: string) => handleInputQuantifiableChange(variableName, value, index),
    handleSubclassChange: (variableName: string, subclassName: string) => handleSubclassChange(variableName, subclassName, index),
    handleArgumentChange: (variableName: string, argName: string, value: unknown) => handleArgumentChange(variableName, argName, value, index),
    handleInputArgumentChange: (variableName: string, argName: string, value: unknown) => handleInputArgumentChange(variableName, argName, value, index),
    copyInputDetails: (variableName: string, inputName: string, inputDetailIndex: number, args?: string[]) => copyInputDetails(variableName, inputName, inputDetailIndex, args, index),
    setInputQueryable: (inputPath: { [key: string]: unknown }) =>  setInputQueryable(inputPath, index),
    addDetailsItem: (isAlgo: boolean) => addDetailsItem(isAlgo, index),
    removeDetailsItem: (inputDetailIndex: number, deleteGenerated: boolean) => removeDetailsItem(inputDetailIndex, deleteGenerated, index),
    copyInputDetailsItem: (inputDetailsItem: InputDetailsType) => copyInputDetailsItem(inputDetailsItem, index),
    handleAddGeneratedOutput: (input_path: { [key: string]: unknown }, input_init: { [key: string]: { [arg: string]: unknown } }, user_env_code: string) => handleAddGeneratedOutput(input_path, input_init, user_env_code, index),
  });

  return (
    <Box
      sx={{
        marginBottom: 2,
        border: '1px solid #ccc',
        borderRadius: '4px',
        padding: 2,
        // minWidth: "100vh",
        // minHeight: "100vh",
      }}
    >
      <Typography variant="h6" gutterBottom sx={{ marginBottom: 2 }}>
        Question Generation
      </Typography>

      <CodeBlock
        context={state.context}
        outerContext = {initialState.context}
        outerGeneratedContext={[]}
        generatedContext={generatedContext}
        setGeneratedContext={setGeneratedContext}
        {...contextActions}
        loading={state.loading}
      />
      {state.subQuestions.map((subQuestion, index) => (
        <SubQuestion
          key={index}
          index={index}
          subQuestion={subQuestion}
          outerContext = {state.context}
          setDescription={handleDescriptionChange}
          setQueryable={(index, value) => handleSubQuestionQueryableChange(index, value)}
          setInputQueryable={(index, value) => handleSubQuestionInputQueryableChange(index, value)}
          handleNumOptionsChange={(value) => handleNumOptionsChange(value, index)}
          handleGenerate={() => {}}
          removeSubQuestion={removeSubQuestion}
          topics={subQuestion.context.topics}
          subtopics={subQuestion.context.subtopics}
          contextActions={{
            ...contextActions,
            ...getSubQuestionActions(index),
            setUserQueryableCode,
          }}
          loading={state.loading}
          outerGeneratedContext={generatedContext}
          setSelectedDetail={setSelectedDetail}
        />
      ))}
      <Button variant="contained" color="primary" onClick={addSubQuestion} sx={{ marginTop: 2 }}>
        Add Sub-Question
      </Button>
      <br></br>
      <Button variant="contained" color="primary" onClick={handleGenerate} sx={{ marginTop: 2 }}>
        Generate Question
      </Button>
      {validationError && (
        <Alert
          severity="error"
          sx={{ mt: 2 }}
          onClose={() => setValidationError(null)}
        >
          {validationError}
        </Alert>
      )}
      {state.generatedQuestions.subquestions && state.generatedQuestions.subquestions.length > 0 && (
        <Box
          sx={{
            marginTop: 2,
            padding: 2,
            backgroundColor: '#f0f4f8',
            borderRadius: '8px',
            boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
          }}
        >
          <Typography variant="h5" gutterBottom sx={{ textAlign: 'center', marginBottom: 4, color: '#333' }}>
            Generated Questions
          </Typography>
          <QuestionCreation
            project={project}
            questions={state.generatedQuestions}
            onAddQuestion={onAddQuestion}
            assessmentId={assessmentId}
            questionBankId={questionBankId}
          />
        </Box>
      )}
    </Box>
  );
};

export default QuestionGeneration;
