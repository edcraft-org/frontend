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
import { formatValue } from "../../utils/format"

interface GeneratedVariablesTableProps {
  generatedVariables: { id: string; type: "input" | "algo"; context: { [key: string]: unknown } }
  onDelete: (id: string, variableName: string) => void
}

const GeneratedVariablesTable: React.FC<GeneratedVariablesTableProps> = ({ generatedVariables, onDelete }) => {
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
                  width: generatedVariables.type === "input" ? "40%" : "50%",
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
                  width: generatedVariables.type === "input" ? "40%" : "50%",
                  fontWeight: "bold",
                  fontSize: "0.875rem",
                  padding: "12px 16px",
                  borderBottom: "2px solid #e0e0e0",
                }}
              >
                Value
              </TableCell>
              {generatedVariables.type === "input" && (
                <TableCell
                  sx={{
                    width: "20%",
                    fontWeight: "bold",
                    fontSize: "0.875rem",
                    padding: "12px 16px",
                    borderBottom: "2px solid #e0e0e0",
                  }}
                >
                  Delete
                </TableCell>
              )}
            </TableRow>
          </TableHead>
          <TableBody>
            {Object.entries(generatedVariables.context).map(([name, value], index) => (
              <TableRow
                key={name}
                sx={{
                  "&:nth-of-type(odd)": { backgroundColor: "#fafafa" },
                  "&:hover": { backgroundColor: "#f0f7ff" },
                  transition: "background-color 0.2s",
                }}
              >
                <TableCell
                  sx={{
                    width: generatedVariables.type === "input" ? "40%" : "50%",
                    padding: "12px 16px",
                    fontSize: "0.875rem",
                    fontWeight: 500,
                  }}
                >
                  {name}
                </TableCell>
                <TableCell
                  sx={{
                    width: generatedVariables.type === "input" ? "40%" : "50%",
                    whiteSpace: "nowrap",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    maxWidth: "150px",
                    padding: "12px 16px",
                    fontSize: "0.875rem",
                    color: "#666",
                  }}
                >
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
                    <span>{formatValue(value)}</span>
                  </Tooltip>
                </TableCell>
                {generatedVariables.type === "input" && (
                  <TableCell
                    sx={{
                      width: "20%",
                      padding: "8px 16px",
                    }}
                  >
                    <IconButton
                      onClick={() => onDelete(generatedVariables.id, name)}
                      aria-label="delete"
                      size="small"
                      sx={{
                        color: "#f44336",
                        "&:hover": {
                          backgroundColor: "rgba(244, 67, 54, 0.08)",
                        },
                      }}
                    >
                      <DeleteIcon fontSize="small" />
                    </IconButton>
                  </TableCell>
                )}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  )
}

export default GeneratedVariablesTable
