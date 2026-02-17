import Marquee from '../../common/marquee/marquee';
import { Navbar } from '../../common/navbar/navbar';
import { useDashboardController } from './dashboard.controller';
import './dashboard.css';
import { DashCarousel } from '../../common/carousel/carousel'
import { ProductCard } from '../../common/productCard/productCard';
import { Box } from '@mui/material';
import breadGirl from '../../assets/breadGirl.svg'
import breadBoy from '../../assets//breadBoy.svg'
import breadBoyGirl from '../../assets/breadBoyGirlMobile.svg'
import leftSpoon from '../../assets/leftSpoon.svg'
import rigthSpoon from '../../assets/right spoon.svg'
import leftShakeGuy from '../../assets/leftshakeguy.svg';
import rightShakeGuy from '../../assets/rightshakeguy.svg';
import upArrow from '../../assets/chevron-up.svg';
import downArrow from '../../assets/chevron-down.svg';
import sectionRecipeSteps from '../../assets/sectionRecipeSteps.svg';
import sectionRecipeStepsMob from '../../assets/sectionRecipeSteps-mobile.svg';
import aboutUs from '../../assets/AboutUs.png';
import aboutUsWeb from '../../assets/AboutUsWeb.png';
import { MediaCard } from '../../common/mediaCard/mediaCard';
import { Footer } from '../../common/footer/footer';
import { Cart } from '../cart/cart.page';
import desktop from '../../assets/Desktop - 12.svg';
import desktop13 from '../../assets/Desktop - 13.svg';
import desktop11 from '../../assets/Desktop - 11.png';
import desktop11Mob from '../../assets/Desktop11Mob.svg';
import desktop13Mob from '../../assets/desktop13Mobile.svg';
import desktopMob from '../../assets/Desktop12Mobile.svg';
import desktopRecipeMob from '../../assets/mobileRecipeSteps.svg';
import natural from '../../assets/natural.svg';
import calories from '../../assets/calories.svg';
import jaggery from '../../assets/jaggery.svg';
import preservatives from '../../assets/preservatives.svg';
import HighProtein from '../../assets/High Protein.svg';
import groupPeople from '../../assets/groupPeople.svg';
import labTested from '../../assets/labTested.svg';
import redCross from '../../assets/redCross.svg';
import redCrossDark from '../../assets/redCrossDark.svg';
import whatsInside from '../../assets/whatsInside.svg';
import AddedToCartPopup from '../../common/dailogBox/AddedToCartPopup';
import AutoScrollCards from '../../common/autoscroll/autoscroll';
import { NutritionAdviceModal } from '../../common/dailogBox/NutritionAdviceModal';
import { Toast } from '../../common/dailogBox/toast';
import AutoScrollCardsRecipe from '../../common/autoscrollRecipe/autoscroll';
import { LoginPage } from '../login/login.page';
import Frame66 from '../../assets/Frame 66.svg'
import Frame66Mob from '../../assets/Frame66Mob.svg'

