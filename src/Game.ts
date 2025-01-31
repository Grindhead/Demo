import { inputData } from "./input";
import { gsap } from "gsap";
import * as PIXI from "pixi.js";

/**
 * Game class handles sprite animation based on input commands
 * @class Game
 * @description Manages asset loading, sprite creation, and GSAP animation sequences
 */
export class Game {
  /** PIXI Application instance for rendering */
  private app: PIXI.Application;

  /** Movement speed in pixels per step */
  private speed = 10;

  /** Duration of each movement animation in seconds */
  private readonly MOVEMENT_DURATION = 0.5;

  /** Delay between consecutive movements in seconds */
  private readonly DELAY_BETWEEN_MOVES = 0.1;

  /** Minimum loading time in seconds */
  private readonly MIN_LOADING_TIME = 1;

  /** Asset URL for the sprite */
  private readonly SPRITE_URL =
    "https://pixijs.io/examples/examples/assets/bunny.png";

  /** Container for loading scene */
  private loadingScene: PIXI.Container;

  /** Container for game scene */
  private gameScene: PIXI.Container;

  /**
   * Creates a new Game instance with PIXI application setup
   * @constructor
   */
  constructor() {
    this.app = new PIXI.Application({
      width: 800,
      height: 600,
      backgroundColor: 0x1099bb,
      resolution: window.devicePixelRatio || 1,
    });

    // Initialize scenes
    this.loadingScene = new PIXI.Container();
    this.gameScene = new PIXI.Container();

    // Add scenes to stage
    this.app.stage.addChild(this.loadingScene);
    this.app.stage.addChild(this.gameScene);

    // Hide game scene initially
    this.gameScene.alpha = 0;
  }

  /**
   * Initializes the game by creating canvas and starting asset loading
   * @public
   */
  public initialize(): void {
    document.body.appendChild(this.app.view as HTMLCanvasElement);

    // Start with both scenes invisible
    this.loadingScene.alpha = 0;
    this.gameScene.alpha = 0;

    this.showLoadingScreen();
    this.fadeInLoader();
  }

  /**
   * Fades in the loading scene
   * @private
   */
  private async fadeInLoader(): Promise<void> {
    // Wait for a frame to ensure everything is set up
    await new Promise((resolve) => setTimeout(resolve, 100));

    // Fade in the loading scene
    await new Promise<void>((resolve) => {
      gsap.to(this.loadingScene, {
        alpha: 1,
        duration: 0.8,
        ease: "power2.inOut",
        onComplete: resolve,
      });
    });

    // Start loading assets after fade in completes
    await this.loadAssets();
  }

  /**
   * Creates and displays the loading screen
   * @private
   */
  private showLoadingScreen(): void {
    const loadingText = new PIXI.Text("Loading... 0%", {
      fontFamily: "Arial",
      fontSize: 24,
      fill: 0xffffff,
    });
    loadingText.anchor.set(0.5);
    loadingText.x = this.app.screen.width / 2;
    loadingText.y = this.app.screen.height / 2;
    loadingText.alpha = 0; // Start with text invisible
    this.loadingScene.addChild(loadingText);
  }

  /**
   * Loads game assets using PIXI's asset system with minimum loading time
   * @private
   * @async
   * @throws {Error} When asset loading fails
   */
  private async loadAssets(): Promise<void> {
    try {
      const loadingText = this.loadingScene.children[0] as PIXI.Text;
      const startTime = Date.now();

      // Fade in loading text
      loadingText.alpha = 0;
      await new Promise<void>((resolve) => {
        gsap.to(loadingText, {
          alpha: 1,
          duration: 0.5,
          ease: "power2.inOut",
          onComplete: resolve,
        });
      });

      // Clear cache and reinitialize assets
      PIXI.Assets.reset();
      await PIXI.Assets.init();

      // Show initial loading state
      loadingText.text = "Loading... 0%";

      // Simulate loading progress while actual loading happens
      const progressTimeline = gsap.timeline();
      progressTimeline.to(
        {},
        {
          duration: this.MIN_LOADING_TIME,
          onUpdate: () => {
            const progress = progressTimeline.progress();
            loadingText.text = `Loading... ${Math.floor(progress * 90)}%`;
          },
        }
      );

      // Load asset
      const texture = await PIXI.Assets.load(this.SPRITE_URL);

      // Complete the progress to 100%
      gsap.to(
        {},
        {
          duration: 0.3,
          onUpdate: () => {
            const progress = Math.min(1, progressTimeline.progress() + 0.1);
            loadingText.text = `Loading... ${Math.floor(progress * 100)}%`;
          },
          onComplete: () => {
            loadingText.text = "Loading... 100%";
          },
        }
      );

      // Pause at 100%
      await new Promise((resolve) => setTimeout(resolve, 300));

      // Transition to game
      await this.transitionToGame(texture);
    } catch (error) {
      console.error("Error loading assets:", error);
      this.showError();
    }
  }

  /**
   * Starts the game with the loaded texture
   * @private
   * @param {PIXI.Texture} texture - The loaded sprite texture
   */
  private start(texture: PIXI.Texture): void {
    const sprite = new PIXI.Sprite(texture);
    sprite.anchor.set(0.5);
    sprite.x = 400; // Center the sprite horizontally
    sprite.y = 300; // Center the sprite vertically

    this.app.stage.addChild(sprite);
    this.createAnimationTimeline(sprite);
  }

  /**
   * Creates a GSAP timeline for sprite movement animation
   * @private
   * @param {PIXI.Sprite} sprite - The sprite to animate
   * @description Creates a sequence of movements based on input commands:
   * - '+' moves right by speed amount
   * - '-' moves left by speed amount
   * Each movement takes MOVEMENT_DURATION seconds with DELAY_BETWEEN_MOVES pause
   */
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

  private async transitionToGame(texture: PIXI.Texture): Promise<void> {
    // Setup game scene before transition
    this.setupGameScene(texture);

    // Create and execute transition timeline
    await new Promise<void>((resolve) => {
      const timeline = gsap.timeline({
        onComplete: () => {
          this.loadingScene.removeChildren();
          resolve();
        },
      });

      timeline
        .to(this.loadingScene, {
          alpha: 0,
          duration: 0.5,
          ease: "power2.inOut",
        })
        .to(
          this.gameScene,
          {
            alpha: 1,
            duration: 0.5,
            ease: "power2.inOut",
          },
          "-=0.3"
        );
    });
  }

  private setupGameScene(texture: PIXI.Texture): void {
    const sprite = new PIXI.Sprite(texture);
    sprite.anchor.set(0.5);
    sprite.x = 400;
    sprite.y = 300;

    this.gameScene.addChild(sprite);
    this.createAnimationTimeline(sprite);
  }

  private showError(): void {
    const errorText = new PIXI.Text("Error loading game assets", {
      fontFamily: "Arial",
      fontSize: 24,
      fill: 0xff0000,
    });
    errorText.anchor.set(0.5);
    errorText.x = this.app.screen.width / 2;
    errorText.y = this.app.screen.height / 2;

    this.loadingScene.removeChildren();
    this.loadingScene.addChild(errorText);
  }
}
