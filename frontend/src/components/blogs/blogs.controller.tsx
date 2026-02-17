import { useMediaQuery, useTheme } from "@mui/material";
import { useLocation, useNavigate } from "react-router-dom";
import { useAppContext, type BlogCard } from "../../context/app.context";
import { shuffleArray } from "../../utils/utils";
// Optional icons/images if needed
import clock from "../../assets/clock.svg"; // Replace with your clock icon
const LS_KEYS = {
    products: "APP_PRODUCTS_V1",
    userID: "APP_USERID_V1",
    blogs: 'APP_BLOGS_V1'
};
function useBlogController() {
    const theme = useTheme();
    const { state } = useLocation();
    const {
        blogData,
        showCart,
        showMenu,
        setAboutUs,
        setShowShop,
        setShowMenu,
        setShowPopup,
        isLoginedIn,
        setIsLoginedIn
    } = useAppContext()
    const { index } = state;
    let tempBlogData: BlogCard[] = blogData ?? []
    if (tempBlogData?.length === 0) {
        tempBlogData = JSON.parse(localStorage.getItem(LS_KEYS.blogs)!)
    }

    // ✅ Map blogData to frontend format (img + header + icon + subheaders + paragraphs)
    const mappedBlogs = tempBlogData!.map((blog, i) => ({
        img: { path: blog.img.path, name: `blog-image-${blog.img.name ?? i}` },
        header: blog.header,
        icon: { path: clock, name: "clock-icon" }, // add icon path if needed
        subheader1: blog.subheader1,
        paragraph1: blog.paragraph1,
        subheader2: blog.subheader2,
        paragraph2: blog.paragraph2,
    }));


    // ✅ Featured blog
    const featuredBlog = mappedBlogs[index];

    // ✅ Remove featured from the rest
    const remainingBlogs = mappedBlogs.filter((_, i) => i !== index);

    // ✅ Shuffle remaining blogs
    const shuffledRemaining = shuffleArray(remainingBlogs);

    // ✅ Pick 3 for right, 3 for bottom
    const rightBlogs = shuffledRemaining.slice(0, 3);
    const bottomBlogs = shuffledRemaining.slice(3, 6);

    return {
        navbarLeft: [
            { path: "/about", name: "OUR JOURNEY" },
            { path: "/shop", name: "SHOP" },
            { path: "/recipe", name: "RECIPES" },
        ],
        isMobile: useMediaQuery(theme.breakpoints.down("sm")),
        navigate: useNavigate(),
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
    }
}

export {
    useBlogController
}
