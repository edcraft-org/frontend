import { useContext, useState, useEffect } from 'react';
import { Box, TextField, Typography, Button, Autocomplete, Chip, TableContainer, Paper, Table, TableHead, TableRow, TableCell, TableBody, Tooltip, CircularProgress, FormControl, InputLabel, Select, MenuItem, Tabs, Tab } from '@mui/material';
import { getTopics, getSubtopics, getQueryables, generateQuestion, Topic, Subtopic, Queryable, GenerateQuestionRequest, getVariables, getAllQueryables, Variables, Quantifiable, getQuantifiables } from '../../utils/api/QuestionGenerationAPI';
import QuestionCreation from './QuestionCreation';
import { createQuestion, QuestionCreationItem } from '../../utils/api/QuestionAPI';
import { addExistingQuestionToAssessment } from '../../utils/api/AssessmentAPI';
import { addExistingQuestionToQuestionBank } from '../../utils/api/QuestionBankAPI';
import { AuthContext } from '../../context/Authcontext';
import { formatText, formatVariableType } from '../../utils/format';
import ProcessorClassCodeSnippetEditor from './ClassCodeSnippetEditors/ProcessorClassCodeSnippetEditor';
import QueryableClassCodeSnippetEditor from './ClassCodeSnippetEditors/QueryableClassCodeSnippetEditor';

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

    // Create request payload
    const requestPayload: GenerateQuestionRequest = {
      topic: currentTopic,
      subtopic: currentSubtopic,
      queryable: currentQueryable,
      element_type: selectedQuantifiables,
      subclasses: selectedSubclasses,
      question_description: description,
      question_type: type,
      marks,
      number_of_options: numOptions,
      number_of_questions: numQuestions,
    };

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

  const handleSubclassChange = (variableName: string, value: string) => {
    setSelectedSubclasses((prev) => ({
      ...prev,
      [variableName]: value,
    }));
  };

  const isQuantifiable = (type: string): boolean => {
    return type === 'Quantifiable' || type.includes('Quantifiable');
  };


  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  const hasQuantifiable = variables.some(variable => isQuantifiable(variable.type));
  const hasSubclasses = variables.some(variable => variable.subclasses && variable.subclasses.length > 0);

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
        {tabValue === 0 ? (
          <>
            <FormControl fullWidth sx={{ marginBottom: 2 }}>
              <InputLabel id="topic-label">Topic</InputLabel>
              <Select
                labelId="topic-label"
                label="Topic"
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                renderValue={(selected) => (
                  <Chip label={formatText(selected)} />
                )}
              >
                {topics.map((topic) => (
                  <MenuItem key={topic} value={topic}>{formatText(topic)}</MenuItem>
                ))}
              </Select>
            </FormControl>
            <FormControl fullWidth sx={{ marginBottom: 2 }}>
              <InputLabel id="subtopic-label">Subtopic</InputLabel>
              <Select
                labelId="subtopic-label"
                label="Subtopic"
                value={subtopic}
                onChange={(e) => setSubtopic(e.target.value)}
                disabled={!topic}
                renderValue={(selected) => (
                  <Chip label={formatText(selected)} />
                )}
              >
                {subtopics.map((subtopic) => (
                  <MenuItem key={subtopic} value={subtopic}>{formatText(subtopic)}</MenuItem>
                ))}
              </Select>
            </FormControl>
            <FormControl fullWidth sx={{ marginBottom: 2 }}>
              <InputLabel id="queryable-label">Queryable</InputLabel>
              <Select
                labelId="queryable-label"
                label="Queryable"
                value={queryable}
                onChange={(e) => setQueryable(e.target.value)}
                disabled={!subtopic}
                renderValue={(selected) => (
                  <Chip label={formatText(selected)} />
                )}
              >
                {queryables.map((queryable) => (
                  <MenuItem key={queryable} value={queryable}>{formatText(queryable)}</MenuItem>
                ))}
              </Select>
            </FormControl>
          </>
        ) : (
          <>
            <Autocomplete
              freeSolo
              fullWidth
              options={topics.map((topic) => topic)}
              value={userTopic}
              onChange={(event, newValue) => {
                setUserTopic(newValue || '');
                setTopic(newValue || '');
              }}
              onInputChange={(event, newInputValue) => setUserTopic(newInputValue)}
              renderInput={(params) => <TextField {...params} label="Topic" variant="outlined" />}
              renderOption={(props, option) => (
                <li {...props}>
                  {formatText(option)}
                </li>
              )}
              sx={{ marginBottom: 2 }}
            />
            <Autocomplete
              freeSolo
              fullWidth
              options={subtopics.map((subtopic) => subtopic)}
              value={userSubtopic}
              onChange={(event, newValue) => setUserSubtopic(newValue || '')}
              onInputChange={(event, newInputValue) => setUserSubtopic(newInputValue)}
              renderInput={(params) => <TextField {...params} label="Subtopic" variant="outlined" />}
              renderOption={(props, option) => (
                <li {...props}>
                  {formatText(option)}
                </li>
              )}
              sx={{ marginBottom: 2 }}
            />
            <Autocomplete
              freeSolo
              fullWidth
              options={queryables.map((queryable) => queryable)}
              value={userQueryable}
              onChange={(event, newValue) => setUserQueryable(newValue || '')}
              onInputChange={(event, newInputValue) => setUserQueryable(newInputValue || '')}
              renderInput={(params) => <TextField {...params} label="QueryableClass" variant="outlined" />}
              renderOption={(props, option) => (
                <li {...props}>
                  {formatText(option)}
                </li>
              )}
              sx={{ marginBottom: 2 }}
            />
          </>
        )}
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
      <TableContainer component={Paper} sx={{ marginBottom: 2, border: '1px solid #ccc' }}>
      <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell sx={{ width: hasQuantifiable || hasSubclasses ? '25%' : '50%' }}>Variable Name</TableCell>
              <TableCell sx={{ width: hasQuantifiable || hasSubclasses ? '25%' : '50%' }}>Variable Type</TableCell>
              {hasQuantifiable && <TableCell sx={{ width: '25%' }}>Quantifiable</TableCell>}
              {hasSubclasses && <TableCell sx={{ width: '25%' }}>Subclass</TableCell>}
            </TableRow>
          </TableHead>
          <TableBody>
            {variables.map((variable, index) => (
              <TableRow key={index}>
                <TableCell sx={{ width: hasQuantifiable || hasSubclasses ? '25%' : '50%' }}>{variable.name}</TableCell>
                <TableCell sx={{ width: hasQuantifiable || hasSubclasses ? '25%' : '50%' }}>
                  {variable.type}
                </TableCell>
                {hasQuantifiable && (
                  <TableCell sx={{ width: '25%' }}>
                    {isQuantifiable(variable.type) ? (
                      <FormControl fullWidth>
                        <Select
                          value={selectedQuantifiables[variable.name] || ''}
                          onChange={(e) => handleQuantifiableChange(variable.name, e.target.value)}
                        >
                          {quantifiables.map((quantifiable) => (
                            <MenuItem key={quantifiable} value={quantifiable}>
                              {quantifiable}
                            </MenuItem>
                          ))}
                        </Select>
                      </FormControl>
                    ) : (
                      <TextField
                        fullWidth
                        value="N/A"
                        disabled
                      />
                    )}
                  </TableCell>
                )}
                {hasSubclasses && (
                  <TableCell sx={{ width: '25%' }}>
                    {variable.subclasses && variable.subclasses.length > 0 ? (
                      <FormControl fullWidth>
                        <Select
                          value={selectedSubclasses[variable.name] || ''}
                          onChange={(e) => handleSubclassChange(variable.name, e.target.value)}
                        >
                          {variable.subclasses.map((subclass) => (
                            <MenuItem key={subclass} value={subclass}>
                              {subclass}
                            </MenuItem>
                          ))}
                        </Select>
                      </FormControl>
                    ) : (
                      <TextField
                        fullWidth
                        value="N/A"
                        disabled
                      />
                    )}
                  </TableCell>
                )}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <TextField
        fullWidth
        label="Question Description"
        variant="outlined"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        required
        sx={{ marginBottom: 2 }}
      />
      <TextField
        fullWidth
        label="Number of Options"
        variant="outlined"
        type="number"
        value={numOptions}
        onChange={(e) => setNumOptions(Number(e.target.value))}
        required
        sx={{ marginBottom: 2 }}
        disabled={type === 'true or false'}
      />
      <TextField
        fullWidth
        label="Number of Questions"
        variant="outlined"
        type="number"
        value={numQuestions}
        onChange={(e) => setNumQuestions(Number(e.target.value))}
        required
        sx={{ marginBottom: 2 }}
      />
      <Button variant="contained" color="primary" onClick={handleGenerate} disabled={loading}>
        {loading ? <CircularProgress size={24} /> : 'Generate'}
      </Button>
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