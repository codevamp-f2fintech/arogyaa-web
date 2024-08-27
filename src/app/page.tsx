import Login from "./login";
"use client";
import styles from './page.module.css';
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import * as React from 'react';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Unstable_Grid2';
import Header from './common/appbar';
import Container from '@mui/material/Container';
import { Margin, WidthFull } from '@mui/icons-material';
import { url } from 'inspector';
import { Button } from '@mui/material';
import styled from 'styled-components';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import ArrowCircleRightIcon from '@mui/icons-material/ArrowCircleRight';
import Paper from '@mui/material/Paper';
import InputBase from '@mui/material/InputBase';
import IconButton from '@mui/material/IconButton';
import SearchIcon from '@mui/icons-material/Search';
import ImageList from '@mui/material/ImageList';
import ImageListItem from '@mui/material/ImageListItem';
import Slider from 'react-slick';
import { Card, CardMedia, CardContent, Typography, } from '@mui/material';
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import Avatar from '@mui/material/Avatar';
import CardHeader from '@mui/material/CardHeader';
import CardActions from '@mui/material/CardActions';
import Footer from './common/footer';
import Link from 'next/link';
import SliderComponent from './common/SliderComponent';

const ContainerPage = styled.div`
padding:0px 50px;
background:#F9F6F6;
padding-top:50px;
`;

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
const slides = [
  'Slide 1 Content',
  'Slide 2 Content',
  'Slide 3 Content',
  'Slide 4 Content',
];
const HomeBanner = styled('div')(({ theme }) => ({
  marginTop: '65px',
  
  // backgroundImage: ' linear-gradient(to left, #95E1D0 , #40BA9D), url('../assets/images/icons8-circle-10.png')',
  // backgroundSize: 'cover',
  // backgroundPosition: 'center',
  height: '90vh', // Adjust the height as needed

  padding: '50px',
  position: 'relative',
  borderRadius:'30px 30px 30px 0;',
  paddingTop: '90px',
  // background-image: linear-gradient(to right, red , yellow);
}));


const BannerCard1 = styled.div`
  background-color:rgba(255, 255, 255, 0.53);
  padding: 40px;
  border-radius: 10px;
  text-align: left;

  /* Nesting styles for child elements */
  h1 {
    font-size: 32px;
    line-height:48px;
    color: #000;
    margin-bottom: 10px;
  }
  h2 {
    font-size: 24px;
    line-height:26px;
    color: #000;
    margin-top: 20px;
    margin-bottom: 30px;
  }

  p {
    font-size: 14px;
    color: #000;
    font-weight: 400;
    line-height: 20px;
  }`;
const BannerCard2 = styled.div`
  background-color:rgba(212, 255, 232, 0.9);
  padding: 20px;
  border-radius: 10px;
  text-align: center;
  height:100%;
    border: 4px solid white;
    border-radius: 10px;

  /* Nesting styles for child elements */
  h1 {
    font-size: 24px;
    color: #000;
    margin-bottom: 10px;
  }

  p {
  font-size: 14px;
    color: #000;
    font-weight: 400;
    line-height: 20px;
    margin-bottom:20px;
  }`;



const BannerContent = styled.div`
   
    width: 850px;
    height: 300px;
  
  .banner_abs_text{
position: absolute;
    bottom: 0;
    left: 0;
    z-index: 1;
    padding: initial;
  }
  .banner_abs_text span{
      background: #F9F6F6;
    padding:15px;
    border-radius: 1px 25px 5px 0px;
    font-size: 2.5rem;
    font-weight: bold;
    line-height: 2.5rem;
        border-radius: 1px 25px 5px 0px;}
  
  
  .banner_abs_text h4{
      background: #F9F6F6;
    padding: 15px;
    border-radius: 1px 25px 5px 0px;
    font-size: 2.5rem;
    font-weight: bold;
    line-height: 2.5rem;}
  
    `;

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


