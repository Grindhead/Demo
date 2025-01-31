import { inputData } from "./input";
import { gsap } from "gsap";
import * as PIXI from "pixi.js";

/**
 * Game class handles the main game logic and PIXI application setup
 * @class Game
 * @description Manages the game state, sprite movement, and rendering
 */
export class Game {
  /** PIXI Application instance */
  private app: PIXI.Application;

  /** Movement speed for sprite translations */
  private speed = 10; // Increased speed to 10

  /** Duration of each movement in seconds */
  private readonly MOVEMENT_DURATION = 0.5; // 1 second per movement

  /** Delay between movements in seconds */
  private readonly DELAY_BETWEEN_MOVES = 0.1; // 1 second delay between movements

  private assetBunny = {
    alias: "bunny",
    src: "https://pixijs.io/examples/examples/assets/bunny.png",
  };

  /**
   * Creates a new Game instance and initializes PIXI application
   * @constructor
   */
  constructor() {
    this.app = new PIXI.Application({
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
    document.body.appendChild(this.app.view as HTMLCanvasElement);
    this.showLoadingScreen();
    this.loadAssets();
  }

  private showLoadingScreen(): void {
    const loadingText = new PIXI.Text("Loading... 0%", {
      fontFamily: "Arial",
      fontSize: 24,
      fill: 0xffffff,
    });
    loadingText.anchor.set(0.5);
    loadingText.x = this.app.screen.width / 2;
    loadingText.y = this.app.screen.height / 2;
    this.app.stage.addChild(loadingText);
  }

  private async loadAssets(): Promise<void> {
    try {
      const loadingText = this.app.stage.children[0] as PIXI.Text;

      // Initialize assets
      await PIXI.Assets.init();

      // Add bundle
      PIXI.Assets.addBundle("game-bundle", {
        bunny: this.assetBunny.src,
      });

      // Load bundle with progress
      const textures = await PIXI.Assets.loadBundle(
        "game-bundle",
        (progress) => {
          loadingText.text = `Loading... ${Math.floor(progress * 100)}%`;
        }
      );

      if (!textures.bunny) {
        throw new Error("Failed to load bunny texture");
      }

      console.log("Texture loaded successfully");
      this.app.stage.removeChildren();
      this.start(textures.bunny);
    } catch (error) {
      console.error("Error loading assets:", error);
      const errorText = new PIXI.Text("Error loading game assets", {
        fontFamily: "Arial",
        fontSize: 24,
        fill: 0xff0000,
      });
      errorText.anchor.set(0.5);
      errorText.x = this.app.screen.width / 2;
      errorText.y = this.app.screen.height / 2;
      this.app.stage.removeChildren();
      this.app.stage.addChild(errorText);
    }
  }

  /**
   * Starts the game loop and processes input commands
   * @private
   * @description Creates sprite, processes movement commands, and sets up game ticker
   */
  private start(texture: PIXI.Texture): void {
    const sprite = new PIXI.Sprite(texture);
    sprite.anchor.set(0.5);
    sprite.x = 400; // Center the sprite horizontally
    sprite.y = 300; // Center the sprite vertically

    this.app.stage.addChild(sprite);
    this.createAnimationTimeline(sprite);
  }

  private createAnimationTimeline(sprite: PIXI.Sprite): void {
    const timeline = gsap.timeline();
    let currentX = sprite.x; // Track current position

    inputData.forEach((input) => {
      const command = input.slice(1)[0];
      const magnitude = command === "+" ? this.speed : -this.speed;
      currentX += magnitude; // Update position for next movement

      timeline.to(sprite, {
        x: currentX,
        duration: this.MOVEMENT_DURATION,
        ease: "back.in",
        delay: this.DELAY_BETWEEN_MOVES,
      });
    });

    timeline.then(() => {
      console.log("Animation sequence complete! Final position:", sprite.x);
    });
  }
}
