import { useContext, useEffect, useState } from 'react';
import NavBar from '../navbar/NavBar';
import Footer from '../footer/Footer';
import { UseContext } from 'App';

export const Page = ({ children }) => {
  const [ isSmallScreen, setIsSmallScreen ] = useState(window.innerWidth <= 900)

  useEffect(() => {
    const handleResize = () => {
      setIsSmallScreen(window.innerWidth <= 900)
    }

    window.addEventListener('resize', handleResize)

    return () => {
      window.removeEventListener('resize', handleResize)
    }
  }, [])

  return (
      <>
        <div><NavBar /></div>
        {children}
        <Footer />
      </>
  );
};
