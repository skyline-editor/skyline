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
        <div className={styles.sidebar}></div>
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
