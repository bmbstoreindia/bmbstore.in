import type { JSX } from "@emotion/react/jsx-runtime";
import { Navbar } from "../../common/navbar/navbar";
import { useBlogController } from "./blogs.controller";
import { Footer } from "../../common/footer/footer";

import "./blogs.css";
import { Cart } from "../cart/cart.page";
import { Box } from "@mui/material";

function BlogPage(): JSX.Element {
    const {
        navbarLeft,
        isMobile,
        navigate,
        featuredBlog,
        rightBlogs,
        bottomBlogs,
        showCart,
        mappedBlogs,
        showMenu,
        setAboutUs,
        setShowShop,
        setShowMenu,
        setShowPopup,
        isLoginedIn,
        setIsLoginedIn
    } = useBlogController();
    const recipeShowCase = isMobile ? mappedBlogs : rightBlogs
    return (
        <>
            <Navbar navbarLeft={navbarLeft} />
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
            <div className="blogs-container">
                <h1 className="blogs-title">Recipes</h1>

                {/* Top Section */}
                <div className="blogs-top">
                    {/* Left Big Card */}
                    {!isMobile && <div
                        className="blogs-featured"
                        onClick={() => navigate(`/recipe/${encodeURIComponent(featuredBlog.header)}`)}
                    >
                        <div>
                            <img loading="eager" src={featuredBlog.img.path} alt="Featured Recipe" />
                        </div>
                        <div className="blogs-featured-text">
                            <h2>{featuredBlog.header}</h2>
                            <span>⏱ 5 Mins Read</span>
                        </div>
                    </div>}

                    {/* Right Small List */}
                    <div className="blogs-side-list">
                        {recipeShowCase.map((blog, i) => (
                            <div
                                key={blog.img.name ?? i}
                                onClick={() => navigate(`/recipe/${encodeURIComponent(blog.header)}`)}
                                className="blogs-side-item"
                            >
                                <div>
                                    <img loading="eager" src={blog.img.path} alt={blog.img.name} className="color-box" />
                                </div>
                                <div style={{ width: '80%' }}>
                                    <p>{blog.header}</p>
                                    <span>⏱ 5 Mins Read</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Bottom Cards */}
                <div className="blogs-bottom">
                    {bottomBlogs.map((blog, i) => (
                        <div
                            key={blog.img.name ?? i}
                            className="blogs-card"
                            onClick={() => navigate(`/recipe/${encodeURIComponent(blog.header)}`)}
                        >
                            <img loading="eager" src={blog.img.path} alt={blog.header} />
                            <h3>{blog.header}</h3>
                            <span>⏱ 5 Mins</span>
                        </div>
                    ))}
                </div>
            </div>
            {showCart && <Cart></Cart>}

            <Footer isMobile={isMobile} />
        </>
    );
}

export { BlogPage };
