import Head from 'next/head'
import styles from '../styles/Home.module.css'

export default function Home() {
  return (
    <div className={styles.container}>
      <Head>
        <title>Skyline Editor</title>
      </Head>
      {/* Monaco Editor */}
      <div id="editor"></div>
    </div>
  )
}
