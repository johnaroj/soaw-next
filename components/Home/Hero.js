import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import { makeStyles } from '@mui/styles';
import { Swiper, SwiperSlide } from 'swiper/react'
import Image from 'next/image';
import { Pagination, Navigation, Autoplay, EffectFade } from "swiper";
import 'swiper/css';
import "swiper/css/effect-fade";
import "swiper/css/pagination";
import "swiper/css/navigation";

const useStyles = makeStyles(theme => ({
  root: {
    width: '100%',
    height: '100%',
    zIndex: 1
  },
  swiper: {
    width: '100%',
    height: 745,
  },
  swiperNavButton: {
    width: `${theme.spacing(3)}px !important`,
    height: `${theme.spacing(3)}px !important`,
    padding: `${theme.spacing(2)}px !important`,
  },
  image: {
    objectFit: 'cover',
  }
}));

const Hero = props => {
  const { className, ...rest } = props;
  const classes = useStyles();
  const [domLoaded, setDomLoaded] = useState(false);

  useEffect(() => {
    setDomLoaded(true);
  }, []);
  return (
    <div className={clsx(classes.root, className)} {...rest}>
      {domLoaded && <Swiper
        autoplay={{
          delay: 5000,
          disableOnInteraction: true,
        }}
        effect="fade"
        speed={1000}
        pagination
        modules={[Pagination, Navigation, Autoplay, EffectFade]}
        className={classes.swiper}
      >
        <SwiperSlide zoom style={{position: 'relative'}}><Image alt="slide-1" src='/images/photos/home/slide-1.jpg' srcSet='/images/photos/home/slide-1.jpg 2x' fill sizes="100vw" className={classes.image}></Image></SwiperSlide>
        <SwiperSlide zoom style={{position: 'relative'}}><Image alt="slide-2" src='/images/photos/home/slide-2.jpg' srcSet='/images/photos/home/slide-2.jpg 2x' fill sizes="100vw" className={classes.image}></Image></SwiperSlide>
      </Swiper>}
    </div>
  );
};


export default Hero;
