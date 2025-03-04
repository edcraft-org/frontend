import { useReducer, useEffect } from 'react';
import { reducer, initialState, InputDetailsType } from '../reducer/questionGenerationReducer';
import { getQueryables, getAlgoVariables, getQueryableVariables, getQuantifiables, getUserQueryables, getUserAlgoVariables, getInputQueryables, getInputQueryableVariables, listInputVariable, Variable } from '../utils/api/QuestionGenerationAPI';

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
    const selectedTopic = state.subQuestions[index].context.selectedTopic ? state.subQuestions[index].context.selectedTopic : state.context.selectedTopic;
    const selectedSubtopic = state.subQuestions[index].context.selectedSubtopic ? state.subQuestions[index].context.selectedSubtopic : state.context.selectedSubtopic;
    if (selectedTopic && selectedSubtopic && queryable) {
      try {
        dispatch({ type: 'SET_SUB_QUESTION_FIELD', index, field: 'selectedQueryable', value: queryable });
        const data = await getQueryableVariables(selectedTopic, selectedSubtopic, queryable);
        dispatch({ type: 'SET_SUB_QUESTION_FIELD', index, field: 'queryVariables', value: data });
        dispatch({ type: 'SET_SUB_QUESTION_FIELD', index, field: 'selectedInputQueryable', value: '' });
        dispatch({ type: 'SET_SUB_QUESTION_FIELD', index, field: 'inputQueryVariables', value: [] });
      } catch (error) {
        console.error('Error fetching queryable variables for subquestion:', error);
      }
    } else {
      dispatch({ type: 'SET_SUB_QUESTION_FIELD', index, field: 'queryVariables', value: [] });
    }
  };


  const handleSubQuestionInputQueryableChange = async (index: number, queryable: string) => {
    if (state.subQuestions[index].context.inputDetails.length > 0 && Object.keys(state.subQuestions[index].context.inputDetails[0].inputPath).length > 0 && queryable) {
      try {
        const selectedInputPath = state.subQuestions[index].context.inputDetails[0].inputPath;
        dispatch({ type: 'SET_SUB_QUESTION_FIELD', index, field: 'selectedInputQueryable', value: queryable });
        const data = await getInputQueryableVariables(selectedInputPath, queryable);
        dispatch({ type: 'SET_SUB_QUESTION_FIELD', index, field: 'inputQueryVariables', value: data });
        dispatch({ type: 'SET_SUB_QUESTION_FIELD', index, field: 'selectedQueryable', value: '' });
        dispatch({ type: 'SET_SUB_QUESTION_FIELD', index, field: 'queryVariables', value: [] });
      } catch (error) {
        console.error('Error fetching queryable variables for subquestion:', error);
      }
    } else {
      dispatch({ type: 'SET_SUB_QUESTION_FIELD', index, field: 'inputQueryVariables', value: [] });
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

  const handleInputPathChange = async (inputPath: { [key: string]: any }, index?: number) => {
    const fetchInputVariables = async () => {
      try {
        return await listInputVariable({ input_path: inputPath });
      } catch (error) {
        console.error('Error fetching input variables:', error);
        return [];
      }
    };

    const updateInputDetails = async (inputDetails: InputDetailsType[]) => {
      const inputVariables = await fetchInputVariables();
      const lastInputDetail = inputDetails.length > 0 ? inputDetails[inputDetails.length - 1] : { inputPath: {}, inputVariables: [], inputVariableArguments: {}, inputInit: {} };

      if (
        Object.keys(lastInputDetail.inputVariableArguments).length === 0 &&
        lastInputDetail.inputInit &&
        Object.keys(lastInputDetail.inputInit).length === 0
      ) {
        inputDetails[inputDetails.length - 1] = { ...lastInputDetail, inputPath, inputVariables };
      } else {
        inputDetails.push({ inputPath, inputVariables, inputVariableArguments: {}, inputInit: {} });
      }

      return inputDetails;
    };
    const context = index !== undefined ? state.subQuestions[index].context : state.context;

    if (index !== undefined) {
      const updatedInputDetails = [{ inputPath, inputVariables: [] as Variable, inputVariableArguments: {}, inputInit: {} }];
      const inputVariables = await fetchInputVariables();
      updatedInputDetails[0].inputVariables = inputVariables;
      dispatch({type: 'SET_SUB_QUESTION_CONTEXT_FIELD', index, field: 'inputDetails', value: updatedInputDetails});
      setInputQueryable(inputPath, index);
    } else {
      const updatedInputDetails = await updateInputDetails([...context.inputDetails]);
      dispatch({ type: 'SET_CONTEXT_FIELD', field: 'inputDetails', value: updatedInputDetails});
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
    const updateInputDetails = (inputDetails: InputDetailsType[]) => {
      if (inputDetails.length === 0) {
        return inputDetails;
      }

      const updatedInputDetails = [...inputDetails];
      const lastInputDetail = updatedInputDetails[updatedInputDetails.length - 1];
      const inputVariableArguments = lastInputDetail.inputVariableArguments || {};

      if (lastInputDetail.inputInit && Object.keys(lastInputDetail.inputInit).length === 0) {
        updatedInputDetails[updatedInputDetails.length - 1] = {
          ...lastInputDetail,
          inputVariableArguments: {
            ...inputVariableArguments,
            [variableName]: {
              ...inputVariableArguments[variableName],
              [argName]: value,
            },
          },
        };
      } else {
        updatedInputDetails.push({
          inputPath: { ...lastInputDetail.inputPath },
          inputVariables: [...lastInputDetail.inputVariables],
          inputVariableArguments: {
            ...inputVariableArguments,
            [variableName]: {
              ...inputVariableArguments[variableName],
              [argName]: value,
            },
          },
          inputInit: {},
        });
      }

      return updatedInputDetails;
      };
    if (index !== undefined) {
      const subQuestion = state.subQuestions[index];
      const updatedInputDetails = [{...subQuestion.context.inputDetails[0], inputVariableArguments: { ...subQuestion.context.inputDetails[0].inputVariableArguments, [variableName]: { ...subQuestion.context.inputDetails[0].inputVariableArguments[variableName], [argName]: value } }}];
      dispatch({type: 'SET_SUB_QUESTION_CONTEXT_FIELD', index, field: 'inputDetails', value: updatedInputDetails});
    } else {
      dispatch({type: 'SET_CONTEXT_FIELD', field: 'inputDetails', value: updateInputDetails([...state.context.inputDetails])});
    }
  };

  const copyInputArgument = (variableName: string, inputName: string, argName: string, inputDetailIndex: number, index?: number) => {
    if (index !== undefined) {
      dispatch({ type: 'SET_SUB_QUESTION_CONTEXT_FIELD', index, field: 'variableArguments', value: { ...state.subQuestions[index].context.variableArguments, [variableName]: { ...state.subQuestions[index].context.variableArguments[variableName], [argName]: state.subQuestions[index].context.inputDetails[inputDetailIndex].inputVariableArguments[inputName][argName] } }});
    } else {
      dispatch({ type: 'SET_CONTEXT_FIELD', field: 'variableArguments', value: { ...state.context.variableArguments, [variableName]: { ...state.context.variableArguments[variableName], [argName]: state.context.inputDetails[inputDetailIndex].inputVariableArguments[inputName][argName] } }});
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
    const updateInputDetails = (inputDetails: InputDetailsType[]) => {
      if (inputDetails.length === 0) {
        return [{ inputPath: {}, inputVariables: [], inputVariableArguments: {}, inputInit }];
      }

      const lastInputDetail = { ...inputDetails[inputDetails.length - 1] };

      if (lastInputDetail.inputInit && Object.keys(lastInputDetail.inputInit).length === 0) {
        inputDetails[inputDetails.length - 1] = { ...lastInputDetail, inputInit };
      } else {
        inputDetails.push({
          inputPath: { ...lastInputDetail.inputPath },
          inputVariables: [...lastInputDetail.inputVariables],
          inputVariableArguments: { ...lastInputDetail.inputVariableArguments },
          inputInit,
        });
      }
      return inputDetails;
    };

    if (index !== undefined) {
      const subQuestion = state.subQuestions[index];
      const updatedInputDetails = [{...subQuestion.context.inputDetails[0], inputInit}];
      dispatch({ type: 'SET_SUB_QUESTION_CONTEXT_FIELD', index, field: 'inputDetails', value: updatedInputDetails });
    } else {
      const updatedInputDetails = updateInputDetails([...state.context.inputDetails]);
      dispatch({ type: 'SET_CONTEXT_FIELD', field: 'inputDetails', value: updatedInputDetails });
    }
  };

  const copyInputInit = (variableName: string, inputName: string, inputDetailIndex: number, index?: number) => {
    if (index !== undefined) {
      if (state.subQuestions[index].context.inputDetails[inputDetailIndex].inputInit) {
        dispatch({ type: 'SET_SUB_QUESTION_CONTEXT_FIELD', index, field: 'argumentsInit', value: { ...state.subQuestions[index].context.argumentsInit, [variableName]: state.subQuestions[index].context.inputDetails[inputDetailIndex].inputInit[inputName] } });
      }
    } else {
      if (state.context.inputDetails[inputDetailIndex].inputInit) {
        dispatch({ type: 'SET_CONTEXT_FIELD', field: 'argumentsInit', value: { ...state.context.argumentsInit, [variableName]: state.context.inputDetails[inputDetailIndex].inputInit[inputName] } });
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

  const setInputQueryable = (inputPath: { [key: string]: any }, index?: number) => {
    if (index !== undefined) {
      getInputQueryables({ input_path: inputPath })
        .then(queryables => dispatch({ type: 'SET_SUB_QUESTION_FIELD', index, field: 'inputQueryables', value: queryables }))
        .catch(error => console.error('Error fetching input queryables:', error));
    } else {
      getInputQueryables({ input_path: inputPath })
      .then(queryables => {
        dispatch({ type: 'SET_FIELD', field: 'inputQueryables', value: queryables });
        state.subQuestions.forEach((_, index) => {
          dispatch({ type: 'SET_SUB_QUESTION_FIELD', index, field: 'inputQueryables', value: queryables });
        });
      })
      .catch(error => {
        dispatch({ type: 'SET_FIELD', field: 'inputQueryables', value: [] })
        state.subQuestions.forEach((_, index) => {
          dispatch({ type: 'SET_SUB_QUESTION_FIELD', index, field: 'inputQueryables', value: [] });
        });
        console.error('Error fetching inputQueryables:', error)
      });
    }
  }

  const removeInputDetailsItem = (inputDetailsIndex: number, index?: number) => {
    const updateInputDetails = (inputDetails: InputDetailsType[]) => {
      const removedItem = { ...inputDetails[inputDetailsIndex] };
      inputDetails.splice(inputDetailsIndex, 1);
      if (inputDetails.length === 0) {
        inputDetails.push({
          inputPath: removedItem.inputPath,
          inputVariables: removedItem.inputVariables,
          inputVariableArguments: {},
          inputInit: {},
        });
      }
      return inputDetails;
    };

    if (index !== undefined) {
      const subQuestion = state.subQuestions[index];
      const updatedInputDetails = updateInputDetails([...subQuestion.context.inputDetails]);
      dispatch({ type: 'SET_SUB_QUESTION_CONTEXT_FIELD', index, field: 'inputDetails', value: updatedInputDetails });
    } else {
      const updatedInputDetails = updateInputDetails([...state.context.inputDetails]);
      dispatch({ type: 'SET_CONTEXT_FIELD', field: 'inputDetails', value: updatedInputDetails });
    }
  };

  const copyInputDetailsItem = (inputDetailsItem: InputDetailsType, index?: number) => {
    const updateInputDetails = (inputDetails: InputDetailsType[]) => {
      const copiedItem = { ...inputDetailsItem };
      inputDetails[inputDetails.length - 1] = copiedItem;
      return inputDetails;
    };

    if (index !== undefined) {
      const subQuestion = state.subQuestions[index];
      const updatedInputDetails = updateInputDetails([...subQuestion.context.inputDetails]);
      dispatch({ type: 'SET_SUB_QUESTION_CONTEXT_FIELD', index, field: 'inputDetails', value: updatedInputDetails });
    } else {
      const updatedInputDetails = updateInputDetails([...state.context.inputDetails]);
      dispatch({ type: 'SET_CONTEXT_FIELD', field: 'inputDetails', value: updatedInputDetails });
    }
  }

  return {
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
    resetState,
    setInputQueryable,
    removeInputDetailsItem,
    copyInputDetailsItem,
  };
};

export default useQuestionGeneration;