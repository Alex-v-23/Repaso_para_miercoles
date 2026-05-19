// App.jsx
import { BrowserRouter as Router, Routes, Route } from 'react-router'
import Home from './pages/Home'
import Login from './pages/Login'
import Students from './pages/Students'

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/home" element={<Home />} />
        <Route path="/students" element={<Students />} />
      </Routes>
    </Router>
  )
}

export default App