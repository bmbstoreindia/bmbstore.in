import { useMemo } from 'react';
import {
  useMediaQuery,
  useTheme,
} from "@mui/material";
interface MarqueeItem {
  id: number;
  text?: string;
  imageUrl?: string;
}

type MarqueeDirection = 'left' | 'right';

interface MarqueeOptions {
  backgroundColor?: string;
  textColor?: string;
  height?: string;
  gap?: string;
  fontFamily?: string;
  marginTop?: string;
}

interface MarqueeProps {
  items: MarqueeItem[];
  duration?: number;
  direction?: MarqueeDirection;
  options?: MarqueeOptions;
  stop?: boolean;
  useMargin: boolean;
  imgHeight?: string
}

const Marquee = ({
  items,
  duration = 15,
  direction = 'left',
  options = {},
  stop = false,
  useMargin = false,
  imgHeight
}: MarqueeProps) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const duplicatedItems = useMemo(() => [...items, ...items], [items]);
  let margin = '';
  if (useMargin && isMobile && duplicatedItems[0].imageUrl) {
    margin = '15px'
  }
  if (useMargin && duplicatedItems[0].text) {
    margin = '65px'
  }
 
  const {
    backgroundColor = '#5A231A',
    textColor = '#fff',
    height = '30px',
    fontFamily = 'Arial, sans-serif',
    marginTop = margin !== '' ? margin : 'unset',
  } = options;


  // 🔁 Duplicate items for seamless looping

  const containerStyle: React.CSSProperties = {
    width: '100%',
    overflow: 'hidden',
    backgroundColor,
    color: textColor,
    height,
    display: 'flex',
    alignItems: 'center',
    marginTop,
  };

  const trackStyle: React.CSSProperties = {
    display: 'flex',
    width: 'max-content',
    gap: '25px',
    animation: stop
      ? 'none'
      : `${direction === 'left' ? 'marquee-left' : 'marquee-right'} ${duration}s linear infinite`,
  };

  const itemStyle: React.CSSProperties = {
    fontSize: '16px',
    fontFamily,
    whiteSpace: 'nowrap',
    display: 'flex',
    alignItems: 'center',
  };

  const keyframes = `
    @keyframes marquee-left {
      from { transform: translateX(0); }
      to { transform: translateX(-50%); }
    }

    @keyframes marquee-right {
      from { transform: translateX(-50%); }
      to { transform: translateX(0); }
    }
  `;

  return (
    <>
      <style>{keyframes}</style>

      <div style={containerStyle}>
        <div style={trackStyle}>
          {duplicatedItems.map((item, index) =>
            item.imageUrl ? (
              <img
                key={`${item.id}-${index}`}
                src={item.imageUrl}
                alt={item.text || ''}
                style={isMobile ? { height: imgHeight } : {}}
              />
            ) : (
              <span key={`${item.id}-${index}`} style={itemStyle}>
                {item.text}
              </span>
            )
          )}
        </div>
      </div>
    </>
  );
};

export default Marquee;
