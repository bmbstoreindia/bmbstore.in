import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Typography from '@mui/material/Typography';
import type { JSX } from '@emotion/react/jsx-runtime';
import type { CSSProperties } from 'react';
import { useNavigate } from 'react-router-dom';

interface props {
  img: {
    path: string;
    name: string;
    place?: string;
  };
  isMobile: boolean;
  header: string;
  icon?: {
    path: string;
    name: string;
  };
  height: number;
  width: number;
  testimonial?: boolean;
  index: number;
}

/* ================= COMMON STYLES ================= */

const dmSansBase: CSSProperties = {
  fontFamily: 'DM Sans',
};



const timeTextStyle = (isMobile: boolean): CSSProperties => ({
  ...dmSansBase,
  fontWeight: '400',
  fontSize: isMobile ? '12px' : '16px',
  textTransform: 'capitalize',
  color: '#5F5F5F',
});


/* ================= COMPONENT ================= */

function MediaCard(props: props): JSX.Element {
  const navigate = useNavigate();

  const { isMobile, img, icon, height, width, header, testimonial, index } = props;

  // ✅ TESTIMONIAL: ONLY IMAGE (NO TEXT / NO BUTTON)
  if (testimonial) {
    return (
      <Card
        className="media-card testimonial-card"
        sx={{
          width,
          borderRadius: '15px',
          overflow: 'hidden', // ✅ ensures image follows radius
          display: 'block',
        }}
      >
        <CardMedia
          image={img.path}
          title={img.name}
          sx={{
            width: '100%',
            height: isMobile ? '260px' : '320px', // tweak if needed
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        />
      </Card>
    );
  }

  // ✅ NORMAL BLOG CARD (UNCHANGED)
  return (
    <Card
      className="media-card"
      sx={{
        width: width,
        height: isMobile ? '400px' : '535px',
        borderRadius: '15px',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      <CardMedia
        sx={{ height: height, flex: 1 }}
        style={{ position: 'relative' }}
        image={img.path}
        title={img.name}
      />

      <CardContent style={{
        display: 'flex', flexDirection: 'column-reverse',
      }}>
        <Typography
          variant="body2"
          component="div"
          sx={{
            color: 'text.secondary',
            display: 'flex',
            alignItems: 'center',
            fontFamily: 'DM Sans',
            gap: '10px',
          }}
        >
          <img loading="eager" src={icon!.path} key={icon!.name} alt={icon!.name} />
          <span style={timeTextStyle(isMobile)}>5 mins</span>
        </Typography>
        <Typography
          gutterBottom
          variant="h5"
          component="div"
          sx={{
            fontSize: { lg: '1.1rem', xs: '14px' },
            fontFamily: 'DM Sans',
            width: { lg: '509px' },
            lineHeight: { xs: '1.4rem', lg: '2.4rem' },
            fontWeight: '700',
          }}
        >
          {header}
        </Typography>

      </CardContent>

      <CardActions style={{ justifyContent: 'center' }}>
        <button
          className="addToCart"
          style={{
            width: '90%',
            borderRadius: '20px',
            marginBottom: '15px',
          }}
          onClick={() => navigate('/recipe', { state: { index: index } })}
        >
          Read
        </button>
      </CardActions>
    </Card>
  );
}

export { MediaCard };
