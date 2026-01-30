import './App.css'
import Navbar from './components/Navbar'
import Hero from './components/Hero'
import Highlights from './components/Highlights'
import PhoneModel from './components/PhoneModel'
import ErrorBoundary from './components/ErrorBoundary'


function App() {
  return (
    <main className='bg-black'>
      <Navbar />
      <Hero />
      <Highlights />
      <ErrorBoundary>
        <PhoneModel />
      </ErrorBoundary>
    </main>
  )
}

export default App
