"use client";
import React, { useState } from 'react';
import Box from '@mui/material/Box';
import { Select, MenuItem, FormControl, InputLabel, Grid, Paper, Typography, Button, AppBar,TextField ,InputAdornment,OutlinedInput} from '@mui/material';
import styled from 'styled-components';

import Header from '../../components/common/Topbar';
import Footer from '../../components/common/Footer';

export default function BasicSelect() {
  const [selectedValue, setSelectedValue] = useState('');

  const handleChange = (event) => {
    setSelectedValue(event.target.value);
  };
  const handleChange1 = (event) => {
    setSelectedValue(event.target.value);
  };
  const DoctorList = styled.div`
padding:50px;
margin-top:40px;
padding-bottom:0;
`;
  const DocListItem = styled.div`
.box_wrp{
display:flex;
margin-top:15px;

}
.dr_cir_canv{
width:160px;
height:auto;
border: 4px solid #20ada0;
}
.dr_cir_canv_wrp{
padding:20px;
border-radius:20px;
display: flex;
    align-items: center;
}
.exp_hrlne{
margin:0px 10px;}
.dr_cap{


}

.dr_cap .t1{
font-size:1.25rem;
font-weight:600;
color:black;
line-height:1.50rem;
margin-bottom:10px;
}
.dr_cap .t2{
font-size:.9rem;
font-weight:400;
color:gray;
line-height:1.20rem;
margin-top:5px;
}
.expr{
display:flex;
align-items:center;
margin-top:20px;
}
.expr .t3{
font-size:.8rem;
font-weight:600;
color:#354c5c;
line-height:1.20rem;
}
.star_ico_wrp{
display:flex;
align-items:center;
margin-top:20px
}
.star_ico_wrp .star_ico{
width:24px;
width:24px;
margin-right:3px;
}
.exp_hrlne{
color:gray;
}
.star_ico_wrp .t3{
font-size:.9rem;
font-weight:400;
color:gray;
line-height:1.20rem;
}
.dr_action{
display:flex;
flex-direction:column;
min-width:200px;
}
.dr_action .t1{
font-size:.9rem;
font-weight:600;
color: #354c5c;
line-height:1.20rem;
}
.dr_action span{
color:#20ADA0;
}
.dr_cat_action_wrp{
display:flex;
justify-content:space-between;
width:100%;
padding:20px;
}
`;
  const DrFilter = styled.div`
margin-bottom:10px;
.filter_opt{
font-size:.8rem;
font-weight:400;
color: #354c5c;
line-height:1.20rem;
}
 li{
font-size:.8rem;
font-weight:400;
color: #354c5c;
line-height:1.20rem;
}
`;
const DrlistCol2 = styled.div`
padding:10px;
background:white;
margin-top:15px;
.t1{
  color:#20ADA0;
  font-size:1rem;
  font-weight:bold;
}
.t2{
  color:black;
  font-size:.9rem;
  font-weight:400;
  margin-top:10px;
}
.ul_li{
margin-top:10px;
}
.ul_li li{
  color:gray;
  font-size:.8rem;
  font-weight:400;
  list-style:none;
  margin-top:5px;
}
`;
const DrlistForm = styled.div`
margin-top:15px;
background:white;
padding:10px;
input{
width:100%;
}
.txt1{
  color:#20ADA0;
  font-size:1.25rem;
  font-weight:bold;
  list-style:none;
  margin-top:5px;
  text-align:center;
  }
.txt2{
  color:gray;
  font-size:.8rem;
  font-weight:400;
  list-style:none;
  margin-top:5px;
  text-align:center;
  margin-bottom:20px;
  }
  inputsize{
  height:30px;
  }
`;

  return (
    <DoctorList>
      <Header />
      <DrFilter>
        <Paper sx={{ padding: '10px', }}>
          <Grid container spacing={3}>
            <Grid item xs={12} sm={6} md={2}>

              <FormControl variant="standard" sx={{ width: '100%' }}>
                <InputLabel id="demo-simple-select-standard-label">Gender</InputLabel>
                <Select
                  labelId="demo-simple-select-standard-label"
                  id="demo-simple-select-standard"
                  value={selectedValue}
                  onChange={handleChange}
                  label="Age"
                  className="filter_opt"
                >
                  <MenuItem value="">
                    <em>None</em>
                  </MenuItem>
                  <MenuItem value={10}>Male</MenuItem>
                  <MenuItem value={20}>Female</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6} md={2}>

              <FormControl variant="standard" sx={{ width: '100%' }}>
                <InputLabel id="exp">Experience</InputLabel>
                <Select
                  labelId="exp"
                  id="demo-simple-select-standard1"
                  value={selectedValue}
                  onChange={handleChange1}
                  label="Age"
                  className="filter_opt"
                >
                  <MenuItem value="">
                    <em>None</em>
                  </MenuItem>
                  <MenuItem value={10}>5+ Years of Experience</MenuItem>
                  <MenuItem value={20}>10+ Years of Experience</MenuItem>
                  <MenuItem value={30}>15+ Years of Experience</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6} md={2}>

              <FormControl variant="standard" sx={{ width: '100%' }}>
                <InputLabel id="fee">Fees</InputLabel>
                <Select
                  labelId="fee"
                  id="demo-simple-select-standard3"
                  value={selectedValue}
                  onChange={handleChange1}
                  label="Fees"
                  className="filter_opt"
                >
                  <MenuItem value="">
                    <em>None</em>
                  </MenuItem>
                  <MenuItem value={10}>High To Low</MenuItem>
                  <MenuItem value={20}>Low To High</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6} md={2}>

            
              <Button variant="contained" sx={{
                  width: 'auto',marginTop:'8px', color: '#fff', background: '#20ADA0', borderRadius:'4px', ':hover': {
                      bgcolor: '#20ADA0', // theme.palette.primary.main
                      color: 'white',
                    },
                  }}>Filter</Button>
            </Grid>
          </Grid>
        </Paper>
      </DrFilter>



      <DocListItem>
        <Grid container spacing={3}>
        

            <Grid item xs={12} sm={8} md={8}>
            {drlist.map((item) => (
              <Paper className="box_wrp"  >
                <Box className="dr_cir_canv_wrp">
                  <Box component="img" className="dr_cir_canv"
                    alt="The house from the offer."
                    src={item.drsrc}
                  />
                </Box>
                <Box className="dr_cat_action_wrp">
                  <Box className="dr_cap">
                    <Typography variant="h4" component="h4" className='t1'>{item.name}</Typography>
                    <Typography variant="h6" component="h6" className='t2'>{item.type}</Typography>
                    <Typography variant="h6" component="h6" className='t2'>{item.work}</Typography>

                    <Box className="expr">
                      <Typography variant="h6" component="span" className='t3'>{item.exep}</Typography>
                      <span className="exp_hrlne">|</span>
                      <Typography variant="h6" component="span" className='t3'>{item.lang}</Typography>
                    </Box>
                    <Box className="star_ico_wrp">
                      <Typography variant="h6" component="span" className='t3'>{item.rating}</Typography>

                      <span className="exp_hrlne">|</span>
                      <Box component="img" className="star_ico"
                        alt="The house from the offer."
                        src={'../assets/images/star-fill.png'}
                      />
                      <Box component="img" className="star_ico"
                        alt="The house from the offer."
                        src={'../assets/images/star-fill.png'}
                      />
                      <Box component="img" className="star_ico"
                        alt="The house from the offer."
                        src={'../assets/images/star-fill.png'}
                      />
                      <Box component="img" className="star_ico"
                        alt="The house from the offer."
                        src={'../assets/images/star-fill.png'}
                      />
                      <Box component="img" className="star_ico"
                        alt="The house from the offer."
                        src={'../assets/images/half-star.png'}
                      />


                    </Box>
                  </Box>
                  <Box className="dr_action">
                    <Typography variant="h6" component="span" className='t1'>{item.onsultationfee} <span>₹{item.rs}</span></Typography>
                    <Button variant="contained" sx={{
                      marginTop: 2, width: 'auto', color: '#fff', background: '#20ADA0', ':hover': {
                        bgcolor: '#20ADA0', // theme.palette.primary.main
                        color: 'white',
                      },
                    }} >{item.button1}</Button>
                    <Button variant="contained" sx={{
                      marginTop: 2, width: 'auto', color: '#fff', background: '#20ADA0', ':hover': {
                        bgcolor: '#20ADA0', // theme.palette.primary.main
                        color: 'white',
                      },
                    }} >{item.button2}</Button>
                  </Box>
                </Box>
              </Paper>
               ))}
            </Grid>
         

          <Grid item xs={12} sm={4} md={4}>
              <DrlistCol2>
                  <Typography className="t1">Book an Appointment with Expert Dietitians</Typography>
                  <Typography  className="t2">Diet Consultation @Rs.299 Only</Typography>
                  <ul className="ul_li">
                    <li>With over 50+ expert Dietitians</li>
                    <li>Get personalized diet plan</li>
                  </ul>
              </DrlistCol2>
              <DrlistForm>
                <Typography className='txt1'>We are Here to Help!</Typography>
                <Typography className='txt2'>Get instant call back in few mins</Typography>
              <FormControl fullWidth>
              <TextField id="outlined-basic" label="Enter Name" variant="outlined"inputProps={{
            style: {fontSize: '.8rem'} 
          }}
          InputLabelProps={{
            style: {fontSize: '.8rem'} 
          }} />
              <TextField id="outlined-basic" label="Enter Phone Number" variant="outlined" sx={{marginTop:'10px', marginBottom:'10px'}} inputProps={{
            style: {fontSize: '.8rem'} 
          }}
          InputLabelProps={{
            style: {fontSize: '.8rem'} 
          }} />
             
          <TextField
          id="outlined-select-currency"
          select
          label="Select"
          defaultValue=""
          helperText="Please select your Location"
          sx={{fontSize:'.8rem'}}
         >
          {currencies.map((option) => (
            <MenuItem  key={option.location} value={option.location}>
              {option.location}
            </MenuItem>
          ))}
        </TextField>
              <Button variant="contained" sx={{
                   marginTop:2, width: 'auto', color: '#fff', background: '#20ADA0', borderRadius:'4px', ':hover': {
                      bgcolor: '#20ADA0', // theme.palette.primary.main
                      color: 'white',
                    },
                  }}>Book Now</Button>
              </FormControl>
              </DrlistForm>
          </Grid>
        </Grid>
      </DocListItem>
      <Footer />
    </DoctorList>
  );
}

