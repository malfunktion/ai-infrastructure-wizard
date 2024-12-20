declare global {
  interface Window {
    electronAPI: {
      createDirectory: (dir: string) => Promise<{ success: boolean; error?: string }>;
      writeFile: (path: string, content: string) => Promise<{ success: boolean; error?: string }>;
      runDockerCompose: (dir: string) => Promise<{ success: boolean; error?: string }>;
      onDeploymentLog: (callback: (event: any, message: string) => void) => () => void;
    };
  }
}

export async function createDirectory(req: Request): Promise<Response> {
  try {
    const { dir } = await req.json();
    const result = await window.electronAPI.createDirectory(dir);
    if (result.success) {
      return new Response('Directory created successfully', { status: 200 });
    } else {
      throw new Error(result.error);
    }
  } catch (error) {
    console.error('Error creating directory:', error);
    return new Response('Failed to create directory: ' + error.message, { status: 500 });
  }
}

export async function writeToFile(req: Request): Promise<Response> {
  try {
    const { path, content } = await req.json();
    const result = await window.electronAPI.writeFile(path, content);
    if (result.success) {
      return new Response('File written successfully', { status: 200 });
    } else {
      throw new Error(result.error);
    }
  } catch (error) {
    console.error('Error writing file:', error);
    return new Response('Failed to write file: ' + error.message, { status: 500 });
  }
}

export async function dockerComposeUp(req: Request): Promise<Response> {
  try {
    const { dir } = await req.json();
    const result = await window.electronAPI.runDockerCompose(dir);
    if (result.success) {
      return new Response('Docker containers started successfully', { status: 200 });
    } else {
      throw new Error(result.error);
    }
  } catch (error) {
    console.error('Error starting Docker containers:', error);
    return new Response('Failed to start Docker containers: ' + error.message, { status: 500 });
  }
}
