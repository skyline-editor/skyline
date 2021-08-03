// TODO: implement FileSystem
export default class FileSystem {
  async listFiles(path: string): Promise<string[]> {
    return [];
  }

  async readTextFile(path: string): Promise<string> {
    return '';
  }

  async renameFile(path: string, new_path: string): Promise<void> {
    
  }

  async removeFile(path: string): Promise<void> {
    
  }

  async writeFile(path: string, content: string): Promise<void> {
    
  }
}
