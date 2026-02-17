// dashboard.controller.tsx ✅ FULL UPDATED
// ✅ Change: call getDashboard ONLY when route is "/" (home) — not on /shop, /product, /about etc.
// ✅ Everything else kept the same (no behavior changes other than restricting dashboard API calls)

import { useTheme, useMediaQuery } from "@mui/material";
import { useEffect, useRef, useState, useMemo, useCallback } from "react";
import {
  useAppContext,
  type BlogCard,
  type Cart,
  type CartItem,
  type Product,
} from "../../context/app.context";

import carouselImg1 from "../../assets/carouselImg1.png";
import carouselImg3 from "../../assets/carousel image 3.png";
import carouselImg2 from "../../assets/carousel image 2.png";
import carouselImg1Mob from "../../assets/choco mobile.jpeg";
import carouselImg3Mob from "../../assets/original mobile.jpeg";
import carouselImg2Mob from "../../assets/Pure mobile.jpeg";
import step1 from "../../assets/step1.svg";
import step2 from "../../assets/step2.svg";
import step3 from "../../assets/step3.svg";
import clock from "../../assets/clock.svg";
import reviewOne from "../../assets/reviewOne.jpeg";
import reviewFour from "../../assets/reviewFour.jpeg";
import reviewFive from "../../assets/reviewFive.jpeg";
import reviewSix from "../../assets/reviewSix.jpeg";
import reviewSeven from "../../assets/reviewSeven.jpeg";
import reviewEight from "../../assets/reviewEight.jpeg";
import lowerMarqueeImage from "../../assets/Lowe Marquee.svg";
import upperMarqueeImage from "../../assets/Upper Marquee.svg";

import { apiService } from "../../sevice/api.service";
import { useLocation, useNavigate } from "react-router-dom";
import type { CartResponse } from "../../sevice/type";

/** ---------------------------
 * Helpers
 * -------------------------- */

/** localStorage keys (only used in THIS hook) */
const LS_KEYS = {
  products: "APP_PRODUCTS_V1",
  userID: "APP_USERID_V1",
  blogs: "APP_BLOGS_V1",
};

// ✅ Put this ONCE at component top (outside the IIFE)
type UiOffer = {
  key: "buy1" | "buy2";
  titleQty: number; // Buy 1 / Buy 2
  pillText?: string; // "Extra 10% Off" only on Buy 2 in your screenshot
  prepaidText: string; // "Extra 5% off on Prepaid"
  addQty: number; // how many items to add when Add is clicked
};

function safeParseJSON<T>(value: string | null): T | null {
  try {
    if (!value) return null;
    return JSON.parse(value) as T;
  } catch {
    return null;
  }
}

/** ---------------------------
 * Hook
 * -------------------------- */
