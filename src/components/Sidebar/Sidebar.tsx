// Styles
import styles from './Sidebar.module.css'

// Components
import Topbar from './Topbar/Topbar'

const Sidebar = () => {
  return (
    <div className={styles.sidebar}>
      <Topbar />
    </div>
  )
}

export default Sidebar
