import { useLocation, useNavigate } from "react-router-dom"
import { useAppContext } from "../../context/app.context"
import { useRef, useEffect } from "react";
import { apiService } from "../../sevice/api.service";


function useOrderConformationController() {
    const {
        setCart,
        showCart
    } = useAppContext()
    const apiRef = useRef(apiService());
    const { getDashboard } = apiRef.current;


    // ✅ safer than hasFetched (prevents wrong blocking)
    const fetchingRef = useRef(false);

    useEffect(() => {
        if (fetchingRef.current) return;

        fetchingRef.current = true;

        const run = async () => {
            try {
                const response = await getDashboard();
                if (!response?.data) return;

                setCart(response.data.cart_v2!);
            } catch (err) {
                console.error("Dashboard fetch failed:", err);
            } finally {
                fetchingRef.current = false;
            }
        };

        run();
    }, [
        setCart,
    ]);

    return {
        navbarLeft: [
            { path: "/about", name: "OUR JOURNEY" },
            { path: "/shop", name: "SHOP" },
            { path: "/recipe", name: "RECIPES" },
        ],
        navigate: useNavigate(),
        orderId: useLocation().state.order_id,
        email: useLocation().state.email,
        showCart
    }
}

export {
    useOrderConformationController
}