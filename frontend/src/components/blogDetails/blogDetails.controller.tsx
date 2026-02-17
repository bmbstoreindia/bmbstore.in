// blogDetails.controller.ts
import { useMemo } from "react";
import { useMediaQuery, useTheme } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useAppContext, type BlogCard } from "../../context/app.context";
import { shuffleArray } from "../../utils/utils";


type ParsedRecipe = {
    title: string;
    image?: string;

    meta: {
        servings?: string;
        tags?: string[];
    };

    ingredients: string[];
    method: string[];
    nutrition: { label: string; value: string }[];
    disclaimer?: string;
};

/* ===================== HELPERS ===================== */

// ✅ Extract servings like: "Ingredients (2 rotis):-"
function extractServings(text: string): string | undefined {
    const clean = (text ?? "").replace(/\r/g, "").trim();

    // match anything inside brackets: (2 rotis), (1 serving), etc.
    const m = clean.match(/\(([^)]+)\)/);
    return m?.[1]?.trim();
}

// ✅ Convert "- item" lines into array
function parseBullets(text: string): string[] {
    return (text ?? "")
        .replace(/\r/g, "")
        .split("\n")
        .map((line) => line.replace(/^[-•]\s*/, "").trim())
        .filter(Boolean);
}

// ✅ Parse method from arrows "→" or line breaks
function parseMethod(text: string): string[] {
    const clean = (text ?? "").replace(/\r/g, "").trim();

    // Take only the part before nutrition/disclaimer sections
    const beforeNutrition = clean.split("🧮")[0].trim();

    // Prefer arrow split if present
    if (beforeNutrition.includes("→")) {
        return beforeNutrition
            .split("→")
            .map((s) => s.trim())
            .filter(Boolean);
    }

    // Otherwise split by newlines
    return beforeNutrition
        .split("\n")
        .map((s) => s.trim())
        .filter(Boolean);
}

// ✅ Parse nutrition table lines inside paragraph2
function parseNutrition(text: string): { label: string; value: string }[] {
    const clean = (text ?? "").replace(/\r/g, "");

    // Get everything after "Nutrition Per 1 Roti"
    const after = clean.split("🧮 Nutrition Per 1")[1];
    if (!after) return [];

    const lines = after
        .split("\n")
        .map((l) => l.trim())
        .filter(Boolean);

    const nutrition: { label: string; value: string }[] = [];

    for (const line of lines) {
        // stop if disclaimer starts
        if (line.toLowerCase().includes("disclaimer")) break;

        // ignore headers
        if (line.toLowerCase() === "nutrient" || line.toLowerCase() === "amount") continue;
        if (line.toLowerCase().startsWith("nutrient")) continue;

        // split by tabs or 2+ spaces
        const parts = line.split(/\t+|\s{2,}/).map((p) => p.trim()).filter(Boolean);

        // Expected: ["Calories", "~130 kcal"]
        if (parts.length >= 2) {
            nutrition.push({ label: parts[0], value: parts[1] });
        } else {
            // fallback: handle "Protein 7.5 g" (single space)
            const m = line.match(/^(Calories|Protein|Carbs|Fat)\s+(.+)$/i);
            if (m) nutrition.push({ label: m[1], value: m[2].trim() });
        }
    }

    return nutrition;
}

// ✅ Parse disclaimer text after "Disclaimer"
function parseDisclaimer(text: string): string | undefined {
    const clean = (text ?? "").replace(/\r/g, "");

    if (!clean.toLowerCase().includes("disclaimer")) return undefined;

    // take after "Disclaimer" and before tags (👉) if present
    const part = clean.split(/Disclaimer/i)[1] ?? "";
    const beforeTags = part.split("👉")[0].trim();

    return beforeTags || undefined;
}

// ✅ Parse tags after 👉
function parseTags(text: string): string[] {
    const clean = (text ?? "").replace(/\r/g, "");

    if (!clean.includes("👉")) return [];

    const after = clean.split("👉")[1] ?? "";
    return after
        .split(",")
        .map((t) => t.trim())
        .filter(Boolean);
}

// ✅ MAIN PARSER (kept inside same file as you asked)
function parseRecipeFromApi(blog: BlogCard): ParsedRecipe {
    return {
        title: (blog.header ?? "").trim(),
        image: blog.img.path,

        meta: {
            servings: extractServings(blog.header) ?? "2 rotis",
            tags: parseTags(blog.paragraph2),
        },

        ingredients: parseBullets(blog.paragraph1),
        method: parseMethod(blog.paragraph2),
        nutrition: parseNutrition(blog.paragraph2),
        disclaimer: parseDisclaimer(blog.paragraph2),
    };
}
const LS_KEYS = {
    products: "APP_PRODUCTS_V1",
    userID: "APP_USERID_V1",
    blogs: 'APP_BLOGS_V1'
};
/* ===================== CONTROLLER ===================== */

const useBlogDetailsController = () => {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
    const navigate = useNavigate();
    const { blogData, showCart,
        showMenu,
        setAboutUs,
        setShowShop,
        setShowMenu,
        setShowPopup,
        isLoginedIn,
        setIsLoginedIn
    } = useAppContext();
    let tempBlogData: BlogCard[] = blogData! ?? []
    if (tempBlogData?.length === 0) {
        tempBlogData = JSON.parse(localStorage.getItem(LS_KEYS.blogs)!)
    }
    // slug from /product/:slug
    const blogSlugFromUrl = useMemo(() => {
        const raw = location.pathname.split("/recipe/")[1] || "";
        return decodeURIComponent(raw);
    }, [location.pathname])
    // ✅ Safe blog from router state (handles refresh)
    const blog = tempBlogData?.find(b => b.header === blogSlugFromUrl)!;
    console.log(blog);

    // ✅ Related blogs (safe even if blogData undefined or blog missing)
    const bottomBlogs = useMemo(() => {
        if (!tempBlogData?.length) return [];
        if (!blog) return shuffleArray([...tempBlogData]).slice(0, 3);

        const remaining = tempBlogData.filter((item) => item.header !== blog.header);
        return shuffleArray(remaining).slice(0, 3);
    }, [tempBlogData, blog]);

    // ✅ Normalized recipe for UI
    const recipe = useMemo(() => {
        if (!blog) return null;
        return parseRecipeFromApi(blog);
    }, [blog]);
    console.log(recipe);

    return {
        navbarLeft: [
            { path: "/about", name: "OUR JOURNEY" },
            { path: "/shop", name: "SHOP" },
            { path: "/recipe", name: "RECIPES" },
        ],
        isMobile,
        navigate,
        marqueeText: Array.from({ length: 12 }).map((_, i) => ({
            id: i + 1,
            text: "Flat 50% off on orders above $399",
        })),
        blog,
        recipe,
        bottomBlogs,
        showCart,
        showMenu,
        setAboutUs,
        setShowShop,
        setShowMenu,
        setShowPopup,
        isLoginedIn,
        setIsLoginedIn
    };
};

export { useBlogDetailsController };
