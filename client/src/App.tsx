import { RouterProvider } from "react-router-dom"
import { ThemeProvider } from "@/components/ThemeProvider"
import router from "@/routers/router"
import { CookiesProvider, Cookies } from "react-cookie"

function App() {
  const cookies = new Cookies();
  return (
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      <CookiesProvider cookies={cookies}>
        <RouterProvider router={router} />
      </CookiesProvider>
    </ThemeProvider>
  )
}

export default App