import { BrowserRouter as Router, Routes, Route } from "react-router-dom"
import Home from "./pages/Home"
import Blog from "./pages/Blog"
import BlogPost from "./pages/BlogPost"
import ErrorPage from "./pages/ErrorPage"

function App() {

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home/>} />
        <Route path="/blog" element={<Blog/>} />
        <Route path="/blog/:slug" element={<BlogPost/>} />

        {/* Error Page */}
        <Route path="*" element={<ErrorPage/>} />
      </Routes>
    </Router>
  )
}

export default App
