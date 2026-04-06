import { StoryFlow } from './storyFlow';
import { endDialogue, introDialogue, pipIntroDialogue, scenario5Dialogue, secretEnd, startDialogue } from './dialogueData';
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
        { targetChunkId: 'introMayra' }, 
      ],
    },

    introMayra: {
      id: 'introMayra',
      dialogueNodes: introDialogue,
      transitions: [
        { targetChunkId: 'introPip' }, 
      ],
    },

    introPip: {
      id: 'introPip',
      dialogueNodes: pipIntroDialogue,
      transitions: [
        { targetChunkId: 'work_organization' }, 
      ],
    },

    work_organization: {
      id: 'work_organization',
      dialogueNodes: scenario5Dialogue,
      reflectionNodes: reflectionDialogues[0],
      transitions: [
        { targetChunkId: 'secretEnd', condition: (choices) => choices['workOrganization'] === 'pairs' &&  choices['supportStyle'] === 'walk'}, 
        { targetChunkId: 'end' },
      ],
    },

    end: {
      id: 'end',
      startingNodeId: 'endnote', // optional override (defaults to 'start')
      dialogueNodes: endDialogue, 
    },

    secretEnd: {
      id: 'secretEnd',
      startingNodeId: 'end',
      dialogueNodes: secretEnd,
    }

  },
};
