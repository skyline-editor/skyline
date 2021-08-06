// Styles
import styles from './File.module.css';

// Icons
import typescript from '../../../icons/typescript.svg';

// File Properties
interface FileProps {
  path: string;
  fileName: string;
  index: number;
  parent: string;
}

const File = ({ path, fileName, index, parent }: FileProps) => {
  const marginLeft = index * 2 + 2 + 'rem';

  return (
    <div className={styles.file} style={{ marginLeft: marginLeft }}>
      <img className={styles.icon} src={typescript} alt="File" />
      <h4 className={styles.fileName}>{fileName}</h4>
    </div>
  );
};

export default File;
