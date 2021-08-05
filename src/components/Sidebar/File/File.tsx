// Styles
import styles from './File.module.css';

// Icons
import typescript from '../../../icons/typescript.svg';

// File Properties
interface FileProps {
  id: string;
  fileName: string;
  index: number;
  parent: string;
}

const File = ({ id, fileName, index, parent }: FileProps) => {
  return (
    <div className={styles.file}>
      <img className={styles.icon} src={typescript} alt="File" />
      <h4 className={styles.fileName}>{fileName}</h4>
    </div>
  );
};

export default File;
