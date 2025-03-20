import { useReducer } from 'react';
import { reducer, initialState, InputDetailsType, Detail, AlgoDetailsType } from '../reducer/questionGenerationReducer';
import { getQueryables, getAlgoVariables, getQueryableVariables, getQuantifiables, getUserQueryables, getUserAlgoVariables, getInputQueryables, getInputQueryableVariables, listInputVariable, getUserInputVariables, getUserQueryableVariables, getUserInputQueryableVariables, getUserInputQueryables } from '../utils/api/QuestionGenerationAPI';

const useQuestionGeneration = () => {
  const [state, dispatch] = useReducer(reducer, initialState);

  const handleTopicChange = async (topic: string, index?: number) => {
    const updateAlgoDetails = (details: Detail[]) => {
      const updatedDetails = details ? [...details] : [];
      if (updatedDetails.length === 0 ||
          updatedDetails[updatedDetails.length - 1].type === 'input' ||
          (updatedDetails[updatedDetails.length - 1].type === 'algo' &&
           'argumentsInit' in updatedDetails[updatedDetails.length - 1].details &&
           Object.keys((updatedDetails[updatedDetails.length - 1].details as AlgoDetailsType).argumentsInit || {}).length > 0)) {

        updatedDetails.push({
          type: 'algo',
          details: {
            selectedTopic: topic,
            selectedSubtopic: '',
            selectedQuantifiables: {},
            selectedSubclasses: {},
            algoVariables: [],
            variableArguments: {},
            argumentsInit: {},
            userAlgoCode: '',
            userEnvCode: [],
          }
        });
      } else {
        updatedDetails[updatedDetails.length - 1] = {
          type: 'algo',
          details: {
            selectedTopic: topic,
            selectedSubtopic: '',
            selectedQuantifiables: {},
            selectedSubclasses: {},
            algoVariables: [],
            variableArguments: {},
            argumentsInit: {},
            userAlgoCode: '',
            userEnvCode: [],
          }
        };
      }
      return updatedDetails;
    };

    try {
      if (index !== undefined) {
        const details = state.subQuestions[index].context.details || [];
        const updatedDetails = updateAlgoDetails([...details]);
        dispatch({
          type: 'SET_SUB_QUESTION_CONTEXT_FIELD',
          index,
          field: 'details',
          value: updatedDetails
        });
      } else {
        const details = state.context.details || [];
        const updatedDetails = updateAlgoDetails([...details]);
        dispatch({
          type: 'SET_CONTEXT_FIELD',
          field: 'details',
          value: updatedDetails
        });
      }
    } catch (error) {
      console.error('Error updating topic:', error);
    }
  };

  const handleSubtopicChange = async (subtopic: string, index?: number) => {
    const updateAlgoDetails = async (details: Detail[]) => {
      if (details.length === 0) {
        return details;
      }
      const updatedAlgoDetails = [...details]
      const lastInputDetail = updatedAlgoDetails[updatedAlgoDetails.length - 1];
      if (lastInputDetail.type == 'input') {
        return updatedAlgoDetails;
      }
      const algoTypeDetails = lastInputDetail.details as AlgoDetailsType;
      try {
        const algoVariables = await getAlgoVariables(algoTypeDetails.selectedTopic, subtopic);
        updatedAlgoDetails[updatedAlgoDetails.length - 1] = {
          type: 'algo',
          details: {
            ...algoTypeDetails,
            selectedSubtopic: subtopic,
            algoVariables: algoVariables,
          }
        };

        if (index) {
          getQuantifiables()
            .then(quantifiables => dispatch({ type: 'SET_SUB_QUESTION_CONTEXT_FIELD', index, field: 'quantifiables', value: quantifiables }))
            .catch(error => console.error('Error fetching quantifiables:', error));
          handleArgumentInit({}, index);
        } else {
          getQuantifiables()
            .then(quantifiables => dispatch({ type: 'SET_QUANTIFIABLES', quantifiables }))
            .catch(error => console.error('Error fetching quantifiables:', error));
        }
        return updatedAlgoDetails;
      } catch (error) {
        console.error('Error fetching algorithm variables:', error);
        return updatedAlgoDetails;
      }
    };
    if (index !== undefined) {
      const updatedDetails = await updateAlgoDetails([...state.subQuestions[index].context.details]);
      dispatch({type: 'SET_SUB_QUESTION_CONTEXT_FIELD', index, field: 'details', value: updatedDetails});
    } else {
      const updatedDetails = await updateAlgoDetails([...state.context.details]);
      dispatch({type: 'SET_CONTEXT_FIELD', field: 'details', value: updatedDetails});
    }
  };

  const handleInputPathChange = async (inputPath: { [key: string]: unknown }, index?: number) => {
    const fetchInputVariables = async () => {
      try {
        return await listInputVariable({ input_path: inputPath });
      } catch (error) {
        console.error('Error fetching input variables:', error);
        return [];
      }
    };

    const updateInputDetails = async (details: Detail[]) => {
      const updatedDetails = details ? [...details] : [];
      const inputVariables = await fetchInputVariables();
      if (updatedDetails.length === 0 ||
        updatedDetails[updatedDetails.length - 1].type === 'algo' ||
        (updatedDetails[updatedDetails.length - 1].type === 'input' &&
         'inputInit' in updatedDetails[updatedDetails.length - 1].details &&
         Object.keys((updatedDetails[updatedDetails.length - 1].details as InputDetailsType).inputInit || {}).length > 0)) {
        updatedDetails.push({
          type: 'input',
          details: {
            inputPath,
            inputVariables,
            inputVariableArguments: {},
            inputInit: {},
            selectedQuantifiables: {},
          }
        });
      } else {
        updatedDetails[updatedDetails.length - 1] = {
          type: 'input',
          details: {
            inputPath,
            inputVariables,
            inputVariableArguments: {},
            inputInit: {},
            selectedQuantifiables: {},
          }
        };
      }

      return updatedDetails;
    };
    const context = index !== undefined ? state.subQuestions[index].context : state.context;

    if (index !== undefined) {
      const updatedDetails = await updateInputDetails([...context.details]);
      dispatch({type: 'SET_SUB_QUESTION_CONTEXT_FIELD', index, field: 'details', value: updatedDetails});
      getQuantifiables()
      .then(quantifiables => dispatch({ type: 'SET_SUB_QUESTION_CONTEXT_FIELD', index, field: 'quantifiables', value: quantifiables }))
      .catch(error => console.error('Error fetching quantifiables:', error));
    } else {
      const updatedDetails = await updateInputDetails([...context.details]);
      dispatch({ type: 'SET_CONTEXT_FIELD', field: 'details', value: updatedDetails});
      getQuantifiables()
      .then(quantifiables => dispatch({ type: 'SET_QUANTIFIABLES', quantifiables }))
      .catch(error => console.error('Error fetching quantifiables:', error));
    }
  };

  const handleSubQuestionQueryableChange = async (index: number, queryable: string) => {
    if (state.subQuestions[index].context.selectedDetail == undefined) {
      return
    }
    const selectedAlgoDetail = state.subQuestions[index].context.selectedDetail.details as AlgoDetailsType;
    const selectedTopic = selectedAlgoDetail.selectedTopic
    const selectedSubtopic = selectedAlgoDetail.selectedSubtopic
    const userEnvCode = selectedAlgoDetail.userEnvCode
    const userAlgoCode = selectedAlgoDetail.userAlgoCode
    if (queryable) {
      dispatch({ type: 'SET_SUB_QUESTION_FIELD', index, field: 'selectedQueryable', value: queryable });
      if (userAlgoCode) {
        try {
          const data = await getUserQueryableVariables(queryable, userAlgoCode, userEnvCode);
          dispatch({ type: 'SET_SUB_QUESTION_FIELD', index, field: 'queryVariables', value: data });
        } catch (error) {
          console.error('Error fetching queryable variables for subquestion:', error);
        }
        return
      }
      if (selectedTopic && selectedSubtopic) {
        try {
          const data = await getQueryableVariables(selectedTopic, selectedSubtopic, queryable);
          dispatch({ type: 'SET_SUB_QUESTION_FIELD', index, field: 'queryVariables', value: data });
        } catch (error) {
          console.error('Error fetching queryable variables for subquestion:', error);
        }
      }
      dispatch({ type: 'SET_SUB_QUESTION_FIELD', index, field: 'selectedInputQueryable', value: '' });
      dispatch({ type: 'SET_SUB_QUESTION_FIELD', index, field: 'inputQueryVariables', value: [] });
    } else {
      dispatch({ type: 'SET_SUB_QUESTION_FIELD', index, field: 'queryVariables', value: [] });
    }
  };

  const handleSubQuestionInputQueryableChange = async (index: number, queryable: string) => {
    if (state.subQuestions[index].context.selectedDetail == undefined) {
      return
    }
    const selectedInputDetail = state.subQuestions[index].context.selectedDetail.details as InputDetailsType;
    if (queryable) {
      dispatch({ type: 'SET_SUB_QUESTION_FIELD', index, field: 'selectedInputQueryable', value: queryable });
      const userEnvCode = selectedInputDetail.userEnvCode
      if (userEnvCode) {
        try {
          const data = await getUserInputQueryableVariables(queryable, userEnvCode);
          dispatch({ type: 'SET_SUB_QUESTION_FIELD', index, field: 'inputQueryVariables', value: data });
        } catch (error) {
          console.error('Error fetching queryable variables for subquestion:', error);
        }
        return
      }
      if (Object.keys(selectedInputDetail.inputPath).length > 0) {
        try {
          const selectedInputPath = selectedInputDetail.inputPath;

          const data = await getInputQueryableVariables(selectedInputPath, queryable);
          dispatch({ type: 'SET_SUB_QUESTION_FIELD', index, field: 'inputQueryVariables', value: data });

        } catch (error) {
          console.error('Error fetching queryable variables for subquestion:', error);
        }
      }
      dispatch({ type: 'SET_SUB_QUESTION_FIELD', index, field: 'selectedQueryable', value: '' });
      dispatch({ type: 'SET_SUB_QUESTION_FIELD', index, field: 'queryVariables', value: [] });
    } else {
      dispatch({ type: 'SET_SUB_QUESTION_FIELD', index, field: 'inputQueryVariables', value: [] });
    }
  };

  const handleQuantifiableChange = (variableName: string, value: string, index?: number) => {
    const updateAlgoDetails = (details: Detail[]) => {
      if (details.length === 0) {
        return details;
      }

      const updatedDetails = [...details];
      const lastDetail = updatedDetails[updatedDetails.length - 1];
      if (lastDetail.type == 'input') {
        return details;
      }
      const algoTypeDetails = lastDetail.details as AlgoDetailsType;
      const selectedQuantifiables = algoTypeDetails.selectedQuantifiables || {};

      if (algoTypeDetails.argumentsInit && Object.keys(algoTypeDetails.argumentsInit).length === 0) {
        updatedDetails[updatedDetails.length - 1] = {
          type: 'algo',
          details: {
            ...algoTypeDetails,
            selectedQuantifiables: {
              ...selectedQuantifiables,
              [variableName]: value,
            },
          }
        };
      } else {
        updatedDetails.push({
          type: 'algo',
          details: {
            selectedTopic: algoTypeDetails.selectedTopic,
            selectedSubtopic: algoTypeDetails.selectedSubtopic,
            selectedQuantifiables: {
              ...selectedQuantifiables,
              [variableName]: value,
            },
            selectedSubclasses: {...algoTypeDetails.selectedSubclasses},
            algoVariables: {...algoTypeDetails.algoVariables},
            variableArguments: {...algoTypeDetails.variableArguments},
            argumentsInit: {},
            userAlgoCode: algoTypeDetails.userAlgoCode,
            userEnvCode: algoTypeDetails.userEnvCode
          }
        });
      }
      return updatedDetails;
    };

    if (index !== undefined) {
      dispatch({type: 'SET_SUB_QUESTION_CONTEXT_FIELD', index, field: 'details', value: updateAlgoDetails([...state.subQuestions[index].context.details])});
    } else {
      dispatch({type: 'SET_CONTEXT_FIELD', field: 'details', value: updateAlgoDetails([...state.context.details])});
    }
  };

  const handleInputQuantifiableChange = (variableName: string, value: string, index?: number) => {
    const updateInputDetails = (inputDetails: Detail[]) => {
      if (inputDetails.length === 0) {
        return inputDetails;
      }

      const updatedInputDetails = [...inputDetails];
      const lastInputDetail = updatedInputDetails[updatedInputDetails.length - 1];
      if (lastInputDetail.type == 'algo') {
        return inputDetails;
      }
      const inputTypeDetails = lastInputDetail.details as InputDetailsType;
      const selectedQuantifiables = inputTypeDetails.selectedQuantifiables || {};

      if (inputTypeDetails.inputInit && Object.keys(inputTypeDetails.inputInit).length === 0) {
        updatedInputDetails[updatedInputDetails.length - 1] = {
          type: 'input',
          details: {
            ...inputTypeDetails,
            selectedQuantifiables: {
              ...selectedQuantifiables,
              [variableName]: value,
            },
          }
        };
      } else {
        updatedInputDetails.push({
          type: 'input',
          details: {
            inputPath: { ...inputTypeDetails.inputPath },
            inputVariables: [...inputTypeDetails.inputVariables],
            inputVariableArguments: { ...inputTypeDetails.inputVariableArguments },
            inputInit: {},
            selectedQuantifiables: {
              ...selectedQuantifiables,
              [variableName]: value,
            },
          }
        });
      }

      return updatedInputDetails;
    };

    if (index !== undefined) {
      dispatch({type: 'SET_SUB_QUESTION_CONTEXT_FIELD', index, field: 'details', value: updateInputDetails([...state.subQuestions[index].context.details])});
    } else {
      dispatch({type: 'SET_CONTEXT_FIELD', field: 'details', value: updateInputDetails([...state.context.details])});
    }
  };

  const handleSubclassChange = (variableName: string, subclassName: string, index?: number) => {
    const updateAlgoDetails = (details: Detail[]) => {
      if (details.length === 0) {
        return details;
      }

      const updatedDetails = [...details];
      const lastDetail = updatedDetails[updatedDetails.length - 1];
      if (lastDetail.type === 'input') {
        return details;
      }

      const algoTypeDetails = lastDetail.details as AlgoDetailsType;

      if (algoTypeDetails.argumentsInit && Object.keys(algoTypeDetails.argumentsInit).length === 0) {
        updatedDetails[updatedDetails.length - 1] = {
          type: 'algo',
          details: {
            ...algoTypeDetails,
            selectedSubclasses: {
              ...algoTypeDetails.selectedSubclasses,
              [variableName]: subclassName
            },
            variableArguments: {
            }
          }
        };
      } else {
        updatedDetails.push({
          type: 'algo',
          details: {
            selectedTopic: algoTypeDetails.selectedTopic,
            selectedSubtopic: algoTypeDetails.selectedSubtopic,
            selectedQuantifiables: { ...algoTypeDetails.selectedQuantifiables },
            selectedSubclasses: {
              ...algoTypeDetails.selectedSubclasses,
              [variableName]: subclassName
            },
            algoVariables: { ...algoTypeDetails.algoVariables },
            variableArguments: {
            },
            argumentsInit: {},
            userAlgoCode: algoTypeDetails.userAlgoCode,
            userEnvCode: algoTypeDetails.userEnvCode
          }
        });
      }
      return updatedDetails;
    };

    if (index !== undefined) {
      dispatch({
        type: 'SET_SUB_QUESTION_CONTEXT_FIELD',
        index,
        field: 'details',
        value: updateAlgoDetails([...state.subQuestions[index].context.details])
      });
    } else {
      dispatch({
        type: 'SET_CONTEXT_FIELD',
        field: 'details',
        value: updateAlgoDetails([...state.context.details])
      });
    }
  };

  const handleArgumentChange = (variableName: string, argName: string, value: unknown, index?: number) => {
    const updateAlgoDetails = (details: Detail[]) => {
      if (details.length == 0) {
        return details;
      }

      const updatedDetails = [...details];
      const lastDetail = updatedDetails[updatedDetails.length - 1];
      if (lastDetail.type == 'input') {
        return details;
      }
      const algoTypeDetails = lastDetail.details as AlgoDetailsType;
      const variableArguments = algoTypeDetails.variableArguments || {};

      if (algoTypeDetails.argumentsInit && Object.keys(algoTypeDetails.argumentsInit).length === 0) {
        updatedDetails[updatedDetails.length - 1] = {
          type: 'algo',
          details: {
            ...algoTypeDetails,
            variableArguments: {
              ...variableArguments,
              [variableName]: {
                ...variableArguments[variableName],
                [argName]: value,
              },
            },
          }
        };
      } else {
        updatedDetails.push({
          type: 'algo',
          details: {
            selectedTopic: algoTypeDetails.selectedTopic,
            selectedSubtopic: algoTypeDetails.selectedSubtopic,
            selectedQuantifiables: { ...algoTypeDetails.selectedQuantifiables },
            selectedSubclasses: {...algoTypeDetails.selectedSubclasses},
            algoVariables: {...algoTypeDetails.algoVariables},
            variableArguments: {
              ...variableArguments,
              [variableName]: {
                ...variableArguments[variableName],
                [argName]: value,
              },
            },
            argumentsInit: {},
            userAlgoCode: algoTypeDetails.userAlgoCode,
            userEnvCode: algoTypeDetails.userEnvCode,
          }
        });
      }
      return updatedDetails;
    };
    if (index !== undefined) {
      dispatch({type: 'SET_SUB_QUESTION_CONTEXT_FIELD', index, field: 'details', value: updateAlgoDetails([...state.subQuestions[index].context.details])});
    } else {
      dispatch({type: 'SET_CONTEXT_FIELD', field: 'details', value: updateAlgoDetails([...state.context.details])});
    }
  };

  const handleInputArgumentChange = (variableName: string, argName: string, value: unknown, index?: number) => {
    const updateInputDetails = (inputDetails: Detail[]) => {
      if (inputDetails.length === 0) {
        return inputDetails;
      }

      const updatedInputDetails = [...inputDetails];
      const lastInputDetail = updatedInputDetails[updatedInputDetails.length - 1];
      if (lastInputDetail.type == 'algo') {
        return inputDetails;
      }
      const inputTypeDetails = lastInputDetail.details as InputDetailsType;
      const inputVariableArguments = inputTypeDetails.inputVariableArguments || {};

      if (inputTypeDetails.inputInit && Object.keys(inputTypeDetails.inputInit).length === 0) {
        updatedInputDetails[updatedInputDetails.length - 1] = {
          type: 'input',
          details: {
            ...inputTypeDetails,
            inputVariableArguments: {
              ...inputVariableArguments,
              [variableName]: {
                ...inputVariableArguments[variableName],
                [argName]: value,
              },
            },
          }
        };
      } else {
        updatedInputDetails.push({
          type: 'input',
          details: {
            inputPath: { ...inputTypeDetails.inputPath },
            inputVariables: [...inputTypeDetails.inputVariables],
            inputVariableArguments: {
              ...inputVariableArguments,
              [variableName]: {
                ...inputVariableArguments[variableName],
                [argName]: value,
              },
            },
            inputInit: {},
            selectedQuantifiables: { ...inputTypeDetails.selectedQuantifiables },
          }
        });
      }
      return updatedInputDetails;
      };
    if (index !== undefined) {
      dispatch({type: 'SET_SUB_QUESTION_CONTEXT_FIELD', index, field: 'details', value: updateInputDetails([...state.subQuestions[index].context.details])});
    } else {
      dispatch({type: 'SET_CONTEXT_FIELD', field: 'details', value: updateInputDetails([...state.context.details])});
    }
  };

  const copyInputDetails = (variableName: string, inputName: string, inputDetailIndex: number, args?: string[], index?: number) => {
    const updateAlgoDetails = (details: Detail[]) => {
      if (details.length === 0) {
        return details;
      }
      const updatedDetails = [...details];
      const lastDetail = updatedDetails[updatedDetails.length - 1];
      if (lastDetail.type === 'input') {
        return details;
      }
      const algoTypeDetails = lastDetail.details as AlgoDetailsType;

      if (algoTypeDetails.argumentsInit && Object.keys(algoTypeDetails.argumentsInit).length === 0) {
        if (inputDetailIndex === -1) {
          updatedDetails[updatedDetails.length - 1] = {
            type: 'algo',
            details: {
              ...algoTypeDetails,
              variableArguments: {},
              selectedQuantifiables: {},
              selectedSubclasses: {}
            }
          };
        } else {
          const newDetails: AlgoDetailsType = { ...algoTypeDetails };
          // Handle arguments
          if (args && args.length > 0 && details[inputDetailIndex].type === "input") {
            const inputTypeDetails = details[inputDetailIndex].details as InputDetailsType;

            if (inputTypeDetails.inputVariableArguments &&
                Object.keys(inputTypeDetails.inputVariableArguments).length > 0) {
              newDetails.variableArguments = {
                ...algoTypeDetails.variableArguments,
                [variableName]: args.reduce((acc, argName) => ({
                  ...acc,
                  [argName]: inputTypeDetails.inputVariableArguments[inputName][argName]
                }), {})
              };
            }
          }

          // Handle quantifiables
          if (details[inputDetailIndex].details.selectedQuantifiables) {
            newDetails.selectedQuantifiables = {
              ...algoTypeDetails.selectedQuantifiables,
              [variableName]: details[inputDetailIndex].details.selectedQuantifiables[inputName]
            };
          }

          // Handle subclass
          const selectedSubclass = algoTypeDetails.algoVariables.find(
            (variable) => variable.name === variableName
          )?.subclasses?.find(
            (subclass) => subclass.name === inputName
          );
          if (selectedSubclass) {
            newDetails.selectedSubclasses = {
              ...algoTypeDetails.selectedSubclasses,
              [variableName]: inputName
            };

            if (selectedSubclass?.arguments && ((details[inputDetailIndex].details as InputDetailsType).inputVariableArguments[inputName])) {
              const initialArguments: { [arg: string]: unknown } = {};

              selectedSubclass.arguments.forEach(arg => {
                initialArguments[arg.name] = (details[inputDetailIndex].details as InputDetailsType).inputVariableArguments[inputName][arg.name];
              });
              newDetails.variableArguments = {
                ...algoTypeDetails.variableArguments,
                [variableName]: initialArguments
              };
            }
          }

          // Handle userEnvCode
          const inputEnvCode = (details[inputDetailIndex].details as InputDetailsType).userEnvCode;
          if (newDetails.userEnvCode && inputEnvCode && !newDetails.userEnvCode.includes(inputEnvCode)) {
            newDetails.userEnvCode = [...newDetails.userEnvCode, inputEnvCode];
          }

          updatedDetails[updatedDetails.length - 1] = {
            type: 'algo',
            details: newDetails
          };
        }
      } else {
        const newDetails: AlgoDetailsType = {
          selectedTopic: algoTypeDetails.selectedTopic,
          selectedSubtopic: algoTypeDetails.selectedSubtopic,
          selectedQuantifiables: { ...algoTypeDetails.selectedQuantifiables },
          selectedSubclasses: { ...algoTypeDetails.selectedSubclasses },
          algoVariables: { ...algoTypeDetails.algoVariables },
          variableArguments: { ...algoTypeDetails.variableArguments },
          argumentsInit: {},
          userAlgoCode: algoTypeDetails.userAlgoCode,
          userEnvCode: algoTypeDetails.userEnvCode
        };

        // Handle arguments
        if (args && args.length > 0 && details[inputDetailIndex].type === "input") {
          const inputTypeDetails = details[inputDetailIndex].details as InputDetailsType;
          if (inputTypeDetails.inputVariableArguments &&
              Object.keys(inputTypeDetails.inputVariableArguments).length > 0) {
            newDetails.variableArguments = {
              ...algoTypeDetails.variableArguments,
              [variableName]: args.reduce((acc, argName) => ({
                ...acc,
                [argName]: inputTypeDetails.inputVariableArguments[inputName][argName]
              }), {})
            };
          }
        }

        // Handle quantifiables
        if (details[inputDetailIndex].details.selectedQuantifiables) {
          newDetails.selectedQuantifiables = {
            ...algoTypeDetails.selectedQuantifiables,
            [variableName]: details[inputDetailIndex].details.selectedQuantifiables[inputName]
          };
        }

        // Handle subclass
        const selectedSubclass = algoTypeDetails.algoVariables.find(
          (variable) => variable.name === variableName
        )?.subclasses?.find(
          (subclass) => subclass.name === inputName
        );
        if (selectedSubclass) {

          newDetails.selectedSubclasses = {
            ...algoTypeDetails.selectedSubclasses,
            [variableName]: inputName
          };

          const initialArguments: { [arg: string]: unknown } = {};
          if (selectedSubclass?.arguments && ((details[inputDetailIndex].details as InputDetailsType).inputVariableArguments[inputName])) {
            selectedSubclass.arguments.forEach(arg => {
              initialArguments[arg.name] = (details[inputDetailIndex].details as InputDetailsType).inputVariableArguments[inputName][arg.name];
            });
            newDetails.variableArguments = {
              ...algoTypeDetails.variableArguments,
              [variableName]: initialArguments
            };
          }
        }

        // Handle userEnvCode
        const inputEnvCode = (details[inputDetailIndex].details as InputDetailsType).userEnvCode;
        newDetails.userEnvCode = inputEnvCode ? [inputEnvCode] : [];

        updatedDetails.push({
          type: 'algo',
          details: newDetails
        });
      }
      return updatedDetails;
    };

    if (index !== undefined) {
      dispatch({
        type: 'SET_SUB_QUESTION_CONTEXT_FIELD',
        index,
        field: 'details',
        value: updateAlgoDetails([...state.subQuestions[index].context.details])
      });
    } else {
      dispatch({
        type: 'SET_CONTEXT_FIELD',
        field: 'details',
        value: updateAlgoDetails([...state.context.details])
      });
    }
  };

  const handleArgumentInit = (argumentsInit: { [key: string]: { [arg: string]: unknown } }, index?: number) => {
    const updateAlgoDetails = (details: Detail[]) => {
      if (details.length === 0) {
        return details;
      }

      const updatedDetails = [...details];
      const lastAlgoDetail = updatedDetails[updatedDetails.length - 1];
      if (lastAlgoDetail.type == 'input') {
        return details;
      }
      const algoTypeDetails = lastAlgoDetail.details as AlgoDetailsType;

      if (algoTypeDetails.argumentsInit && Object.keys(algoTypeDetails.argumentsInit).length === 0) {
        updatedDetails[updatedDetails.length - 1] = {
          type: 'algo',
          details: { ...algoTypeDetails, argumentsInit }
        };
      } else {
        updatedDetails.push({
          type: 'algo',
          details: {
            selectedTopic: algoTypeDetails.selectedTopic,
            selectedSubtopic: algoTypeDetails.selectedSubtopic,
            selectedQuantifiables: { ...algoTypeDetails.selectedQuantifiables },
            selectedSubclasses: {...algoTypeDetails.selectedSubclasses},
            algoVariables: {...algoTypeDetails.algoVariables},
            variableArguments: {...algoTypeDetails.variableArguments},
            argumentsInit: argumentsInit,
            userAlgoCode: algoTypeDetails.userAlgoCode,
            userEnvCode: algoTypeDetails.userEnvCode
          }
        });
      }
      return updatedDetails;
    };

    if (index !== undefined) {
      const updatedAlgoDetails = updateAlgoDetails([...state.subQuestions[index].context.details]);
      dispatch({ type: 'SET_SUB_QUESTION_CONTEXT_FIELD', index, field: 'details', value: updatedAlgoDetails });
    } else {
      const updatedAlgoDetails = updateAlgoDetails([...state.context.details]);
      dispatch({ type: 'SET_CONTEXT_FIELD', field: 'details', value: updatedAlgoDetails });
    }
  };

  const handleInputInit = (inputInit: { [key: string]: { [arg: string]: unknown } }, index?: number) => {
    const updateInputDetails = (inputDetails: Detail[]) => {
      if (inputDetails.length === 0) {
        return inputDetails;
      }

      const updatedInputDetails = [...inputDetails];
      const lastInputDetail = updatedInputDetails[updatedInputDetails.length - 1];
      if (lastInputDetail.type == 'algo') {
        return inputDetails;
      }
      const inputTypeDetails = lastInputDetail.details as InputDetailsType;

      if (inputTypeDetails.inputInit && Object.keys(inputTypeDetails.inputInit).length === 0) {
        updatedInputDetails[updatedInputDetails.length - 1] = {
          type: 'input',
          details: { ...inputTypeDetails, inputInit }
        };
      } else {
        updatedInputDetails.push({
          type: 'input',
          details: {
            inputPath: { ...inputTypeDetails.inputPath },
            inputVariables: [...inputTypeDetails.inputVariables],
            inputVariableArguments: { ...inputTypeDetails.inputVariableArguments },
            inputInit,
            selectedQuantifiables: { ...inputTypeDetails.selectedQuantifiables },
          }
        });
      }
      return updatedInputDetails;
    };

    if (index !== undefined) {
      const updatedInputDetails = updateInputDetails([...state.subQuestions[index].context.details]);
      dispatch({ type: 'SET_SUB_QUESTION_CONTEXT_FIELD', index, field: 'details', value: updatedInputDetails });
    } else {
      const updatedInputDetails = updateInputDetails([...state.context.details]);
      dispatch({ type: 'SET_CONTEXT_FIELD', field: 'details', value: updatedInputDetails });
    }
  };

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

  const setUserAlgoCode = async (userAlgoCode: string, index?: number) => {
    const updateAlgoDetails = async (details: Detail[]) => {
      if (details.length === 0) {
        return details;
      }

      const updatedDetails = [...details];
      const lastDetail = updatedDetails[updatedDetails.length - 1];
      if (lastDetail.type !== 'algo') {
        return details;
      }

      const algoTypeDetails = lastDetail.details as AlgoDetailsType;

      const updatedEnvCode: string[] = [];
      updatedDetails.forEach(detail => {
        if (detail.type === 'input') {
          const inputDetails = detail.details as InputDetailsType;
          if (inputDetails.userEnvCode) {
            updatedEnvCode.push(inputDetails.userEnvCode);
          }
        }
      });
      const algoVariables = await getUserAlgoVariables(userAlgoCode, updatedEnvCode);

      updatedDetails[updatedDetails.length - 1] = {
        type: 'algo',
        details: {
          ...algoTypeDetails,
          algoVariables,
          userAlgoCode,
          userEnvCode: updatedEnvCode
        }
      };

      return updatedDetails;
    };

    if (index !== undefined) {
      const updatedDetails = await updateAlgoDetails([...state.subQuestions[index].context.details]);
      dispatch({ type: 'SET_SUB_QUESTION_CONTEXT_FIELD', index, field: 'details', value: updatedDetails });

      getQuantifiables()
      .then(quantifiables => dispatch({ type: 'SET_SUB_QUESTION_CONTEXT_FIELD', index, field: 'quantifiables', value: quantifiables }))
      .catch(error => console.error('Error fetching quantifiables:', error));

    } else {
      const updatedDetails = await updateAlgoDetails([...state.context.details]);
      dispatch({ type: 'SET_CONTEXT_FIELD', field: 'details', value: updatedDetails });
      getQuantifiables()
      .then(quantifiables => dispatch({ type: 'SET_QUANTIFIABLES', quantifiables }))
      .catch(error => console.error('Error fetching quantifiables:', error));
    }
  };

  const setUserEnvCode = (userEnvCode: string, index?: number) => {
    const updateInputDetails = (details: Detail[]) => {
      if (details.length === 0) {
        return details;
      }

      const updatedDetails = [...details];
      const lastDetail = updatedDetails[updatedDetails.length - 1];
      if (lastDetail.type !== 'input') {
        return details;
      }

      const inputTypeDetails = lastDetail.details as InputDetailsType;

      updatedDetails[updatedDetails.length - 1] = {
        type: 'input',
        details: {
          ...inputTypeDetails,
          userEnvCode
        }
      };

      return updatedDetails;
    };

    if (index !== undefined) {
      const updatedDetails = updateInputDetails([...state.subQuestions[index].context.details]);
      dispatch({ type: 'SET_SUB_QUESTION_CONTEXT_FIELD', index, field: 'details', value: updatedDetails });

      if (updatedDetails[updatedDetails.length - 1]?.type === 'input') {
        getUserInputVariables(userEnvCode)
          .then(inputVariables => {
            const updatedInputDetails = { ...updatedDetails[updatedDetails.length - 1] };
            (updatedInputDetails.details as InputDetailsType).inputVariables = inputVariables;
            updatedDetails[updatedDetails.length - 1] = updatedInputDetails;
            dispatch({ type: 'SET_SUB_QUESTION_CONTEXT_FIELD', index, field: 'details', value: updatedDetails });
          })
          .catch(error => console.error('Error fetching user input variables:', error));
        getQuantifiables()
          .then(quantifiables => dispatch({ type: 'SET_SUB_QUESTION_CONTEXT_FIELD', index, field: 'quantifiables', value: quantifiables }))
          .catch(error => console.error('Error fetching quantifiables:', error));
      }
    } else {
      const updatedDetails = updateInputDetails([...state.context.details]);
      dispatch({ type: 'SET_CONTEXT_FIELD', field: 'details', value: updatedDetails });

      if (updatedDetails[updatedDetails.length - 1]?.type === 'input') {
        getUserInputVariables(userEnvCode)
          .then(inputVariables => {
            const updatedInputDetails = { ...updatedDetails[updatedDetails.length - 1] };
            (updatedInputDetails.details as InputDetailsType).inputVariables = inputVariables;
            updatedDetails[updatedDetails.length - 1] = updatedInputDetails;
            dispatch({ type: 'SET_CONTEXT_FIELD', field: 'details', value: updatedDetails });
          })
          .catch(error => console.error('Error fetching user input variables:', error));
        getQuantifiables()
          .then(quantifiables => dispatch({ type: 'SET_QUANTIFIABLES', quantifiables }))
          .catch(error => console.error('Error fetching quantifiables:', error));
      }
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

  const setInputQueryable = (inputPath: { [key: string]: unknown }, index?: number) => {
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

  const addDetailsItem = (isAlgo: boolean, index?: number) => {
    const updateDetails = (details: Detail[]) => {
      if (isAlgo) {
        details.push({
          type: 'algo',
          details: {
            selectedTopic: '',
            selectedSubtopic: '',
            selectedQuantifiables: {},
            selectedSubclasses: {},
            algoVariables: [],
            variableArguments: {},
            argumentsInit: {},
            userAlgoCode: '',
            userEnvCode: [],
          }
        });
      } else {
        details.push({
          type: 'input',
          details: {
            inputPath: {},
            inputVariables: [],
            inputVariableArguments: {},
            inputInit: {},
            selectedQuantifiables: {},
            userEnvCode: '',
          }
        });
      }
      return details;
    };

    if (index !== undefined) {
      const subQuestion = state.subQuestions[index];
      const updatedDetails = updateDetails([...subQuestion.context.details]);
      dispatch({ type: 'SET_SUB_QUESTION_CONTEXT_FIELD', index, field: 'details', value: updatedDetails });
    } else {
      const updatedDetails = updateDetails([...state.context.details]);
      dispatch({ type: 'SET_CONTEXT_FIELD', field: 'details', value: updatedDetails });
    }
  }

  const removeDetailsItem = (detailsIndex: number, deleteGenerated: boolean, index?: number, ) => {
    const updateDetails = (details: Detail[]) => {
      if (detailsIndex == -1) {
        details.splice(details.length - 1, 1);
      } else {
        const init = details[detailsIndex].type == 'algo' ? (details[detailsIndex].details as AlgoDetailsType).argumentsInit : (details[detailsIndex].details as InputDetailsType).inputInit;
        if (deleteGenerated || (init && Object.keys(init).length == 0)) {
          details.splice(detailsIndex, 1);
        }
      }
      return details;
    };

    if (index !== undefined) {
      const subQuestion = state.subQuestions[index];
      const updatedDetails = updateDetails([...subQuestion.context.details]);
      dispatch({ type: 'SET_SUB_QUESTION_CONTEXT_FIELD', index, field: 'details', value: updatedDetails });
    } else {
      const updatedDetails = updateDetails([...state.context.details]);
      dispatch({ type: 'SET_CONTEXT_FIELD', field: 'details', value: updatedDetails });
    }
  }

  const copyInputDetailsItem = (inputDetailsItem: InputDetailsType, index?: number) => {
    const updateDetails = (details: Detail[]) => {
      const copiedItem = { ...inputDetailsItem };
      details[details.length - 1] = {
        type: 'input',
        details: copiedItem
      };
      return details;
    }

    if (index !== undefined) {
      const subQuestion = state.subQuestions[index];
      const updatedDetails = updateDetails([...subQuestion.context.details]);
      dispatch({ type: 'SET_SUB_QUESTION_CONTEXT_FIELD', index, field: 'details', value: updatedDetails });
    } else {
      const updatedDetails = updateDetails([...state.context.details]);
      dispatch({ type: 'SET_CONTEXT_FIELD', field: 'details', value: updatedDetails });
    }
  }

  const setSelectedDetail = (detail: Detail, index?: number) => {
    if (index !== undefined) {
      dispatch({
        type: 'SET_SUB_QUESTION_CONTEXT_FIELD',
        index,
        field: 'selectedDetail',
        value: detail
      });
      if (detail.type === 'input') {
        const inputDetails = detail.details as InputDetailsType;
        if (inputDetails.userEnvCode) {
          getUserInputQueryables(inputDetails.userEnvCode)
          .then(queryables => dispatch({ type: 'SET_SUB_QUESTION_FIELD', index, field: 'inputQueryables', value: queryables }))
          .catch(error => console.error('Error fetching input queryables:', error));
          dispatch({ type: 'SET_SUB_QUESTION_FIELD', index, field: 'selectedQueryable', value: '' });
          return
        }
        if (Object.keys(inputDetails.inputPath).length > 0) {
          getInputQueryables({ input_path: inputDetails.inputPath })
          .then(queryables => dispatch({ type: 'SET_SUB_QUESTION_FIELD', index, field: 'inputQueryables', value: queryables }))
          .catch(error => console.error('Error fetching input queryables:', error));
        }
      } else {
        const algoDetails = detail.details as AlgoDetailsType;
        if (algoDetails.userAlgoCode) {

          const userEnvCode = algoDetails.userEnvCode;

          getUserQueryables(algoDetails.userAlgoCode, userEnvCode)
            .then(queryables => dispatch({ type: 'SET_SUB_QUESTION_FIELD', index, field: 'queryables', value: queryables }))
            .catch(error => console.error('Error fetching user queryables:', error));
          dispatch({ type: 'SET_SUB_QUESTION_FIELD', index, field: 'selectedQueryable', value: '' });
          return
        }
        if ((detail.details as AlgoDetailsType).selectedTopic && (detail.details as AlgoDetailsType).selectedSubtopic) {
          getQueryables((detail.details as AlgoDetailsType).selectedTopic, (detail.details as AlgoDetailsType).selectedSubtopic)
          .then(queryables => dispatch({ type: 'SET_SUB_QUESTION_FIELD', index, field: 'queryables', value: queryables }))
          .catch(error => console.error('Error fetching queryables:', error));
        }
      }
      dispatch({ type: 'SET_SUB_QUESTION_FIELD', index, field: 'selectedQueryable', value: '' });
    } else {
      dispatch({
        type: 'SET_CONTEXT_FIELD',
        field: 'selectedDetail',
        value: detail
      });
    }
  }

  const handleAddGeneratedOutput = (input_path: { [key: string]: unknown }, input_init: { [key: string]: { [arg: string]: unknown } }, user_env_code: string, index?: number) => {
    if (index !== undefined) {
      const subQuestion = state.subQuestions[index];
      const updatedDetails = [...subQuestion.context.details];
      updatedDetails.push({
        type: 'input',
        details: {
          inputPath: input_path,
          inputVariables: [],
          inputVariableArguments: {},
          inputInit: input_init,
          selectedQuantifiables: {},
          userEnvCode: user_env_code,
        }
      });
      dispatch({ type: 'SET_SUB_QUESTION_CONTEXT_FIELD', index, field: 'details', value: updatedDetails });
    } else {
      const updatedDetails = [...state.context.details];
      updatedDetails.push({
        type: 'input',
        details: {
          inputPath: input_path,
          inputVariables: [],
          inputVariableArguments: {},
          inputInit: input_init,
          selectedQuantifiables: {},
          userEnvCode: '',
        }
      });
      dispatch({ type: 'SET_CONTEXT_FIELD', field: 'details', value: updatedDetails });
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
    resetState,
    setInputQueryable,
    addDetailsItem,
    removeDetailsItem,
    copyInputDetailsItem,
    setSelectedDetail,
    handleAddGeneratedOutput,
  };
};

export default useQuestionGeneration;