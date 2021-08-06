// Styles
import styles from './Folder.module.css';

// Icons
import folder_yellow from '../../../icons/folder_yellow.svg';

// React
import React, { useState } from 'react';

// Context menu
import { ContextMenuTrigger } from 'react-contextmenu';
// import ContextMenu from './Contextmenu/Contextmenu';

// Folder Properties
interface FolderProps {
  path: string;
  folderName: string;
  expanded: boolean;
  index: number;
  parent: string;
  setShowContextMenu: (arg: boolean) => void;
  setContextX: (arg: number) => void;
  setContextY: (arg: number) => void;
}

const Folder = ({
  path,
  folderName,
  expanded,
  index,
  parent,
  setShowContextMenu,
  setContextX,
  setContextY,
}: FolderProps) => {
  const [isExpanded, setIsExpanded] = useState(expanded);

  const marginLeft = index * 2 + 0.5 + 'rem';

  const folderRef = React.useRef(null);

  return (
    <>
      <div
        className={styles.folder}
        ref={folderRef}
        style={{ marginLeft: marginLeft }}
        onContextMenu={(e) => {
          e.preventDefault();
          console.log(
            'show context menu for folder: ',
            folderRef.current.getBoundingClientRect().top
          );
          setContextX(folderRef.current.getBoundingClientRect().left + 55);
          setContextY(folderRef.current.getBoundingClientRect().top + 30);
          setShowContextMenu(true);
        }}
      >
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
    </>
  );
};

export default Folder;