const DrList = styled(Box)`
.slick-prev,
.slick-next {
  z-index: 1;
  width: 40px;
  height: 40px;

}

.slick-prev:before,
.slick-next:before {
  font-size: 40px;
  color: #0BAE5A;
}
.slick-list {margin: 0 -10px;}
.slick-slide>div {padding: 0 10px;}
h5{
  font-size: 24px;
    color: #000;
    line-height:28px;
    font-weight: 700;
    margin-top:5px;
    margin-bottom:10px;
}
    h6{
  font-size: 18px;
    color: #000;
    line-height:22px;
    font-weight: 500;
    margin-top:5px;
    margin-bottom:5px;
}
    p{
      font-size: 12px;
    color: #000;
    line-height:20px;
    font-weight: 300;
    margin-top:5px;
    margin-bottom:5px;
    }
    p.p_exprenc{
      font-size: 12px;
    color: #000;
    line-height:20px;
    font-weight: 300;
    margin-top:5px;
    margin-bottom:5px;
    }
    h2.h1_section_title{
        font-size: 32px;
    color: #000;
    line-height: 40px;
    font-weight: 700;
    margin-top: 20px;
    margin-bottom: 40px;
    text-align: center;}
`;
const Symptoms = styled(Box)`
 text-align:center;
    // background-image: url(../assets/images/icy-medical-checkup.png);
    // background-repeat: no-repeat;
    // background-size: 50%;
    // background-position: center;
    background-color: #F9F6F6;
    border-radius: 0 0 50% 50%;

h5{
  font-size: 16px;
  color: #000;
  line-height:20px;
  font-weight: 700;
  margin-top:10px;
  margin-bottom:10px;
}
      h2.h1_section_title{
        font-size: 2.5rem;
    color: #000;
    line-height: 40px;
    font-weight: 700;
    margin-top: 20px;
    margin-bottom: 40px;
    text-align: center;}
  
      h2.h1_section_title .title_span{
        font-size: 1rem;
    color: #20ADA0;
  }
  `;
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
const WhyWe = styled(Box)`
   h2.h1_section_title{
        font-size: 32px;
    color: #000;
    line-height: 40px;
    font-weight: 700;
    margin-top: 20px;
    margin-bottom: 40px;
    text-align: center;}
  
  text-align:center;
  background:#fff;
  .card_whywe span{
  text-align:left;}
  .whywe_content{
  text-align:left;
  }
  .card_cont_whywe{
  display:flex;
  }
  .card_cont_whywe h6{
   font-size: 16px;
    color: #000;
    line-height: 20px;
    font-weight: 600;
    margin-bottom: 10px;
    text-align:left;
  }
  .card_cont_whywe p{
     font-size: 12px;
    color: #000;
    line-height: 18px;
    font-weight: 500;
    text-align:left;}
  .card_cont_whywe img{
  margin-right:10px;
  }
    `;

const AboutUS = styled(Box)`
  text-align:center;
  background:#F9F6F6;
  padding-bottom:40px;
  padding-top:80px;
 .abt_typogrphy h4{
 font-size:2.5rem;
 text-align:left;
 color:black;
 line-height:4rem;
 font-weight:600;
 }
 .abt_typogrphy p{
  font-size:1rem;
 text-align:left;
 color:black;
 line-height:2rem;
 font-weight:300;
 margin-top:10px;
 }
 .abt_typogrphy h4 span{
color:#20ADA0;
 }
.abt_typo_card{
background:white;
padding:20px;
border-radius:20px;
color:white;
    box-shadow: 0px 2px 1px -1px rgba(0, 0, 0, 0.2), 0px 1px 1px 0px rgba(0, 0, 0, 0.14), 0px 1px 3px 0px rgba(0, 0, 0, 0.12);
}
.abt_typo_card.green{
background:#20ADA0;
padding:20px;
color:white;
}
.abt_typo_card h4{
color:black;
text-align:center;
margin-top:10px;
margin-bottom:15px;
}
.abt_typo_card p{
color:black;
text-align:center;
margin-top:15px;
margin-bottom:10px;
}
.abt_typo_card.green h4{
color:white;
}
.abt_typo_card.green p{
color:white;
}
.abt_wraper_c{
margin-top:50px;
}
    `;

const MeetSpecialitiest = styled(Box)`
padding-top:50px;
padding-bottom:50px;
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
    .dr_cir_canv{
        width: 100px;
    height: 100px;
    border-radius: 100%;
    background: #20ada0;}
    .abt_typo_card{
    text-align:center;
    padding:30px;
    }
    .abt_typo_card {
    border-radius:30px;}
    .abt_typo_card h6{
           font-size:1rem;
    color:#20ADA0;
    font-weight:500; 
    }
    .abt_typo_card .t1{
    font-size:1.2rem;
    color:#20ADA0;
    font-weight:bold;
    margin-top:5px;
    margin-bottom:5px; 
    }
    .abt_typo_card .t2{
       font-size:.9rem;
    color:#000;
    font-weight:600; 
        margin-top:10px;
    margin-bottom:10px; 
    }
    .abt_typo_card .t3{
      font-size:.8rem;
    color:#000;
    font-weight:300; 
       margin-top:10px;
    margin-bottom:10px; 
    }
    `;
