// Styles
import styles from './Folder.module.css';

// Icons
import folder_yellow from '../../../icons/folder_yellow.svg';
import arrow_right from '../../../icons/arrow_right.svg';
import arrow_down from '../../../icons/arrow_down.svg';

// React
import { useState, useEffect } from 'react';
import { appWindow } from '@tauri-apps/api/window';

// Folder Properties
interface FolderProps {
  folderName: string;
  expanded: boolean;
}

const Folder = ({ folderName, expanded }: FolderProps) => {
  const [isExpanded, setIsExpanded] = useState(expanded);

  return (
    <div className={styles.folder}>
      <div
        className={styles.arrow}
        style={{
          background: isExpanded
            ? 'url(/icons/arrow_down.svg)'
            : 'url(/icons/arrow_right.svg)',
        }}
        onClick={() => setIsExpanded(!isExpanded)}
      ></div>
      <img className={styles.icon} src={folder_yellow} alt="Folder" />
      <h4 className={styles.folderName}>{folderName}</h4>
    </div>
  );
};

export default Folder;
