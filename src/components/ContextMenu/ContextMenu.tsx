import styles from './ContextMenu.module.css';

import { useState, useEffect } from 'react';

interface ContextMenuProps {
  contextType: string;
  showMenu: boolean;
  contextX: number;
  contextY: number;
}

const ContextMenu = ({
  contextType,
  showMenu,
  contextX,
  contextY,
}: ContextMenuProps) => {
  return (
    <div
      className={styles.contextMenu}
      style={{
        display: showMenu ? 'flex' : 'none',
        top: contextY,
        left: contextX,
      }}
    >
      <p style={{ display: contextType == 'file' ? 'none' : 'flex' }}>
        Create Folder
      </p>
      <p style={{ display: contextType == 'file' ? 'none' : 'flex' }}>
        Create File
      </p>
      <p>Copy</p>
      <p>Cut</p>
      <p>Paste</p>
      <p>Rename</p>
      <p>Delete</p>
      <p>Copy Path</p>
    </div>
  );
};

export default ContextMenu;
