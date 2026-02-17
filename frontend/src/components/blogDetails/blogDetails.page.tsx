// BlogDetails.tsx
import type { JSX } from "@emotion/react/jsx-runtime";
import { Navbar } from "../../common/navbar/navbar";
import { Footer } from "../../common/footer/footer";
import Marquee from "../../common/marquee/marquee";
import { useBlogDetailsController } from "./blogDetails.controller";

import facebookBrown from "../../assets/FacebookBrown.svg";
import twitterBrown from "../../assets/TwitterBrown.svg";
import link from "../../assets/Link.svg";
import whatsAppBrown from "../../assets/whatsAppBrown.svg";

import "./blogDetails.css";
import { Cart } from "../cart/cart.page";
import { Box } from "@mui/material";

function BlogDetails(): JSX.Element {
    const {
        navbarLeft,
        isMobile,
        marqueeText,
        blog,
        recipe,
        bottomBlogs,
        navigate,
        showCart,
        showMenu,
        setAboutUs,
        setShowShop,
        setShowMenu,
        setShowPopup,
        isLoginedIn,
        setIsLoginedIn,
    } = useBlogDetailsController();

    /* ===============================
       ✅ SHARE HELPERS (NEW)
    ================================ */

    const pageUrl =
        typeof window !== "undefined" ? window.location.href : "";

    const shareText =
        recipe?.title
            ? `Check this recipe: ${recipe.title}`
            : "Check this out!";

    const openPopup = (url: string) => {
        if (typeof window === "undefined") return;
        window.open(url, "_blank", "noopener,noreferrer,width=600,height=700");
    };

    const onShareFacebook = () => {
        openPopup(
            `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(pageUrl)}`
        );
    };

    const onShareTwitter = () => {
        openPopup(
            `https://twitter.com/intent/tweet?text=${encodeURIComponent(
                `${shareText}\n${pageUrl}`
            )}`
        );
    };

    const onShareWhatsApp = () => {
        openPopup(
            `https://wa.me/?text=${encodeURIComponent(`${shareText}\n${pageUrl}`)}`
        );
    };

    const onCopyLink = async () => {
        try {
            await navigator.clipboard.writeText(pageUrl);
            // if you have snackbar, trigger here
        } catch {
            // fallback (older browsers / permissions)
            try {
                const temp = document.createElement("input");
                temp.value = pageUrl;
                document.body.appendChild(temp);
                temp.select();
                document.execCommand("copy");
                document.body.removeChild(temp);
            } catch {
                // ignore
            }
        }
    };

    // ✅ If user refreshes page and state is missing
    if (!blog || !recipe) {
        return (
            <>
                <Navbar navbarLeft={navbarLeft} />

                <Marquee
                    direction="right"
                    duration={50}
                    items={marqueeText}
                    useMargin={true}
                    stop={false}
                />

                <div className="recipe-details-container">
                    <h1 className="recipe-header">Recipe not found</h1>
                    <p className="recipe-text" style={{ textAlign: "center" }}>
                        Please go back to Recipes and open a recipe again.
                    </p>

                    <div style={{ display: "flex", justifyContent: "center", marginTop: 18 }}>
                        <button
                            type="button"
                            className="recipe-back-btn"
                            onClick={() => navigate("/recipe")}
                        >
                            ← Back to Recipes
                        </button>
                    </div>
                </div>

                <Footer isMobile={isMobile} />
            </>
        );
    }

    return (
        <>
            <Navbar navbarLeft={navbarLeft} />

            <Marquee
                direction="right"
                duration={50}
                items={marqueeText}
                useMargin={true}
                stop={false}
            />

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
                                    localStorage.clear();
                                    setShowMenu(false);
                                    setIsLoginedIn(false);
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

            <div className="recipe-details-container">
                {/* Header */}
                <header className="recipe-header-wrap">
                    <h1 className="recipe-header">{recipe.title}</h1>

                    <div className="recipe-meta">
                        <span className="recipe-pill">⏱ 5 Mins Read</span>
                    </div>

                    {/* Tags */}
                    {recipe.meta.tags && recipe.meta.tags.length > 0 && (
                        <div className="recipe-tags">
                            {recipe.meta.tags.map((t) => (
                                <span key={t} className="recipe-tag">
                                    {t}
                                </span>
                            ))}
                        </div>
                    )}
                </header>

                {/* Hero Image */}
                <div className="recipe-hero">
                    <img loading="eager" src={recipe.image} alt={recipe.title} />
                </div>

                {/* Content */}
                <div className="recipe-content">
                    {/* Ingredients */}
                    <section className="recipe-section">
                        <h2 className="recipe-subheader">Ingredients</h2>

                        <ul className="recipe-list">
                            {recipe.ingredients.map((item, idx) => (
                                <li key={`${item}-${idx}`}>{item}</li>
                            ))}
                        </ul>
                    </section>

                    <hr className="recipe-divider" />

                    {/* Method */}
                    <section className="recipe-section">
                        <h2 className="recipe-subheader">🧑‍🍳 Method</h2>

                        <ol className="recipe-steps">
                            {recipe.method.map((step, idx) => (
                                <li key={`${step}-${idx}`}>
                                    <span className="step-index">{idx + 1}</span>
                                    <p className="step-text">{step}</p>
                                </li>
                            ))}
                        </ol>
                    </section>

                    {/* Nutrition */}
                    {recipe.nutrition.length > 0 && (
                        <>
                            <hr className="recipe-divider" />

                            <section className="recipe-section">
                                <h2 className="recipe-subheader">🧮 Nutrition Per 1 Roti</h2>

                                <div className="nutrition-card">
                                    <div className="nutrition-row nutrition-head">
                                        <span>Nutrient</span>
                                        <span>Amount</span>
                                    </div>

                                    {recipe.nutrition.map((n) => (
                                        <div className="nutrition-row" key={n.label}>
                                            <span>{n.label}</span>
                                            <span>{n.value}</span>
                                        </div>
                                    ))}
                                </div>
                            </section>
                        </>
                    )}

                    {/* Disclaimer */}
                    {recipe.disclaimer && (
                        <section className="recipe-section recipe-disclaimer">
                            <h3 className="recipe-disclaimer-title">Disclaimer</h3>
                            <p className="recipe-text">{recipe.disclaimer}</p>
                        </section>
                    )}

                    {/* ✅ Share (UPDATED) */}
                    <div className="recipe-share">
                        <span>Share Via</span>

                        <button
                            className="icon-btn"
                            type="button"
                            aria-label="Facebook"
                            onClick={onShareFacebook}
                        >
                            <img loading="eager" src={facebookBrown} alt="Facebook" />
                        </button>

                        <button
                            className="icon-btn"
                            type="button"
                            aria-label="Twitter"
                            onClick={onShareTwitter}
                        >
                            <img loading="eager" src={twitterBrown} alt="Twitter" />
                        </button>

                        <button
                            className="icon-btn"
                            type="button"
                            aria-label="WhatsApp"
                            onClick={onShareWhatsApp}
                        >
                            <img loading="eager" src={whatsAppBrown} alt="WhatsApp" />
                        </button>

                        <button
                            className="icon-btn"
                            type="button"
                            aria-label="Copy Link"
                            onClick={onCopyLink}
                        >
                            <img loading="eager" src={link} alt="Copy Link" />
                        </button>
                    </div>
                </div>

                {/* Related / Bottom recipe */}
                {bottomBlogs.length > 0 && (
                    <div className="recipe-related">
                        {bottomBlogs.map((b, i) => {
                            const img = b.img.path;
                            return (
                                <button
                                    key={i}
                                    className="related-card"
                                    type="button"
                                    onClick={() =>
                                        navigate(`/recipe/${encodeURIComponent(b.header)}`, {
                                            state: { blog: b },
                                        })
                                    }
                                >
                                    <img loading="eager" src={img} alt={b.header} />
                                    <p>{b.header}</p>
                                    <span>⏱ 5 Mins</span>
                                </button>
                            );
                        })}
                    </div>
                )}
            </div>

            {showCart && <Cart />}

            <Footer isMobile={isMobile} />
        </>
    );
}

export { BlogDetails };
