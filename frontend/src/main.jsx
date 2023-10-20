/* eslint-disable no-unused-vars */
import { ChakraProvider, ColorModeProvider } from '@chakra-ui/react'
import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import { mode } from '@chakra-ui/theme-tools'
import { extendTheme } from '@chakra-ui/react'
import { BrowserRouter } from 'react-router-dom'
import { RecoilRoot } from 'recoil'

const styles = {
  global: (props) => ({
    body: {
      color: mode('grey.800', 'whiteAlpha.900')(props),
      bg:mode('gray.100', '#101010')(props),
    }
  })
}

const config = {
  initalColorMode: "dark", 
  useSystemColorMode: true, 
}

const colors = {
  gray: {
    light: '#616161',
    dark: '#1e1e1e',
  }
}

const theme = extendTheme({config, styles, colors})

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <RecoilRoot>
      <BrowserRouter>
        <ChakraProvider theme = {theme}>
          <ColorModeProvider initalColorMode={theme.config.initalColorMode}/>
          <App />
        </ChakraProvider>
      </BrowserRouter>
    </RecoilRoot> 
   </React.StrictMode>, 
)
