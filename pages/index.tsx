import Head from 'next/head'
import styles from '../styles/Home.module.css'

import CodeEditor from '../components/codeeditor'

export default function Home() {
  return (
    <div className={styles.container}>
      <Head>
        <title>Skyline Editor</title>
      </Head>

      {/* Code Editor */}
      <div className={styles.editor}>
        <div className={styles.navbar}></div>
        <div className={styles.sidebar}>
          <button onClick={() => {
            window.location.href = '/new';
          }}>Got to new Code Editor (BETA)</button>
        </div>
        <div className={styles.code}>
          <CodeEditor
            initialValue="# This program prints Hello, world!
print('Hello, world!')"
          />
        </div>
      </div>
    </div>
  )
}
