// Styles
import styles from './Folder.module.css';

// Icons
import folder_yellow from '../../../icons/folder_yellow.svg';

// React
import { useState } from 'react';

// Folder Properties
interface FolderProps {
  id: string;
  folderName: string;
  expanded: boolean;
  index: number;
  parent: string;
}

const Folder = ({ id, folderName, expanded, index, parent }: FolderProps) => {
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
