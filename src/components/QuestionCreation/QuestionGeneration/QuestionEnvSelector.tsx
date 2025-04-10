import * as React from 'react';
import { TreeViewBaseItem } from '@mui/x-tree-view/models';
import { ClassKeyData, listInputs } from '../../../utils/api/QuestionGenerationAPI';
import { useEffect, useState } from 'react';
import TreeViewSelector from '../../FolderSelector/TreeViewSelector';
import { formatIdToNestedObject } from '../../../utils/format';


interface QuestionEnvSelectorProps {
  setInputPath: (inputPath: { [key: string]: unknown }) => void;
}

const QuestionEnvSelector: React.FC<QuestionEnvSelectorProps> = ({
  setInputPath,
}) => {
  const [treeItems, setTreeItems] = useState<ClassKeyData>({});

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await listInputs();
        setTreeItems(data);
      } catch (error) {
        console.error('Error fetching algos:', error);
      }
    };

    fetchData();
  }, []);

  const handleNodeSelect = async (_parent: TreeViewBaseItem | undefined, child: TreeViewBaseItem) => {
    const formattedChildId = formatIdToNestedObject(child.id);
    setInputPath(formattedChildId);
  };

  return (
    <TreeViewSelector
      data={treeItems}
      onNodeSelect={handleNodeSelect}
    />
  );
};

export default QuestionEnvSelector;