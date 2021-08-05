// Styles
import styles from './Sidebar.module.css';

// Components
import Topbar from './Topbar/Topbar';

const direcoryName = 'Skyline';

const Sidebar = () => {
  return (
    <div className={styles.sidebar}>
      <Topbar />
      <div className={styles.directoryName}>{direcoryName}</div>
      <div className={styles.differentiator}></div>
    </div>
  );
};

export default Sidebar;
