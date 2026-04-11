import { SceneNode } from './dialogueData';
import { ReflectionNode } from './reflectionData';

// ───────────────── Types ─────────────────

/**
 * A story chunk groups dialogue nodes into a logical story segment.
 * Each chunk can optionally include reflection data and choice tracking.
 */
export interface StoryChunk {
  id: string;
  dialogueNodes: SceneNode[];
  startingNodeId?: string; // optional override for starting node (defaults 'start')
  reflectionNodes?: ReflectionNode[];
  reflectionSessionNumber?: number; // for db tracking, only used if reflectionNodes is defined
  transitions?: ChunkTransition[]; // chunk-level transitions 
}

/**
 * Defines a transition from one chunk to the next, with an optional condition based on player choices.
 */
export interface ChunkTransition {
  targetChunkId: string; 
  /** Return true when this transition should fire. Evaluated against current playerChoices. */
  condition?: (playerChoices: Record<string, string | boolean | number>) => boolean;
}

/**
 * A story flow of multiple chunks, only one should exist for this story.
 */
export interface StoryFlow {
  id: string;
  initialChunkId: string;
  chunks: Record<string, StoryChunk>;
}

/**
 * Given a completed chunk id and the current player choices, returns the id of the next chunk (or null if the story ends).
 */
export function evaluateNextChunk(
  storyFlow: StoryFlow,
  currentChunkId: string,
  playerChoices: Record<string, string | boolean | number>,
): string | null {
  const entry = storyFlow.chunks[currentChunkId];
  if (!entry) return null;

  console.debug(`Evaluating next chunk for completed chunk '${currentChunkId}' with transitions:`, entry.transitions);

  if (!entry.transitions || entry.transitions.length === 0) {
    return null; // no transitions -> story ends
  }

  for (const transition of entry.transitions) {
    if (!transition.condition || transition.condition(playerChoices)) {
      return transition.targetChunkId;
    }
  }
  return null; // no matching transition -> story ends
}

/**
 * Returns true if the given chunk has reflection nodes defined, false otherwise.
 */
export function chunkHasReflection(storyFlow: StoryFlow, chunkId: string): boolean {
  const entry = storyFlow.chunks[chunkId];
  /* @ts-ignore next-line */
  return entry?.reflectionNodes?.length > 0 ?? false;
}
