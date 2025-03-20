import * as React from 'react';
import { TreeViewBaseItem } from '@mui/x-tree-view/models';
import { ClassKeyData, listAlgos } from '../../../utils/api/QuestionGenerationAPI';
import { useEffect, useState } from 'react';
import TreeViewSelector from '../../FolderSelector/TreeViewSelector';
import { AlgoDetailsType, ContextBlockType } from '../../../reducer/questionGenerationReducer';

interface QuestionCategorySelectorProps {
  setTopic: (value: string) => void;
  setSubtopic: (value: string) => void;
  context: ContextBlockType;
}

const QuestionCategorySelector: React.FC<QuestionCategorySelectorProps> = ({
  setTopic,
  setSubtopic,
  context
}) => {

  const [treeItems, setTreeItems] = useState<ClassKeyData>({});
  const [selectedSubtopic, setSelectedSubtopic] = useState<string>('');

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

  const handleNodeSelect = async (parent: TreeViewBaseItem | undefined, child: TreeViewBaseItem) => {
    const topic = parent?.id || '';
    const subtopic = child.id.split('__').pop() || '';
    if (topic && subtopic) {
      setTopic(topic)
      setSelectedSubtopic(subtopic);
    }
  };

  useEffect(() => {
    if (context.details.length > 0 && context.details[context.details.length-1].type == 'algo' && (context.details[context.details.length - 1].details as AlgoDetailsType).selectedTopic && selectedSubtopic) {
      setSubtopic(selectedSubtopic);
    }
  }, [selectedSubtopic]);

  return (
    <TreeViewSelector
      data={treeItems}
      onNodeSelect={handleNodeSelect}
    />
  );
};

export default QuestionCategorySelector;