const HealthPriority = styled(Box)`
padding-top:50px;
padding-bottom:50px;
margin-top:100px;
border-radius:30px;
     .banner2_c_title{
    display: flex;
    flex-direction: column;
    align-items: flex-end;
    margin-top: -66px;
    margin-right: -16px;
  }
  .banner2_c_title span{
      background: #F9F6F6;
    padding:15px;
    font-size: 2.5rem;
    font-weight: bold;
    line-height: 2.5rem;
       border-radius:  0px 0px 0px 25px}
  
  
  .banner2_c_title h4{
      background: #F9F6F6;
    padding: 15px;
  border-radius: 0px 0px 0px 25px;
    font-size: 2.5rem;
    font-weight: bold;
    line-height: 2.5rem;}
  
    `;
    const Banner2Card = styled.div`
  background-color:rgba(255, 255, 255, 0.53);
  padding: 40px;
  border-radius: 10px;
  text-align: left;
max-width:400px;
  margin-right:40px;

  /* Nesting styles for child elements */
  h1 {
    font-size: 32px;
    line-height:48px;
    color: #000;
    margin-bottom: 10px;
  }
  h2 {
    font-size: 24px;
    line-height:26px;
    color: #000;
    margin-top: 20px;
    margin-bottom: 30px;
  }

  p {
    font-size: 14px;
    color: #000;
    font-weight: 400;
    line-height: 20px;
  }`;
