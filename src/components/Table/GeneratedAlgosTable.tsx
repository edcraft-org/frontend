import type React from "react"
import {
  Box,
  TableContainer,
  Paper,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  IconButton,
  Tooltip,
} from "@mui/material"
import DeleteIcon from "@mui/icons-material/Delete"
import BuildIcon from "@mui/icons-material/Build"
import { formatText, formatValue } from "../../utils/format"
import { AlgoDetailsType, Detail } from "../../reducer/questionGenerationReducer"

interface GeneratedVariablesTableProps {
  generatedVariables: {
    id: string;
    type: "input" | "algo";
    context: { [key: string]: unknown },
    context_init: { [key: string]: unknown },
    has_output: boolean,
    name?: string
  }
  contextDetail: Detail
  onDelete?: (id: string, variableName: string) => void
  onGenerateOutput?: () => void
}

const GeneratedAlgosTable: React.FC<GeneratedVariablesTableProps> = ({
  generatedVariables,
  contextDetail,
  onDelete,
  onGenerateOutput
}) => {
  return (
    <Box sx={{ marginY: 2 }}>
      <TableContainer
        component={Paper}
        sx={{
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
                width: onDelete && onGenerateOutput ? "15%" : onDelete || onGenerateOutput ? "20%" : "25%",
                fontWeight: "bold",
                fontSize: "0.875rem",
                padding: "12px 16px",
                borderBottom: "2px solid #e0e0e0",
              }}
            >
              Type
            </TableCell>
            <TableCell
              sx={{
                width: onDelete && onGenerateOutput ? "25%" : onDelete || onGenerateOutput ? "30%" : "35%",
                fontWeight: "bold",
                fontSize: "0.875rem",
                padding: "12px 16px",
                borderBottom: "2px solid #e0e0e0",
              }}
            >
              Algo Type
            </TableCell>
            <TableCell
              sx={{
                width: onDelete && onGenerateOutput ? "25%" : onDelete || onGenerateOutput ? "30%" : "40%",
                fontWeight: "bold",
                fontSize: "0.875rem",
                padding: "12px 16px",
                borderBottom: "2px solid #e0e0e0",
              }}
            >
              Argument Values
            </TableCell>
            {onDelete && (
              <TableCell
                sx={{
                  width: onGenerateOutput ? "15%" : "20%",
                  fontWeight: "bold",
                  fontSize: "0.875rem",
                  padding: "12px 16px",
                  borderBottom: "2px solid #e0e0e0",
                }}
              >
                Delete
              </TableCell>
            )}
            {onGenerateOutput && (
              <TableCell
                sx={{
                  width: onDelete ? "15%" : "20%",
                  fontWeight: "bold",
                  fontSize: "0.875rem",
                  padding: "12px 16px",
                  borderBottom: "2px solid #e0e0e0",
                }}
              >
                Generate Output
              </TableCell>
            )}
          </TableRow>
        </TableHead>
        <TableBody>
          <TableRow
            sx={{
              "&:nth-of-type(odd)": { backgroundColor: "#fafafa" },
              "&:hover": { backgroundColor: "#f0f7ff" },
              transition: "background-color 0.2s",
            }}
          >
            <TableCell
              sx={{
                width: onDelete && onGenerateOutput ? "15%" : onDelete || onGenerateOutput ? "20%" : "25%",
                padding: "12px 16px",
                fontSize: "0.875rem",
                color: "#666",
              }}
            >
              {generatedVariables.type === "input" ? "Input" : "Algorithm"}
            </TableCell>
            <TableCell
              sx={{
                width: onDelete && onGenerateOutput ? "25%" : onDelete || onGenerateOutput ? "30%" : "35%",
                padding: "12px 16px",
                fontSize: "0.875rem",
                fontWeight: 500,
              }}
            >
              {formatText(generatedVariables.name ?? (contextDetail.details as AlgoDetailsType).selectedSubtopic)}
            </TableCell>
            <TableCell
              sx={{
                width: onDelete && onGenerateOutput ? "25%" : onDelete || onGenerateOutput ? "30%" : "40%",
                padding: "12px 16px",
                fontSize: "0.875rem",
              }}
            >
              {Object.entries(generatedVariables.context).map(([name, value], index) => (
                <Box key={name} sx={{ display: 'flex', alignItems: 'center', mb: index !== Object.entries(generatedVariables.context).length - 1 ? 1 : 0 }}>
                  <Box sx={{ fontWeight: 500, mr: 2}}>{name}:</Box>
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
                    <span style={{ color: '#666' }}>{formatValue(value)}</span>
                  </Tooltip>
                </Box>
              ))}
            </TableCell>
            {onDelete && (
              <TableCell
                sx={{
                  width: onGenerateOutput ? "15%" : "20%",
                  padding: "8px 16px",
                }}
              >
                {Object.keys(generatedVariables.context).map((name) => (
                  <IconButton
                    key={name}
                    onClick={() => onDelete(generatedVariables.id, name)}
                    aria-label="delete"
                    size="small"
                    sx={{
                      color: "#f44336",
                      "&:hover": {
                        backgroundColor: "rgba(244, 67, 54, 0.08)",
                      },
                      display: 'block',
                      // mb: 1
                    }}
                  >
                    <DeleteIcon fontSize="small" />
                  </IconButton>
                ))}
              </TableCell>
            )}
            {onGenerateOutput && (
              <TableCell
                sx={{
                  width: onDelete ? "15%" : "20%",
                  padding: "8px 16px",
                }}
              >
                <IconButton
                    // key={name}
                    onClick={() => onGenerateOutput()}
                    aria-label="generate output"
                    disabled={!generatedVariables.has_output}
                    size="small"
                    sx={{
                      color: "#2196f3",
                      "&:hover": {
                        backgroundColor: "rgba(244, 67, 54, 0.08)",
                      },
                      display: 'block',
                      ml: 5
                      // mb: 1
                    }}
                  >
                    <BuildIcon fontSize="small" />
                </IconButton>
              </TableCell>
            )}
          </TableRow>
        </TableBody>
        </Table>
      </TableContainer>
    </Box>
  )
}

export default GeneratedAlgosTable