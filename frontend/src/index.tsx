import React from 'react';
import ReactDOM from 'react-dom/client';
import Catalog from './components/line_comp/GameCatalogMenu'
import Createuser from './components/line_comp/UserCreationMenu'
import { Search }  from './components/line_comp/SearchComp'
import './styles/index.css';
import './styles/frontPage.css';

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(
  <React.StrictMode>
    <div className='centered'>
      <h1>Tomer's Challenge (1)</h1>
      <br/>
      <div className='buttonView'>
        <Catalog/>
        <Createuser/>
        <Search/>
      </div>
    </div>
  </React.StrictMode>
);
