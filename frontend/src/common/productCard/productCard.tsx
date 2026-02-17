import type { JSX } from "@emotion/react/jsx-runtime";
import "./productCard.css";
import plus from "../../assets/plus.svg";
import minus from "../../assets/minus.svg";
import { useAppContext } from "../../context/app.context";
import { useNavigate } from "react-router-dom";
import useMediaQuery from "@mui/material/useMediaQuery";
import { useTheme } from "@mui/material";
import { truncateText } from "../../utils/utils";

interface Props {
  name: string;
  description: string;
  price: number;
  originalPrice?: number;
  image_urls: string[];
  count: number;
  updateCartQuantity: (
    delta: number,
    weightSize: string,
    productId: string
  ) => void;
  id: string;
  width?: number;
  turncate:number;
}

const ProductCard = (props: Props): JSX.Element => {
  const {
    name,
    description,
    price,
    originalPrice,
    image_urls,
    count,
    updateCartQuantity,
    width,
    id,
    turncate
  } = props;

  const { setShowProductDetails, productData, showCart, setShowCart, setShowMenu } = useAppContext();
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  let truncateTextNo = turncate ||75;
  /* -------------------------------------------------
     ✅ Determine default weight (first variant)
  ------------------------------------------------- */
  const product = productData?.find(p => p.id === id);
  const defaultWeightSize = product?.weights?.find(
    (w) => Number(w.price) === Number(price)
  )?.size


  if (isMobile && !showCart) {
    truncateTextNo = 45
  }
  return (
    <div
      className="product"
      style={width ? { width: `${width}%` } : {}}

    >
      <div
        className="imageBox"
        onClick={() =>
          setShowProductDetails(prev => {
            setShowCart(false)
            setShowMenu(false)
            navigate(`/product/${encodeURIComponent(name)}`, {
              state: { productDetals: { id } }
            });
            return !prev;
          })
        }
      >
        <img
          src={image_urls[0] || ""}
          alt={name}
          onError={(e: any) => {
            e.target.src = "";
          }}
        />
      </div>

      <div className="description" onClick={() =>
        setShowProductDetails(prev => {
          navigate(`/product/${encodeURIComponent(name)}`, {
            state: { productDetals: { id } }
          });
          return !prev;
        })
      }>
        <span>{name}</span>
        {!showCart && <span>
          {truncateText(description, truncateTextNo)}
        </span>}

        <div className="price">
          {originalPrice && <span>₹{originalPrice}</span>}
          <span> ₹{price}</span>
        </div>

        {originalPrice && (
          <span className="discountPercent">
            {Math.round(
              ((originalPrice - price) / originalPrice) * 100
            )}
            % OFF
          </span>
        )}
      </div>

      {count === 0 ? (
        <button
          className="addToCart"
          onClick={() =>
            updateCartQuantity(
              +1,
              defaultWeightSize!,
              id
            )
          }
        >
          Add
        </button>
      ) : (
        <div className="buttons addToCart">
          <img
            src={minus}
            alt="minus"
            onClick={() =>
              updateCartQuantity(
                -1,
                defaultWeightSize!,
                id
              )
            }
          />
          <span className="count">{count}</span>
          <img
            src={plus}
            alt="plus"
            onClick={() =>
              updateCartQuantity(
                +1,
                defaultWeightSize!,
                id
              )
            }
          />
        </div>
      )}
    </div>
  );
};

export { ProductCard };
