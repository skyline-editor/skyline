// Styles
import styles from './Folder.module.css';

// Icons
import folder_yellow from '../../../icons/folder_yellow.svg';

// React
import { useState } from 'react';

// Context menu
import { ContextMenuTrigger } from 'react-contextmenu';
import ContextMenu from './Contextmenu/Contextmenu';

// Folder Properties
interface FolderProps {
  path: string;
  folderName: string;
  expanded: boolean;
  index: number;
  parent: string;
}

const Folder = ({ path, folderName, expanded, index, parent }: FolderProps) => {
  const [isExpanded, setIsExpanded] = useState(expanded);

  const marginLeft = index * 2 + 0.5 + 'rem';

  return (
    <>
      <ContextMenuTrigger id="contextmenu">
        <div className={styles.folder} style={{ marginLeft: marginLeft }}>
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
      </ContextMenuTrigger>

      <ContextMenu />
    </>
  );
};

export default Folder;
