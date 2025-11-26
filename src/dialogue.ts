/**
 * DialogueBox - Manages the display of dialogue text that the player can click through
 */
export class DialogueBox {
  private element: HTMLElement;
  private textElement: HTMLElement;
  private dialogues: string[];
  private currentIndex: number;
  private onComplete?: () => void;

  constructor(elementId: string, textElementId: string) {
    const element = document.getElementById(elementId);
    const textElement = document.getElementById(textElementId);
    
    if (!element || !textElement) {
      throw new Error('Dialogue box elements not found');
    }
    
    this.element = element;
    this.textElement = textElement;
    this.dialogues = [];
    this.currentIndex = 0;
    
    this.element.addEventListener('click', () => this.advance());
  }

  /**
   * Show a series of dialogue messages
   */
  show(dialogues: string[], onComplete?: () => void): void {
    this.dialogues = dialogues;
    this.currentIndex = 0;
    this.onComplete = onComplete;
    this.element.classList.remove('hidden');
    this.displayCurrentDialogue();
  }

  /**
   * Hide the dialogue box
   */
  hide(): void {
    this.element.classList.add('hidden');
  }

  /**
   * Advance to the next dialogue or complete if at the end
   */
  private advance(): void {
    this.currentIndex++;
    
    if (this.currentIndex >= this.dialogues.length) {
      this.hide();
      if (this.onComplete) {
        this.onComplete();
      }
    } else {
      this.displayCurrentDialogue();
    }
  }

  /**
   * Display the current dialogue text
   */
  private displayCurrentDialogue(): void {
    this.textElement.textContent = this.dialogues[this.currentIndex];
  }
}
