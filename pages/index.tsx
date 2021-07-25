import Head from 'next/head'
import styles from '../styles/Home.module.css'

import CodeEditor from '../components/codeEditor'

export default function Home() {
  return (
    <div className={styles.container}>
      <Head>
        <title>Skyline Editor</title>
      </Head>

      {/* Code Editor */}
      <CodeEditor initialValue="" />
    </div>
  )
}
