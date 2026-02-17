import {
  Box,
  AppBar,
  Toolbar,
  useMediaQuery,
  useTheme,
  Portal,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import logo from "../../assets/bmbLogo.svg";
import cartIcon from "../../assets/cart.svg";
import search from "../../assets/searchBar.svg";
import profile from "../../assets/profile.svg";
import MenuIcon from "../../assets/menu.svg";
import cross from "../../assets/coss.svg";
import "./navbar.css";
import { useEffect, useMemo, useRef, useState } from "react";
import { useAppContext, type Product } from "../../context/app.context";
import { apiService } from "../../sevice/api.service";

interface NavbarRightItem {
  name: "search" | "profile" | "cart";
  icon: string;
  path?: string;
  onClick?: () => void;
}

interface Props {
  navbarLeft: {
    path: string;
    name: string;
  }[];
}

const normalize = (s: string) => s.trim().toLowerCase().replace(/\s+/g, " ");

const Navbar = ({ navbarLeft }: Props) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const navigate = useNavigate();
  const apiRef = useRef(apiService());
  const { loginUser } = apiRef.current;
  const [showSearchBar, setShowSearchbar] = useState(false);

  const {
    setShowMenu,
    setShowCart,
    setShowShop,
    setShowProductDetails,
    setAboutUs,
    setShowPopup,
    cart,
    setShowCoupon,
    productData,
    setProductData, // ✅ ADDED (you said it exists)
    setShowLogin,
    isLoginedIn,
    showCart,
    setToProfile,
    userID,
    setIsLoginedIn
  } = useAppContext();

  const isSearchVisible = isMobile && showSearchBar;

  const searchBarClick = () => {
    if (!isMobile) return;
    setShowSearchbar((prev) => !prev);
    setShowMenu(false);
  };

  const navbarRight: NavbarRightItem[] = [
    { name: "search", icon: search, onClick: searchBarClick },
    {
      name: "profile",
      icon: profile,
      onClick: async () => {
        setShowCart(false);
        setShowCart(false);
        if (isLoginedIn) {
          
          const userData = localStorage.getItem('userData')
          if (!userData) {
            const email = localStorage.getItem('email')!
            const res = await loginUser(userID, email);
            localStorage.setItem('token', res.token!)
            localStorage.setItem('address', JSON.stringify(res.address))
            localStorage.setItem('userData', JSON.stringify(res.user))
          }
          navigate("/AccountSetting", { state: { profile: true } });
        } else {
          setShowLogin(true)
          setToProfile(true)
        }
      },
    },
    {
      name: "cart",
      icon: cartIcon,
      path: "/cart",
      onClick: () => {
        setShowCoupon(false);
        return setShowCart(!showCart);
      },
    },
  ];

  // =========================
  // ✅ AUTOCOMPLETE STATE
  // =========================
  const [query, setQuery] = useState("");
  const [openSuggest, setOpenSuggest] = useState(false);

  // ✅ IMPORTANT: ref on INPUT
  const desktopInputRef = useRef<HTMLInputElement | null>(null);
  const mobileInputRef = useRef<HTMLInputElement | null>(null);

  // ✅ NEW: ref for portal dropdown so outside-click does not close it
  const dropdownRef = useRef<HTMLDivElement | null>(null);

  const anchorInputEl = isSearchVisible
    ? mobileInputRef.current
    : desktopInputRef.current;

  // ✅ keep a safe “default” list sorted by priority (for logo reset)
  const defaultPrioritySorted = useMemo(() => {
    const list = (productData ?? []) as Product[];
    return [...list].sort((a, b) => (a.priority ?? 0) - (b.priority ?? 0));
  }, [productData]);

  // ✅ suggestions (top 8) also by priority
  const suggestions = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return [];

    const list = (productData ?? []) as Product[];
    return [...list]
      .filter((p) => (p?.header ?? "").toLowerCase().includes(q))
      .sort((a, b) => (a.priority ?? 0) - (b.priority ?? 0))
      .slice(0, 8);
  }, [query, productData]);

  // ✅ Search-based sort for shop list:
  // - exact header match first
  // - then startsWith
  // - then includes
  // - tie-breaker: priority
  const sortBySearch = (list: Product[], rawQuery: string) => {
    const q = normalize(rawQuery);
    if (!q) return [...list].sort((a, b) => (a.priority ?? 0) - (b.priority ?? 0));

    const rank = (p: Product) => {
      const h = normalize(p.header ?? "");
      if (h === q) return 0;
      if (h.startsWith(q)) return 1;
      if (h.includes(q)) return 2;
      return 3;
    };

    return [...list].sort((a, b) => {
      const ra = rank(a);
      const rb = rank(b);
      if (ra !== rb) return ra - rb;

      // secondary: shorter header first (feels more relevant), then priority
      const la = (a.header ?? "").length;
      const lb = (b.header ?? "").length;
      if (la !== lb) return la - lb;

      return (a.priority ?? 0) - (b.priority ?? 0);
    });
  };

  const goToProduct = (productPage: Product) => {
    const path = "product"; // <-- change if your base route differs
    setShowMenu(false);
    setShowCart(false);
    setShowShop(false);
    setAboutUs(false);
    setShowPopup(false);
    setShowProductDetails(true);

    setQuery("");
    setOpenSuggest(false);
    if (isMobile) setShowSearchbar(false);

    return navigate(`/${path}/${encodeURIComponent(productPage?.header!)}`, {
      state: { productDetals: { id: productPage?.id } },
    });
  };

  // ✅ When no suggestion selected and user presses Enter:
  // 1) sort productData based on query (relevance)
  // 2) navigate to /shop
  const goToShopAndSort = (searchText: string) => {
    const q = searchText.trim();

    setShowMenu(false);
    setShowCart(false);
    setAboutUs(false);
    setShowProductDetails(false);

    setShowShop(true);
    setShowPopup(true);

    setOpenSuggest(false);
    if (isMobile) setShowSearchbar(false);

    // ✅ sort the list for shop
    if (productData && productData.length > 0) {
      const sorted = sortBySearch(productData, q);
      setProductData(sorted);
    }

    navigate("/shop", {
      state: {
        searchQuery: q, // optional: if shop wants to show in a filter UI
        fromNavbar: true,
      },
    });
  };

  // ✅ reset list back to priority sort (on logo click)
  const resetProductsToPriority = () => {
    if (!productData) return;
    setProductData([...productData].sort((a, b) => (a.priority ?? 0) - (b.priority ?? 0)));
  };

  // ✅ FIXED: close dropdown on outside click (but NOT when clicking dropdown)
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      const t = e.target as Node;

      const inDesktop = desktopInputRef.current?.contains(t);
      const inMobile = mobileInputRef.current?.contains(t);
      const inDropdown = dropdownRef.current?.contains(t);

      if (!inDesktop && !inMobile && !inDropdown) {
        setOpenSuggest(false);
      }
    };

    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const onSearchKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      const q = query.trim();
      if (!q) {
        setOpenSuggest(false);
        return;
      }

      // ✅ EXACT MATCH FIRST
      const exact =
        (productData ?? []).find(
          (p: any) => normalize(p?.header ?? "") === normalize(q)
        ) ?? null;

      if (exact) {
        goToProduct(exact as Product);
      } else {
        // ✅ no exact match => go shop + sort by relevance
        goToShopAndSort(q);
      }
    }

    if (e.key === "Escape") setOpenSuggest(false);
  };

  // ✅ PORTAL DROPDOWN (fixed click issue)
  const AutocompleteDropdown = () => {
    if (!openSuggest) return null;
    if (query.trim().length === 0) return null;
    if (!anchorInputEl) return null;
    if (suggestions.length === 0) return null;

    const rect = anchorInputEl.getBoundingClientRect();
    const width = rect.width || 300;

    return (
      <Portal>
        <Box
          ref={dropdownRef}
          sx={{
            position: "fixed",
            top: rect.bottom + 8,
            left: rect.left,
            width,
            background: "#fff",
            border: "1px solid #e5e5e5",
            borderRadius: "10px",
            boxShadow: "0 10px 20px rgba(0,0,0,0.12)",
            zIndex: 999999,
            overflow: "hidden",
            maxHeight: 320,
            overflowY: "auto",
          }}
          onMouseDown={(e) => e.stopPropagation()}
        >
          {suggestions.map((p) => (
            <Box
              key={p.id}
              sx={{
                padding: "10px 12px",
                cursor: "pointer",
                display: "flex",
                flexDirection: "column",
                gap: "2px",
                "&:hover": { background: "#f7f7f7" },
              }}
              onMouseDown={(e) => {
                e.preventDefault();
                e.stopPropagation();
                goToProduct(p);
              }}
            >
              <Box sx={{ fontSize: "13px", fontWeight: 700, color: "#111" }}>
                {p.header}
              </Box>
            </Box>
          ))}
        </Box>
      </Portal>
    );
  };

  return (
    <Box sx={{ zIndex: 1000 }}>
      <AppBar position="fixed" sx={{ background: "white", boxShadow: "none" }}>
        {!isSearchVisible && (
          <Toolbar sx={{ px: 4 }}>
            {/* LEFT NAV (Desktop only) */}
            <Box sx={{ display: { xs: "none", lg: "flex" }, gap: 5 }}>
              {navbarLeft.map((item) => {
                if (item.name === "OUR JOURNEY") {
                  return (
                    <Box
                      key={item.path}
                      sx={{ borderRight: "1px solid #D6D6D6", pr: 3 }}
                    >
                      <div
                        style={{
                          textDecoration: "none",
                          color: "black",
                          fontFamily: "'DM Sans', sans-serif",
                          fontWeight: 700,
                          fontSize: "14px",
                          cursor: "pointer",
                        }}
                        onClick={() => {
                          setAboutUs((prev) => {
                            navigate(item.path);
                            setShowCart(false);
                            setShowShop(false);
                            return !prev;
                          });
                        }}
                      >
                        {item.name}
                      </div>
                    </Box>
                  );
                }

                if (item.name === "SHOP") {
                  return (
                    <Box
                      key={item.path}
                      sx={{ borderRight: "1px solid #D6D6D6", pr: 3 }}
                    >
                      <div
                        style={{
                          textDecoration: "none",
                          color: "black",
                          fontFamily: "'DM Sans', sans-serif",
                          fontWeight: 700,
                          fontSize: "14px",
                          cursor: "pointer",
                        }}
                        onClick={() => {
                          setShowShop((prev) => {
                            setShowCart(false);
                            setAboutUs(false);

                            // ✅ If user clicks SHOP explicitly, restore priority order
                            if (productData && productData.length > 0) {
                              setProductData(defaultPrioritySorted);
                            }

                            navigate(item.path);
                            setShowPopup(true);
                            return !prev;
                          });
                        }}
                      >
                        {item.name}
                      </div>
                    </Box>
                  );
                }

                if (item.name === "RECIPES") {
                  return (
                    <Box
                      key={item.path}
                      sx={{ borderRight: "1px solid #D6D6D6", pr: 3 }}
                    >
                      <div
                        style={{
                          textDecoration: "none",
                          color: "black",
                          fontFamily: "'DM Sans', sans-serif",
                          fontWeight: 700,
                          fontSize: "14px",
                          cursor: "pointer",
                        }}
                        onClick={() => {
                          setShowCart(false);
                          navigate(item.path, { state: { index: 1 } });
                        }}
                      >
                        {item.name}
                      </div>
                    </Box>
                  );
                }

                return null;
              })}
            </Box>

            {/* MOBILE MENU ICON */}
            <Box sx={{ display: { xs: "block", lg: "none" } }}>
              <img
                src={MenuIcon}
                alt="Menu"
                onClick={(e) => {
                  e.stopPropagation();
                  setShowMenu((prev) => !prev);
                }}
                style={{ cursor: "pointer" }}
              />
            </Box>

            {/* LOGO */}
            <Box
              sx={{
                flexGrow: 1,
                display: "flex",
                justifyContent: "center",
                paddingLeft: "85px",
                height: { xs: "40px" },
              }}
            >
              <img
                loading="eager"
                src={logo}
                style={{ cursor: "pointer" }}
                alt="Logo"
                onClick={() => {
                  // ✅ logo click => reset products back to priority sort
                  resetProductsToPriority();

                  setShowCart(() => {
                    navigate("/");
                    localStorage.clear()
                    setShowMenu(false);
                    setIsLoginedIn(false)
                    setShowCoupon(false);
                    setShowShop(false);
                    setAboutUs(false);
                    setShowLogin(false)
                    setShowProductDetails(false);
                    return false;
                  });
                }}
              />
            </Box>

            {/* RIGHT NAV */}
            <Box
              sx={{
                display: "flex",
                gap: { xs: 3, lg: 6 },
                alignItems: "center",
              }}
            >
              {navbarRight.map((item, i) => {
                // ✅ DESKTOP SEARCH
                if (item.name === "search" && !isMobile) {
                  return (
                    <Box
                      key={item.name}
                      sx={{ position: "relative", height: 40, width: 245 }}
                    >
                      <input
                        ref={desktopInputRef}
                        value={query}
                        onChange={(e) => {
                          setQuery(e.target.value);
                          setOpenSuggest(true);
                        }}
                        onFocus={() => setOpenSuggest(true)}
                        onKeyDown={onSearchKeyDown}
                        placeholder="Search for products"
                        style={{
                          width: "100%",
                          height: "100%",
                          paddingLeft: "35px",
                          borderRadius: "8px",
                          border: "1px solid #bfbfbf",
                          fontSize: "12px",
                        }}
                      />
                      <img
                        src={search}
                        alt="search"
                        style={{
                          position: "absolute",
                          left: 10,
                          top: "50%",
                          transform: "translateY(-50%)",
                          height: 18,
                        }}
                      />
                    </Box>
                  );
                }

                // MOBILE SEARCH ICON
                if (item.name === "search" && isMobile) {
                  return (
                    <img
                      key={item.name}
                      src={item.icon}
                      alt="search"
                      onClick={item.onClick}
                      style={{ cursor: "pointer" }}
                    />
                  );
                }

                // 🛒 CART WITH BADGE
                if (item.name === "cart") {
                  return (
                    <Box
                      key={item.name}
                      sx={{ position: "relative", cursor: "pointer" }}
                      onClick={item.onClick}
                    >
                      <img loading="eager" src={item.icon} alt="cart" />

                      {cart?.product_count! > 0 && (
                        <Box
                          sx={{
                            position: "absolute",
                            top: -6,
                            right: -8,
                            background: "#E0181E",
                            color: "#fff",
                            borderRadius: "50%",
                            minWidth: 18,
                            height: 18,
                            fontSize: 11,
                            fontWeight: 700,
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            padding: "0 4px",
                          }}
                        >
                          {cart!.product_count}
                        </Box>
                      )}
                    </Box>
                  );
                }

                // DEFAULT ICON
                return (
                  <img
                    key={i}
                    src={item.icon}
                    alt={item.name}
                    onClick={item.onClick}
                    style={{ cursor: "pointer" }}
                  />
                );
              })}
            </Box>
          </Toolbar>
        )}

        {/* ✅ MOBILE SEARCH BAR */}
        {isSearchVisible && (
          <div className="searchBar">
            <Box
              sx={{
                position: "relative",
                height: "40px",
                width: "385px",
                m: 1,
              }}
            >
              <input
                ref={mobileInputRef}
                value={query}
                onChange={(e) => {
                  setQuery(e.target.value);
                  setOpenSuggest(true);
                }}
                onFocus={() => setOpenSuggest(true)}
                onKeyDown={onSearchKeyDown}
                placeholder="Search for products"
                style={{
                  width: "100%",
                  height: "100%",
                  paddingLeft: "35px",
                  borderRadius: "8px",
                  border: "1px solid #bfbfbf",
                  fontSize: "12px",
                }}
              />
              <img
                src={search}
                alt="search"
                style={{
                  position: "absolute",
                  left: "10px",
                  top: "50%",
                  transform: "translateY(-50%)",
                  height: "18px",
                }}
              />
              <img
                src={cross}
                alt="close"
                onClick={searchBarClick}
                style={{
                  position: "absolute",
                  right: "10px",
                  top: "50%",
                  transform: "translateY(-50%)",
                  height: "18px",
                  cursor: "pointer",
                }}
              />
            </Box>
          </div>
        )}

        <AutocompleteDropdown />
      </AppBar>
    </Box>
  );
};

export { Navbar };
