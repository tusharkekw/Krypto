import { useState } from 'react'
import { Navbar, Welcome, Transactions, } from './components'

const App =  () => {
  return (
    <div className="min-h-screen">
      <div className="gradient-bg-welcome">
        <Navbar/>
        <Welcome/>
      </div>

      <Transactions/>
      
    </div>
  )
}

export default App;
