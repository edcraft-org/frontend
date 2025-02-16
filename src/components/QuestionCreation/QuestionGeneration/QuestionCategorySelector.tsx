import * as React from 'react';
import { TreeViewBaseItem } from '@mui/x-tree-view/models';
import { ClassKeyData, listAlgos } from '../../../utils/api/QuestionGenerationAPI';
import { useEffect, useState } from 'react';
import TreeViewSelector from '../../FolderSelector/TreeViewSelector';

interface QuestionCategorySelectorProps {
  tabValue: number;
  setTopic: (value: string) => void;
  setSubtopic: (value: string) => void;
}

const QuestionCategorySelector: React.FC<QuestionCategorySelectorProps> = ({
  tabValue,
  setTopic,
  setSubtopic,
}) => {

  const [treeItems, setTreeItems] = useState<ClassKeyData>({});

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await listAlgos();
        setTreeItems(data);
      } catch (error) {
        console.error('Error fetching algos:', error);
      }
    };

    fetchData();
  }, []);

  const handleNodeSelect = (parent: TreeViewBaseItem | undefined, child: TreeViewBaseItem) => {
    setTopic(parent?.id || '');
    setSubtopic(child.id.split('__').pop() || '');
  };

  return (
    <TreeViewSelector
      data={treeItems}
      tabValue={tabValue}
      onNodeSelect={handleNodeSelect}
    />
  );
};

export default QuestionCategorySelector;