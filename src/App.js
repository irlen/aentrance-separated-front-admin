/** @jsx jsx */
import React from 'react'
import { jsx, css, Global, ClassNames } from '@emotion/core'
import { AppRoute } from './Routes'
import { ThemeProvider } from 'emotion-theming'
import { deepBlue } from './styles/globalStyle'
import './styles/style.less'
class App extends React.Component {
  render() {
    return (
      <ThemeProvider theme={deepBlue}>
        <AppRoute />
        <Global
          styles={{
            body: {
              width:'100%',
              height:'100%',
              margin: 0,
              padding: 0,
            },
            html:{
              width:'100%',
              height:'100%'
            },
            div:{
              boxSizing: 'border-box'
            }
          }}
        />
      </ThemeProvider>
    )
  }
}

export default App
