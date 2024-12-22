import { useContext, useState, useEffect } from 'react';
import { Box, TextField, Typography, Button, Autocomplete, Tooltip, CircularProgress, Tabs, Tab } from '@mui/material';
import { getTopics, getSubtopics, getQueryables, generateQuestion, Topic, Subtopic, Queryable, GenerateQuestionRequest, getVariables, getAllQueryables, Variables, Quantifiable, getQuantifiables } from '../../utils/api/QuestionGenerationAPI';
import QuestionCreation from './QuestionCreation';
import { createQuestion, QuestionCreationItem } from '../../utils/api/QuestionAPI';
import { addExistingQuestionToAssessment } from '../../utils/api/AssessmentAPI';
import { addExistingQuestionToQuestionBank } from '../../utils/api/QuestionBankAPI';
import { AuthContext } from '../../context/Authcontext';
import { convertArgumentValue, formatText, formatVariableType } from '../../utils/format';
import ProcessorClassCodeSnippetEditor from './ClassCodeSnippetEditors/ProcessorClassCodeSnippetEditor';
import QueryableClassCodeSnippetEditor from './ClassCodeSnippetEditors/QueryableClassCodeSnippetEditor';
import QuestionGenerationForm from './QuestionGeneration/QuestionGenerationForm';
import VariableTable from './QuestionGeneration/VariableTable';
import QuestionCategorySelector from './QuestionGeneration/QuestionCategorySelector';

interface QuestionGenerationProps {
  description: string;
  setDescription: (description: string) => void;
  type: string;
  marks: number;
  project: { id: string, title: string };
  assessmentId?: string;
  questionBankId?: string;
}

