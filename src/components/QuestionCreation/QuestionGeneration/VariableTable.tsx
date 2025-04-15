import type React from "react"
import { useState } from "react"
import {
  TableContainer,
  Paper,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  FormControl,
  Select,
  MenuItem,
  TextField,
  Tooltip,
} from "@mui/material"
import type { Variable, Quantifiable, VariableItem, GeneratedContext } from "../../../utils/api/QuestionGenerationAPI"
import type { ContextBlockType, InputDetailsType } from "../../../reducer/questionGenerationReducer"
import CodeSnippetEditor from "../CodeSnippetEditor"

interface VariableTableProps {
  variables: Variable
  quantifiables: Quantifiable[]
  selectedQuantifiables: { [key: string]: string }
  selectedSubclasses: { [key: string]: string }
  variableArguments: { [key: string]: { [arg: string]: unknown } }
  handleQuantifiableChange: (variableName: string, value: string) => void
  handleSubclassChange: (variableName: string, subclassName: string) => void
  handleArgumentChange: (variableName: string, argName: string, value: unknown) => void
  isAlgoTable: boolean
  isInnerInputTable: boolean
  context: ContextBlockType
  outerContext: ContextBlockType
  copyInputDetails: (variableName: string, inputName: string, inputDetailIndex: number, args?: string[]) => void
  useGeneratedInput: { [key: string]: number }
  setUseGeneratedInput: (value: React.SetStateAction<{ [key: string]: number }>) => void
  setInputInit: (value: React.SetStateAction<{ [key: string]: { [arg: string]: unknown } }>) => void
  generatedContext: GeneratedContext
  outerGeneratedContext: GeneratedContext
  copyInputDetailsItem: (inputDetailsType: InputDetailsType) => void
}

