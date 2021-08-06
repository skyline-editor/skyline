// Styles
import styles from './File.module.css';

// Icons
import typescript from '../../../icons/typescript.svg';

// React Hooks
import { useRef } from 'react';

// File Properties
interface FileProps {
  path: string;
  fileName: string;
  index: number;
  parent: string;
  setShowContextMenu: (arg: boolean) => void;
  setContextType: (arg: string) => void;
  setContextX: (arg: number) => void;
  setContextY: (arg: number) => void;
}

const File = ({
  path,
  fileName,
  index,
  parent,
  setShowContextMenu,
  setContextType,
  setContextX,
  setContextY,
}: FileProps) => {
  const marginLeft = index * 2 + 2 + 'rem';

  const fileRef = useRef(null);

  return (
    <div
      className={styles.file}
      ref={fileRef}
      style={{ marginLeft: marginLeft }}
      onContextMenu={(e) => {
        e.preventDefault();
        setContextType('file');
        setContextX(fileRef.current.getBoundingClientRect().left + 55);
        setContextY(fileRef.current.getBoundingClientRect().top + 30);
        setShowContextMenu(true);
      }}
    >
      <img className={styles.icon} src={typescript} alt="File" />
      <h4 className={styles.fileName}>{fileName}</h4>
    </div>
  );
};

export default File;
