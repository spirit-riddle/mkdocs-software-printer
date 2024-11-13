// index.ts

/**
 * **Application Entry Point**
 *
 * Initiates the process of generating a virtual folder from MkDocs documentation. It serves as the main entry point when running the application.
 *
 * @remarks
 * - Ensure that the MkDocs documentation is properly formatted before running the application.
 * - The generated virtual folder can be used for further processing or deployment.
 *
 * @example
 * ```shell
 * npm start -- --input ./docs --output ./output
 * ```
 *
 * @see {@link generateVirtualFolderFromMkDocs}
 */
import generateVirtualFolderFromMkDocs from "./processes/generateVirtualFolderFromMkDocs";

generateVirtualFolderFromMkDocs();
