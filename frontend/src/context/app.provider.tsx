import { useEffect, useState, type ReactNode } from 'react'
import { AppContext } from './app.context'
import type { appliedCoupon, BlogCard, Cart, Coupon, Product } from './app.context'
import { registerLoader } from '../utils/app.store'

interface AppProviderProps {
  children: ReactNode
}

export const AppProvider = ({ children }: AppProviderProps) => {
  const [showMenu, setShowMenu] = useState<boolean>(false)
  const [showCart, setShowCart] = useState<boolean>(false)
  const [showLogin, setShowLogin] = useState<boolean>(false)
  const [isLoginedIn, setIsLoginedIn] = useState<boolean>(false)
  const [showShop, setShowShop] = useState<boolean>(false)
  const [appliedCoupon, setAppliedCoupon] = useState<appliedCoupon>(null)
  const [showCoupon, setShowCoupon] = useState(false);
  const [showProductDetails, setShowProductDetails] = useState<boolean>(false)
  const [ipAddress, setIp] = useState<string>('')
  const [userID, setUserID] = useState<string>('')
  const [offerId, setOfferId] = useState<string>('')
  const [showAboutUs, setAboutUs] = useState<boolean>(false)
  const [productData, setProductData] = useState<Product[] | null>(null);
  const [blogData, setBlogData] = useState<BlogCard[] | null>(null)
  const [cart, setCart] = useState<Cart | null>(null);
  const [coupon, setCoupon] = useState<Coupon[] | null>(null);
  const [showPopup, setShowPopup] = useState(true);
  const [showGetLeads, setSetGetLeads] = useState(false);
  const [showloader, setShowLoader] = useState(false);
  const [toProfile, setToProfile] = useState(false);
  const [selectedWeightIndex, setSelectedWeightIndex] = useState(1);
  const [toast, setToast] = useState<{
    show: boolean;
    message: string;
  }>({ show: false, message: "" });
  useEffect(() => {
    registerLoader(setShowLoader);
  }, []);
  return (
    <AppContext.Provider value={{
      showMenu,
      setShowMenu,
      showCart,
      setShowCart,
      productData,
      setProductData,
      showLogin,
      setShowLogin,
      isLoginedIn,
      setIsLoginedIn,
      appliedCoupon,
      setAppliedCoupon,
      showCoupon,
      setShowCoupon,
      showShop,
      setShowShop,
      showProductDetails,
      setShowProductDetails,
      showAboutUs,
      setAboutUs,
      ipAddress,
      setIp,
      blogData,
      setBlogData,
      cart,
      setCart,
      coupon,
      setCoupon,
      userID,
      setUserID,
      showPopup,
      setShowPopup,
      showloader,
      setShowLoader,
      selectedWeightIndex,
      setSelectedWeightIndex,
      showGetLeads,
      setSetGetLeads,
      toast,
      setToast,
      offerId,
      setOfferId,
      toProfile,
      setToProfile
    }}>
      {children}
    </AppContext.Provider>
  )
}