const useDashboardController = () => {
  const {
    setShowMenu,
    showMenu,
    showCart,
    setShowCart,

    productData,
    setProductData,

    showLogin,
    showShop,
    setShowShop,

    showProductDetails,
    setShowProductDetails,

    showAboutUs,
    setAboutUs,

    setBlogData,
    blogData,

    setCart,
    cart,

    setCoupon,
    setUserID,
    userID,

    showPopup,
    setShowPopup,

    selectedWeightIndex,
    setSelectedWeightIndex,

    showGetLeads,
    setSetGetLeads,

    toast,
    setToast,
    isLoginedIn,
    setIsLoginedIn
  } = useAppContext();

  // ✅ SAME offers for ALL products (hardcoded)
  const HARD_OFFERS: UiOffer[] = [
    {
      key: "buy1",
      titleQty: 1,
      prepaidText: "Extra 5% off on",
      addQty: 1,
    },
    {
      key: "buy2",
      titleQty: 2,
      pillText: "Extra 10% Off",
      prepaidText: "Extra 5% off on",
      addQty: 2,
    },
  ];

  // ✅ ADD THIS ONCE at component top (outside the IIFE)
  const [selectedOfferKey, setSelectedOfferKey] = useState<UiOffer["key"]>(
    "buy1"
  );

  const location = useLocation();
  const navigate = useNavigate();
  const [openFaqKey, setOpenFaqKey] = useState<string | null>(null);

  const toggleFaq = (key: string) => {
    setOpenFaqKey((prev) => (prev === key ? null : key));
  };

  useEffect(() => {
    if (!showCart) return;

    const handleOutside = () => {
      setShowCart(false);
    };

    document.addEventListener("mousedown", handleOutside); // ✅ not "click"

    return () => {
      document.removeEventListener("mousedown", handleOutside);
    };
  }, [showCart, setShowCart]);

  // ⚠️ keep apiService stable (avoid recreating functions if apiService() creates new refs)
  const apiRef = useRef(apiService());
  const { getDashboard, removeFromCart, addToCart } = apiRef.current;

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const isProductRoute = location.pathname.startsWith("/product/");
  const isShopRoute = location.pathname === "/shop";
  const isAboutRoute = location.pathname === "/about";
  const isHomeRoute = location.pathname === "/"; // ✅ ADDED

  /** ---------------------------------------------------
   * ✅ NEW TAB FIX #1: Hydrate productData/userID from localStorage
   * -------------------------------------------------- */
  useEffect(() => {
    // If context is empty, try localStorage
    if (!productData || productData.length === 0) {
      const savedProducts = safeParseJSON<Product[]>(
        localStorage.getItem(LS_KEYS.products)
      );
      if (savedProducts && savedProducts.length > 0) {
        setProductData(savedProducts);
      }
    }

    // If userID is empty, try localStorage
    if (!userID) {
      const savedUserId = localStorage.getItem(LS_KEYS.userID);
      if (savedUserId) setUserID(savedUserId);
    }
    // run once on mount
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  /** ---------------------------------------------------
   * ✅ NEW TAB FIX #2: Persist productData/userID to localStorage
   * -------------------------------------------------- */
  useEffect(() => {
    if (productData && productData.length > 0) {
      localStorage.setItem(LS_KEYS.products, JSON.stringify(productData));
    }
  }, [productData]);

  useEffect(() => {
    if (userID) {
      localStorage.setItem(LS_KEYS.userID, userID);
    }
  }, [userID]);

  /** ---------------------------------------------------
   * Route -> UI state (FIXED)
   * -------------------------------------------------- */
  useEffect(() => {
    if (isShopRoute) {
      setShowShop(true);
      setAboutUs(false);
      setShowProductDetails(false);
      return;
    }

    if (isAboutRoute) {
      setAboutUs(true);
      setShowShop(false);
      setShowProductDetails(false);
      return;
    }

    if (isProductRoute) {
      setShowProductDetails(true);
      setShowShop(false);
      setAboutUs(false);
      return;
    }

    // default home/other
    setShowShop(false);
    setAboutUs(false);
    setShowProductDetails(false);
  }, [
    isShopRoute,
    isAboutRoute,
    isProductRoute,
    setShowShop,
    setAboutUs,
    setShowProductDetails,
  ]);

  /** ---------------------------------------------------
   * Popstate handling (optional)
   * -------------------------------------------------- */
  useEffect(() => {
    const handlePopState = () => {
      if (showProductDetails) setShowProductDetails(false);
      if (showShop) setShowShop(false);
      if (showAboutUs) setAboutUs(false);
      navigate("/", { replace: true });
    };

    window.addEventListener("popstate", handlePopState);
    return () => window.removeEventListener("popstate", handlePopState);
  }, [
    showProductDetails,
    showShop,
    showAboutUs,
    setShowProductDetails,
    setShowShop,
    setAboutUs,
    navigate,
  ]);

  /** ---------------------------------------------------
   * ✅ Product resolve logic (FIXED: NO async useMemo)
   * -------------------------------------------------- */

  // product passed via navigation state
  const productFromState = (location.state as any)?.productDetals ?? null;

  // slug from /product/:slug
  const productSlugFromUrl = useMemo(() => {
    if (!isProductRoute) return "";
    const raw = location.pathname.split("/product/")[1] || "";
    return decodeURIComponent(raw);
  }, [location.pathname, isProductRoute]);

  // resolved product state
  const [resolvedProduct, setResolvedProduct] = useState<Product | null>(null);
  const [isResolvingProduct, setIsResolvingProduct] = useState(false);

  useEffect(() => {
    let cancelled = false;

    const run = async () => {
      // 1) priority: product from state
      if (productFromState) {
        setResolvedProduct(productFromState);
        return;
      }

      // 2) not a product route or slug missing
      if (!isProductRoute || !productSlugFromUrl) {
        setResolvedProduct(null);
        return;
      }

      setIsResolvingProduct(true);

      try {
        // 3) try from context first (fastest)
        if (productData && productData.length > 0) {
          const foundFromContext =
            productData.find(
              (p) => p.header.toLowerCase() === productSlugFromUrl.toLowerCase()
            ) ?? null;

          if (!cancelled) setResolvedProduct(foundFromContext);
          return;
        }

        // 4) try localStorage
        const lsProducts = safeParseJSON<Product[]>(
          localStorage.getItem(LS_KEYS.products)
        );

        if (lsProducts && lsProducts.length > 0) {
          const foundFromLS =
            lsProducts.find(
              (p) => p.header.toLowerCase() === productSlugFromUrl.toLowerCase()
            ) ?? null;

          // sync app state too
          setProductData(lsProducts);

          if (!cancelled) setResolvedProduct(foundFromLS);
          return;
        }

        // ✅ IMPORTANT CHANGE:
        // ❌ DO NOT call getDashboard here anymore
        // because you want dashboard API only on "/"
        if (!cancelled) setResolvedProduct(null);
      } catch (err) {
        console.error("Product resolve failed:", err);
        if (!cancelled) setResolvedProduct(null);
      } finally {
        if (!cancelled) setIsResolvingProduct(false);
      }
    };

    run();

    return () => {
      cancelled = true;
    };
  }, [
    productFromState,
    isProductRoute,
    productSlugFromUrl,
    productData,
    setProductData,
  ]);

  const productDetals: Product | null = productFromState || resolvedProduct;

  // When user opened product page directly and data not yet resolved
  const isResolvingProductRoute =
    isProductRoute && isResolvingProduct && !productDetals;

  /** ---------------------------------------------------
   * FAQ + UI state
   * -------------------------------------------------- */
  const [mainImageIndex, setMainImageIndex] = useState(0);

  const [faqQuestionData, setFaqQuestionData] = useState([
    {
      que: "What is Peanut Butter Powder ?",
      ans: "Peanut Butter Powder is a high-protein, low-fat peanut powder made from roasted peanuts. It delivers the taste of peanut butter with significantly less fat and calories, making it ideal for fitness and healthy lifestyles.",
      clicked: true,
    },
    {
      que: "How is it different from normal peanut butter ?",
      ans: "It has: Less fat More protein Fewer calories Better versatility in food and drinks",
      clicked: false,
    },
    {
      que: "How can I use Peanut Butter Powder ?",
      ans: `
      You can use it in:
-Milk, shakes, smoothies
-Roti, atta, oats
-Sweets and snacks
-Chai and coffee
-Peanut butter spread
      `,
      clicked: false,
    },
    {
      que: "Is it only for gym people ?",
      ans: `No.
It is suitable for anyone who wants to increase protein in daily diet.`,
      clicked: false,
    },
    {
      que: "Is BMB Peanut Butter Powder vegan ?",
      ans: `Yes.
It is made from plant-based ingredients. No added Protein or Whey.`,
      clicked: false,
    },
    {
      que: "Does it change the taste of food ?",
      ans: `
      No.
It blends easily and adds a mild peanut taste`,
      clicked: false,
    },
  ]);

  const recipeSteps = [step1, step2, step3];

  function faqClick(index: number): void {
    setFaqQuestionData((prev) =>
      prev.map((item, i) => ({
        ...item,
        clicked: i === index ? !item.clicked : false,
      }))
    );
  }

  /** ---------------------------------------------------
   * Cart mapping
   * -------------------------------------------------- */
  function mapApiCartToCart(apiCart: CartResponse, products: Product[]): Cart {
    // ✅ FIRST sort apiCart.items so offer items go last
    const sortedApiItems = [...(apiCart.items ?? [])].sort(
      (a, b) => Number(!!a.offer_id) - Number(!!b.offer_id)
    );

    const items: CartItem[] = sortedApiItems.map((item) => {
      const product = products.find((p) => p.id === item.product_id);

      return {
        product_id: item.product_id,
        size: item.size,
        // ✅ if offer_id comes, quantity becomes 0 (so it won't affect counts)
        quantity: item.offer_id ? 0 : item.quantity,
        price: item.price,
        original_price: item.total_original_price,
        total_price: item.total_price,
        ...(item.offer_id ? { offer_id: item.offer_id } : {}),
        total_original_price: item.total_original_price,
        product_name: product?.header ?? "",
        product_type: product?.subHeader ?? "",
        product_image: product?.image?.[0]?.path ?? "",
      };
    });

    return {
      id: apiCart.id,
      created_at: apiCart.created_at,
      user_id: apiCart.user_id,
      session_id: apiCart.session_id!,
      items,
      product_count: apiCart.product_count,
      total_price: apiCart.total_price,
      total_original_price: items.reduce((sum, i) => sum + i.total_original_price, 0),
    };
  }

  const updateCartQuantity = useCallback(
    async (delta: number, weightSize: string | undefined, productId: string) => {
      if (!weightSize || !productData) return;

      try {
        const effectiveDelta = delta;

        const res =
          effectiveDelta > 0
            ? await addToCart(productId, weightSize, effectiveDelta, userID)
            : await removeFromCart(productId, userID, false, cart?.id, weightSize);
            

        if (!res?.cart) return;

        const normalizedCart = mapApiCartToCart(res.cart, productData);
        setCart(normalizedCart);
        // ✅ Precompute which productIds have offer items in cart (fast + clean)
        const offerProductIds = new Set<string | number>(
          normalizedCart.items
            .filter((ci) => !!ci.offer_id)
            .map((ci) => ci.product_id)
        );

        setProductData((prev) =>
          prev
            ? [...prev]
                // ✅ ONE sort only: priority first, then offer-products last
                .sort((a, b) => {
                  const ap = a.priority ?? 0;
                  const bp = b.priority ?? 0;

                  if (ap !== bp) return ap - bp;

                  const aHasOffer = offerProductIds.has(a.id);
                  const bHasOffer = offerProductIds.has(b.id);

                  return Number(aHasOffer) - Number(bHasOffer);
                })
                .map((product) => {
                  const relatedCartItems = normalizedCart.items.filter(
                    (ci) => ci.product_id === product.id
                  );

                  const updatedWeights =
                    product.weights?.map((w) => {
                      // ✅ pick only NON-OFFER cart item for this weight
                      const cartItem = relatedCartItems.find(
                        (ci) => ci.size === w.size && !ci.offer_id
                      );

                      const quantity = cartItem?.quantity ?? 0;

                      const unitPrice = Number(w.price ?? 0);
                      const unitOriginalPrice = Number(w.originalPrice ?? 0);

                      const baseTotal = unitPrice * quantity;
                      const baseOriginalTotal = unitOriginalPrice * quantity;

                      return {
                        ...w,
                        quantity,
                        price: w.price,
                        originalPrice: w.originalPrice,
                        total_price: baseTotal.toString(),
                        total_original_price: baseOriginalTotal.toString(),
                      };
                    }) ?? [];

                  // ✅ count should ONLY include NON-OFFER quantities
                  const totalCount = updatedWeights.reduce(
                    (sum, w) => sum + (w.quantity ?? 0),
                    0
                  );

                  const totalPrice = updatedWeights.reduce(
                    (sum, w) => sum + Number((w as any).total_price ?? 0),
                    0
                  );

                  const totalOriginalPrice = updatedWeights.reduce(
                    (sum, w) => sum + Number((w as any).total_original_price ?? 0),
                    0
                  );

                  return {
                    ...product,
                    count: totalCount,
                    weights: updatedWeights,
                    total_price: totalPrice.toString(),
                    total_original_price: totalOriginalPrice.toString(),
                  };
                })
            : prev
        );

        if (normalizedCart.items.length === 0) {
          setShowCart(false);
        }
      } catch (err) {
        console.error("Cart update failed", err);
      }
    },
    [
      productData,
      addToCart,
      removeFromCart,
      userID,
      cart?.id,
      setCart,
      setProductData,
      setShowCart,
    ]
  );

  /** ---------------------------------------------------
   * IMPORTANT FIX:
   * ✅ Fetch dashboard ONLY on "/"
   * -------------------------------------------------- */

  // ✅ safer than hasFetched
  const fetchingRef = useRef(false);

  useEffect(() => {
    // ✅ DO NOTHING unless home route
    if (!isHomeRoute) return;

    if (fetchingRef.current) return;
    fetchingRef.current = true;

    const run = async () => {
      try {
        const response = await getDashboard();
        if (!response?.data) return;

        /* ================= PRODUCTS ================= */
        const sortedProducts = response.data.products.sort(
          (a: any, b: any) => (a.priority ?? 0) - (b.priority ?? 0)
        );

        const cartItems: any[] = response.data?.cart?.items ?? [];

        const hasOffer = (item: any) =>
          item?.offerId != null || item?.offer_id != null || item?.offerID != null;

        const quantityByProductId = new Map<number, number>();

        for (const item of cartItems) {
          if (hasOffer(item)) continue;

          const qty = Number(item?.quantity ?? 0) || 0;
          if (!qty) continue;

          const pid = Number(item?.product_id);
          if (!Number.isFinite(pid)) continue;

          quantityByProductId.set(pid, (quantityByProductId.get(pid) ?? 0) + qty);
        }

        const mappedProducts: Product[] = sortedProducts.map((p: any) => {
          const DEFAULT_SIZE = "227gm";

          const allImages = (p.image_urls ?? []).map((url: string, idx: number) => ({
            path: url,
            name: `${p.name}-img-${idx + 1}`,
          }));

          const price227 =
            p.discounted_prices?.[DEFAULT_SIZE] ??
            p.size_prices?.[DEFAULT_SIZE] ??
            p.price;

          const originalPrice227 = p.size_prices?.[DEFAULT_SIZE] ?? p.price;

          const quantity = quantityByProductId.get(Number(p.id)) ?? 0;

          const weights = (p.sizes ?? []).map((size: string) => ({
            size,
            originalPrice: p.size_prices?.[size]?.toString() ?? p.price.toString(),
            price: p.discounted_prices?.[size]?.toString() ?? p.price.toString(),
            quantity: 0,
          }));

          /* ================= OFFERS ================= */
          const offers = (p.offers ?? []).map((o: any) => ({
            minQuantity: o.min_quantity,
            discountPercent: o.discount_percent,
            id: o.id,
          }));

          return {
            id: p.id,
            header: p.name,
            subHeader: p.description ?? "",
            originalPrice: originalPrice227.toString(),
            price: price227.toString(),
            image: allImages,
            count: quantity,
            priority: p.priority,
            weights,
            offers,
          } as Product;
        });

        /* ================= BLOGS ================= */
        const mappedBlogs: BlogCard[] = response.data.blogs.map(
          (blog: any, index: number) => ({
            img: {
              path: blog.image_urls?.[0],
              name: `blog-image-${blog.id ?? index}`,
            },
            header: blog.header,
            icon: { path: clock, name: "clock-icon" },
            subheader1: blog.subHeader1,
            paragraph1: blog.paragraph1 ?? "Lorem ipsum ".repeat(5),
            subheader2: blog.subHeader2,
            paragraph2: blog.paragraph2 ?? "Lorem ipsum ".repeat(5),
          })
        );

        /* ================= STATE SET ================= */
        localStorage.setItem(LS_KEYS.blogs, JSON.stringify(mappedBlogs));

        setUserID(response.sessionId!);
        setCart(response.data.cart_v2!);
        setProductData(mappedProducts);
        setBlogData(mappedBlogs);
        setCoupon(response.data.coupons ?? []);
      } catch (err) {
        console.error("Dashboard fetch failed:", err);
      } finally {
        fetchingRef.current = false;
      }
    };

    run();
  }, [
    isHomeRoute,
    getDashboard,
    setProductData,
    setBlogData,
    setCart,
    setCoupon,
    setUserID,
  ]);

  useEffect(() => {
    console.log("controller isMobile:", isMobile, "showMenu:", showMenu);
  }, [isMobile, showMenu]);

  /** ---------------------------------------------------
   * Mobile menu + FAQ reset
   * -------------------------------------------------- */
  useEffect(() => {
    if (!isMobile) setShowMenu(false);
    setFaqQuestionData((prev) =>
      prev.map((item, i) => (i === 0 ? { ...item, clicked: true } : item))
    );
  }, [isMobile, setShowMenu]);

  const isHomePage = !showShop && !showAboutUs && !showProductDetails;
  const isShopPage = showShop;

  /** ---------------------------------------------------
   * ✅ Product Details ViewModel
   * -------------------------------------------------- */
  const productDetailsVM = useMemo(() => {
    if (!showProductDetails) return null;
    if (!productDetals) return null;
    if (!productData || productData.length === 0) return null;

    const product = productData.find((p) => p.id === productDetals.id);
    if (!product) return null;

    const maxIndex = (product.weights?.length ?? 1) - 1;
    const safeWeightIndex = Math.min(selectedWeightIndex, Math.max(0, maxIndex));

    const selectedWeight = product.weights?.[safeWeightIndex];
    if (!selectedWeight) return null;

    const quantity = selectedWeight.quantity ?? 0;
    const displayQuantity = quantity > 0 ? quantity : 1;

    const unitPrice = Number(selectedWeight.price ?? 0);
    const unitOriginalPrice = Number(selectedWeight.originalPrice ?? 0);

    const totalPrice = unitPrice * displayQuantity;
    const totalOriginalPrice = unitOriginalPrice * displayQuantity;

    const images = product.image ?? [];
    const carouselImages = images.map((img, i) => ({
      name: (img as any).name ?? `img-${i}`,
      path: img.path,
    }));

    const stats = [
      { value: "2x", label: "Protein" },
      { value: "4x", label: "Less Fat" },
      { value: "1/3", label: "Calories" },
    ];

    return {
      product,
      images,
      carouselImages,
      stats,
      safeWeightIndex,
      selectedWeight,
      quantity,
      totalPrice,
      totalOriginalPrice,
    };
  }, [showProductDetails, productDetals?.id, productData, selectedWeightIndex]);

  /** ---------------------------------------------------
   * Return
   * -------------------------------------------------- */
  return {
    showMenu,
    isMobile,
    recipeSteps,
    faqClick,

    marqueeText: Array.from({ length: 12 }).map((_, i) => ({
      id: i + 1,
      text: "Flat 50% off on orders above $399",
    })),

    lowerMarqueeImage: [
      { id: 1, imageUrl: lowerMarqueeImage },
      { id: 2, imageUrl: lowerMarqueeImage },
    ],

    upperMarqueeImage: [
      { id: 1, imageUrl: upperMarqueeImage },
      { id: 2, imageUrl: upperMarqueeImage },
    ],

    dashboardCarousel: isMobile
      ? [
          { name: "img1", path: carouselImg1Mob },
          { name: "img2", path: carouselImg2Mob },
          { name: "img3", path: carouselImg3Mob },
        ]
      : [
          { name: "img1", path: carouselImg1 },
          { name: "img2", path: carouselImg2 },
          { name: "img3", path: carouselImg3 },
        ],

    navbarLeft: [
      { path: "/about", name: "OUR JOURNEY" },
      { path: "/shop", name: "SHOP" },
      { path: "/recipe", name: "RECIPES" },
    ],

    productData,

    blogData: {
      data: blogData,
      width: isMobile ? 340 : 425,
      height: isMobile ? 200 : 350,
    },

    testimonialsData: {
      data: [
        { img: { path: reviewOne, name: "", place: "Chandigarh" }, header: "Easy 4-Ingredient Peanut Butter Cookies" },
        { img: { path: reviewFour, name: "", place: "Chandigarh" }, header: "Easy 4-Ingredient Peanut Butter Cookies" },
        { img: { path: reviewFive, name: "", place: "Chandigarh" }, header: "Easy 4-Ingredient Peanut Butter Cookies" },
        { img: { path: reviewSix, name: "", place: "Chandigarh" }, header: "Easy 4-Ingredient Peanut Butter Cookies" },
        { img: { path: reviewSeven, name: "", place: "Chandigarh" }, header: "Easy 4-Ingredient Peanut Butter Cookies" },
        { img: { path: reviewEight, name: "", place: "Chandigarh" }, header: "Easy 4-Ingredient Peanut Butter Cookies" },
      ],
      width: isMobile ? 250 : 325,
      height: isMobile ? 200 : 350,
    },

    faqQuestionData,
    faqQueHeight: isMobile ? "175px" : "200px",

    updateCartQuantity,

    showCart,
    showLogin,

    showShop,
    setShowShop,

    showProductDetails,
    setShowProductDetails,

    showAboutUs,
    setAboutUs,

    checkCondition: showShop || showAboutUs,

    setBlogData,
    cart,
    navigate,

    productDetals,
    isResolvingProductRoute,

    setShowMenu,

    shouldShowPopup: showPopup && (isHomePage || isShopPage),
    setShowPopup,

    selectedWeightIndex,
    setSelectedWeightIndex,

    mainImageIndex,
    setMainImageIndex,

    dailogBoxCheck: showCart === false && (cart?.items?.length ?? 0) > 0,

    showGetLeads,
    setSetGetLeads,
    toast,
    setToast,

    productDetailsVM,
    openFaqKey,
    toggleFaq,

    selectedOfferKey,
    setSelectedOfferKey,
    HARD_OFFERS,

    setShowCart,
    isLoginedIn,
    setIsLoginedIn
  };
};

export { useDashboardController };
