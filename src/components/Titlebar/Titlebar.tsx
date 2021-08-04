// Styles
import styles from './Titlebar.module.css';

// App windows
import { appWindow } from '@tauri-apps/api/window';

const Titlebar = () => {
  return (
    <div data-tauri-drag-region className={styles.titlebar}>
      <div
        className={styles.titlebar_button}
        id="titlebar-minimize"
        onClick={() => appWindow.minimize()}
      >
        <img src="/titlebar/minimize.svg" alt="minimize" />
      </div>
      <div
        className={styles.titlebar_button}
        id="titlebar-maximize"
        onClick={async () =>
          (await appWindow.isMaximized())
            ? appWindow.unmaximize()
            : appWindow.maximize()
        }
      >
        <img src="/titlebar/maximize.svg" alt="maximize" />
      </div>
      <div
        className={styles.titlebar_button}
        id="titlebar-close"
        onClick={() => appWindow.close()}
      >
        <img src="/titlebar/close.svg" alt="close" />
      </div>
    </div>
  );
};

export default Titlebar;
