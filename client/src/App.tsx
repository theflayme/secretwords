
import { RouterProvider } from "react-router-dom"
import Router from "./routers/Router"
import { CookiesProvider } from 'react-cookie'

const App = () => {
  return (
    <>
      <CookiesProvider>
        <RouterProvider router={Router} />
      </CookiesProvider>
    </>
  )
}

export default App
