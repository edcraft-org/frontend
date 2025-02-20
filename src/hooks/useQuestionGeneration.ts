import { useReducer, useEffect } from 'react';
import { reducer, initialState } from '../reducer/questionGenerationReducer';
import { getQueryables, getAlgoVariables, getQueryableVariables, getQuantifiables, getUserQueryables, getUserAlgoVariables } from '../utils/api/QuestionGenerationAPI';

const useQuestionGeneration = () => {
  const [state, dispatch] = useReducer(reducer, initialState);

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
        .catch(error => {
          dispatch({ type: 'SET_FIELD', field: 'queryables', value: [] })
          state.subQuestions.forEach((_, index) => {
            dispatch({ type: 'SET_SUB_QUESTION_FIELD', index, field: 'queryables', value: [] });
            dispatch({ type: 'SET_SUB_QUESTION_FIELD', index, field: 'selectedQueryable', value: '' });
          });
          console.error('Error fetching queryables:', error)
        });
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
    dispatch({ type: 'SET_CONTEXT_FIELD', field: 'argumentsInit', value: {} });
  }, [state.context.selectedSubtopic]);

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
          .catch(error => {
            dispatch({ type: 'SET_SUB_QUESTION_FIELD', index, field: 'queryables', value: [] })
            dispatch({ type: 'SET_SUB_QUESTION_FIELD', index, field: 'selectedQueryable', value: '' });
            console.error('Error fetching queryables:', error)
          });
        handleArgumentInit({}, index);
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

  const handleInputArgumentChange = (variableName: string, argName: string, value: any, index?: number) => {
    if (index !== undefined) {
      dispatch({ type: 'SET_SUB_QUESTION_CONTEXT_FIELD', index, field: 'inputVariableArguments', value: { ...state.subQuestions[index].context.inputVariableArguments, [variableName]: { ...state.subQuestions[index].context.inputVariableArguments[variableName], [argName]: value } } });
    } else {
      dispatch({ type: 'SET_CONTEXT_FIELD', field: 'inputVariableArguments', value: { ...state.context.inputVariableArguments, [variableName]: { ...state.context.inputVariableArguments[variableName], [argName]: value } } });
    }
  };

  const copyInputArgument = (variableName: string, inputName: string, argName: string, index?: number) => {
    if (index !== undefined) {
      dispatch({ type: 'SET_SUB_QUESTION_CONTEXT_FIELD', index, field: 'variableArguments', value: { ...state.subQuestions[index].context.variableArguments, [variableName]: { ...state.subQuestions[index].context.variableArguments[variableName], [argName]: state.subQuestions[index].context.inputVariableArguments[inputName][argName] } }});
    } else {
      dispatch({ type: 'SET_CONTEXT_FIELD', field: 'variableArguments', value: { ...state.context.variableArguments, [variableName]: { ...state.context.variableArguments[variableName], [argName]: state.context.inputVariableArguments[inputName][argName] } }});
    }
  }


  const handleArgumentInit = (argumentsInit: { [key: string]: { [arg: string]: any } }, index?: number) => {
    if (index !== undefined) {
      dispatch({ type: 'SET_SUB_QUESTION_CONTEXT_FIELD', index, field: 'argumentsInit', value: argumentsInit });
    } else {
      dispatch({ type: 'SET_CONTEXT_FIELD', field: 'argumentsInit', value: argumentsInit });
    }
  };

  const handleInputInit = (inputInit: { [key: string]: { [arg: string]: any } }, index?: number) => {
    if (index !== undefined) {
      dispatch({ type: 'SET_SUB_QUESTION_CONTEXT_FIELD', index, field: 'inputInit', value: inputInit });
    } else {
      dispatch({ type: 'SET_CONTEXT_FIELD', field: 'inputInit', value: inputInit });
    }
  };

  const copyInputInit = (variableName: string, inputName: string, index?: number) => {
    if (index !== undefined) {
      if (state.subQuestions[index].context.inputInit) {
        dispatch({ type: 'SET_SUB_QUESTION_CONTEXT_FIELD', index, field: 'argumentsInit', value: { ...state.subQuestions[index].context.argumentsInit, [variableName]: state.subQuestions[index].context.inputInit[inputName] } });
      }
    } else {
      if (state.context.inputInit) {
        dispatch({ type: 'SET_CONTEXT_FIELD', field: 'argumentsInit', value: { ...state.context.argumentsInit, [variableName]: state.context.inputInit[inputName] } });
      }
    }
  }

  const handleDescriptionChange = (description: string, index?: number) => {
    if (index !== undefined) {
      dispatch({ type: 'SET_SUB_QUESTION_FIELD', index, field: 'description', value: description });
    } else {
      dispatch({ type: 'SET_FIELD', field: 'description', value: description });
    }
  };

  const handleNumOptionsChange = (numOptions: number, index: number) => {
    dispatch({ type: 'SET_SUB_QUESTION_FIELD', index, field: 'numOptions', value: numOptions });
  };


  const setUserAlgoCode = (userAlgoCode: string, index?: number) => {
    if (index !== undefined) {
      dispatch({ type: 'SET_SUB_QUESTION_CONTEXT_FIELD', index, field: 'userAlgoCode', value: userAlgoCode });
      getUserAlgoVariables(userAlgoCode)
        .then(algoVariables => dispatch({ type: 'SET_SUB_QUESTION_CONTEXT_FIELD', index, field: 'algoVariables', value: algoVariables }))
        .catch(error => console.error('Error fetching algorithm variables:', error));
      getUserQueryables(userAlgoCode)
        .then(queryables => dispatch({ type: 'SET_SUB_QUESTION_FIELD', index, field: 'queryables', value: queryables }))
        .catch(error => console.error('Error fetching user queryables:', error));
    } else {
      dispatch({ type: 'SET_CONTEXT_FIELD', field: 'userAlgoCode', value: userAlgoCode });
      getUserAlgoVariables(userAlgoCode)
        .then(algoVariables => dispatch({ type: 'SET_ALGO_VARIABLES', algoVariables }))
        .catch(error => console.error('Error fetching algorithm variables:', error));
      getUserQueryables(userAlgoCode)
        .then(queryables => {
          dispatch({ type: 'SET_FIELD', field: 'queryables', value: queryables });
          state.subQuestions.forEach((_, index) => {
            dispatch({ type: 'SET_SUB_QUESTION_FIELD', index, field: 'queryables', value: queryables });
          });
        })
        .catch(error => console.error('Error fetching user queryables:', error));
    }
  };

  const setUserEnvCode = (userEnvCode: string, index?: number) => {
    if (index !== undefined) {
      dispatch({ type: 'SET_SUB_QUESTION_CONTEXT_FIELD', index, field: 'userEnvCode', value: userEnvCode });
    } else {
      dispatch({ type: 'SET_CONTEXT_FIELD', field: 'userEnvCode', value: userEnvCode });
    }
  };

  const setUserQueryableCode = (userQueryableCode: string, index?: number) => {
    if (index !== undefined) {
      dispatch({ type: 'SET_SUB_QUESTION_FIELD', index, field: 'userQueryableCode', value: userQueryableCode });
    } else {
      dispatch({ type: 'SET_FIELD', field: 'userQueryableCode', value: userQueryableCode });
    }
  };

  const resetState = () => {
    dispatch({ type: 'RESET_STATE' });
  }

  return {
    state,
    dispatch,
    handleSubQuestionQueryableChange,
    handleTopicChange,
    handleSubtopicChange,
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
    resetState,
  };
};

export default useQuestionGeneration;