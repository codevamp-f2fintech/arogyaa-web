import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

import { Box, Button, Grid, ImageListItem } from '@mui/material/';
import ArrowCircleRightIcon from '@mui/icons-material/ArrowCircleRight';
import Slider from 'react-slick';
import styled from 'styled-components';

import styles from '../page.module.css';
import { specialistData } from "@/data";


const settings = {
    dots: true,
    infinite: false,
    speed: 500,
    slidesToShow: 4,
    slidesToScroll: 2,
    autoplay: false,
    autoplaySpeed: 3000,
    customPaging: i => (
        <div className={styles.customDot}>
            {/* You can add custom content here */}
            {i + 1}
        </div>
    ),
    dotsClass: `slick-dots ${styles.customDots}`,
    responsive: [
        {
            breakpoint: 1024,
            settings: {
                slidesToShow: 3,
                slidesToScroll: 3,
                infinite: true,
                dots: true
            }
        },
        {
            breakpoint: 600,
            settings: {
                slidesToShow: 1,
                slidesToScroll: 1,
                initialSlide: 1
            }
        },
        {
            breakpoint: 480,
            settings: {
                slidesToShow: 1,
                slidesToScroll: 1
            }
        }
    ]
};

const Speciality = styled.div`

.slick-initialized .slick-slide {
    display: block;
    padding: 10px!important;
}
      .listof_specialities{
       font-size: 32px;
    color: #000;
    line-height:40px;
    font-weight: 700;
    margin-top:20px;
    margin-bottom:20px;
    text-align:center;
    }
`;

const StyledBox = styled(Box)`

background:white;
      height: 100%;
    border: 4px solid white;
    display:flex!important;
    align-items:center;
    flex-direction:column;
    border-radius: 30px;
        padding: 20px;
        position:relative;
        box-shadow: 0px 2px 1px -1px rgba(0, 0, 0, 0.2), 0px 1px 1px 0px rgba(0, 0, 0, 0.14), 0px 1px 3px 0px rgba(0, 0, 0, 0.12);
text-align:center;
       h2{
            font-size: 18px;
    font-weight: 700;
    line-height:26px;
    color: #000;
    margin-top:20px;
    } 
       h4{
        font-size: 14px;
    color: #000;
    line-height:18px;
    font-weight: 400;
    margin-top:20px;
    margin-bottom:20px;
    } 

    .vector_plus{
    position: absolute;
    right: 10px;
    top: 10px;
  
    }

`;

const SpecialitySlider = () => {
    return (
        <>
            <Box sx={{ background: '#F9F6F6', padding: '50px', height: 50, width: '100%' }}>
            </Box>
            <Speciality>
                <h1 className='listof_specialities'>We Serve In Different Areas For Our Patients</h1>

                <Slider {...settings} >
                    {specialistData.map((item, index) => (


                        <StyledBox className='vector_plus_container' sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}
                            key={index}
                        >
                            <img src="../assets/images/speciality-icons/vector_plus.png" className='vector_plus' />
                            <ImageListItem key={item.img} sx={{
                                height: 100,
                                width: 100,
                                background: '#f9f6f6',
                                borderRadius: '100px',
                                padding: '20px'
                            }}>
                                <img
                                    srcSet={`${item.img}?w=164&h=164&fit=crop&auto=format&dpr=2 2x`}
                                    src={`${item.img}?w=164&h=164&fit=crop&auto=format`}
                                    alt={item.title}
                                    loading="lazy"
                                />
                            </ImageListItem>

                            <h2>{item.title}</h2>
                            <h4>{item.caption}</h4>
                            <Button variant="contained" sx={{
                                marginTop: 2, width: 'auto', color: '#fff', background: '#20ADA0', borderRadius: '100px', ':hover': {
                                    bgcolor: '#20ADA0', // theme.palette.primary.main
                                    color: 'white',
                                },
                            }} endIcon={<ArrowCircleRightIcon />}>{item.readmore}</Button>
                        </StyledBox>


                    ))}
                </Slider>

                <Grid container spacing={2} columns={{ xs: 4, sm: 8, md: 12 }}>

                    <Grid xs={12} sx={{ textAlign: 'center', marginTop: '20px' }}>
                        <Button variant="contained" sx={{
                            marginTop: 2, width: 'auto', color: '#fff', background: '#20ADA0', borderRadius: '100px', ':hover': {
                                bgcolor: '#20ADA0', // theme.palette.primary.main
                                color: 'white',
                            },
                        }} endIcon={<ArrowCircleRightIcon />}>More Specialty</Button>
                    </Grid>
                </Grid>
            </Speciality>
        </>
    )
};

export default SpecialitySlider;
