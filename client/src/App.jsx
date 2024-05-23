import './App.css'
import axios from 'axios'
import {UserContextProvider } from './authentication/UserContextProvider'
import Rider from './Rider'
axios.defaults.withCredentials = true;
import {ChakraProvider} from '@chakra-ui/react'

function App() {
  return (
    <UserContextProvider>
      <ChakraProvider>
        <Rider/>
      </ChakraProvider>
    </UserContextProvider>
  )
}

export default App
