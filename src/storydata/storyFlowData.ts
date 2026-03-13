import { StoryFlow } from './storyFlow';
import { endDialogue, scenario5Dialogue, startDialogue } from './dialogueData';
import { reflectionDialogues } from './reflectionData';

// Simple story flow for now
export const exampleStoryFlow: StoryFlow = {
  id: 'example_flow',
  initialChunkId: 'intro',

  chunks: {

    intro: {
      id: 'intro',
      dialogueNodes: startDialogue,
      transitions: [
        { targetChunkId: 'work_organization' }, // Unconditional transition 
      ],
    },

    work_organization: {
      id: 'work_organization',
      dialogueNodes: scenario5Dialogue,
      reflectionNodes: reflectionDialogues[0],
      transitions: [
        { targetChunkId: 'end' },
      ],
    },

    end: {
      id: 'end',
      startingNodeId: 'endnote', // optional override (defaults to 'start')
      dialogueNodes: endDialogue, 
    }

  },
};
