# Usage Example

To use the os object and its verbs in your code:

```typescript
// Example usage in another part of your application

import makeOs from '../os/makeOs';
import { Dependencies } from '../app/types/dependencies';
import fs from 'fs';
import path from 'path';

const dependencies: Dependencies = {
  fs,
  path,
  // ... other dependencies
};

const os = makeOs(dependencies);

// Using the verbs
(async () => {
  const filePath = './example.txt';
  
  // Write to a file
  await os.writeFile(filePath, 'Hello, World!');
  
  // Check if the file exists
  const exists = await os.fileExists(filePath);
  console.log(`File exists: ${exists}`); // Output: File exists: true
  
  // Read from the file
  const content = await os.readFile(filePath);
  console.log(`File content: ${content}`); // Output: File content: Hello, World!
  
  // Rename the file
  await os.rename(filePath, './example-renamed.txt');
  
  // Copy the file
  await os.copyFile('./example-renamed.txt', './example-copy.txt');
  
  // Read directory contents
  const dirContents = await os.readdir('.');
  dirContents.forEach((entry) => {
    console.log(`Entry: ${entry.name}`);
  });
  
  // Delete the copied file
  await os.deleteFile('./example-copy.txt');
})();
```