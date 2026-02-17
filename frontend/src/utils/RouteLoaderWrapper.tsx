// RouteLoaderWrapper.tsx
import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";

const RouteLoaderWrapper = ({ children }: { children: React.ReactNode }) => {
  const location = useLocation();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);

    const timer = setTimeout(() => {
      setLoading(false);
      window.scrollTo({ top: 0, behavior: "instant" });
    }, 250);

    return () => clearTimeout(timer);
  }, [location.pathname]);

  return (
    <>
      {loading && (
        <div className="route-loader">
          <div className="spinner"></div>
        </div>
      )}
      {!loading && children}
    </>
  );
};

export default RouteLoaderWrapper;
