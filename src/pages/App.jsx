import { Routes, Route } from 'react-router-dom'
import { AuthProvider } from '../context/AuthContext'
import PrivateRoute from '../components/PrivateRoute'

import Layout from '../shared/Layout'
import Home from './Home'
import Login from './Login'
import Register from './Register'
import FAQ from './FAQ'
import Setup from './Setup'

export default function App() {
  return (
    <AuthProvider>
      <Layout>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/faq" element={<FAQ />} />

          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          <Route
            path="/setup"
            element={
              <PrivateRoute>
                <Setup />
              </PrivateRoute>
            }
          />
        </Routes>
      </Layout>
    </AuthProvider>
  )
}
