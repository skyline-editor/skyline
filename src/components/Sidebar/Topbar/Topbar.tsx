/*
    Copyright 2021 Tejas Ravishankar, Eliyah Sundström, Pranav Doshi
    Licensed under the Apache License, Version 2.0 (the "License");
    you may not use this file except in compliance with the License.
    You may obtain a copy of the License at
        http://www.apache.org/licenses/LICENSE-2.0
    Unless required by applicable law or agreed to in writing, software
    distributed under the License is distributed on an "AS IS" BASIS,
    WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
    See the License for the specific language governing permissions and
    limitations under the License.
*/

// Styles
import styles from './Topbar.module.css';

// icons
import folder_blue from '../../../icons/folder_blue.svg';
import search from '../../../icons/search.svg';
import git from '../../../icons/git.svg';
import extension from '../../../icons/extension.svg';

const Topbar = () => {
  return (
    <div className={styles.topbar}>
      <img src={folder_blue} alt="Files" />
      <img src={search} alt="Search" />
      <img src={git} alt="Git" />
      <img src={extension} alt="Extensions" />
    </div>
  );
};

export default Topbar;
