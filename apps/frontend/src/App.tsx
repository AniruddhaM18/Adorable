import {BrowserRouter,Route, Routes} from "react-router-dom";

import './App.css'
import Landing from './landing'
import { Viewport } from "./components/ViewPort";
import { ViewSelector } from "./components/ViewSelector";

function App() {
  return (
    <>
    <BrowserRouter>
    <Routes>
      <Route element={ <Landing /> } path="/" />
      <Route element={ <ViewSelector /> } path="/editor" />
    </Routes>
    </BrowserRouter>
    </>
  )
}

export default App