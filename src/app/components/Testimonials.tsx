'use client';

import { Box } from '@mui/material/';
import styled from 'styled-components';

import { images } from "@/data";
import SliderComponent from './common/SliderComponent';

const Testimonial = styled(Box)`
background-color: #f6f6f6;
    background-image: url('data:image/svg+xml;charset=UTF-8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 320"><path fill="%23ffffff" fill-opacity="1" d="M0,160L30,160C60,160,120,160,180,160C240,160,300,160,360,170.7C420,181,480,203,540,202.7C600,203,660,181,720,186.7C780,192,840,224,900,240C960,256,1020,256,1080,240C1140,224,1200,192,1260,160C1320,128,1380,96,1410,80L1440,64L1440,320L1410,320C1380,320,1320,320,1260,320C1200,320,1140,320,1080,320C1020,320,960,320,900,320C840,320,780,320,720,320C660,320,600,320,540,320C480,320,420,320,360,320C300,320,240,320,180,320C120,320,60,320,30,320L0,320Z"></path></svg>');
    background-repeat: no-repeat;
    background-position: center;
    background-size: 100%;

.slick-initialized .slick-slide {
    display: block;
    padding: 10px!important;
}
       .met_title{
    margin-bottom:30px;
    }
    .met_title h2{
    font-size:2.5rem;
    color:black;
    font-weight:700;
text-align:center;
    }
    .met_title h5{
       font-size:1rem;
    color:#20ADA0;
    font-weight:700; 
    text-align:center;
    }
  `;

const Testimonials = () => {
    return (

        <Testimonial>
            <SliderComponent images={images} />
        </Testimonial>
    );
};

export default Testimonials;
