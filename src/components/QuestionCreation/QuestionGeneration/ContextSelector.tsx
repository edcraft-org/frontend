"use client"

import type React from "react"
import { useState } from "react"
import {
  Box,
  FormControl,
  Select,
  MenuItem,
  Typography,
  Card,
  CardContent,
  Divider,
  Chip,
  type SelectChangeEvent,
  Tooltip,
} from "@mui/material"
import { AlgoDetailsType, ContextBlockType, Detail, InputDetailsType, SubQuestionType } from "../../../reducer/questionGenerationReducer"
import { formatText, formatValue } from "../../../utils/format"
import GeneratedVariablesTable from "../../Table/GeneratedVariablesTable"
import GeneratedAlgosTable from "../../Table/GeneratedAlgosTable"
import { GeneratedContext } from "../../../utils/api/QuestionGenerationAPI"

interface ContextSelectorProps {
  subQuestion: SubQuestionType;
  outerGeneratedContext: GeneratedContext
  outerContext: ContextBlockType
  setSelectedDetail: (detail: Detail) => void
}

const ContextSelector: React.FC<ContextSelectorProps> = ({ subQuestion, outerGeneratedContext, outerContext, setSelectedDetail }) => {
  const [selectedContextIndex, setSelectedContextIndex] = useState<number>(() => {
    const selectedDetail = subQuestion.context.selectedDetail
    if (selectedDetail) {
      const index = outerContext.details.findIndex(context => {
        if (context.type !== selectedDetail.type) {
          return false;
        }

        if (context.type === 'algo' && selectedDetail.type === 'algo') {
          const contextDetails = context.details as AlgoDetailsType;
          const selectedDetails = selectedDetail.details as AlgoDetailsType;

          return (
            contextDetails.selectedTopic === selectedDetails.selectedTopic &&
            contextDetails.selectedSubtopic === selectedDetails.selectedSubtopic &&
            JSON.stringify(contextDetails.argumentsInit) === JSON.stringify(selectedDetails.argumentsInit)
          );
        }

        if (context.type === 'input' && selectedDetail.type === 'input') {
          const contextDetails = context.details as InputDetailsType;
          const selectedDetails = selectedDetail.details as InputDetailsType;

          return (
            JSON.stringify(contextDetails.inputPath) === JSON.stringify(selectedDetails.inputPath) &&
            JSON.stringify(contextDetails.inputInit) === JSON.stringify(selectedDetails.inputInit)
          );
        }

        return false;
      });

      // if (index !== -1) {
      //   setSelectedDetail(outerContext.details[index]);
      // }

      return index;
    }
    return -1;
  });

  const handleContextChange = (event: SelectChangeEvent<string>) => {
    const index = Number.parseInt(event.target.value)
    setSelectedContextIndex(index)
    setSelectedDetail(outerContext.details[index])
  }

  const getContextTypeLabel = (type: "input" | "algo") => {
    return type === "input" ? "Input" : "Algorithm"
  }

  const selectedContext = selectedContextIndex !== -1 ? outerGeneratedContext[selectedContextIndex] : null

  return (
    <Box sx={{ width: "100%", mb: 2 }}>
      <Typography variant="h6" gutterBottom>
        Apply Context
      </Typography>

      <FormControl fullWidth sx={{ mb: 3 }}>
        <Select
          value={selectedContextIndex === -1 ? "-1" : selectedContextIndex.toString()}
          onChange={handleContextChange}
          displayEmpty
          sx={{
            borderRadius: "8px",
            "& .MuiOutlinedInput-notchedOutline": {
              borderColor: "rgba(0, 0, 0, 0.23)",
            },
          }}
        >
          <MenuItem value="-1">
            <em>Select a context</em>
          </MenuItem>
          {outerGeneratedContext.map((context, idx) => (
            <MenuItem key={idx} value={idx.toString()}>
              <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <Chip
                size="small"
                label={getContextTypeLabel(context.type)}
                color={context.type === "input" ? "primary" : "secondary"}
                sx={{
                    mr: 1,
                    width: 80,
                    '& .MuiChip-label': {
                    width: '100%',
                    textAlign: 'center'
                    }
                }}
                />
                {context.type === "algo" ? (
                    <Box>
                        <Typography variant="body1" sx={{ mb: 1 }}>
                            {formatText(context.name ?? (outerContext.details[idx].details as AlgoDetailsType).selectedSubtopic)}
                        </Typography>
                        {Object.entries(context.context).map(([name, value], valueIndex) => (
                            <Box
                                key={`${idx}-${name}`}
                                sx={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    mb: valueIndex !== Object.entries(context.context).length - 1 ? 0.5 : 0,
                                    fontSize: '0.875rem'
                                }}
                            >
                                <Box sx={{
                                    fontWeight: 500,
                                    mr: 1,
                                    fontSize: '0.875rem'
                                }}>
                                    {name}:&nbsp;
                                </Box>
                                <Tooltip
                                    title={formatValue(value)}
                                    placement="top-start"
                                    arrow
                                    sx={{
                                        backgroundColor: "#fff",
                                        boxShadow: "0 4px 20px rgba(0,0,0,0.1)",
                                        maxWidth: "300px",
                                    }}
                                >
                                    <span style={{
                                        color: '#666',
                                        fontSize: '0.875rem',
                                        maxWidth: '400px',
                                        overflow: 'hidden',
                                        textOverflow: 'ellipsis',
                                        whiteSpace: 'nowrap',
                                        display: 'inline-block'
                                    }}>
                                        {formatValue(value)}
                                    </span>
                                </Tooltip>
                            </Box>
                        ))}
                    </Box>
                ) : (
                    <Box>
                        {Object.entries(context.context).map(([name, value], valueIndex) => (
                        <Box
                            key={`${idx}-${name}`}
                            sx={{
                                display: 'flex',
                                alignItems: 'center',
                                mb: valueIndex !== Object.entries(context.context).length - 1 ? 1 : 0
                            }}
                        >
                            <Box sx={{ fontWeight: 500 }}>{name}:&nbsp;</Box>
                            <Tooltip
                                title={formatValue(value)}
                                placement="top-start"
                                arrow
                                sx={{
                                    backgroundColor: "#fff",
                                    boxShadow: "0 4px 20px rgba(0,0,0,0.1)",
                                    maxWidth: "300px",
                                }}
                            >
                                <span style={{
                                    color: '#666',
                                    maxWidth: '400px',
                                    overflow: 'hidden',
                                    textOverflow: 'ellipsis',
                                    whiteSpace: 'nowrap',
                                    display: 'inline-block'
                                }}>
                                    {formatValue(value)}
                                </span>
                            </Tooltip>
                        </Box>
                        ))}
                    </Box>
                )}
              </Box>
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      {selectedContext && (
        <Card variant="outlined" sx={{ mt: 2, borderRadius: "8px" }}>
          <CardContent>
            <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
              <Chip
                size="small"
                label={getContextTypeLabel(selectedContext.type)}
                color={selectedContext.type === "input" ? "primary" : "secondary"}
                sx={{ mr: 1 }}
              />
            </Box>

            <Divider sx={{ mb: 2 }} />
            {selectedContext.type === "input" ? (
                <GeneratedVariablesTable key={selectedContext.id} generatedVariables={selectedContext} />
            ) : (
                <GeneratedAlgosTable key={selectedContext.id} generatedVariables={selectedContext} contextDetail={outerContext.details[selectedContextIndex]} />
            )}
          </CardContent>
        </Card>
      )}
    </Box>
  )
}

export default ContextSelector
