// Styles
import styles from './Contextmenu.module.css';

// Context menu
import { ContextMenu, MenuItem } from 'react-contextmenu';

const Contextmenu = () => {
  return (
    <ContextMenu id="contextmenu" className={styles.contextmenu}>
      <MenuItem data={{ copy: 'MI50' }}>
        <span>New File</span>
      </MenuItem>
      <MenuItem>
        <span>New Folder</span>
      </MenuItem>
      <MenuItem>
        <span>Cut</span>
      </MenuItem>
      <MenuItem>
        <span>Copy</span>
      </MenuItem>
      <MenuItem>
        <span>Paste</span>
      </MenuItem>
      <MenuItem>
        <span>Delete</span>
      </MenuItem>
      <MenuItem>
        <span>Copy Path</span>
      </MenuItem>
    </ContextMenu>
  );
};

export default Contextmenu;
