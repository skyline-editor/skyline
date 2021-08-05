// Styles
import styles from './Folder.module.css';

// Icons
import folder_yellow from '../../../icons/folder_yellow.svg';
import arrow_right from '../../../icons/arrow_right.svg';
import arrow_down from '../../../icons/arrow_down.svg';

interface FolderProps {
  folderName: string;
  expanded: boolean;
}

const Folder = ({ folderName, expanded }: FolderProps) => {
  return (
    <div className={styles.folder}>
      <img
        className={styles.arrow}
        src={expanded ? arrow_down : arrow_right}
        alt="Arrow"
      />
      <img className={styles.icon} src={folder_yellow} alt="Folder" />
      <h4 className={styles.folderName}>{folderName}</h4>
    </div>
  );
};

export default Folder;