function Home() {

  return (
    <>
      <h1>Aarogya app</h1>
      <p>
        <Login />
      </p>
    </>
    <ContainerPage  >
    <div className={styles.container_main} >
      <Header />
      <HomeBanner className={styles.homebanner}>
        <BannerContent>
          <Box
            component="img"
            sx={{

              width: '48vw',
              position: 'absolute',
              right: '10px',
              bottom: '0px'

            }}
            alt="The house from the offer."
            src={'../assets/images/dr1.png'}
          />
          <Grid container spacing={2} columns={{ xs: 4, sm: 8, md: 12 }}>
            <Grid xs={6}>

              <BannerCard1>
                <h1>Request a Call</h1>
                {/* <h2> Restoring Your Health</h2> */}
                <p>You can simplyfy order a call and we will help you make an appointment with right specialist.</p>
                <Paper
                  component="form"
                  sx={{ p: '2px 4px', display: 'flex', alignItems: 'center', width: '100%', marginTop: 3 }}
                >

                  <InputBase
                    sx={{ ml: 1, flex: 1 }}
                    placeholder="Name"
                    inputProps={{ 'aria-label': 'search google maps' }}
                  />
                </Paper>
                <Paper
                  component="form"
                  sx={{ p: '2px 4px', display: 'flex', alignItems: 'center', width: '100%', marginTop: 3 }}
                >

                  <InputBase
                    sx={{ ml: 1, flex: 1 }}
                    placeholder="Phone Number"
                    inputProps={{ 'aria-label': 'search google maps' }}
                  />
                </Paper>

                <Box sx={{ flex: 1, marginTop: '20px' }}>

                  <Button variant="contained" sx={{
                    width: '100%', color: '#20ADA0', background: '#fff', ':hover': {
                      bgcolor: '#20ADA0', // theme.palette.primary.main
                      color: 'white',
                    },
                  }} endIcon={<ArrowCircleRightIcon />}>Send Request</Button>
                </Box>


              </BannerCard1>

            </Grid>


          </Grid>

          <CardContent className="banner_abs_text">
            <Typography variant="h5" component="span">
              The Best Medical
            </Typography>
            <Typography variant="h4" component="h4">
              and Treatment Center For You
            </Typography>
          </CardContent>

        </BannerContent>



      </HomeBanner>
      <Box sx={{ background: '#F9F6F6', padding: '50px', height: 50, width: '100%' }}>

      </Box>

      <Speciality>
        <h1 className='listof_specialities'>We Serve In Different Areas For Our Patients</h1>
     
        <Slider {...settings} >
          {specialistData.map((item) => (
           
              
              <StyledBox className='vector_plus_container' sx={{display:'flex', flexDirection:'column', alignItems:'center'}}>
                <img src="../assets/images/speciality-icons/vector_plus.png" className='vector_plus' />
                <ImageListItem key={item.img} sx={{
                  height: 100,
                  width: 100,
                  background:'#f9f6f6',
                  borderRadius:'100px',
                  padding:'20px'
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
                   marginTop:2, width: 'auto', color: '#fff', background: '#20ADA0', borderRadius:'100px', ':hover': {
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
                   marginTop:2, width: 'auto', color: '#fff', background: '#20ADA0', borderRadius:'100px', ':hover': {
                      bgcolor: '#20ADA0', // theme.palette.primary.main
                      color: 'white',
                    },
                  }} endIcon={<ArrowCircleRightIcon />}>More Specialty</Button>
                     </Grid>
        </Grid>
      </Speciality>

     
      <MeetSpecialitiest className="met_sp_container">

        
        <Box className="met_title">
          <Typography variant="h5" component="h5">
            Meet Our
          </Typography>
          <Typography variant="h2" component="h2">
            Expert Specialist
          </Typography>
        </Box>
        <Grid container spacing={3}>
        <Grid item xs={4}>
        <Paper className="abt_typo_card" sx={{height:'245px'}}>
        <Box component="img" sx={{ width: '100%',}} className="dr_cir_canv"
              alt="The house from the offer."
              src={'../assets/images/portrait-young-woman-doctor-with-stethoscope-uniform (1).png'}
            />
                  <Typography variant="h4" component="h4" className='t1'>Dr. Nidhi</Typography>
                  <Typography variant="h6" component="h6" className='t2'>Physician</Typography>
                  <Typography variant="h6" component="p" className='t3'>15 years of experiance</Typography>
                 
                </Paper>
                <Box sx={{display:'flex', justifyContent:'center'}}>
                <Button variant="contained" sx={{
                   marginTop:2, width: 'auto', color: '#fff', background: '#20ADA0', borderRadius:'100px', ':hover': {
                      bgcolor: '#20ADA0', // theme.palette.primary.main
                      color: 'white',
                    },
                  }} endIcon={<ArrowCircleRightIcon />}>See All Doctors</Button>
                  </Box>
        </Grid>
        <Grid item xs>
        <Paper className="abt_typo_card green" sx={{height:'315px'}}>
        <Box component="img" sx={{ width: '100%',}} className="dr_cir_canv"
              alt="The house from the offer."
              src={'../assets/images/portrait-young-woman-doctor-with-stethoscope-uniform (1).png'}
            />
       <Typography variant="h4" component="h4" className='t1'>Dr. Nidhi</Typography>
                  <Typography variant="h6" component="h6" className='t2'>Physician</Typography>
                  <Typography variant="h6" component="p" className='t3'>15 years of experiance<br/>
                  Lorem Ipsum <br/>
                    Lorem Ipsum
                  </Typography>
                </Paper>
        </Grid>
        <Grid item xs>
        <Paper className="abt_typo_card green" sx={{height:'315px'}}>
        <Box component="img" sx={{ width: '100%',}} className="dr_cir_canv"
              alt="The house from the offer."
              src={'../assets/images/portrait-young-woman-doctor-with-stethoscope-uniform (1).png'}
            />
        <Typography variant="h4" component="h4" className='t1'>Dr. Nidhi</Typography>
                  <Typography variant="h6" component="h6" className='t2'>Physician</Typography>
                  <Typography variant="h6" component="p" className='t3'>15 years of experiance<br/>
                  Lorem Ipsum <br/>
                    Lorem Ipsum
                  </Typography>
                </Paper>
        </Grid>
        <Grid item xs>
        <Paper className="abt_typo_card green" sx={{height:'315px'}}>
        <Box component="img" sx={{ width: '100%',}} className="dr_cir_canv"
              alt="The house from the offer."
              src={'../assets/images/portrait-young-woman-doctor-with-stethoscope-uniform (1).png'}
            />
        <Typography variant="h4" component="h4" className='t1' >Dr. Nidhi</Typography>
                  <Typography variant="h6" component="h6" className='t2'>Physician</Typography>
                  <Typography variant="h6" component="p" className='t3' sx={{marginTop:'20px'}}>15 years of experiance<br/>
                  Lorem Ipsum <br/>
                    Lorem Ipsum
                  </Typography>
                </Paper>
        </Grid>
      </Grid>
   
      </MeetSpecialitiest>


      <Symptoms>
        <Typography variant="h2" component="h2" className='h1_section_title'><span className='title_span'>Common</span><br/> Health Concerns </Typography>

        <Grid container spacing={2} columns={{ xs: 4, sm: 8, md: 12 }}>
          {symptomslist.map((item, index) => (
            <Grid xs={3} sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', }}>
              <Paper className="abt_typo_card" sx={{padding:2, borderRadius:'30px', width:'100%', textAlign:'center', display: 'flex', flexDirection: 'column', alignItems: 'center',}}>
              <CardMedia
                component="img"
                sx={{ borderRadius: 100, overflow: 'hidden', width: '100px', height: '100px', border: '3px solid white' }}
                image={item.image}
                alt={item.title}
              />
              <CardContent>
                <Typography variant="h5" component="h5">
                  {item.title}
                </Typography>


               <Button variant="contained" sx={{
                   marginTop:2, width: 'auto', color: '#fff', background: '#20ADA0', borderRadius:'100px', ':hover': {
                      bgcolor: '#20ADA0', // theme.palette.primary.main
                      color: 'white',
                    },
                  }} endIcon={<ArrowCircleRightIcon />}>{item.Consult}</Button>
              </CardContent>
              </Paper>
            </Grid>
          ))}

        </Grid>
        <Grid container spacing={2} columns={{ xs: 4, sm: 8, md: 12 }}>

          <Grid xs={12} sx={{ textAlign: 'center', marginTop: '20px' }}>
            <Button variant="contained" sx={{ color: 'white', background: '#20ADA0' }} endIcon={<ArrowCircleRightIcon />}>See All Symptoms</Button>
          </Grid>
        </Grid>
      </Symptoms>
      <AboutUS>
        <Grid container spacing={2} columns={{ xs: 4, sm: 8, md: 12 }}>

          <Grid xs={4} sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', }}>
            <Box
              component="img"
              sx={{

                width: '100%',


              }}
              alt="The house from the offer."
              src={'../assets/images/online-doctor-with-white-coat.png'}
            />
          </Grid>
          <Grid xs={8} className="abt_typogrphy">
            <Typography variant="h4" component="h4" className='h1_section_title'>About Our Center<span> Arogya</span></Typography>
            <Typography variant="h6" component="p" className='h1_section_title'>Arogya is the largest multi-channel digital healthcare platform in India, created with a vision of eliminating flexibility blockages from the healthcare industry. We believe in making healthcare affordable to everyone by combining analytic excellence, affordable cost, and extensive research with advanced technology.</Typography>

            <Grid container spacing={3} columns={{ xs: 4, sm: 8, md: 12 }} className="abt_wraper_c">
              <Grid item xs={12} sm={6} md={4}>
                <Paper className="abt_typo_card green">
                  <Typography variant="h4" component="h4" className=''>15 +</Typography>
                  <Typography variant="h6" component="p" className=''>years of experianced Doctors</Typography>
                </Paper>
              </Grid>
              <Grid item xs={12} sm={6} md={4}>
                <Paper className="abt_typo_card ">
                  <Typography variant="h4" component="h4" className=''>50 +</Typography>
                  <Typography variant="h6" component="p" className=''>Specialities</Typography>
                </Paper>
              </Grid>
              <Grid item xs={12} sm={6} md={4}>
                <Paper className="abt_typo_card ">
                  <Typography variant="h4" component="h4" className=''>24x7</Typography>
                  <Typography variant="h6" component="p" className=''>Avialibility</Typography>
                </Paper>
              </Grid>

            </Grid>


          </Grid>
        </Grid>
      </AboutUS>
    <Testimonial>
    
    <SliderComponent images={images} />
    </Testimonial>
     <HealthPriority  className={styles.banner2}>
    
          <Box
            component="img"
            sx={{

              width: '48vw',
              position: 'absolute',
              left: '10px',
              bottom: '0px'

            }}
            alt="The house from the offer."
            src={'../assets/images/doctor-with-his-arms-crossed-white-background.png'}
          />
          <Grid container spacing={2} columns={{ xs: 4, sm: 8, md: 12 }} sx={{height:'100%'}}>
            <Grid xs={6}></Grid>
            <Grid xs={6} sx={{display:'flex', justifyContent:'space-between', flexDirection:'column', alignItems:'flex-end'}} >

            <CardContent className="banner2_c_title">
            <Typography variant="h5" component="span">
              Make your health a priority
            </Typography>
            <Typography variant="h4" component="h4">
              Don't Overlook it
            </Typography>
            
          </CardContent>
          <Button variant="contained" sx={{    position: 'absolute',
    right: '374px',
    top: '86px',
                    width: 'auto', color: '#20ADA0', background: '#fff', ':hover': {
                      bgcolor: '#20ADA0', // theme.palette.primary.main
                      color: 'white',
                    },
                  }} endIcon={<ArrowCircleRightIcon />}>Book online</Button>
              <Banner2Card>
                <h1>Request a Call</h1>
                {/* <h2> Restoring Your Health</h2> */}
                <p>You can simplyfy order a call and we will help you make an appointment with right specialist.</p>
                <Paper
                  component="form"
                  sx={{ p: '2px 4px', display: 'flex', alignItems: 'center', width: '100%', marginTop: 3 }}
                >

                  <InputBase
                    sx={{ ml: 1, flex: 1 }}
                    placeholder="Name"
                    inputProps={{ 'aria-label': 'search google maps' }}
                  />
                </Paper>
                <Paper
                  component="form"
                  sx={{ p: '2px 4px', display: 'flex', alignItems: 'center', width: '100%', marginTop: 3 }}
                >

                  <InputBase
                    sx={{ ml: 1, flex: 1 }}
                    placeholder="Phone Number"
                    inputProps={{ 'aria-label': 'search google maps' }}
                  />
                </Paper>

                <Box sx={{ flex: 1, marginTop: '20px' }}>

                  <Button variant="contained" sx={{
                    width: '100%', color: '#20ADA0', background: '#fff', ':hover': {
                      bgcolor: '#20ADA0', // theme.palette.primary.main
                      color: 'white',
                    },
                  }} endIcon={<ArrowCircleRightIcon />}>Send Request</Button>
                </Box>
              </Banner2Card>
            </Grid>
       </Grid>

     </HealthPriority>
      <Footer />

    </div>
    </ContainerPage>
  );
}
export default Home;

const specialistData = [
  {
    img: '../assets/images/speciality-icons/medicine.png',
    title: 'General Physician',
    caption: '20+ Doctors are available under this department who serve.',
    readmore: 'Read More',
  },
  {
    img: '../assets/images/speciality-icons/cardiology.png',
    title: 'Cardiology',
    caption: '20+ Doctors are available under this department who serve.',
    readmore: 'Read More',
  },
  {
    img: '../assets/images/speciality-icons/Orthopedic.png',
    title: 'Orthopedic',
    caption: '20+ Doctors are available under this department who serve.',
    readmore: 'Read More',
  },
  {
    img: '../assets/images/speciality-icons/Neurology.png',
    title: 'Neurology',
    caption: '20+ Doctors are available under this department who serve.',
    readmore: 'Read More',
  },
  {
    img: '../assets/images/speciality-icons/gastro.png',
    title: 'Gastroenterology',
    caption: '20+ Doctors are available under this department who serve.',
    readmore: 'Read More',
  },
  {
    img: '../assets/images/speciality-icons/pediatrics.png',
    title: 'Pediatrics',
    caption: '20+ Doctors are available under this department who serve.',
    readmore: 'Read More',
  },
  {
    img: '../assets/images/speciality-icons/gyno.png',
    title: 'Obstetrics & Gynaecology',
    caption: '20+ Doctors are available under this department who serve.',
    readmore: 'Read More',
  },
  {
    img: '../assets/images/speciality-icons/Psychiatry.png',
    title: 'Psychiatry',
    caption: '20+ Doctors are available under this department who serve.',
    readmore: 'Read More',
  },


];

const items = [
  {
    title: 'Dr.Rachna Kucheria',
    sp_type: 'General Physician',
    located: 'MBBS MAMC New Delhi',
    experiance: '26+ years of experience',
    description: 'This is the first slide',
    button1: 'View profile',
    button2: 'Book Appointment',
    image: '../assets/images/drimg/dr-rachna.png',
  },
  {
    title: 'Dr.Rupal',
    sp_type: 'General Physician',
    located: 'MBBS MAMC New Delhi',
    experiance: '26+ years of experience',
    description: 'This is the first slide',
    button1: 'View profile',
    button2: 'Book Appointment',
    image: '../assets/images/drimg/Dr-Rupal-Shah-scaled.jpg',
  },
  {
    title: 'Dr. Shehla Agarwal',
    sp_type: 'Dermatology',
    located: 'MBBS MAMC New Delhi',
    experiance: '26+ years of experience',
    description: 'This is the first slide',
    button1: 'View profile',
    button2: 'Book Appointment',
    image: '../assets/images/drimg/dr-shehla-agarwal.jpg',
  },
  {
    title: 'Dr.Sandip Agnihotri',
    sp_type: 'Dermatology',
    located: 'MBBS MAMC New Delhi',
    experiance: '26+ years of experience',
    description: 'This is the first slide',
    button1: 'View profile',
    button2: 'Book Appointment',
    image: '../assets/images/drimg/dr-rachna.png',
  },
  {
    title: 'Dr.Rachna Kucheria',
    sp_type: 'General Physician',
    located: 'MBBS MAMC New Delhi',
    experiance: '26+ years of experience',
    description: 'This is the first slide',
    button1: 'View profile',
    button2: 'Book Appointment',
    image: '../assets/images/drimg/dr-rachna.png',
  },
  {
    title: 'Dr.Rachna Kucheria',
    sp_type: 'General Physician',
    located: 'MBBS MAMC New Delhi',
    experiance: '26+ years of experience',
    description: 'This is the first slide',
    button1: 'View profile',
    button2: 'Book Appointment',
    image: '../assets/images/drimg/dr-rachna.png',
  },
  {
    title: 'Dr.Rachna Kucheria',
    sp_type: 'General Physician',
    located: 'MBBS MAMC New Delhi',
    experiance: '26+ years of experience',
    description: 'This is the first slide',
    button1: 'View profile',
    button2: 'Book Appointment',
    image: '../assets/images/drimg/dr-rachna.png',
  },
  {
    title: 'Dr.Rachna Kucheria',
    sp_type: 'General Physician',
    located: 'MBBS MAMC New Delhi',
    experiance: '26+ years of experience',
    description: 'This is the first slide',
    button1: 'View profile',
    button2: 'Book Appointment',
    image: '../assets/images/drimg/dr-rachna.png',
  },


];
const symptomslist = [
  {
    title: 'Cough, Cold or Fever',
    Consult: 'Consult Now',
    image: '../assets/images/symtems/fever.png',
  },
  {
    title: 'Period doubts or Pregnancy',
    Consult: 'Consult Now',
    image: '../assets/images/symtems/pregnancy.png',
  },
  {
    title: 'Acne, pimple or skin issues',
    Consult: 'Consult Now',
    image: '../assets/images/symtems/skin.png',
  },
  {
    title: 'Child not feeling well',
    Consult: 'Consult Now',
    image: '../assets/images/symtems/child.png',
  },
  {
    title: 'Depression or anxiety',
    Consult: 'Consult Now',
    image: '../assets/images/symtems/depression.png',
  },
  {
    title: 'Weight Lose',
    Consult: 'Consult Now',
    image: '../assets/images/symtems/scale.png',
  },
  {
    title: 'Stomach Issue',
    Consult: 'Consult Now',
    image: '../assets/images/symtems/stomach.png',
  },
  {
    title: 'Vaginal infections',
    Consult: 'Consult Now',
    image: '../assets/images/symtems/Vaginalinfections.png',
  },
];

const testimoniallist = [
  {
    title: 'Ajit Saxena',
    desc: 'Arogya was like God sent! I am a doctor based outside India and was desperately looking for a physician for my sister in Delhi. My sister was suffering from Covid. In the present times, getting a teleconsultation with an experienced physician was such a relief! According to my sister, the physician was so patient with her queries and was so clear and crisp in his explanations that she started feeling better almost immediately! For me , it was extremely reassuring to know that a competent physician was keeping an eye on my sister.....thank you DocGenie! You are doing amazing work!',
    date: '16/03/2024',
    image: '../assets/images/pills-different-colores-spoon.jpg',
  },
  {
    title: 'Neha Mathur',
    desc: 'Arogya was like God sent! I am a doctor based outside India and was desperately looking for a physician for my sister in Delhi. My sister was suffering from Covid. In the present times, getting a teleconsultation with an experienced physician was such a relief! According to my sister, the physician was so patient with her queries and was so clear and crisp in his explanations that she started feeling better almost immediately! For me , it was extremely reassuring to know that a competent physician was keeping an eye on my sister.....thank you DocGenie! You are doing amazing work!',
    date: '12/04/2024',
    image: '../assets/images/pills-different-colores-spoon.jpg',
  },
  {
    title: 'Rohit',
    desc: 'Arogya was like God sent! I am a doctor based outside India and was desperately looking for a physician for my sister in Delhi. My sister was suffering from Covid. In the present times, getting a teleconsultation with an experienced physician was such a relief! According to my sister, the physician was so patient with her queries and was so clear and crisp in his explanations that she started feeling better almost immediately! For me , it was extremely reassuring to know that a competent physician was keeping an eye on my sister.....thank you DocGenie! You are doing amazing work!',
    date: '24/01/2024',
    image: '../assets/images/pills-different-colores-spoon.jpg',
  },
];
const whychoose = [
  {
    title: 'Consult Top Doctors 24x7',
    desc: 'Connect instantly with a 24x7 specialist',
    image: '../assets/images/green-eco-loop-leaf-check-mark.png',
  },
  {
    title: 'Experience of most Doctors',
    desc: 'We have 15 + years of experianced Doctors ',
    image: '../assets/images/green-eco-loop-leaf-check-mark.png',
  },
  {
    title: 'Specialities',
    desc: 'We have 40+ Specialities.',
    image: '../assets/images/green-eco-loop-leaf-check-mark.png',
  },
  {
    title: 'Google Rating',
    desc: 'We have 4.7 google rating.',
    image: '../assets/images/green-eco-loop-leaf-check-mark.png',
  },
  {
    title: 'Convenient and Easy',
    desc: 'Start an instant consultation within 2 minutes',
    image: '../assets/images/green-eco-loop-leaf-check-mark.png',
  },
  {
    title: '100% Safe Consultations',
    desc: ' Cnline consultation will be fully private and secured.',
    image: '../assets/images/green-eco-loop-leaf-check-mark.png',
  },
  {
    title: 'Similar Clinic Experience',
    desc: 'Consultation through a video call with the doctor.',
    image: '../assets/images/green-eco-loop-leaf-check-mark.png',
  },
  {
    title: 'Free Follow-up',
    desc: 'Get a valid digital prescription and a 7-day',
    image: '../assets/images/green-eco-loop-leaf-check-mark.png',
  },
];

const images = [
  {
    src: '../assets/images/portrait-young-woman-doctor-with-stethoscope-uniform (1).png',
    srcquote: '../assets/images/icons8-quote-left-100.png',
    name:'raghav Chadda',
    age:'87',
    description: 'It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using Lorem Ipsum is that it has a more-or-less normal distribution of letters, as opposed to using  making it look like readable English. Many desktop publishing packages and web page editors now use Lorem Ipsum as their default model text, and a search for  will uncover many web sites still in their infancy. Various versions have evolved over the years, sometimes by accident, sometimes on purpose (injected humour and the like). 1',
  },
  {
    src: '../assets/images/dr1.png',
    srcquote: '../assets/images/icons8-quote-left-100.png',
    name:'Anil kushwaha',
    age:'24',
    description: ' since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum',
  },
  {
    src: '../assets/images/online-doctor-with-white-coat.png',
    srcquote: '../assets/images/icons8-quote-left-100.png',
    name:'Neeraj Randhawa',
    age:'65',
    description: 't anything embarrassing hidden in the middle of text. All the Lorem Ipsum generators on the Internet tend to repeat predefined chunks as necessary, making this the first true generator on the Internet. It uses a dictionary of over 200 Latin words, combined with a handful of model sentence structures, to generate Lorem Ipsum which looks reasonable. The generated Lorem Ipsum is therefore always free from repetition, injected humour, or non-characteristic words etc',
  },
  {
    src: '../assets/images/green-eco-loop-leaf-check-mark.png',
    srcquote: '../assets/images/icons8-quote-left-100.png',
    name:'Sanjay Singh Bhalla',
    age:'45',
    description: 'The standard chunk of Lorem Ipsum used since the 1500s is reproduced below for those interested. Sections 1.10.32 and 1.10.33 from "de Finibus Bonorum et Malorum" by Cicero are also reproduced in their exact original form, accompanied by English versions from the 1914 translation by H. Rackham.',
  },
];
