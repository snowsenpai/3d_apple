import './App.css'
import Navbar from './components/Navbar'
import Hero from './components/Hero'
import Highlights from './components/Highlights'
import PhoneModel from './components/PhoneModel'
import ErrorBoundary from './components/ErrorBoundary'
import Features from './components/Features'
import HowItWorks from './components/HowItWorks'
import Footer from './components/Footer'


function App() {
  return (
    <main className='bg-black'>
      <Navbar />
      <Hero />
      <Highlights />
      <ErrorBoundary>
        <PhoneModel />
      </ErrorBoundary>
      <Features />
      <HowItWorks />
      <Footer />
    </main>
  )
}

export default App
