import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import CommunityBoardPage from './pages/CommunityBoardPage'
import './App.css'

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/community/:storeId" element={<CommunityBoardPage />} />
      </Routes>
    </Router>
  )
}

export default App
