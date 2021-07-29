import FileSystem from '../functions/FileSystem'
import CodeEditor from '../components/code/main'

export default function New() {
  let fs = new FileSystem()
  fs.listFiles('Desktop')
  return <CodeEditor />
}
