import { useReducer, useEffect } from 'react';
import { reducer, initialState } from '../reducer/questionGenerationReducer';
import { getTopics, getSubtopics, getQueryables, getAlgoVariables, getQueryableVariables, getQuantifiables } from '../utils/api/QuestionGenerationAPI';

const useQuestionGeneration = () => {
  const [state, dispatch] = useReducer(reducer, initialState);

  useEffect(() => {
    getTopics()
      .then(topics => {
        dispatch({ type: 'SET_TOPICS', topics });
        state.subQuestions.forEach((_, index) => {
          dispatch({ type: 'SET_SUB_QUESTION_CONTEXT_FIELD', index, field: 'topics', value: topics });
        });
      })
      .catch(error => console.error('Error fetching topics:', error));
  }, []);

  useEffect(() => {
    if (state.context.selectedTopic) {
      getSubtopics(state.context.selectedTopic)
        .then(subtopics => dispatch({ type: 'SET_SUBTOPICS', subtopics }))
        .catch(error => console.error('Error fetching subtopics:', error));
    } else {
      dispatch({ type: 'SET_SUBTOPICS', subtopics: [] });
    }
    dispatch({ type: 'SET_CONTEXT_FIELD', field: 'selectedSubtopic', value: '' });
    dispatch({ type: 'SET_CONTEXT_FIELD', field: 'selectedQuantifiables', value: {} });
    dispatch({ type: 'SET_CONTEXT_FIELD', field: 'selectedSubclasses', value: {} });
    dispatch({ type: 'SET_CONTEXT_FIELD', field: 'variableArguments', value: {} });
  }, [state.context.selectedTopic]);

  useEffect(() => {
    if (state.context.selectedSubtopic) {
      getAlgoVariables(state.context.selectedTopic, state.context.selectedSubtopic)
        .then(algoVariables => dispatch({ type: 'SET_ALGO_VARIABLES', algoVariables }))
        .catch(error => console.error('Error fetching algorithm variables:', error));
      getQuantifiables()
        .then(quantifiables => dispatch({ type: 'SET_QUANTIFIABLES', quantifiables }))
        .catch(error => console.error('Error fetching quantifiables:', error));
      getQueryables(state.context.selectedTopic, state.context.selectedSubtopic)
        .then(queryables => {
          dispatch({ type: 'SET_FIELD', field: 'queryables', value: queryables });
          state.subQuestions.forEach((_, index) => {
            dispatch({ type: 'SET_SUB_QUESTION_FIELD', index, field: 'queryables', value: queryables });
          });
        })
        .catch(error => console.error('Error fetching queryables:', error));
    } else {
      dispatch({ type: 'SET_ALGO_VARIABLES', algoVariables: [] });
      state.subQuestions.forEach((_, index) => {
        dispatch({ type: 'SET_SUB_QUESTION_FIELD', index, field: 'queryables', value: [] });
      });
    }
    state.subQuestions.forEach((_, index) => {
      dispatch({ type: 'SET_SUB_QUESTION_FIELD', index, field: 'selectedQueryable', value: '' });
    });
    dispatch({ type: 'SET_CONTEXT_FIELD', field: 'selectedQuantifiables', value: {} });
    dispatch({ type: 'SET_CONTEXT_FIELD', field: 'selectedSubclasses', value: {} });
    dispatch({ type: 'SET_CONTEXT_FIELD', field: 'variableArguments', value: {} });
  }, [state.context.selectedSubtopic]);

  // useEffect(() => {
  //   if (state.context.selectedTopic && state.context.selectedSubtopic && state.context.selectedQueryable) {
  //     getQueryableVariables(state.context.selectedTopic, state.context.selectedSubtopic, state.context.selectedQueryable)
  //       .then(queryVariables => dispatch({ type: 'SET_CONTEXT_FIELD', field: 'queryVariables', value: queryVariables }))
  //       .catch(error => console.error('Error fetching queryable variables:', error));
  //   } else {
  //     dispatch({ type: 'SET_CONTEXT_FIELD', field: 'queryVariables', value: [] });
  //   }
  //   dispatch({ type: 'SET_CONTEXT_FIELD', field: 'selectedQuantifiables', value: {} });
  //   dispatch({ type: 'SET_CONTEXT_FIELD', field: 'selectedSubclasses', value: {} });
  //   dispatch({ type: 'SET_CONTEXT_FIELD', field: 'variableArguments', value: {} });
  // }, [state.context.selectedQueryable]);

  // useEffect(() => {
  //   if (state.tabValue === 1) {
  //     getAllQueryables()
  //       .then(queryables => dispatch({ type: 'SET_QUERYABLES', queryables }))
  //       .catch(error => console.error('Error fetching all queryables:', error));
  //   }
  //   dispatch({ type: 'SET_GENERATED_QUESTIONS', generatedQuestions: [] });
  // }, [state.tabValue, state.context.selectedTopic]);

  const handleSubQuestionQueryableChange = async (index: number, queryable: string) => {
    if (state.context.selectedTopic && state.context.selectedSubtopic && queryable) {
      try {
        dispatch({ type: 'SET_SUB_QUESTION_FIELD', index, field: 'selectedQueryable', value: queryable });
        const data = await getQueryableVariables(state.context.selectedTopic, state.context.selectedSubtopic, queryable);
        dispatch({ type: 'SET_SUB_QUESTION_FIELD', index, field: 'queryVariables', value: data });
      } catch (error) {
        console.error('Error fetching queryable variables for subquestion:', error);
      }
    } else {
      dispatch({ type: 'SET_SUB_QUESTION_FIELD', index, field: 'queryVariables', value: [] });
    }
  };

  const handleTopicChange = async (topic: string, index?: number) => {
    if (index !== undefined) {
      dispatch({ type: 'SET_SUB_QUESTION_CONTEXT_FIELD', index, field: 'selectedTopic', value: topic });
      try {
        const subtopics = await getSubtopics(topic);
        dispatch({ type: 'SET_SUB_QUESTION_CONTEXT_FIELD', index, field: 'subtopics', value: subtopics });
        dispatch({ type: 'SET_SUB_QUESTION_CONTEXT_FIELD', index, field: 'selectedSubtopic', value: '' });
        dispatch({ type: 'SET_SUB_QUESTION_FIELD', index, field: 'selectedQueryable', value: '' });
        dispatch({ type: 'SET_SUB_QUESTION_FIELD', index, field: 'queryables', value: [] });
        dispatch({ type: 'SET_SUB_QUESTION_CONTEXT_FIELD', index, field: 'selectedQuantifiables', value: {} });
        dispatch({ type: 'SET_SUB_QUESTION_CONTEXT_FIELD', index, field: 'selectedSubclasses', value: {} });
        dispatch({ type: 'SET_SUB_QUESTION_CONTEXT_FIELD', index, field: 'algoVariables', value: [] });
      } catch (error) {
        console.error('Error fetching subtopics for subquestion:', error);
      }
    } else {
      dispatch({ type: 'SET_CONTEXT_FIELD', field: 'selectedTopic', value: topic });
    }
  };

  const handleSubtopicChange = async (subtopic: string, index?: number) => {
    if (index !== undefined) {
      dispatch({ type: 'SET_SUB_QUESTION_CONTEXT_FIELD', index, field: 'selectedSubtopic', value: subtopic });
      try {
        const selectedTopic = state.subQuestions[index].context.selectedTopic;

        getAlgoVariables(selectedTopic, subtopic)
        .then(algoVariables => dispatch({ type: 'SET_SUB_QUESTION_CONTEXT_FIELD', index, field: 'algoVariables', value: algoVariables }))
        .catch(error => console.error('Error fetching algorithm variables:', error));
        getQuantifiables()
          .then(quantifiables => dispatch({ type: 'SET_SUB_QUESTION_CONTEXT_FIELD', index, field: 'quantifiables', value: quantifiables }))
          .catch(error => console.error('Error fetching quantifiables:', error));
        getQueryables(selectedTopic, subtopic)
          .then(queryables => dispatch({ type: 'SET_SUB_QUESTION_FIELD', index, field: 'queryables', value: queryables }))
          .catch(error => console.error('Error fetching queryables:', error));
      } catch (error) {
        console.error('Error fetching queryables for subquestion:', error);
      }
    } else {
      dispatch({ type: 'SET_CONTEXT_FIELD', field: 'selectedSubtopic', value: subtopic });
    }
  };

  const handleQuantifiableChange = (variableName: string, value: string, index?: number) => {
    if (index !== undefined) {
      dispatch({ type: 'SET_SUB_QUESTION_CONTEXT_FIELD', index, field: 'selectedQuantifiables', value: { ...state.subQuestions[index].context.selectedQuantifiables, [variableName]: value } });
    } else {
      dispatch({ type: 'SET_CONTEXT_FIELD', field: 'selectedQuantifiables', value: { ...state.context.selectedQuantifiables, [variableName]: value } });
    }
  };

  const handleSubclassChange = (variableName: string, subclassName: string, index?: number) => {
    if (index !== undefined) {
      dispatch({ type: 'SET_SUB_QUESTION_CONTEXT_FIELD', index, field: 'selectedSubclasses', value: { ...state.subQuestions[index].context.selectedSubclasses, [variableName]: subclassName } });

      const selectedSubclass = state.subQuestions[index].context.algoVariables.find((variable) => variable.name === variableName)?.subclasses?.find((subclass) => subclass.name === subclassName);
      if (selectedSubclass) {
        const initialArguments = selectedSubclass.arguments.reduce((acc, arg) => {
          acc[arg.name] = '';
          return acc;
        }, {} as { [key: string]: any });
        dispatch({ type: 'SET_SUB_QUESTION_CONTEXT_FIELD', index, field: 'variableArguments', value: { ...state.subQuestions[index].context.variableArguments, [variableName]: initialArguments } });
      }
    } else {
      dispatch({ type: 'SET_CONTEXT_FIELD', field: 'selectedSubclasses', value: { ...state.context.selectedSubclasses, [variableName]: subclassName } });

      const selectedSubclass = state.context.algoVariables.find((variable) => variable.name === variableName)?.subclasses?.find((subclass) => subclass.name === subclassName);
      if (selectedSubclass) {
        const initialArguments = selectedSubclass.arguments.reduce((acc, arg) => {
          acc[arg.name] = '';
          return acc;
        }, {} as { [key: string]: any });
        dispatch({ type: 'SET_CONTEXT_FIELD', field: 'variableArguments', value: { ...state.context.variableArguments, [variableName]: initialArguments } });
      }
    }
  };

  const handleArgumentChange = (variableName: string, argName: string, value: any, index?: number) => {
    if (index !== undefined) {
      dispatch({ type: 'SET_SUB_QUESTION_CONTEXT_FIELD', index, field: 'variableArguments', value: { ...state.subQuestions[index].context.variableArguments, [variableName]: { ...state.subQuestions[index].context.variableArguments[variableName], [argName]: value } } });
    } else {
      dispatch({ type: 'SET_CONTEXT_FIELD', field: 'variableArguments', value: { ...state.context.variableArguments, [variableName]: { ...state.context.variableArguments[variableName], [argName]: value } } });
    }
  };

  const handleArgumentInit = (argumentsInit: { [key: string]: { [arg: string]: any } }, index?: number) => {
    if (index !== undefined) {
      dispatch({ type: 'SET_SUB_QUESTION_CONTEXT_FIELD', index, field: 'argumentsInit', value: argumentsInit });
    } else {
      dispatch({ type: 'SET_CONTEXT_FIELD', field: 'argumentsInit', value: argumentsInit });
    }
  };


  const handleDescriptionChange = (description: string, index?: number) => {
    if (index !== undefined) {
      dispatch({ type: 'SET_SUB_QUESTION_FIELD', index, field: 'description', value: description });
    } else {
      dispatch({ type: 'SET_FIELD', field: 'description', value: description });
    }
  };

  return {
    state,
    dispatch,
    handleSubQuestionQueryableChange,
    handleTopicChange,
    handleSubtopicChange,
    handleQuantifiableChange,
    handleSubclassChange,
    handleArgumentChange,
    handleArgumentInit,
    handleDescriptionChange,
  };
};

export default useQuestionGeneration;