const QuestionGeneration: React.FC<QuestionGenerationProps> = ({
  description,
  setDescription,
  type,
  marks,
  project,
  assessmentId,
  questionBankId
}) => {
  const [numOptions, setNumOptions] = useState<number>(4);
  const [numQuestions, setNumQuestions] = useState<number>(1);
  const [topic, setTopic] = useState<string>("");
  const [subtopic, setSubtopic] = useState<string>("");
  const [queryable, setQueryable] = useState<string>("");
  const [userTopic, setUserTopic] = useState<string>("");
  const [userSubtopic, setUserSubtopic] = useState<string>("");
  const [userQueryable, setUserQueryable] = useState<string>("");
  const [queryableCodeSnippet, setQueryableCodeSnippet] = useState<string>("");
  const [processorCodeSnippet, setProcessorCodeSnippet] = useState<string>("");
  const [queryableCodeRequiredLines, setQueryableCodeRequiredLines] = useState<string[]>([]);
  const [processorCodeRequiredLines, setProcessorCodeRequiredLines] = useState<string[]>([]);
  const [variables, setVariables] = useState<Variables>([]);
  const [quantifiables, setQuantifiables] = useState<Quantifiable[]>([]);
  const [variableArguments, setVariableArguments] = useState<{ [key: string]: { [arg: string]: any } }>({});
  const [selectedQuantifiables, setSelectedQuantifiables] = useState<{ [key: string]: string }>({});
  const [selectedSubclasses, setSelectedSubclasses] = useState<{ [key: string]: string }>({});
  const [topics, setTopics] = useState<Topic[]>([]);
  const [subtopics, setSubtopics] = useState<Subtopic[]>([]);
  const [queryables, setQueryables] = useState<Queryable[]>([]);
  const [generatedQuestions, setGeneratedQuestions] = useState<QuestionCreationItem[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [tabValue, setTabValue] = useState<number>(0);

  const { user } = useContext(AuthContext);

  useEffect(() => {
    // Fetch topics
    getTopics()
      .then(setTopics)
      .catch(error => console.error('Error fetching topics:', error));
  }, []);

  useEffect(() => {
    if (topic) {
      // Fetch subtopics
      getSubtopics(topic)
        .then(setSubtopics)
        .catch(error => console.error('Error fetching subtopics:', error));
    } else {
      setSubtopics([]);
      setQueryables([]);
    }
    setSubtopic('');
    setQueryable('');
    setDescription('');
    setSelectedQuantifiables({});
    setSelectedSubclasses({});
    setVariableArguments({});
  }, [topic]);

  useEffect(() => {
    if (subtopic) {
      // Fetch queryables
      getQueryables(topic, subtopic)
        .then(setQueryables)
        .catch(error => console.error('Error fetching queryables:', error));
    } else {
      setQueryables([]);
    }
    setQueryable('');
    setDescription('');
    setSelectedQuantifiables({});
    setSelectedSubclasses({});
    setVariableArguments({});
  }, [subtopic]);

  useEffect(() => {
    if (topic && subtopic && queryable) {
      getVariables(topic, subtopic, queryable)
      .then(setVariables)
      .catch(error => console.error('Error fetching variables:', error));
      getQuantifiables()
      .then(setQuantifiables)
      .catch(error => console.error('Error fetching quantifiables:', error));
    } else {
      setVariables([]);
    }
    setDescription('');
    setSelectedQuantifiables({});
    setSelectedSubclasses({});
    setVariableArguments({});
  }, [queryable]);

  useEffect(() => {
    if (tabValue === 1) {
      getAllQueryables()
        .then(setQueryables)
        .catch(error => console.error('Error fetching all queryables:', error));
    }
    setGeneratedQuestions([]);
  }, [tabValue, userTopic]);

  useEffect(() => {
    if (type === 'true or false') {
      setNumOptions(2);
    }
  }, [type]);

  const handleGenerate = async () => {
    // Validate that all required fields are defined
    const currentTopic =  tabValue === 0 ? topic : userTopic;
    const currentSubtopic =  tabValue === 0 ? subtopic : userSubtopic;
    const currentQueryable =  tabValue === 0 ? queryable : userQueryable;

    if (!currentTopic || !currentSubtopic || !currentQueryable || !description || !type || !marks || !numOptions || !numQuestions) {
      alert('Please fill in all required fields.');
      return;
    }

    // Check if all required subclasses are selected
    const allSubclassesSelected = variables.every((variable) => {
      if (variable.subclasses && variable.subclasses.length > 0) {
        return selectedSubclasses[variable.name];
      }
      return true;
    });

    if (!allSubclassesSelected) {
      alert('Please select a subclass for all variables that have subclasses.');
      return;
    }

    // Check if all variables are used in the description
    const allVariablesUsed = variables.every((variable) => description.includes(`{${variable.name}}`));

    if (!allVariablesUsed) {
      alert('Please use all variables in the question description.');
      return;
    }

    // Convert argument values to the correct type
    const convertedArguments = Object.keys(variableArguments).reduce((acc, variableName) => {
      const variable = variables.find(v => v.name === variableName);
      if (variable) {
        acc[variableName] = Object.keys(variableArguments[variableName]).reduce((argAcc, argName) => {
          const arg = variable.arguments?.find(a => a.name === argName) || variable.subclasses?.find(s => s.name === selectedSubclasses[variableName])?.arguments.find(a => a.name === argName);
          if (arg) {
            argAcc[argName] = convertArgumentValue(arg.type, variableArguments[variableName][argName]);
          }
          return argAcc;
        }, {} as { [key: string]: any });
      }
      return acc;
    }, {} as { [key: string]: { [arg: string]: any } });

    // Create request payload
    const requestPayload: GenerateQuestionRequest = {
      topic: currentTopic,
      subtopic: currentSubtopic,
      queryable: currentQueryable,
      element_type: selectedQuantifiables,
      subclasses: selectedSubclasses,
      arguments: convertedArguments,
      question_description: description,
      question_type: type,
      marks,
      number_of_options: numOptions,
      number_of_questions: numQuestions,
    };

    console.log('Request payload:', requestPayload);
    try {
      setLoading(true);
      const data = await generateQuestion(requestPayload);
      setGeneratedQuestions(data);
    } catch (error) {
      console.error('Error generating question:', error);
    } finally {
      setLoading(false);
    }
  };

  const validateCodeSnippet = (code: string, requiredLines: string[]): boolean => {
    for (const line of requiredLines) {
      if (!code.includes(line)) {
        return false;
      }
    }
    return true;
  };

  const handleSaveCodeSnippet = async () => {
    try {
      setLoading(true);

      // if (!validateCodeSnippet(queryableCodeSnippet, queryableCodeRequiredLines)) {
      //   alert(`Please include the required lines in the QueryableClass code snippet:\n${queryableCodeRequiredLines.join('\n')}`);
      //   return;
      // }

      if (!validateCodeSnippet(processorCodeSnippet, processorCodeRequiredLines)) {
        alert(`Please include the required lines in the ProcessorClass code snippet:\n${processorCodeRequiredLines.join('\n')}`);
        return;
      }

      // TODO: add endpoint to save code snippet
      // const response = await fetch('/api/save-code-snippet', {
      //   method: 'POST',
      //   headers: {
      //     'Content-Type': 'application/json',
      //   },
      //   body: JSON.stringify({
      //     userTopic,
      //     userSubtopic,
      //     userQueryable,
      //     queryableCodeSnippet,
      //     processorCodeSnippet
      //   }),
      // });

      // if (!response.ok) {
      //   throw new Error('Failed to save code snippet');
      // }
    } catch (error) {
      console.error('Error saving code snippet:', error);
      throw error;
    }
  };

  const onAddQuestion = async (selectedQuestions: QuestionCreationItem[]) => {
    try {
      // TODO: To be updated when authentication logic is implemented
      if (!user) {
        throw new Error('User is not logged in');
      }

      for (const selectedQuestion of selectedQuestions) {
        const newQuestion = {
          text: selectedQuestion.question,
          options: selectedQuestion.options,
          answer: selectedQuestion.answer,
          marks: selectedQuestion.marks,
          user_id: user.id,
          svg: selectedQuestion.svg,
        };

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
      }

      console.log('Questions added to assessment successfully');
    } catch (error) {
      console.error('Error adding questions to assessment:', error);
    }
  };


  const handleQuantifiableChange = (variableName: string, value: string) => {
    setSelectedQuantifiables((prev) => ({
      ...prev,
      [variableName]: value,
    }));
  };

  // const handleSubclassChange = (variableName: string, value: string) => {
  //   setSelectedSubclasses((prev) => ({
  //     ...prev,
  //     [variableName]: value,
  //   }));
  // };
  const handleSubclassChange = (variableName: string, subclassName: string) => {
    setSelectedSubclasses((prev) => ({
      ...prev,
      [variableName]: subclassName,
    }));

    const selectedSubclass = variables.find((variable) => variable.name === variableName)?.subclasses?.find((subclass) => subclass.name === subclassName);
    if (selectedSubclass) {
      const initialArguments = selectedSubclass.arguments.reduce((acc, arg) => {
        acc[arg.name] = '';
        return acc;
      }, {} as { [key: string]: any });
      setVariableArguments((prev) => ({
        ...prev,
        [variableName]: initialArguments,
      }));
    }
  };

  const handleArgumentChange = (variableName: string, argName: string, value: any) => {
    setVariableArguments((prev) => ({
      ...prev,
      [variableName]: {
        ...prev[variableName],
        [argName]: value,
      },
    }));
  };

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };


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
      <Tabs value={tabValue} onChange={handleTabChange} aria-label="algorithm type tabs" sx={{ marginBottom: 2 }}>
        <Tab label="Defined Algorithms" />
        <Tab label="New Algorithm" />
      </Tabs>
      <Box sx={{ display: 'flex', gap: 2 }}>
        <QuestionCategorySelector
            tabValue={tabValue}
            topics={topics}
            subtopics={subtopics}
            queryables={queryables}
            topic={topic}
            subtopic={subtopic}
            queryable={queryable}
            userTopic={userTopic}
            userSubtopic={userSubtopic}
            userQueryable={userQueryable}
            setTopic={setTopic}
            setSubtopic={setSubtopic}
            setQueryable={setQueryable}
            setUserTopic={setUserTopic}
            setUserSubtopic={setUserSubtopic}
            setUserQueryable={setUserQueryable}
          />
      </Box>
      {tabValue === 1 && userTopic && userSubtopic && userQueryable && (
        <>
          <ProcessorClassCodeSnippetEditor setProcessorCodeSnippet={setProcessorCodeSnippet} setProcessorCodeRequiredLines={setProcessorCodeRequiredLines}/>
          <Button variant="contained" color="primary" onClick={handleSaveCodeSnippet} disabled={loading} sx={{ marginBottom: 2}}>
            {loading ? <CircularProgress size={24} /> : 'Save Algorithm'}
          </Button>
        </>
      )}
      <Tooltip title="Variables are placeholders in your question. Use {Input}, {Step}, etc. in your question description to represent these variables." placement='bottom-start'>
        <Typography variant="subtitle1" >
          Variables (Use variable name in question description)
        </Typography>
      </Tooltip>
      <VariableTable
        variables={variables}
        quantifiables={quantifiables}
        selectedQuantifiables={selectedQuantifiables}
        selectedSubclasses={selectedSubclasses}
        variableArguments={variableArguments}
        handleQuantifiableChange={handleQuantifiableChange}
        handleSubclassChange={handleSubclassChange}
        handleArgumentChange={handleArgumentChange}
      />
      <QuestionGenerationForm
        description={description}
        setDescription={setDescription}
        numOptions={numOptions}
        setNumOptions={setNumOptions}
        numQuestions={numQuestions}
        setNumQuestions={setNumQuestions}
        type={type}
        loading={loading}
        handleGenerate={handleGenerate}
      />
      {generatedQuestions.length > 0 && (
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
            questions={generatedQuestions}
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
