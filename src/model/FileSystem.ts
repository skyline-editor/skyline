import { fs } from '@tauri-apps/api';

export default class FileSystem {
  async listFiles(path: string): Promise<string[]> {
    return await fs.readDir(path).then((files) => {
      const paths = new Array<string>(files.length);
      for (let i = 0; i < files.length; i++) {
        paths[i] = files[i].path;
      }

      return paths;
    }).catch(err => err);
  }

  async readTextFile(path: string): Promise<string> {
    return await fs.readTextFile(path).then((text) => text ?? '').catch(err => err);
  }

  async renameFile(path: string, new_path: string): Promise<void> {
    return await fs
      .renameFile(path, new_path)
      .then((_) => null)
      .catch((err) => err);
  }

  async removeFile(path: string): Promise<void> {
    return await fs
      .removeFile(path)
      .then((_) => null)
      .catch((err) => err);
  }

  async writeFile(path: string, content: string): Promise<void> {
    // todo, only append extra changes to the file
    return await fs
      .writeFile({
        path: path,
        contents: content,
      })
      .then((_) => null)
      .catch((err) => err);
  }
}
