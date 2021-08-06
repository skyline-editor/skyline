// Styles
import styles from './Sidebar.module.css';

// Components
import Topbar from './Topbar/Topbar';
import Folder from './Folder/Folder';
import File from './File/File';
import ContextMenu from '../ContextMenu/ContextMenu';

// React Hooks
import { useState } from 'react';

const direcoryName = 'Skyline';

const Sidebar = () => {
  const [contextType, setContextType] = useState('folder');
  const [showContextMenu, setShowContextMenu] = useState(false);
  const [contextX, setContextX] = useState(0);
  const [contextY, setContextY] = useState(0);

  return (
    <div
      className={styles.sidebar}
      onClick={() => {
        if (showContextMenu) {
          setShowContextMenu(false);
        }
      }}
    >
      <Topbar />
      <ContextMenu
        contextType={contextType}
        showMenu={showContextMenu}
        contextX={contextX}
        contextY={contextY}
      />
      <div className={styles.directoryName}>{direcoryName}</div>
      <div className={styles.differentiator}></div>
      <Folder
        path="/components"
        folderName="components"
        expanded={false}
        index={0}
        parent="root"
        setShowContextMenu={setShowContextMenu}
        setContextX={setContextX}
        setContextY={setContextY}
      />
      {/* <File
        path="/components/index.ts"
        fileName="index.ts"
        index={1}
        parent="components"
      /> */}
      {/* <Folder
        path="/pages"
        folderName="pages"
        expanded={true}
        index={0}
        parent="root"
      /> */}
    </div>
  );
};

export default Sidebar;
