import { StoryFlow } from './storyFlow';
import { endDialogue, introDialogue, pipIntroDialogue, scenario1Dialogue, scenario5Dialogue, secretEnd, startDialogue } from './dialogueData';
import { reflectionDialogues } from './reflectionData';

// Debugging story flow

export const testFlow: StoryFlow = {
  id: 'test_flow',
  initialChunkId: 'intro',
  chunks: {
    intro: {
      id: 'intro',
      dialogueNodes: startDialogue,
      transitions: [
        { targetChunkId: 'scenario1' }, 
      ],
    },

    scenario1: {
      id: 'scenario1',
      dialogueNodes: scenario1Dialogue,
      // add reflection
    },
  },
};

// Simple story flow for now
export const storyFlow: StoryFlow = {
  id: 'story_flow',
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

    scenario1: {
      id: 'scenario1',
      dialogueNodes: scenario1Dialogue,
      // add reflection
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
