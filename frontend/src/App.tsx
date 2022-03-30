import React, { useEffect, useState } from 'react';
import { ThemeProvider } from '@mui/material/styles';
import Cookies from 'js-cookie';
import { themes } from './Components/Common/Theme';
import OAuth2Login from 'react-simple-oauth2-login';
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

  const onSuccess = (response: any) => console.log(response);
  const onFailure = (response: any) => console.error(response);

  return (
    <ThemeProvider theme={themes[themeCookie]}>
      <Router>
        <div className="App">
          <CssBaseline />
          <Provider store={store}>
            <OAuth2Login
              authorizationUrl="https://auth.stuvus.uni-stuttgart.de/oauth2/auth"
              responseType="token"
              clientId=""
              redirectUri="https://beachify.fius.de/"
              onSuccess={onSuccess}
              onFailure={onFailure} />
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
