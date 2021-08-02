// Styles
import styles from './Topbar.module.css';

// icons
import folder_blue from '../../../icons/folder_blue.svg';
import search from '../../../icons/search.svg';
import git from '../../../icons/git.svg';
import extension from '../../../icons/extension.svg';

const Topbar = () => {
  return (
    <div className={styles.topbar}>
      <img src={folder_blue} alt="Files" />
      <img src={search} alt="Search" />
      <img src={git} alt="Git" />
      <img src={extension} alt="Extensions" />
    </div>
  );
};

export default Topbar;
