// Styles
import styles from './Sidebar.module.css';

// Components
import Topbar from './Topbar/Topbar';
import Folder from './Folder/Folder';
import File from './File/File';

const direcoryName = 'Skyline';

const Sidebar = () => {
  return (
    <div className={styles.sidebar}>
      <Topbar />
      <div className={styles.directoryName}>{direcoryName}</div>
      <div className={styles.differentiator}></div>
      <Folder
        id="components"
        folderName="components"
        expanded={false}
        index={0}
        parent="root"
      />
      <File id="index.ts" fileName="index.ts" index={1} parent="components" />
      {/* <Folder folderName="pages" expanded={true} /> */}
    </div>
  );
};

export default Sidebar;
