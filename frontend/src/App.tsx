import React, { useEffect, useState } from 'react';
import { ThemeProvider } from '@mui/material/styles';
import Cookies from 'js-cookie';
import { themes } from './Components/Common/Theme';

import allReducer from './Reducer/reducerCombiner';
import { createStore } from 'redux';
import { composeWithDevTools } from 'redux-devtools-extension';
import { Provider } from 'react-redux';
import { CssBaseline } from '@mui/material';
import { BrowserRouter as Router } from 'react-router-dom';
import SongArea from './Components/SongSearch/SongArea';
import QueueArea from "./Components/SongQueue/QueueArea";
import style from './app.module.scss';

function App() {
  const [themeCookie, setthemeCookie] = useState(0)
  const store = createStore(allReducer, composeWithDevTools())

  useEffect(() => {
    setthemeCookie(Cookies.get("theme") !== undefined ? Number(Cookies.get("theme")) : 0)
  }, [])

  return (
    <ThemeProvider theme={themes[themeCookie]}>
      <Router>
        <div className="App">
          <CssBaseline />
          <Provider store={store}>
            <div className={style.app}>
              <SongArea />
              <QueueArea />
            </div>
          </Provider>
        </div>
      </Router>
    </ThemeProvider >
  );
}

export default App;
