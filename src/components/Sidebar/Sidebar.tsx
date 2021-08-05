// Styles
import styles from './Sidebar.module.css';

// Components
import Topbar from './Topbar/Topbar';
import Folder from './Folder/Folder';

const direcoryName = 'Skyline';

const Sidebar = () => {
  return (
    <div className={styles.sidebar}>
      <Topbar />
      <div className={styles.directoryName}>{direcoryName}</div>
      <div className={styles.differentiator}></div>
      <Folder folderName="components" expanded={false} />
      <Folder folderName="pages" expanded={true} />
    </div>
  );
};

export default Sidebar;
