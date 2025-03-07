import { useContext, useState } from 'react';
import { Box, Typography, Button } from '@mui/material';
import { generateQuestion, GenerateQuestionRequest } from '../../utils/api/QuestionGenerationAPI';
import QuestionCreation from './QuestionCreation';
import { createQuestion, NewQuestion } from '../../utils/api/QuestionAPI';
import { addExistingQuestionToAssessment } from '../../utils/api/AssessmentAPI';
import { addExistingQuestionToQuestionBank } from '../../utils/api/QuestionBankAPI';
import { AuthContext } from '../../context/Authcontext';
import { convertArguments, convertInputArguments } from '../../utils/format';
import QuestionDescriptionInput from './QuestionGeneration/QuestionDescriptionInput';
import CodeBlock from './QuestionGeneration/CodeBlock';
import SubQuestion from './QuestionGeneration/SubQuestion';
import useQuestionGeneration from '../../hooks/useQuestionGeneration';
import { initialState, InputDetailsType } from '../../reducer/questionGenerationReducer';

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
    handleSubclassChange,
    handleArgumentChange,
    handleInputArgumentChange,
    copyInputArgument,
    handleArgumentInit,
    handleInputInit,
    copyInputInit,
    handleDescriptionChange,
    handleNumOptionsChange,
    setUserAlgoCode,
    setUserEnvCode,
    setUserQueryableCode,
    setInputQueryable,
    removeInputDetailsItem,
    copyInputDetailsItem,
  } = useQuestionGeneration();

  const { user } = useContext(AuthContext);

  const handleGenerate = async () => {
    const { description, context, subQuestions } = state;
    const requestPayload: GenerateQuestionRequest = {
      description,
      context: {
        selectedTopic: context.selectedTopic,
        selectedSubtopic: context.selectedSubtopic,
        inputPath: {},
        selectedSubclasses: context.selectedSubclasses,
        selectedQuantifiables: context.selectedQuantifiables,
        arguments: convertArguments(context.variableArguments, context.algoVariables, context.selectedSubclasses),
        inputArguments: {},
        argumentsInit: context.argumentsInit || {},
        inputInit: {},
        userAlgoCode: context.userAlgoCode || '',
        userEnvCode: context.userEnvCode || '',
      },
      sub_questions: subQuestions.map(subQuestion => ({
        description: subQuestion.description,
        queryable: subQuestion.selectedQueryable,
        inputQueryable: subQuestion.selectedInputQueryable,
        userQueryableCode: subQuestion.userQueryableCode || '',
        context: {
          selectedTopic: subQuestion.context.selectedTopic,
          selectedSubtopic: subQuestion.context.selectedSubtopic,
          inputPath: subQuestion.context.inputDetails[0].inputPath,
          selectedSubclasses: subQuestion.context.selectedSubclasses,
          selectedQuantifiables: subQuestion.context.selectedQuantifiables,
          arguments: convertArguments(subQuestion.context.variableArguments, subQuestion.context.algoVariables, subQuestion.context.selectedSubclasses),
          inputArguments: convertInputArguments(subQuestion.context.inputDetails[0].inputVariableArguments, subQuestion.context.inputDetails[0].inputVariables),
          argumentsInit: subQuestion.context.argumentsInit || {},
          inputInit: subQuestion.context.inputDetails[0].inputInit || {},
          userAlgoCode: subQuestion.context.userAlgoCode || '',
          userEnvCode: subQuestion.context.userEnvCode|| '',
        },
        questionDetails: {
          marks: subQuestion.marks,
          number_of_options: subQuestion.numOptions,
        },
      })),
    };
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


  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    dispatch({ type: 'SET_FIELD', field: 'tabValue', value: newValue });
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
    handleSubclassChange: handleSubclassChange,
    handleArgumentChange: handleArgumentChange,
    handleInputArgumentChange: handleInputArgumentChange,
    copyInputArgument: copyInputArgument,
    handleArgumentInit: handleArgumentInit,
    handleInputInit: handleInputInit,
    copyInputInit: copyInputInit,
    setUserAlgoCode: setUserAlgoCode,
    setUserEnvCode: setUserEnvCode,
    setInputQueryable: setInputQueryable,
    removeInputDetailsItem: removeInputDetailsItem,
    copyInputDetailsItem: copyInputDetailsItem,
  };

  const getSubQuestionActions = (index: number) => ({
    setTopic: (topic: string) => handleTopicChange(topic, index),
    setSubtopic: (subtopic: string) => handleSubtopicChange(subtopic, index),
    setInputPath: (inputPath: { [key: string]: unknown }) => handleInputPathChange(inputPath, index),
    handleQuantifiableChange: (variableName: string, value: string) => handleQuantifiableChange(variableName, value, index),
    handleSubclassChange: (variableName: string, subclassName: string) => handleSubclassChange(variableName, subclassName, index),
    handleArgumentChange: (variableName: string, argName: string, value: unknown) => handleArgumentChange(variableName, argName, value, index),
    handleInputArgumentChange: (variableName: string, argName: string, value: unknown) => handleInputArgumentChange(variableName, argName, value, index),
    copyInputArgument: (variableName: string, inputName: string, argName: string, inputDetailIndex: number) => copyInputArgument(variableName, inputName, argName, inputDetailIndex, index),
    copyInputInit: (variableName: string, inputName: string,  inputDetailIndex: number) => copyInputInit(variableName, inputName, inputDetailIndex, index),
    setInputQueryable: (inputPath: { [key: string]: unknown }) =>  setInputQueryable(inputPath, index),
    removeInputDetailsItem: (inputDetailIndex: number) => removeInputDetailsItem(inputDetailIndex, index),
    copyInputDetailsItem: (inputDetailsItem: InputDetailsType) => copyInputDetailsItem(inputDetailsItem, index),
  });

  const [generatedInputs, setGeneratedInputs] = useState<Array<{ id: string, type: 'input' | 'algo', context: { [key: string]: unknown }, context_init: { [key: string]: unknown } }>>([]);

  return (
    <Box
      sx={{
        marginBottom: 2,
        border: '1px solid #ccc',
        borderRadius: '4px',
        padding: 2,
      }}
    >
      <Typography variant="h6" gutterBottom sx={{ marginBottom: 2 }}>
        Question Generation
      </Typography>

      <QuestionDescriptionInput
          description={state.description}
          setDescription={handleDescriptionChange}
      />
      <CodeBlock
        tabValue={state.tabValue}
        handleTabChange={handleTabChange}
        context={state.context}
        outerContext = {initialState.context}
        generatedInputs={generatedInputs}
        setGeneratedInputs={setGeneratedInputs}
        outerGeneratedInputs={[]}
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
          tabValue={state.tabValue}
          handleTabChange={handleTabChange}
          loading={state.loading}
          outerGeneratedInputs={generatedInputs}
        />
      ))}
      <Button variant="contained" color="primary" onClick={addSubQuestion} sx={{ marginTop: 2 }}>
        Add Sub-Question
      </Button>
      <br></br>
      <Button variant="contained" color="primary" onClick={handleGenerate} sx={{ marginTop: 2 }}>
        Generate Question
      </Button>
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
