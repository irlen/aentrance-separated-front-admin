/** @jsx jsx */
import React from 'react'
import { jsx, css, Global, ClassNames } from '@emotion/core'
import { ThemeProvider, withTheme } from 'emotion-theming'


import { AppRoute } from './Routes'
import './styles/style.less'

import { deepBlue } from './styles/globalStyle'

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
              boxSizing: 'borderBox'
            }
          }}
        />
      </ThemeProvider>
    )
  }
}

export default App
