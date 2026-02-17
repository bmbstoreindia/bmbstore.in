import { useEffect } from 'react';
import './App.css'
import AppRoutes from './routes/routes'
import ApiLoader from './utils/ApiLoader'
import { useAppContext } from './context/app.context';

function App() {
  const { showMenu, setShowMenu } = useAppContext()
  useEffect(() => {
    if (!showMenu) return;

    const closeMenu = () => {
      setShowMenu(false);
    };

    // click outside
    document.addEventListener("click", closeMenu);

    // scroll anywhere
    window.addEventListener("scroll", closeMenu, { passive: true });

    return () => {
      document.removeEventListener("click", closeMenu);
      window.removeEventListener("scroll", closeMenu);
    };
  }, [showMenu]);

  return (
    <>
      <ApiLoader />
      <AppRoutes />
    </>
  )
}

export default App
