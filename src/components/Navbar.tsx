import { navLists } from '../constants'
import { appleImg, bagImg, searchImg } from '../utils'

const Navbar = () => {
  return (
    <header  className="w-full py-5 sm:px-10 px-5 flex justify-between items-center">
      <nav className='w-full flex screen-max-width'>
        <img src={appleImg} alt="Apple Image" className="w-3.5 h-4.5 cursor-pointer" />
        
        <div className='flex flex-1 max-sm:hidden justify-center gap-5'>
          {navLists.map((nav, i) => (
            <div key={i} className='text-sm cursor-pointer text-gray hover:text-white transition-all'>
              {nav}
            </div>
          ))}
        </div>

        <div className='flex items-baseline gap-7 max-sm:justify-end max-sm:flex-1'>
          <img src={searchImg} alt="Search Image" className="w-4 h-4 cursor-pointer" />
          <img src={bagImg} alt="Bag Image" className="w-4 h-4 cursor-pointer" />
        </div>
      </nav>
    </header>
  )
}

export default Navbar