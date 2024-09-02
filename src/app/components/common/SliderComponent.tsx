/* eslint-disable @next/next/no-img-element */
'use client';

import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';

import React, { useRef } from 'react';
import Slider from 'react-slick';
import { Box, Paper, Typography } from '@mui/material';

interface ImageData {
  src: string;
  srcquote: string;
  description: string;
  name: string;
  age: string;
}

interface SliderComponentProps {
  images: ImageData[];
}

const SliderComponent: React.FC<SliderComponentProps> = ({ images }) => {
  const sliderForRef = useRef<Slider | null>(null);
  const sliderNavRef = useRef<Slider | null>(null);

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
    <Box sx={{ textAlign: 'center' }}>
      <Box sx={{ width: '30vw', margin: '0 auto', marginBottom: '40px' }}>
        <Slider {...settingsFor} ref={sliderForRef}>
          {images.map((image, index) => (
            <Paper
              key={index}
              sx={{
                maxWidth: '30vw',
                marginBottom: '20px',
                padding: '20px',
                minHeight: '380px',
                textAlign: 'left',
              }}
            >
              <img
                src={image.srcquote}
                alt={`Quote ${index}`}
                style={{ width: '50px', height: '50px', marginRight: '20px' }}
              />
              <p style={{
                textAlign: 'left', marginTop: '15px', fontSize: '.9rem',
                fontWeight: 'normal', paddingBottom: '20px',
                color: '#252525',
                lineHeight: '1.5rem'
              }}> {image.description}</p>

              <Box sx={{ display: 'flex', alignItems: 'center', marginTop: '15px' }}>
                {[...Array(5)].map((_, i) => (
                  <img
                    key={i}
                    src="/assets/images/filled_star.png"
                    alt={`Star ${i}`}
                    style={{ width: '40px' }}
                  />
                ))}
              </Box>
            </Paper>
          ))}
        </Slider>
      </Box>

      <Box>
        <Slider {...settingsNav} ref={sliderNavRef}>
          {images.map((image, index) => (
            <Box
              key={index}
              sx={{
                display: 'flex',
                alignItems: 'center',
                borderRadius: '30px',
                padding: 2,
              }}
            >
              <Paper
                sx={{
                  display: 'flex',
                  padding: 2,
                  borderRadius: '30px',
                  alignItems: 'center',
                }}
              >
                <img
                  src={image.src}
                  alt={`User ${index}`}
                  style={{
                    width: '65px',
                    height: '65px',
                    marginRight: '20px',
                    borderRadius: '100px',
                    background: '#20ADA0',
                  }}
                />
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
      </Box>
    </Box>
  );
};

export default SliderComponent;
