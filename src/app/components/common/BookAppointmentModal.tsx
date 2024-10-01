// components/Modal.tsx
import React from 'react';
import styled from 'styled-components';
import { TextField, Button, Stack, Box, Modal, Typography, Grid, FormControl,Select, MenuItem, InputLabel, Autocomplete } from '@mui/material';
import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import Link from 'next/link';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import ScheduleIcon from '@mui/icons-material/Schedule';
import BookOnlineIcon from '@mui/icons-material/BookOnline';
import ChecklistRtlIcon from '@mui/icons-material/ChecklistRtl';
import CloseIcon from '@mui/icons-material/Close';

interface ModalProps {
    isOpen: boolean;
    onClose: () => void;
}
const ModalHeader = styled.div`
    padding:15px 20px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    border-bottom: 1px solid #ababab;
.tx1{
    font-size:1.25rem;
    font-weight:600;
    color:#20ADA0;
}
.tx2{
  font-size:1.1rem;
    font-weight:300;
    color:#000;
}
    .tx2 span{
  font-size:1.1rem;
    font-weight:600;
    color:#20ADA0;
}
`;
const ModalBody = styled.div`
    overflow-x: auto;
    max-height: 72vh;
   padding:10px 20px;
   margin-top:15px;
   .locat{
   font-size: 1rem;
    font-weight: 300;
    color: #000;
    margin-bottom: 20px;
    display:flex;
    align-items:center;
   }
    .time_box{
    display: flex;
    flex-wrap: wrap;
    width: 100%;
}
.time_box li{
margin-top:10px;
font-size:.8rem;
font-weight:300;
color:#20ADA0;
    line-height: 1.20rem;
    padding: 8px 10px;
    border: 1px solid #20ADA0;
    border-radius: 4px;
    list-style: none;
    color: black;
    margin-right:10px;
    cursor:pointer;
}
    .time_box li:hover{
    cursor:pointer;
    background:#20ADA0;
    color:white;
    }
    .tx2date{
    font-size: 1rem;
    font-weight: 300;
    color: #000;
    margin-bottom: 16px;
    display:flex;
    align-items:center;
    }
    .tx2date svg{
    margin-right:7px;
    } 
    input.Mui-disabled {
    opacity: 1;
    -webkit-text-fill-color: rgb(0 0 0 / 100%);
}
    .MuiFormLabel-filled.Mui-disabled{
        color: rgba(0, 0, 0, .6);
    }
        .fldset_lgend{
            background: white;
    margin-left: 15px;
    font-size: .7rem;
    font-weight: 500;
    color: #20ada0;
    padding: 0px 5px;
    }
    .fieldset_wrap{
    padding:20px;
    padding-bottom:20px;
    padding-top:10px;
       border-color: #efefef;
    margin-bottom:10px;
    }
    .MuiPickersTextField{
    width:100%;
    }
    .pric_tw{border: 1px solid #b1b1b1;}
`;
const ModalFooter = styled.div`
  padding:15px 20px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    border-top: 1px solid #ababab;
      display:flex;
    justify-content:center;
    .footer_btn_wrp{
    display:flex;
    justify-content:center;
    }
`;
const Pricewrap = styled.div`

.price_header_txt{
font-size: 1.1rem;
    font-weight: 600;
    color: #000;
    line-height: 1.20rem;
    padding: 15px 10px;
    background: #efefef;
}
    .tx1{
font-size: 1.1rem;
    font-weight: 500;
    color: #000000;
    margin-top: 10px;
}
    .tx2{
    font-size: 1rem;
    font-weight: normal;
    color: #1f1f1f;
    margin-top: 5px;
    padding-bottom: 10px;
    }
    .tx3{
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 10px 0px;
    border-top: 1px solid #bababa;
    }
    .tx3 .spntx1{
   font-size: .90rem;
    font-weight: normal;
    color: #000;
    }
    .tx3 .spntx2{
   font-size: .90rem;
    font-weight: normal;
    color: #000;
    }
       .tx4{
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 10px 0px;
    border-top: 1px solid #bababa;
    }
    .tx4 .spntx1{
   font-size: 1rem;
    font-weight: 500;
    color: #20ada0;
    }
    .tx4 .spntx2{
   font-size: 1rem;
    font-weight: 500;
    color: #20ada0;
    }
    .prc_contnt{
    padding:10px;
    padding-bottom:0px;
    }
`;
function ModalOne({ isOpen, onClose }: ModalProps) {
    const [Gender, setGender] = React.useState('');

    const handleChange = (event: SelectChangeEvent) => {
      setGender(event.target.value as string);
    };
    if (!isOpen) return null;

    return (
        <Modal
            open={isOpen}
            onClose={onClose}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
        >
            <Box sx={style}>
                <ModalHeader>
                    <Typography id="" variant="h6" component="h2" className='tx1'>
                        Book Appointment
                    </Typography>
                   <CloseIcon sx={{cursor:'pointer'}} onClick={onClose}/>
                </ModalHeader>
                <ModalBody>
                    <Grid container spacing={3}>
                        <Grid item xs={12} sm={4} md={4}>
                            {/* <Typography className='locat'>
                                <LocationOnIcon /> St John’s Medical College Bangalore
                            </Typography> */}
                            <form>
                                <Stack spacing={2} direction="row" sx={{ marginBottom: 2 }}>
                                    <TextField
                                        type="text"
                                        variant='outlined'
                                        color='primary'
                                        label="First Name"

                                        value={''}
                                        fullWidth
                                        required
                                    />

                                </Stack>
                                <Stack spacing={2} direction="row" sx={{ marginBottom: 2 }}>
                                <TextField
                                    type="text"
                                    variant='outlined'
                                    color='primary'
                                    label="Age"

                                    value={''}
                                  
                                    fullWidth
                                    sx={{ mb: 2 }}
                                />
                                    <FormControl fullWidth>
                                        <InputLabel id="demo-simple-select-label">Gender</InputLabel>
                                        <Select
                                            labelId="demo-simple-select-label"
                                            id="demo-simple-select"
                                            value={Gender}
                                            label="Gender"
                                            onChange={handleChange}
                                        >
                                            <MenuItem value={10}>Male</MenuItem>
                                            <MenuItem value={20}>Female</MenuItem>
                                        </Select>
                                    </FormControl>


                                </Stack>

                                <TextField
                                    type="number"
                                    variant='outlined'
                                    color='primary'
                                    label="Phone Number"

                                    value={'Phone'}
                                    required
                                    fullWidth
                                    sx={{ mb: 1 }}
                                />
                                <FormControl fullWidth>
                                <LocalizationProvider dateAdapter={AdapterDayjs} sx={{ width: '100%' }} >
                                    <DemoContainer components={['DatePicker']} sx={{ width: '100%' }}>
                                        <DatePicker label="Choose Date of Appointment" sx={{ width: '100%' }} />
                                    </DemoContainer>
                                </LocalizationProvider>
                                </FormControl>
                                <FormControl fullWidth sx={{marginTop:'15px'}}>
                                <MultiSelect />
                                </FormControl>
                                {/* <TextField sx={{ mt: 2, color: '#000' }}
                                    disabled
                                    type="text"
                                    variant='outlined'
                                    color='primary'
                                    label="Slots available"

                                    value={'20 Slots Available'}
                                    fullWidth

                                /> */}
                                {/* <Button variant="outlined" color="primary" type="submit">Register</Button> */}
                            </form>
                        </Grid>
                        <Grid item xs={12} sm={5} md={5}>
                        <Pricewrap >
                            {/* <Typography className='tx2date'>
                                <ChecklistRtlIcon />40 Slots Available
                            </Typography> */}
                            <Box component="fieldset" className='fieldset_wrap' sx={{marginTop:'-5px'}}>
                                <legend className='fldset_lgend'>Morning Slots</legend>
                                <ul className="time_box">
                                    <li>03:00 PM</li>
                                    <li>06:00 PM</li>
                                    <li>09:00 PM</li>
                                    <li>09:00 PM</li>
                                    <li>09:00 PM</li>
                                    <li>09:00 PM</li>

                                </ul>
                            </Box>
                            <Box component="fieldset" className='fieldset_wrap'>
                                <legend className='fldset_lgend'>Afternoon Slots</legend>
                                <ul className="time_box">
                                    <li>03:00 PM</li>
                                    <li>06:00 PM</li>
                                    <li>09:00 PM</li>
                                    <li>09:00 PM</li>
                                    <li>09:00 PM</li>
                                    <li>09:00 PM</li>

                                </ul>
                            </Box>
                            <Box component="fieldset" className='fieldset_wrap'>
                                <legend className='fldset_lgend'>Evening Slots</legend>
                                <ul className="time_box">
                                    <li>03:00 PM</li>
                                    <li>06:00 PM</li>
                                    <li>09:00 PM</li>
                                    <li>09:00 PM</li>
                                    <li>09:00 PM</li>

                                </ul>
                            </Box>
                            <Box component="fieldset" className='fieldset_wrap'>
                                <legend className='fldset_lgend'>Night Slots</legend>
                                <ul className="time_box">
                                    <li>03:00 PM</li>
                                    <li>06:00 PM</li>
                                    <li>09:00 PM</li>

                                </ul>
                            </Box>
                            </Pricewrap>
                        </Grid>
                        <Grid item xs={12} sm={3} md={3}>
                            <Pricewrap className="pric_tw">
                                <Typography className="price_header_txt">Consultation Details</Typography>
                                <Box className="prc_contnt">
                                <Typography className="tx1">Dr. Ranjana Sharma</Typography>
                                <Typography className="tx2">Fever</Typography>
                                <Typography className="tx3"><span className="spntx1">Price</span><span className="spntx2">$ 500</span></Typography>
                                <Typography className="tx4"><span className="spntx1">Total</span><span className="spntx2">$ 500</span></Typography>
                                </Box>
                            </Pricewrap>

                        </Grid>
                      
                    </Grid>
                </ModalBody>
                <ModalFooter>
                    <Box className="footer_btn_wrp">
                        <Button variant="contained" sx={{
                            width: 'auto', minWidth: '150px', color: '#fff', background: '#20ADA0', borderRadius: '4px', marginLeft: '20px', ':hover': {
                                bgcolor: '#20ADA0', // theme.palette.primary.main
                                color: 'white',
                            },
                        }}><BookOnlineIcon sx={{ marginRight: 1 }} />Book Now
                        </Button>
                        <Button onClick={onClose} variant="contained" sx={{
                            width: 'auto', minWidth: '150px', color: '#fff', background: '#20ADA0', borderRadius: '4px', marginLeft: '20px', ':hover': {
                                bgcolor: '#20ADA0', // theme.palette.primary.main
                                color: 'white',
                            },
                        }}>Cancel
                        </Button>
                    </Box>

                </ModalFooter>
            </Box>
        </Modal>

    );
}
const style = {
    position: 'absolute' as 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: '90%',
    maxWidth: '1200px',
    bgcolor: 'background.paper',
    border: '2px solid #000',
    boxShadow: 24,

};

const styles = {
    modalOverlay: {
        position: 'fixed' as 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 1000,
    },
    modalContent: {
        backgroundColor: '#fff',
        padding: '20px',
        borderRadius: '10px',
        maxWidth: '1000px',
        width: '100%',
        textAlign: 'center' as 'center',
    },
    closeButton: {
        marginTop: '20px',
    },
};

export default ModalOne;



const MultiSelect = () => {
    // Define the options you want to display in the dropdown
    const options = [
      { title: 'Fever' },
      { title: 'Cold' },
      { title: 'Cough' },
      { title: 'Headach' },
    ];
  
    return (
      <Autocomplete
        multiple
        options={options}
        getOptionLabel={(option) => option.title}
        renderInput={(params) => (
          <TextField {...params} variant="outlined" label="Select Symptoms" placeholder="Options" />
        )}
      />
    );
  };
  
 