import { fs } from '@tauri-apps/api';
import { invoke } from '@tauri-apps/api/tauri';

export default class FileSystem {
  listFiles(path: string): Promise<string[]> {
    return fs.readDir(path).then((files) => {
      const paths = new Array<string>(files.length);
      for (let i = 0; i < files.length; i++) {
        paths[i] = files[i].path;
      }

      return paths;
    });
  }

  readTextFile(path: string): Promise<string> {
    return fs.readTextFile(path).then((text) => text ?? '');
  }

  renameFile(path: string, new_path: string): Promise<void> {
    return fs
      .renameFile(path, new_path)
      .then((_) => null)
      .catch((err) => err);
  }

  removeFile(path: string): Promise<void> {
    return fs
      .removeFile(path)
      .then((_) => null)
      .catch((err) => err);
  }

  writeFile(path: string, content: string): Promise<void> {
    // todo, only append extra changes to the file
    return fs
      .writeFile({
        path: path,
        contents: content,
      })
      .then((_) => null)
      .catch((err) => err);
  }

  copyFile(source: string, destination: string): Promise<void> {
    return fs
      .copyFile(source, destination)
      .then((_) => null)
      .catch((err) => err);
  }

  createDirectory(path: string): Promise<void> {
    return fs
      .createDir(path)
      .then((_) => null)
      .catch((err) => err);
  }

  removeDirectory(path: string): Promise<void> {
    return fs
      .removeDir(path)
      .then((_) => null)
      .catch((err) => err);
  }

  removeDirectoryRecursive(path: string): Promise<void> {
    return invoke('remove_dir_recursive')
      .then(() => null)
      .catch((error) => error);
  }
}
