'use client';
// components/SyncedSliders.js

import React, { useRef } from 'react';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import Slider from 'react-slick';
import Paper from '@mui/material/Paper';
import { Box, Typography, } from '@mui/material';

const SliderComponent = ({ images }) => {
  const sliderForRef = useRef(null);
  const sliderNavRef = useRef(null);

  const settingsFor = {
    slidesToShow: 1,
    slidesToScroll: 1,
    arrows: false,
    fade: true,
    asNavFor: sliderNavRef.current,
  };

  const settingsNav = {
    slidesToShow: 4,
    slidesToScroll: 1,
    asNavFor: sliderForRef.current,
    dots: true,
    centerMode: true,
    focusOnSelect: true,
  };

  return (
    <div className="synced-sliders" >
      <div className="slider-for" style={{ width: '30vw', margin: '0 auto', marginBottom: '40px' }}>
        <Slider {...settingsFor} ref={sliderForRef}>
          {images.map((image, index) => (

            <Paper key={index} sx={{ maxWidth: '30vw', marginBottom: '20px', padding: '20px', minHeight: '380px' }}>
              <img src={image.srcquote} className="slider_src_place" style={{ width: '50px', height: '50px', marginRight: '20px' }} />
              <p sx={{ paddingBottom: '20px', textAlign: 'left' }} style={{
                textAlign: 'left', marginTop: '15px', fontSize: '.9rem',
                fontWeight: 'normal',
                color: '#252525',
                lineHeight: '1.5rem'
              }}> {image.description}</p>
              <div style={{ display: 'flex', alignItems: 'center', marginTop: '15px' }}>
                <img src="../../../public/assets/images/filled_star.png" style={{ width: '40px' }} />
                <img src="../../../public/assets/images/filled_star.png" style={{ width: '40px' }} />
                <img src="../../../public/assets/images/filled_star.png" style={{ width: '40px' }} />
                <img src="../../../public/assets/images/filled_star.png" style={{ width: '40px' }} />
                <img src="../../../public/assets/images/filled_star.png" style={{ width: '40px' }} />
              </div>
            </ Paper>
          ))}
        </Slider>
      </div>

      <div className="slider-nav">
        <Slider {...settingsNav} ref={sliderNavRef}>
          {images.map((image, index) => (
            <Box
              key={index}
              sx={{ display: 'flex', alignItems: 'center', borderRadius: '30px' }}>
              <Paper key={index} style={{ display: 'flex', padding: 20, borderRadius: 30 }}>
                <img src={image.src} className="slider_src_place" style={{ width: '65px', height: '65px', marginRight: '20px', borderRadius: '100px', background: '#20ADA0' }} />

                <Box>
                  <Typography variant="h4" component="h4" sx={{ color: '#20ADA0', fontSize: '1.2rem' }}>
                    {image.name}
                  </Typography>
                  <Typography variant="h4" component="h4" sx={{ color: 'gray', fontSize: '.9rem', marginTop: '10px', textAlign: 'left' }}>
                    {image.age}
                  </Typography>

                </Box>
              </Paper>
            </Box>
          ))}
        </Slider>
      </div>

      <style jsx>{`
        .slider-for .slider-image {
          width: 100%;
          height: auto;
        }

        .slider-nav .slider-image {
          cursor: pointer;
          width: 100%;
          height: auto;
          border: 2px solid #ccc;
        }

        .slider-nav .slick-center .slider-image {
          border-color: #000;
        }
      `}</style>
    </div>
  );
};

export default SliderComponent;
