import { inputData } from "./input";

/**
 * Game class handles the main game logic and PIXI application setup
 * @class Game
 * @description Manages the game state, sprite movement, and rendering
 */
export class Game {
  /** PIXI Application instance */
  private app: PIXI.Application;

  /** Movement speed for sprite translations */
  private speed = 1;

  /**
   * Creates a new Game instance and initializes PIXI application
   * @constructor
   */
  constructor() {
    this.app = new window.PIXI.Application({
      width: 800,
      height: 600,
      backgroundColor: 0x1099bb,
      resolution: window.devicePixelRatio || 1,
    });
  }

  /**
   * Initializes the game by appending the PIXI canvas and starting the game loop
   * @public
   */
  public initialize(): void {
    document.body.appendChild(this.app.view);
    this.start();
  }

  /**
   * Starts the game loop and processes input commands
   * @private
   * @description Creates sprite, processes movement commands, and sets up game ticker
   */
  private start(): void {
    const sprite: PIXI.Sprite = window.PIXI.Sprite.from(
      "https://pixijs.io/examples/examples/assets/bunny.png"
    );
    sprite.anchor.set(0.5);

    this.app.stage.addChild(sprite);

    /**
     * Handles sprite rotation based on direction and command
     * @param {string} dir - Direction of movement ('L' or 'R')
     * @param {string} command - Command modifier ('+' or '-')
     */
    const rotate = (dir: string, command: string) => {
      const vel = command === "-" ? -this.speed : this.speed;
      if (dir === "L") {
        sprite.x += vel;
      } else {
        sprite.x += vel * -1;
      }
      console.log(sprite.x);
    };

    // Process each input command
    inputData.forEach((input) => {
      const dir = input.charAt(0) as string;
      const command = input.slice(1, input.length);

      for (let i = 0; i < command.length; i++) {
        console.log("commands:", command.length);
        for (let j = 0; j < command.length; j++) {
          rotate(dir, command[i][j]);
        }
      }
    });

    console.log("Final output ", sprite.x);

    this.app.ticker.add(() => {});
  }
}
