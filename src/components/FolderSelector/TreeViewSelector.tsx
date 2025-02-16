import * as React from 'react';
import Box from '@mui/material/Box';
import { TreeViewBaseItem } from '@mui/x-tree-view/models';
import { styled, alpha } from '@mui/material/styles';
import { RichTreeView } from '@mui/x-tree-view/RichTreeView';
import { TreeItem, treeItemClasses } from '@mui/x-tree-view/TreeItem';
import { useEffect, useState } from 'react';
import { Button, TextField } from '@mui/material';
import { formatText } from '../../utils/format';
import { ClassKeyData } from '../../utils/api/QuestionGenerationAPI';

interface TreeViewSelectorProps {
  data: ClassKeyData;
  tabValue: number;
  onNodeSelect: (parent: TreeViewBaseItem | undefined, child: TreeViewBaseItem) => void;
}

const CustomTreeItem = styled(TreeItem)(({ theme }) => ({
  color: theme.palette.grey[200],
  [`& .${treeItemClasses.content}`]: {
    borderRadius: theme.spacing(0.5),
    padding: theme.spacing(0.5, 1),
    margin: theme.spacing(0.2, 0),
    [`& .${treeItemClasses.label}`]: {
      fontSize: '0.8rem',
      fontWeight: 500,
    },
  },
  [`& .${treeItemClasses.iconContainer}`]: {
    borderRadius: '50%',
    backgroundColor: theme.palette.primary.dark,
    padding: theme.spacing(0, 1.2),
    ...theme.applyStyles('light', {
      backgroundColor: alpha(theme.palette.primary.main, 0.25),
    }),
    ...theme.applyStyles('dark', {
      color: theme.palette.primary.contrastText,
    }),
  },
  [`& .${treeItemClasses.groupTransition}`]: {
    marginLeft: 15,
    paddingLeft: 18,
    borderLeft: `1px dashed ${alpha(theme.palette.text.primary, 0.4)}`,
  },
  ...theme.applyStyles('light', {
    color: theme.palette.grey[800],
  }),
}));

const TreeViewSelector: React.FC<TreeViewSelectorProps> = ({
  data,
  tabValue,
  onNodeSelect,
}) => {
  const [treeItems, setTreeItems] = useState<TreeViewBaseItem[]>([]);
  const [newSubtopic, setNewSubtopic] = useState('');
  const [selectedTopic, setSelectedTopic] = useState<string | null>(null);

  useEffect(() => {
    const formattedData: TreeViewBaseItem[] = formatData(data);
    setTreeItems(formattedData);
  }, [data]);

  const formatData = (data: ClassKeyData, parentKey: string = ''): TreeViewBaseItem[] => {
    return Object.keys(data).map((key) => {
        const uniqueId = parentKey ? `${parentKey}__${key}` : key;
        const value = data[key];
        return {
          id: uniqueId,
          label: formatText(key),
          children: typeof value === 'object' ? formatData(value, uniqueId) : [],
        };
      });
    };

  const handleNodeSelect = (event: React.SyntheticEvent, nodeId: string) => {
    const node = findNodeById(treeItems, nodeId);
    if (node?.children?.length === 0) {
      const parent = findParentNode(treeItems, nodeId);
      onNodeSelect(parent, node);
    }
  };

  const findNodeById = (nodes: TreeViewBaseItem[], id: string): TreeViewBaseItem | undefined => {
    for (const node of nodes) {
      if (node.id === id) {
        return node;
      }
      if (node.children) {
        const childNode = findNodeById(node.children, id);
        if (childNode) {
          return childNode;
        }
      }
    }
    return undefined;
  };

  const findParentNode = (nodes: TreeViewBaseItem[], id: string): TreeViewBaseItem | undefined => {
    for (const node of nodes) {
      if (node.children?.some(child => child.id === id)) {
        return node;
      }
      if (node.children) {
        const parentNode = findParentNode(node.children, id);
        if (parentNode) {
          return parentNode;
        }
      }
    }
    return undefined;
  };

  const handleAddSubtopic = () => {
    if (newSubtopic.trim() === '' || !selectedTopic) return;
    setTreeItems(treeItems.map(item => {
      if (item.id === selectedTopic) {
        return {
          ...item,
          children: [...(item.children || []), { id: `${selectedTopic}_${newSubtopic}`, label: formatText(newSubtopic), children: [] }]
        };
      }
      return item;
    }));
    setNewSubtopic('');
  };

  return (
    <Box sx={{ minHeight: 200, minWidth: 400 }}>
      <RichTreeView
        defaultExpandedItems={['grid']}
        slots={{ item: CustomTreeItem }}
        items={treeItems}
        onItemSelectionToggle={handleNodeSelect}
      />
      {tabValue == 1 &&
        <Box sx={{ marginY: 2 }}>
          <TextField
            label="New Subtopic"
            value={newSubtopic}
            onChange={(e) => setNewSubtopic(e.target.value)}
            fullWidth
            sx={{ marginBottom: 1, fontSize: '0.75rem', padding: '4px 8px' }}
            InputProps={{ sx: { fontSize: '0.75rem', padding: '4px 8px' } }}
            disabled={!selectedTopic}
          />
          <Button
            variant="contained"
            color="primary"
            size="small"
            onClick={handleAddSubtopic}
            fullWidth
            disabled={!selectedTopic}
            sx={{
              padding: '4px 8px',
              fontSize: '0.75rem',
              minWidth: 'auto',
            }}
          >
            Add New
          </Button>
        </Box>
      }
    </Box>
  );
};

export default TreeViewSelector;