const Dashboard = () => {

  const {
    showMenu,
    setShowMenu,
    productData,
    navbarLeft,
    dashboardCarousel,
    lowerMarqueeImage,
    upperMarqueeImage,
    marqueeText,
    recipeSteps,
    isMobile,
    testimonialsData,
    faqQuestionData,
    faqClick,
    faqQueHeight,
    updateCartQuantity,
    showCart,
    showShop,
    showProductDetails,
    showAboutUs,
    checkCondition,
    blogData,
    navigate,
    setAboutUs,
    setShowShop,
    productDetals,
    isResolvingProductRoute,
    showLogin,
    setShowPopup,
    selectedWeightIndex,
    setSelectedWeightIndex,
    mainImageIndex,
    setMainImageIndex,
    dailogBoxCheck,
    showGetLeads,
    setSetGetLeads,
    toast,
    openFaqKey,
    toggleFaq,
    selectedOfferKey,
    setSelectedOfferKey,
    HARD_OFFERS,
    isLoginedIn,
    setIsLoginedIn
  } = useDashboardController()
  if (isResolvingProductRoute) return null; // or loader


  return (
    <>
      <div className="box">
        <Navbar navbarLeft={navbarLeft}></Navbar>
        {showMenu && (
          <Box
            onClick={(e) => e.stopPropagation()}
            sx={{
              display: "flex",
              gap: 5,
              position: "fixed",
              background: "white",
              top: "56px",
              height: !isLoginedIn ? "28%" : "45%",
              flexDirection: "column",
              zIndex: 1,
              width: "100%",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            {navbarLeft.map((item) => {
              const commonStyle = {
                textDecoration: "none",
                color: "black",
                fontFamily: "'DM Sans', sans-serif",
                fontWeight: 700,
                fontSize: "14px",
                cursor: "pointer",
              };

              if (item.name === "OUR JOURNEY") {
                return (
                  <Box key={item.path}>
                    <span
                      style={commonStyle}
                      onClick={() => {
                        navigate(item.path);
                        setAboutUs(false);
                        setShowShop(false);
                        setShowMenu(false);
                      }}
                    >
                      {item.name}
                    </span>
                  </Box>
                );
              }

              if (item.name === "SHOP") {
                return (
                  <Box key={item.path}>
                    <span
                      style={commonStyle}
                      onClick={() => {
                        navigate(item.path);
                        setAboutUs(false);
                        setShowPopup(true);
                        setShowMenu(false);
                      }}
                    >
                      {item.name}
                    </span>
                  </Box>
                );
              }

              if (item.name === "RECIPES") {
                return (
                  <Box key={item.path}>
                    <span
                      style={commonStyle}
                      onClick={() => {
                        setShowMenu(false);
                        setAboutUs(false);
                        setShowPopup(false);
                        navigate(item.path, { state: { index: 1 } });
                      }}
                    >
                      {item.name}
                    </span>
                  </Box>
                );
              }

              return null;
            })}

            {/* ✅ SIGN OUT OPTION */}
            {isLoginedIn && (
              <Box>
                <span
                  style={{
                    textDecoration: "none",
                    color: "red",
                    fontFamily: "'DM Sans', sans-serif",
                    fontWeight: 700,
                    fontSize: "14px",
                    cursor: "pointer",
                  }}
                  onClick={() => {
                    // 🔥 Your logout logic here
                    localStorage.clear()
                    setShowMenu(false);
                    setIsLoginedIn(false)
                    navigate("/");
                    window.location.reload();
                  }}
                >
                  SIGN OUT
                </span>
              </Box>
            )}
          </Box>
        )}

        {
          showProductDetails &&
          productDetals &&
          productData &&
          (() => {
            const product = productData.find((p) => p.id === productDetals.id);
            if (!product) return null;

            const safeWeightIndex = Math.min(
              selectedWeightIndex,
              (product.weights?.length ?? 1) - 1
            );
            const selectedWeight = product.weights?.[safeWeightIndex];
            if (!selectedWeight) return null;

            // ✅ selected hardcoded offer
            const selectedUiOffer =
              selectedOfferKey === "buy2" ? HARD_OFFERS[1] : HARD_OFFERS[0];

            // ✅ base unit prices from API / productData (DO NOT MODIFY THEM)
            const baseUnitPrice = Number(selectedWeight.price ?? 0);
            const baseUnitOriginalPrice = Number(selectedWeight.originalPrice ?? 0);

            /* =========================================================
               ✅ Offer prices (ONLY for showing inside offer radio cards)
                  - Buy1 => 0% (same as base)
                  - Buy2 => 10% off
            ========================================================= */
            const buy1DiscountPercent = 0;
            const buy2DiscountPercent = 10;

            // ✅ no float display: round to whole rupees
            const toRupeeInt = (n: number) => Math.max(0, Math.round(Number(n || 0)));

            const buy1DiscountedUnitPrice = toRupeeInt(
              baseUnitPrice * (1 - buy1DiscountPercent / 100)
            );
            const buy2DiscountedUnitPrice = toRupeeInt(
              baseUnitPrice * (1 - buy2DiscountPercent / 100)
            );

            // ✅ Price shown under radio buttons:
            // - Buy1 shows 1x discounted price
            // - Buy2 shows 2x discounted price (2 items total)
            const qtyMultiplier = selectedOfferKey === "buy2" ? 2 : 1;
            const selectedDiscountedUnit =
              selectedOfferKey === "buy2"
                ? buy2DiscountedUnitPrice
                : buy1DiscountedUnitPrice;

            const finalPayPrice = toRupeeInt(selectedDiscountedUnit * qtyMultiplier);
            const finalMrp = toRupeeInt(baseUnitOriginalPrice * qtyMultiplier);

            const handleWeightClick = (index: number) => setSelectedWeightIndex(index);

            const images = product.image ?? [];

            const carouselImages = images.map((img, i) => ({
              name: img.name ?? `img-${i}`,
              path: img.path,
            }));

            const handleThumbClick = (index: number) => {
              setMainImageIndex(index);
            };

            const stats = [
              { value: "2x", label: "Protein" },
              { value: "4x", label: "Less Fat" },
              { value: "1/3", label: "Calories" },
            ];

            /* =========================================================
               ✅ Product-specific content for PB Powders + Combos
               ✅ NOW: Special-case headers for combo ingredients
               ✅ Everything else stays the same
            ========================================================= */

            const normalizeName = (s: any) =>
              String(s ?? "")
                .trim()
                .toLowerCase()
                .replace(/\s+/g, " ");

            const headerNorm = normalizeName(product?.header);

            const isPurePowder = headerNorm === normalizeName("Pure Peanut Butter Powder");
            const isOriginalPowder =
              headerNorm === normalizeName("Original Peanut Butter Powder");
            const isChocolatePowder =
              headerNorm === normalizeName("Chocolate Peanut Butter Powder");

            const isPbPowder = isPurePowder || isOriginalPowder || isChocolatePowder;

            // ✅ Common lists
            const FREE_FROM_PURE: string[] = [
              "Preservative",
              "Hydrogenated oil",
              "Palm oil",
              "Artificial flavors",
              "Emulsifiers",
              "Soya or Protein Powders",
            ];

            const HOW_TO_USE_PURE: string[] = [
              "Mix in Atta",
              "Blend in Shakes",
              "Add to Smoothies",
              "Stir in Oats",
              "Use in Desserts",
            ];

            const HOW_TO_USE_ORIGINAL: string[] = [
              "Spread on Toast",
              "Blend in Shakes",
              "Add to smoothie",
              "Stir in oats",
              "Use in deserts",
            ];

            const SUITABLE_TEXT_POWDER =
              "Kids, adults, and senior- suitable for anyone looking to increase protein in their daily meals.";
            const SUITABLE_NOTE_POWDER = "Avoid if allergic to peanuts.";

            // ✅ Combo badges
            const COMBO_BADGES: string[] = [
              "Dairy Free",
              "Vegan",
              "Gluten Free",
              "No Preservative",
              "No Chemical",
            ];

            // ✅ flavor ingredients
            const FLAVOR_INGREDIENTS = {
              pure: "Pure - 100% Pure Roasted Peanuts",
              original: "Original - Roasted Peanuts, Sugar, Salt",
              chocolate: "Chocolate - Roasted Peanuts, Cocoa, Sugar, Salt",
            } as const;

            type FlavorKey = keyof typeof FLAVOR_INGREDIENTS;

            // ✅ EXACT HEADER OVERRIDES YOU ASKED FOR (highest priority)
            const HEADER_INGREDIENT_OVERRIDES: Record<string, FlavorKey[]> = {
              [normalizeName("Peanut Butter Family Pack")]: ["pure", "original", "chocolate"],
              [normalizeName("Pure & Original Combo")]: ["pure", "original"],
              [normalizeName("Pure & Chocolate Combo")]: ["chocolate", "pure"], // order as you wrote
              [normalizeName("Chocolate & Original Combo")]: ["original", "chocolate"], // order as you wrote
            };

            const overrideFlavors = HEADER_INGREDIENT_OVERRIDES[headerNorm] ?? null;

            const isAllCombos = headerNorm.includes("all combos");
            const headerHasPure = headerNorm.includes("pure");
            const headerHasOriginal = headerNorm.includes("original");
            const headerHasChocolate =
              headerNorm.includes("chocolate") || headerNorm.includes("cocoa");

            const isCombo =
              isAllCombos ||
              headerNorm.includes("combo") ||
              headerNorm.includes("pack") ||
              headerNorm.includes("duo") ||
              headerNorm.includes("trio") ||
              headerHasPure ||
              headerHasOriginal ||
              headerHasChocolate;

            // ✅ Pick flavors:
            // 1) If header matches your explicit list -> use that
            // 2) Else keep old detection logic
            const comboFlavors: FlavorKey[] = (() => {
              if (overrideFlavors) return overrideFlavors;

              if (isAllCombos) return ["pure", "original", "chocolate"];

              const picked: FlavorKey[] = [];
              if (headerHasPure) picked.push("pure");
              if (headerHasOriginal) picked.push("original");
              if (headerHasChocolate) picked.push("chocolate");

              if (picked.length === 0) return ["pure", "original", "chocolate"];
              return picked;
            })();

            const COMBO_INGREDIENTS: string[] = comboFlavors.map(
              (f) => FLAVOR_INGREDIENTS[f]
            );

            const POWDER_CONTENT = (() => {
              // ✅ COMBOS (now uses your header override when applicable)
              if (isCombo && !isPbPowder) {
                return {
                  badges: COMBO_BADGES,
                  ingredients: COMBO_INGREDIENTS,
                  freeFrom: FREE_FROM_PURE,
                  howToUse: HOW_TO_USE_ORIGINAL,
                  suitableText: SUITABLE_TEXT_POWDER,
                  suitableNote: SUITABLE_NOTE_POWDER,
                };
              }

              // ✅ Singles
              if (isPurePowder) {
                return {
                  badges: ["No Sugar", "Dairy Free", "Vegan", "Gluten Free", "No Preservative"],
                  ingredients: ["100% Pure Roasted Peanuts"],
                  freeFrom: FREE_FROM_PURE,
                  howToUse: HOW_TO_USE_PURE,
                  suitableText: SUITABLE_TEXT_POWDER,
                  suitableNote: SUITABLE_NOTE_POWDER,
                };
              }

              if (isOriginalPowder) {
                return {
                  badges: ["American Taste", "Dairy Free", "Vegan", "Gluten Free", "No Preservative"],
                  ingredients: ["Roasted Peanuts", "Sugar", "Salt"],
                  freeFrom: FREE_FROM_PURE,
                  howToUse: HOW_TO_USE_ORIGINAL,
                  suitableText: SUITABLE_TEXT_POWDER,
                  suitableNote: SUITABLE_NOTE_POWDER,
                };
              }

              if (isChocolatePowder) {
                return {
                  badges: ["Real Cocoa", "Dairy Free", "Vegan", "Gluten Free", "No Preservative"],
                  ingredients: ["Roasted Peanuts", "Cocoa", "Sugar", "Salt"],
                  freeFrom: FREE_FROM_PURE,
                  howToUse: HOW_TO_USE_ORIGINAL,
                  suitableText: SUITABLE_TEXT_POWDER,
                  suitableNote: SUITABLE_NOTE_POWDER,
                };
              }

              return null;
            })();

            /* =========================================================
               ✅ Default fallback content
            ========================================================= */

            const defaultBadges = [
              { icon: jaggery, label: "Jaggery" },
              { icon: natural, label: "All Natural" },
              { icon: calories, label: "1/3 Calories" },
              { icon: preservatives, label: "No Preservatives" },
              { icon: HighProtein, label: "High Protein" },
            ];

            const defaultIngredients: string[] = ["100% Pure Roasted Peanuts"];

            const defaultFreeFrom: string[] = [
              "Preservatives",
              "Sodium benzoate",
              "No Refind Sugar",
              "Mono- and diglycerides",
              "Hydrogenated Oil",
              "Palm Oil",
              "Artificial Flavours",
              "Emulsifiers E-471",
            ];

            const defaultHowToUse: string[] = ["Use in smoothies", "Add to oats", "Blend in shakes"];

            const defaultSuitableText: string =
              "Perfect for all ages – kids, adults, and seniors who love peanuts!";
            const defaultSuitableNote: string = "Not suitable for individuals with peanut allergies.";

            const badges = POWDER_CONTENT?.badges ?? defaultBadges;
            const ingredientsList = POWDER_CONTENT?.ingredients ?? defaultIngredients;
            const freeFromList = POWDER_CONTENT?.freeFrom ?? defaultFreeFrom;
            const howToUseList = POWDER_CONTENT?.howToUse ?? defaultHowToUse;
            const suitableText = POWDER_CONTENT?.suitableText ?? defaultSuitableText;
            const suitableNote = POWDER_CONTENT?.suitableNote ?? defaultSuitableNote;

            const handleAddToCart = () => {
              return updateCartQuantity(selectedUiOffer.addQty, selectedWeight.size, product.id);
            };

            /* =========================================================
               ✅ Badge styles (INLINE)
            ========================================================= */

            const badgeWrapStyle: React.CSSProperties = {
              display: "flex",
              flexWrap: "wrap",
              gap: "14px",
              marginTop: "12px",
            };

            const badgePillStyle: React.CSSProperties = {
              display: "inline-flex",
              alignItems: "center",
              gap: "10px",
              background: "#b30000",
              color: "#fff",
              borderRadius: "999px",
              padding: "12px 18px",
              minHeight: "44px",
              lineHeight: 1,
              fontWeight: 800,
              fontSize: "18px",
              letterSpacing: "0.2px",
              boxShadow: "0 2px 0 rgba(0,0,0,0.06)",
              userSelect: "none",
            };

            const badgeIconStyle: React.CSSProperties = {
              width: "24px",
              height: "24px",
              objectFit: "contain",
              filter: "brightness(0) invert(1)",
              flex: "0 0 auto",
            };

            const renderPillBadge = (label: string, icon?: string) => (
              <div key={label} style={badgePillStyle} title={label}>
                {!!icon && <img src={icon} alt="" style={badgeIconStyle} />}
                <span style={{ fontWeight: 800, whiteSpace: "nowrap", color: "white" }}>
                  {label}
                </span>
              </div>
            );

            return (
              <>
                <section className="product-details">
                  {/* LEFT IMAGES */}
                  <div className="product-images">
                    {!isMobile && (
                      <div className="thumbnail-column">
                        {images.map((img, i) => (
                          <div
                            className={`thumb ${i === mainImageIndex ? "active" : ""}`}
                            key={i}
                            onClick={() => handleThumbClick(i)}
                          >
                            <img loading="eager" src={img.path} alt={img.name} />
                          </div>
                        ))}
                      </div>
                    )}

                    <div className={isMobile ? "pd-mobile-carousel" : "main-image"}>
                      <DashCarousel
                        interval={5000}
                        images={carouselImages}
                        autoPlay={false}
                        wrap={true}
                        showArrows={true}
                        swipeable={true}
                        activeIndex={mainImageIndex}
                        onIndexChange={(i: number) => setMainImageIndex(i)}
                      />

                      {isMobile && (
                        <div className="pd-thumbs-row">
                          {images.map((img, i) => (
                            <button
                              type="button"
                              key={i}
                              className={`pd-thumb ${i === mainImageIndex ? "active" : ""}`}
                              onClick={() => handleThumbClick(i)}
                            >
                              <img loading="eager" src={img.path} alt={img.name} />
                            </button>
                          ))}
                        </div>
                      )}
                    </div>

                    {!isMobile && (
                      <div className="product-stats">
                        {stats.map((s, idx) => (
                          <div key={idx}>
                            <span>{s.value}</span>
                            <p>{s.label}</p>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* RIGHT DETAILS */}
                  <div className="product-info">
                    <h1>{product.header}</h1>

                    {/* ✅ BADGES (PILLS) */}
                    <div className="pd-badges" aria-label="Product highlights">
                      <div style={badgeWrapStyle}>
                        {Array.isArray(badges) && typeof (badges as any)[0] === "string"
                          ? (badges as string[]).map((label) => renderPillBadge(label))
                          : (badges as { icon: string; label: string }[]).map((b) =>
                            renderPillBadge(b.label, b.icon)
                          )}
                      </div>
                    </div>

                    {/* WEIGHT OPTIONS */}
                    <div className="weight">
                      <span>WEIGHT</span>
                      <div className="weight-options">
                        {product.weights?.map((w, index) => (
                          <button
                            key={index}
                            className={safeWeightIndex === index ? "active" : ""}
                            onClick={() => handleWeightClick(index)}
                          >
                            {w.size}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* ✅ OFFERS (RADIO BOXES) */}
                    <div className="pd-offers">
                      <button
                        type="button"
                        className={`pd-offer-card ${selectedOfferKey === "buy1" ? "active" : ""}`}
                        onClick={() => setSelectedOfferKey("buy1")}
                      >
                        <span className="pd-radio" aria-hidden="true" />
                        <div className="pd-offer-content">
                          <span className="pd-offer-title">Buy 1</span>
                          <span className="pd-offer-price">₹{buy1DiscountedUnitPrice}</span>
                          <span className="pd-offer-sub">
                            Extra 5% off on <b>Prepaid</b>
                          </span>
                        </div>
                      </button>

                      <button
                        type="button"
                        className={`pd-offer-card ${selectedOfferKey === "buy2" ? "active" : ""}`}
                        onClick={() => setSelectedOfferKey("buy2")}
                      >
                        <span className="pd-radio" aria-hidden="true" />
                        <div className="pd-offer-content">
                          <span className="pd-offer-title">
                            Buy 2 <span className="pd-offer-pill">Extra 10% Off</span>
                          </span>
                          <span className="pd-offer-price">₹{buy2DiscountedUnitPrice}</span>
                          <span className="pd-offer-sub">
                            Extra 5% off on <b>Prepaid</b>
                          </span>
                        </div>
                      </button>
                    </div>

                    {/* ✅ PRICE MOVED BELOW RADIO BUTTONS + SHOW DISCOUNTED TOTAL (1x / 2x) */}
                    <div className="price">
                      <span className="mrp">MRP: ₹{finalMrp}</span>
                      <span className="new">₹{finalPayPrice}</span>
                    </div>

                    {/* QUANTITY */}
                    <div className="quantity-cart">
                      <button className="addToCart" onClick={handleAddToCart}>
                        Add
                      </button>
                    </div>

                    {/* DETAILS */}
                    <div className="details">
                      <h2>Product Details</h2>
                      <p>{product.subHeader}</p>
                    </div>

                    {/* Stats boxes (mobile) */}
                    {isMobile && (
                      <div className="product-stats">
                        {stats.map((s, idx) => (
                          <div key={idx}>
                            <span>{s.value}</span>
                            <p>{s.label}</p>
                          </div>
                        ))}
                      </div>
                    )}

                    {/* ✅ UPDATED ACCORDION (4 ITEMS) */}
                    <div className="pd-accordion">
                      {/* Ingredients */}
                      <div className={`pd-acc-item ${openFaqKey === "ingredients" ? "open" : ""}`}>
                        <button
                          type="button"
                          className="pd-acc-header"
                          onClick={() => toggleFaq("ingredients")}
                          aria-expanded={openFaqKey === "ingredients"}
                        >
                          <span className="pd-acc-left">
                            <img src={whatsInside} alt="" className="pd-acc-icon" />
                            <span className="pd-acc-title">Ingredients</span>
                          </span>
                          <span className="pd-acc-chevron" aria-hidden="true">
                            ▾
                          </span>
                        </button>

                        <div className="pd-acc-body">
                          <ol className="pd-acc-list pd-acc-ordered">
                            {ingredientsList.map((item, idx) => (
                              <li key={idx} className="pd-acc-text">
                                {item}
                              </li>
                            ))}
                          </ol>
                        </div>
                      </div>

                      {/* Free from */}
                      <div className={`pd-acc-item ${openFaqKey === "freeFrom" ? "open" : ""}`}>
                        <button
                          type="button"
                          className="pd-acc-header"
                          onClick={() => toggleFaq("freeFrom")}
                          aria-expanded={openFaqKey === "freeFrom"}
                        >
                          <span className="pd-acc-left">
                            <img src={redCross} alt="" className="pd-acc-icon" />
                            <span className="pd-acc-title">Free from</span>
                          </span>
                          <span className="pd-acc-chevron" aria-hidden="true">
                            ▾
                          </span>
                        </button>

                        <div className="pd-acc-body">
                          <ul className="pd-acc-list pd-acc-crosslist">
                            {freeFromList.map((item, idx) => (
                              <li key={idx} className="pd-acc-text">
                                <img className="pd-cross" src={redCrossDark} alt="" />
                                <span>{item}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>

                      {/* How to use */}
                      <div className={`pd-acc-item ${openFaqKey === "howToUse" ? "open" : ""}`}>
                        <button
                          type="button"
                          className="pd-acc-header"
                          onClick={() => toggleFaq("howToUse")}
                          aria-expanded={openFaqKey === "howToUse"}
                        >
                          <span className="pd-acc-left">
                            <img src={labTested} alt="" className="pd-acc-icon" />
                            <span className="pd-acc-title">How to use</span>
                          </span>
                          <span className="pd-acc-chevron" aria-hidden="true">
                            ▾
                          </span>
                        </button>

                        <div className="pd-acc-body">
                          <ol className="pd-acc-list pd-acc-ordered">
                            {howToUseList.map((item, idx) => (
                              <li key={idx} className="pd-acc-text">
                                {item}
                              </li>
                            ))}
                          </ol>
                        </div>
                      </div>

                      {/* Suitable for */}
                      <div className={`pd-acc-item ${openFaqKey === "suitableFor" ? "open" : ""}`}>
                        <button
                          type="button"
                          className="pd-acc-header"
                          onClick={() => toggleFaq("suitableFor")}
                          aria-expanded={openFaqKey === "suitableFor"}
                        >
                          <span className="pd-acc-left">
                            <img src={groupPeople} alt="" className="pd-acc-icon" />
                            <span className="pd-acc-title">Suitable for</span>
                          </span>
                          <span className="pd-acc-chevron" aria-hidden="true">
                            ▾
                          </span>
                        </button>

                        <div className="pd-acc-body">
                          <p className="pd-acc-text pd-acc-paragraph">{suitableText}</p>
                          {!!suitableNote && (
                            <p className="pd-acc-text pd-acc-note">
                              <em>{suitableNote}</em>
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </section>
              </>
            );
          })()
        }

        {!showProductDetails && <>
          <Marquee
            direction='left'
            duration={50}
            items={marqueeText}
            useMargin={true}
            stop={false}
            options={{
              height: '45px'
            }}
          ></Marquee>
          {!showProductDetails && <>
            {!showShop && !showAboutUs && <DashCarousel
              interval={5000}
              images={dashboardCarousel}
              autoPlay={true}
              wrap={true}
              showArrows={false}
              swipeable={true}
            ></DashCarousel>}
            {showAboutUs && !isMobile && <img src={desktop11} alt="aboutUsImg" />}
            {showAboutUs && isMobile && <img src={desktop11Mob} alt="aboutUsImg" />}
            {!showShop && !showAboutUs && <>
              <Marquee
                direction='right'
                duration={35}
                items={upperMarqueeImage}
                useMargin={true}
                stop={false}
                imgHeight='40px'
                options={{
                  backgroundColor: 'white',
                  height: isMobile ? '40px' : '75px'
                }}
              ></Marquee>
              <Marquee
                direction='left'
                duration={35}
                items={lowerMarqueeImage}
                stop={false}
                imgHeight='40px'
                useMargin={true}
                options={{
                  backgroundColor: 'white',
                  height: isMobile ? '40px' : '75px'
                }}
              ></Marquee>
            </>}
            {!checkCondition &&
              <section id='showcase' className='showcase'>
                <div className='headerBox'>
                  <span>Explore our products</span>
                </div>
                <div className='products'>
                  {productData &&
                    productData
                      .slice(0, 4) // only first 3 products
                      .map((product) => (
                        <ProductCard
                          key={product.id}
                          count={product.count}
                          name={product.header}
                          description={product.subHeader}
                          price={Number(product.price)}
                          originalPrice={Number(product.originalPrice)}
                          id={product.id}
                          turncate={75}
                          image_urls={[product.image[0].path]}
                          updateCartQuantity={(delta, weightSize, productId) =>
                            updateCartQuantity(delta, weightSize, productId)
                          }
                        />

                      ))}
                </div>

              </section>
            }
          </>}

        </>}
        {showShop && <section id='showcase' className='showcase'>
          <div className='headerBox'>
            <span>Shop our products</span>
            <span>Choose Your Flavour</span>
          </div>
          <div className='productShowCase'>
            {productData && productData.map((product) => (
              <ProductCard
                key={product.id}
                count={product.count}
                name={product.header}
                description={product.subHeader}
                price={Number(product.price)}
                originalPrice={Number(product.originalPrice)}
                id={product.id}
                turncate={75}
                image_urls={[product.image[0].path]}
                updateCartQuantity={(delta, weightSize, productId) =>
                  updateCartQuantity(delta, weightSize, productId)
                }
              />

            ))}
          </div>

        </section>}
        {!showAboutUs && !showShop &&
          <>
            {!isMobile &&
              <section id='recipeSteps' className='recipeSteps'>
                <div className='headerBox '>
                  <span>Make creamy spread in just 3 easy steps</span>
                </div>
                <div className='guide'>
                  {recipeSteps.map((path, i) => (
                    <img loading="eager" src={path} key={i} alt="step1" />
                  ))}
                </div>
                {!isMobile ? (
                  <>
                    <img loading="eager" src={breadGirl} alt="breadGirl" id="breadGirl" />
                    <img loading="eager" src={breadBoy} alt="breadBoy" id="breadBoy" />
                  </>
                ) : (
                  <img loading="eager" src={breadBoyGirl} alt="breadBoyGirl" id="breadBoyGirl" />
                )}
              </section>
            }
            {isMobile &&
              <img loading="eager" src={desktopRecipeMob} alt="recipeSteps" />
            }
            <section className='pointerSection' id='pointerSection' style={{ background: '#FFE2C0', height: "auto" }}>
              <div className="leftSide">
                <div className='header'>
                  <span>Traditional</span>
                  <span>Peanut butter</span>
                </div>
                <img loading="eager" src={leftSpoon} alt="leftSpoon" />
                <div className='pointers'>
                  <div className='divider'>
                    <div className='pointerBox'>
                      <span>200</span>
                      <span>Calories</span>
                    </div>
                    <div className='pointerBox'>
                      <span>4g</span>
                      <span>Protein</span>
                    </div>
                  </div>
                  <div className='pointerBox'>
                    <span>16g</span>
                    <span>Fat</span>
                  </div>
                </div>
              </div>
              <div className='middle'>
                vs
              </div>
              <div className='rightSide'>
                <div className='header'>
                  <div>
                    <span>
                      BMB
                    </span>
                    <span>
                      Peanut
                    </span>
                  </div>
                  <div>
                    <span>
                      butter
                    </span>
                    <span>
                      powder
                    </span>
                  </div>
                </div>
                <img loading="eager" src={rigthSpoon} alt="rightSpoon" />
                <div className='pointers'>
                  <div className='divider'>
                    <div className='pointerBox'>
                      <span>69</span>
                      <span>Calories</span>
                    </div>
                    <div className='pointerBox'>
                      <span>8.6g</span>
                      <span>Protein</span>
                    </div>
                  </div>
                  <div className='pointerBox'>
                    <span>2.6g</span>
                    <span>Fat</span>
                  </div>
                </div>
              </div>
            </section>
          </>
        }
        {showProductDetails && !isMobile && <img loading="eager" src={sectionRecipeSteps} alt="guideLine" />}
        {showProductDetails && isMobile && <img loading="eager" src={sectionRecipeStepsMob} alt="guideLine" />}
        {showAboutUs &&
          <div className='aboutUs'>
            <div className='aboutUsDetails'>
              <div>
                <span>Built by People Who</span>
                <span>Faced the Problem First</span>
              </div>
              <div>
                <img loading="eager" style={{ height: '100%' }} src={isMobile ? aboutUs : aboutUsWeb} alt="aboutUs" />
              </div>
              <div>
                <span>Build My Body was started by three friends-Jugraj Deep Singh, Jasdeep Singh, and Jaskirat Singh, who shared a common frustration</span>
                <span>Eating healthy in India felt unnecessarily hard.</span>
                <span>
                  They weren’t bodybuilders.
                </span>
                <span>
                  They weren’t nutrition experts.
                </span>
                <span>
                  They were everyday people trying to improve their diet and struggling to get enough protein without changing their lifestyle.
                </span>
                <span>
                  From confusing supplements to expensive shakes and sugar-loaded “healthy” foods, nothing felt practical or sustainable for daily life.
                </span>
                <span>That frustration sparked a simple question:</span>
                <span>“Why isn’t there an easier way to get protein every day?”</span>
                <span>And that question became Build My Body.</span>
              </div>
            </div>
            <img loading="eager" src={aboutUs} style={{ height: '100%' }} alt="aboutUs" />
          </div>
        }
        {showAboutUs && !isMobile && <img loading="eager" src={desktop13} alt="desktop" />}
        {showAboutUs && isMobile && <img loading="eager" src={desktop13Mob} alt="desktop" />}
        {showAboutUs && !isMobile && <img loading="eager" src={desktop} alt="desktop" />}
        {showAboutUs && isMobile && <img loading="eager" src={desktopMob} alt="desktopMobile" />}
        {showAboutUs && (
          <section className="aboutHero">
            <img className="aboutHeroBg" src={isMobile ? Frame66Mob : Frame66} alt="" />

            {/* INSIDE CONTENT */}
            <div className="aboutHeroContent">
              <h2 className="aboutHeroTitle">Upgrade What You Already Eat</h2>

              <p className="aboutHeroDesc">
                You don’t need a new lifestyle to eat better.
                <br />
                You just need better everyday choices.
              </p>

              <div className="aboutHeroActions">
                <button className="aboutHeroBtn aboutHeroBtnPrimary" onClick={() => navigate('/shop')}>
                  Explore Our Products
                </button>

                <button className="aboutHeroBtn aboutHeroBtnOutline" onClick={() => setSetGetLeads(prev => !prev)}>
                  Get Free Nutrition Advice
                </button>
              </div>
            </div>
          </section>
        )}
        {!showProductDetails && !showAboutUs && !showShop && <section className='advice' id='advice'>
          <div style={{
            width: isMobile ? '350px' : '600px',
            fontSize: isMobile ? '24px' : '48px',
            fontFamily: 'Paytone One',
            color: 'white',
            lineHeight: isMobile ? '30px' : '50px',
            textAlign: 'center',
          }}>
            Confused about protein?
            Calories? Daily intake?
          </div>
          <div style={{
            width: isMobile ? '350px' : '655px',
            fontFamily: 'DM Sans',
            fontSize: isMobile ? '12px' : '24px',
            textAlign: 'center',
            color: 'white',
          }}>
            Our nutrition experts help you understand what your body needs — based on your lifestyle, not trends.
          </div>
          <button className='adviceBtn' onClick={() => setSetGetLeads(prev => !prev)}>Get Free Nutrition Advice</button>
          <img loading="eager" src={leftShakeGuy} style={{ position: isMobile ? 'relative' : 'absolute' }} alt="leftShakeGuy" />
          <img loading="eager" src={rightShakeGuy} style={{ display: isMobile ? 'none' : 'block' }} alt="rightShakeGuy" />
        </section >}
        {!showProductDetails && !showAboutUs && (
          <section className="recipe" id="recipe">
            <div className="header">
              Let’s make something healthier together
            </div>

            <AutoScrollCardsRecipe
              isMobile={isMobile}
              mobileOnly={false}
              webMode="step"
              direction="left"
              pauseMs={2000}
              animMs={450}
            >
              {blogData.data &&
                blogData.data.map((items, i) => (
                  <MediaCard
                    index={i}
                    key={items.img.name + i}
                    {...items}
                    height={blogData.height}
                    width={blogData.width}
                    isMobile={isMobile}
                  />
                ))}
            </AutoScrollCardsRecipe>
          </section>
        )}
        {showProductDetails &&
          <div className='aboutUs'>
            <div className='aboutUsDetails'>
              <div>
                <span>Built by People Who</span>
                <span>Faced the Problem First</span>
              </div>
              <div>
                <img loading="eager" style={{ height: '100%' }} src={isMobile ? aboutUs : aboutUsWeb} alt="aboutUs" />
              </div>
              <div>
                <span>Build My Body was started by three friends-Jugraj Deep Singh, Jasdeep Singh, and Jaskirat Singh, who shared a common frustration</span>
                <span>Eating healthy in India felt unnecessarily hard.</span>
                <span>
                  They weren’t bodybuilders.
                </span>
                <span>
                  They weren’t nutrition experts.
                </span>
                <span>
                  They were everyday people trying to improve their diet and struggling to get enough protein without changing their lifestyle.
                </span>
                <span>
                  From confusing supplements to expensive shakes and sugar-loaded “healthy” foods, nothing felt practical or sustainable for daily life.
                </span>
                <span>That frustration sparked a simple question:</span>
                <span>“Why isn’t there an easier way to get protein every day?”</span>
                <span>And that question became Build My Body.</span>
              </div>
            </div>
            <img loading="eager" src={aboutUs} style={{ height: '100%' }} alt="aboutUs" />
          </div>
        }
        {!showAboutUs && <section className="testimonials" id="testimonials">
          <div className="header">
            From Those who loved
          </div>

          <AutoScrollCards isMobile={true} mobileOnly={false} webMode="step" direction="right" pauseMs={2000} animMs={450}>
            {testimonialsData.data.map((items, i) => (
              <MediaCard
                index={i}
                key={i}
                {...items}
                height={testimonialsData.height}
                width={testimonialsData.width}
                isMobile={isMobile}
                testimonial
              />
            ))}
          </AutoScrollCards>
        </section>}

        {!showAboutUs && <section className='faq' id='faq'>
          <div className='questions'>
            <span>FAQs</span>
            {faqQuestionData.map((data, i) => {
              return <div key={data.que + i} className='questionBox' style={data.clicked ? { height: faqQueHeight } : {}}>
                <div onClick={() => faqClick(i)}>
                  <span>{data.que}</span>
                  <img loading="eager" src={data.clicked ? upArrow : downArrow} style={{ cursor: 'pointer' }} alt={i.toLocaleString()} />
                </div>
                <span style={!data.clicked ? { opacity: '0', display: 'none' } : {}} className='answer'>
                  {data.ans}
                </span>
              </div>
            })}
          </div>
          <img loading="eager" src={breadGirl} alt="leftShakeGuy" />
          <img loading="eager" src={rightShakeGuy} alt="rightShakeGuy" />
        </section>}
        {showCart && <div onMouseDown={(e) => e.stopPropagation()}>
          <Cart></Cart>
        </div>}
        {showLogin && <LoginPage />}
        {!showAboutUs && dailogBoxCheck && <AddedToCartPopup></AddedToCartPopup>}
        <Footer isMobile></Footer>
      </div >
      {toast.show && <Toast></Toast>}
      {showGetLeads && <NutritionAdviceModal></NutritionAdviceModal>}
    </>
  )
}

export {
  Dashboard
}