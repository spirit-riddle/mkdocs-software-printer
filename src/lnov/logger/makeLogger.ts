// logger/makeLogger.ts

export default function makeLogger() {
    return {
      info: (message: string): void => {
        console.log(`INFO: ${message}`);
      },
      warn: (message: string): void => {
        console.warn(`WARN: ${message}`);
      },
      error: (message: string): void => {
        console.error(`ERROR: ${message}`);
      },
    };
  }
  