const VariableTable: React.FC<VariableTableProps> = ({
  variables,
  quantifiables,
  selectedQuantifiables,
  selectedSubclasses,
  variableArguments,
  handleQuantifiableChange,
  handleSubclassChange,
  handleArgumentChange,
  isAlgoTable,
  isInnerInputTable,
  context,
  outerContext,
  copyInputDetails,
  setInputInit,
  useGeneratedInput,
  setUseGeneratedInput,
  generatedContext,
  outerGeneratedContext,
  copyInputDetailsItem,
}) => {
  const isQuantifiable = (type: string): boolean => {
    return type === "Quantifiable" || type.includes("Quantifiable") || type.includes("list")
  }
  const [codeSnippets, setCodeSnippets] = useState<{ [key: string]: string }>({})
  const contextDetails = isInnerInputTable ? outerContext.details : context.details
  const referenceGeneratedInputs = isInnerInputTable ? outerGeneratedContext : generatedContext
  const handleUseGeneratedInputChange = (
    useOuterInput: boolean,
    variable: VariableItem,
    inputDetailIndex: number | null,
  ) => {
    if (useOuterInput) {
      handleUseOuterGeneratedInputChange(variable, inputDetailIndex)
    } else {
      handleAlgoUseGeneratedInputChange(variable, inputDetailIndex)
    }
  }

  const handleAlgoUseGeneratedInputChange = (variable: VariableItem, inputDetailIndex: number | null) => {
    if (
      inputDetailIndex !== null &&
      inputDetailIndex !== -1 &&
      contextDetails[inputDetailIndex].type == "input" &&
      (contextDetails[inputDetailIndex].details as InputDetailsType).inputInit &&
      Object.keys((contextDetails[inputDetailIndex].details as InputDetailsType).inputInit || {}).length > 0
    ) {
      const inputDetails = contextDetails[inputDetailIndex].details as InputDetailsType
      const inputName = Object.keys(inputDetails.inputInit ?? {})[0] ?? "";
      const inputInit = (inputDetails.inputInit ?? {})[inputName]
      copyInputDetails(variable.name, inputName, inputDetailIndex, variable.arguments?.map((arg) => arg.name))
      setInputInit((prev) => ({ ...prev, [variable.name]: inputInit }));
      setUseGeneratedInput((prev) => ({ ...prev, [variable.name]: inputDetailIndex }))
    }
    if (inputDetailIndex === -1) {
      copyInputDetails(variable.name, "", inputDetailIndex, [])
      setUseGeneratedInput((prev) => ({ ...prev, [variable.name]: inputDetailIndex }))
      setInputInit((prev) => {
        const newInputInit = { ...prev }
        delete newInputInit[variable.name]
        return newInputInit
      })
    }
  }

  const handleUseOuterGeneratedInputChange = (variable: VariableItem, inputDetailIndex: number | null) => {
    if (
      inputDetailIndex !== null &&
      inputDetailIndex !== -1 &&
      contextDetails[inputDetailIndex].type == "input" &&
      (contextDetails[inputDetailIndex].details as InputDetailsType).inputInit &&
      Object.keys((contextDetails[inputDetailIndex].details as InputDetailsType).inputInit || {}).length > 0
    ) {
      copyInputDetailsItem(contextDetails[inputDetailIndex].details as InputDetailsType)
      setUseGeneratedInput((prev) => ({ ...prev, [variable.name]: inputDetailIndex }))
    }
    if (inputDetailIndex === -1) {
      setUseGeneratedInput((prev) => ({ ...prev, [variable.name]: inputDetailIndex }))
      copyInputDetailsItem({
        ...context.details[0].details as InputDetailsType,
        inputVariableArguments: {},
        inputInit: {},
        selectedQuantifiables: {},
      })
    }
  }

  const handleCodeSnippetChange = (variableName: string, argName: string, code: string) => {
    setCodeSnippets((prev) => ({
      ...prev,
      [`${variableName}_${argName}`]: code,
    }))
    handleArgumentChange(variableName, argName, code)
  }

  const hasQuantifiable = variables.some((variable) => isQuantifiable(variable.type))
  // const hasSubclasses = variables.some((variable) => variable.subclasses && variable.subclasses.length > 0)
  const hasMatchingInput = (type: string) => contextDetails && contextDetails.length > 0 && contextDetails.some((_contextDetails, index) => checkArgumentType(type, index))

  const checkArgumentType = (type: string, inputDetailIndex: number): boolean => {
    if (contextDetails.length > inputDetailIndex) {
      if (contextDetails[inputDetailIndex].type == "algo") {
        return false
      }
      const inputDetail = contextDetails[inputDetailIndex].details as InputDetailsType
      if (inputDetail.inputInit) {
        const inputInitKeys = Object.keys(inputDetail.inputInit)
        if (inputInitKeys.length > 0) {
          // if (type.includes(inputInitKeys[0])) {
          // Extract base type name before any generic parameters
          const baseType = type.split('[')[0];
          const inputBaseType = inputInitKeys[0].split('[')[0];

          // Check if base types match exactly
          if (baseType === inputBaseType) {
            return true;
          } else if (baseType == 'bool' && inputBaseType == 'BoolInput') {
            return true;
          }
        }
      }
      const inputVariable = inputDetail.inputVariables
      if (inputVariable.length > 0) {
        if (type.includes(inputVariable[0].type)) {
          return true
        }
      }
    }
    return false
  }

  return (
    <TableContainer
      component={Paper}
      sx={{
        marginBottom: 2,
        border: "1px solid #e0e0e0",
        borderRadius: "8px",
        boxShadow: "0 2px 4px rgba(0,0,0,0.05)",
        overflow: "hidden",
      }}
    >
      <Table size="small">
        <TableHead>
          <TableRow sx={{ backgroundColor: "#f5f5f5" }}>
            <TableCell
              sx={{
                width: "20%",
                fontWeight: "bold",
                fontSize: "0.875rem",
                padding: "12px 16px",
                borderBottom: "2px solid #e0e0e0",
              }}
            >
              Variable Name
            </TableCell>
            <TableCell
              sx={{
                width: "20%",
                fontWeight: "bold",
                fontSize: "0.875rem",
                padding: "12px 16px",
                borderBottom: "2px solid #e0e0e0",
              }}
            >
              Variable Type
            </TableCell>
            {hasQuantifiable && (
              <TableCell
                sx={{
                  width: "20%",
                  fontWeight: "bold",
                  fontSize: "0.875rem",
                  padding: "12px 16px",
                  borderBottom: "2px solid #e0e0e0",
                }}
              >
                Element type
              </TableCell>
            )}
            {/* {hasSubclasses && (
              <TableCell
                sx={{
                  width: "20%",
                  fontWeight: "bold",
                  fontSize: "0.875rem",
                  padding: "12px 16px",
                  borderBottom: "2px solid #e0e0e0",
                }}
              >
                Subclass
              </TableCell>
            )} */}
            <TableCell
              sx={{
                width: "20%",
                fontWeight: "bold",
                fontSize: "0.875rem",
                padding: "12px 16px",
                borderBottom: "2px solid #e0e0e0",
              }}
            >
              Options
            </TableCell>
            {(isAlgoTable || isInnerInputTable) && (
              <TableCell
                sx={{
                  width: "20%",
                  fontWeight: "bold",
                  fontSize: "0.875rem",
                  padding: "12px 16px",
                  borderBottom: "2px solid #e0e0e0",
                }}
              >
                Use Generated Input
              </TableCell>
            )}
          </TableRow>
        </TableHead>
        <TableBody>
          {variables.map((variable, index) => {
            const disableFields =
              (isAlgoTable || isInnerInputTable) &&
              hasMatchingInput(variable.type) &&
              useGeneratedInput[variable.name] != -1 &&
              useGeneratedInput[variable.name] != undefined
            return (
              <TableRow
                key={index}
                sx={{
                  "&:nth-of-type(odd)": { backgroundColor: "#fafafa" },
                  "&:hover": { backgroundColor: "#f0f7ff" },
                  transition: "background-color 0.2s",
                }}
              >
                <TableCell
                  sx={{
                    width: "20%",
                    padding: "12px 16px",
                    fontSize: "0.875rem",
                    fontWeight: 500,
                  }}
                >
                  {variable.name}
                </TableCell>
                {(!variable.subclasses || variable.subclasses.length == 0) && (<TableCell
                  sx={{
                    width: "20%",
                    padding: "12px 16px",
                    fontSize: "0.875rem",
                    color: "#666",
                  }}
                >
                  {variable.type}
                </TableCell>)
                }
                {hasQuantifiable ? (
                  <TableCell sx={{ width: "20%", padding: "12px 16px" }}>
                    {isQuantifiable(variable.type) ? (
                      <FormControl
                        fullWidth
                        disabled={disableFields}
                        sx={{
                          "& .MuiOutlinedInput-root": {
                            borderRadius: "4px",
                            fontSize: "0.875rem",
                          },
                        }}
                      >
                        <Select
                          value={selectedQuantifiables[variable.name] || ""}
                          onChange={(e) => handleQuantifiableChange(variable.name, e.target.value)}
                          size="small"
                          sx={{
                            "&.Mui-disabled": {
                              backgroundColor: "#f5f5f5",
                            },
                          }}
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
                        size="small"
                        sx={{
                          "& .MuiInputBase-input": {
                            fontSize: "0.875rem",
                          },
                          "& .MuiOutlinedInput-root": {
                            backgroundColor: "#f5f5f5",
                          },
                        }}
                      />
                    )}
                  </TableCell>
                ) : null}
                {variable.subclasses && variable.subclasses.length > 0 && (
                  <TableCell sx={{ width: "20%", padding: "12px 16px" }}>
                    {variable.subclasses && variable.subclasses.length > 0 ? (
                      <FormControl
                        fullWidth
                        disabled={disableFields}
                        sx={{
                          "& .MuiOutlinedInput-root": {
                            borderRadius: "4px",
                            fontSize: "0.875rem",
                          },
                        }}
                      >
                        <Select
                          value={selectedSubclasses[variable.name] || ""}
                          onChange={(e) => handleSubclassChange(variable.name, e.target.value)}
                          size="small"
                          sx={{
                            "&.Mui-disabled": {
                              backgroundColor: "#f5f5f5",
                            },
                          }}
                        >
                          {variable.subclasses.map((subclass) => (
                            <MenuItem key={subclass.name} value={subclass.name}>
                              {subclass.name}
                            </MenuItem>
                          ))}
                        </Select>
                      </FormControl>
                    ) : (
                      <TextField
                        fullWidth
                        value="N/A"
                        disabled
                        size="small"
                        sx={{
                          "& .MuiInputBase-input": {
                            fontSize: "0.875rem",
                          },
                          "& .MuiOutlinedInput-root": {
                            backgroundColor: "#f5f5f5",
                          },
                        }}
                      />
                    )}
                  </TableCell>
                )}
                {selectedSubclasses[variable.name] &&
                variables
                  .find((v) => v.name === variable.name)
                  ?.subclasses?.find((s) => s.name === selectedSubclasses[variable.name])?.arguments ? (
                  <TableCell sx={{ width: "20%", padding: "12px 16px" }}>
                    {variables
                      .find((v) => v.name === variable.name)
                      ?.subclasses?.find((s) => s.name === selectedSubclasses[variable.name])
                      ?.arguments.map((arg, idx) =>
                        arg.type.includes("typing.Callable") ? (
                          <div key={arg.name} style={{ marginBottom: idx !== 0 ? "16px" : "0" }}>
                            <CodeSnippetEditor
                              title={`${arg.name} (${arg.type})`}
                              codeSnippet={codeSnippets[`${variable.name}_${arg.name}`] || ""}
                              setCodeSnippet={(code) => handleCodeSnippetChange(variable.name, arg.name, code)}
                            />
                          </div>
                        ) : (
                          <TextField
                            key={arg.name}
                            label={`${arg.name} (${arg.type})`}
                            value={variableArguments[variable.name]?.[arg.name] || ""}
                            onChange={(e) => handleArgumentChange(variable.name, arg.name, e.target.value)}
                            fullWidth
                            size="small"
                            sx={{
                              marginBottom: 2,
                              "& .MuiInputBase-input": {
                                fontSize: "0.875rem",
                              },
                              "& .MuiInputLabel-root": {
                                fontSize: "0.875rem",
                              },
                              "&.Mui-disabled": {
                                backgroundColor: "#f5f5f5",
                              },
                            }}
                            disabled={disableFields}
                          />
                        ),
                      )}
                  </TableCell>
                ) : (
                  variable.arguments && (
                    <TableCell sx={{ width: "20%", padding: "12px 16px" }}>
                      {variable.arguments?.map((arg, idx) =>
                        arg.type === "typing.Callable" ? (
                          <div key={arg.name} style={{ marginBottom: idx !== 0 ? "16px" : "0" }}>
                            <CodeSnippetEditor
                              title={`${arg.name} (${arg.type})`}
                              codeSnippet={codeSnippets[`${variable.name}_${arg.name}`] || ""}
                              setCodeSnippet={(code) => handleCodeSnippetChange(variable.name, arg.name, code)}
                            />
                          </div>
                        ) : (
                          <TextField
                            key={arg.name}
                            label={`${arg.name} (${arg.type})`}
                            value={variableArguments[variable.name]?.[arg.name] || ""}
                            onChange={(e) => handleArgumentChange(variable.name, arg.name, e.target.value)}
                            fullWidth
                            size="small"
                            sx={{
                              marginBottom: idx !== (variable.arguments?.length ?? 0) - 1 ? 2 : 0,
                              "& .MuiInputBase-input": {
                                fontSize: "0.875rem",
                              },
                              "& .MuiInputLabel-root": {
                                fontSize: "0.875rem",
                              },
                              "&.Mui-disabled": {
                                backgroundColor: "#f5f5f5",
                              },
                            }}
                            disabled={disableFields}
                          />
                        ),
                      )}
                    </TableCell>
                  )
                )}
                {(isAlgoTable || isInnerInputTable) && (
                  <TableCell sx={{ width: "20%", padding: "12px 16px" }}>
                    <FormControl
                      fullWidth
                      sx={{
                        "& .MuiOutlinedInput-root": {
                          borderRadius: "4px",
                          fontSize: "0.875rem",
                        },
                      }}
                    >
                      <Select
                        value={
                          useGeneratedInput[variable.name] !== undefined
                            ? useGeneratedInput[variable.name].toString()
                            : "-1"
                        }
                        onChange={(e) =>
                          handleUseGeneratedInputChange(
                            isInnerInputTable,
                            variable,
                            e.target.value === "-1" ? -1 : Number.parseInt(e.target.value),
                          )
                        }
                        displayEmpty
                        size="small"
                        sx={{ maxWidth: 500 }}
                        MenuProps={{
                          PaperProps: {
                            style: {
                              maxWidth: 500,
                              maxHeight: 300,
                              boxShadow: "0 4px 20px rgba(0,0,0,0.1)",
                            },
                          },
                        }}
                      >
                        <MenuItem value="-1">
                          <em>None</em>
                        </MenuItem>
                        {contextDetails.map(
                          (contextDetail, idx) =>
                            contextDetail.type == "input" &&
                            checkArgumentType(variable.type, idx) &&
                            referenceGeneratedInputs &&
                            referenceGeneratedInputs[idx] && (
                                <MenuItem key={idx} value={idx.toString()}>
                                  <Tooltip
                                    key={idx}
                                    title={`Input: ${Object.values(referenceGeneratedInputs[idx].context)[0]}`}
                                    arrow
                                    placement="top"
                                  >
                                    <span>{`Input: ${Object.values(referenceGeneratedInputs[idx].context)[0]}`}</span>
                                  </Tooltip>
                                </MenuItem>
                            ),
                        )}
                      </Select>
                    </FormControl>
                  </TableCell>
                )}
              </TableRow>
            )
          })}
        </TableBody>
      </Table>
    </TableContainer>
  )
}

export default VariableTable

