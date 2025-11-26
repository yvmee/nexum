import { DialogueBox } from './dialogue';

interface Star {
  x: number;
  y: number;
  size: number;
}

/**
 * Main game entry point
 */
class Game {
  private canvas: HTMLCanvasElement;
  private ctx: CanvasRenderingContext2D;
  private dialogueBox: DialogueBox;
  private stars: Star[];

  constructor() {
    const canvas = document.getElementById('game-canvas') as HTMLCanvasElement;
    if (!canvas) {
      throw new Error('Canvas element not found');
    }
    
    this.canvas = canvas;
    this.canvas.width = 800;
    this.canvas.height = 600;
    
    const ctx = this.canvas.getContext('2d');
    if (!ctx) {
      throw new Error('Could not get 2D context');
    }
    this.ctx = ctx;
    
    this.dialogueBox = new DialogueBox('dialogue-box', 'dialogue-text');
    
    // Pre-generate star positions for consistent rendering
    this.stars = this.generateStars(50);
    
    this.init();
  }

  /**
   * Generate star positions for the background
   */
  private generateStars(count: number): Star[] {
    const stars: Star[] = [];
    for (let i = 0; i < count; i++) {
      stars.push({
        x: Math.random() * this.canvas.width,
        y: Math.random() * this.canvas.height,
        size: Math.random() * 2 + 1
      });
    }
    return stars;
  }

  /**
   * Initialize the game
   */
  private init(): void {
    this.render();
    this.showIntroDialogue();
  }

  /**
   * Render the game scene
   */
  private render(): void {
    // Draw background
    this.ctx.fillStyle = '#16213e';
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
    
    // Draw stars in the background using pre-generated positions
    this.ctx.fillStyle = '#ffffff';
    for (const star of this.stars) {
      this.ctx.beginPath();
      this.ctx.arc(star.x, star.y, star.size, 0, Math.PI * 2);
      this.ctx.fill();
    }
    
    // Draw game title
    this.ctx.fillStyle = '#e94560';
    this.ctx.font = 'bold 48px Segoe UI';
    this.ctx.textAlign = 'center';
    this.ctx.fillText('NEXUM', this.canvas.width / 2, 150);
    
    // Draw subtitle
    this.ctx.fillStyle = '#ffffff';
    this.ctx.font = '20px Segoe UI';
    this.ctx.fillText('A Browser Game Prototype', this.canvas.width / 2, 190);
  }

  /**
   * Show the introductory dialogue sequence
   */
  private showIntroDialogue(): void {
    const sampleDialogues = [
      'Welcome to Nexum, brave adventurer!',
      'This is a prototype browser game built with TypeScript.',
      'You can click through these dialogue boxes to advance the story.',
      'Each click will reveal the next piece of text.',
      'When you reach the end, the dialogue box will close automatically.',
      'Thanks for playing! Click to close this dialogue.'
    ];
    
    this.dialogueBox.show(sampleDialogues, () => {
      console.log('Dialogue sequence completed!');
    });
  }
}

// Start the game when the DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  new Game();
});