const drlist = [
  {
    drsrc: '../assets/images/drRanjanaSharma.jpg',
    name: 'Dr. Ranjana Sharma',
    type: 'General Physician',
    work: 'MS GR Medical College, Gwalior',
    exep: '42+ years of experience',
    lang: 'Hindi, English, Bit of Arabic',
    rating: 'Rating 4.5',
    button1: 'View Profile',
    button2: 'Book Appointment',
    onsultationfee: 'Consultation Fees',
    rs: '500'
  },
  {
    drsrc: '../assets/images/drNidhiSharma.jpg',
    name: 'Dr. Nidhi Sharma',
    type: 'General Physician',
    work: 'MS (Obgyn) PGIMS, Rohtak',
    exep: '13+ years of experience',
    lang: 'Speaks Hindi, English, French, Punjabi, Marathi',
    rating: 'Rating 4.5',
    button1: 'View Profile',
    button2: 'Book Appointment',
    onsultationfee: 'Consultation Fees',
    rs: '700'
  },
  {
    drsrc: '../assets/images/niranjanaDr.jpg',
    name: 'Dr.Niranjana Jayakrishnan',
    type: 'General Physician',
    work: 'MD Amrita Vishwa Vidyapeetham University, Kochi',
    exep: '13+ years of experience',
    lang: 'Speaks Hindi, English, French, Punjabi, Marathi',
    rating: 'Rating 4.5',
    button1: 'View Profile',
    button2: 'Book Appointment',
    onsultationfee: 'Consultation Fees',
    rs: '1000'
  },
]

const currencies =[{
location:'Haldwani',

},
{
  location:'Dehradun'
}
]