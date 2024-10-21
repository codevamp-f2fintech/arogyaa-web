"use client";

import { useSearchParams } from "next/navigation";
import React, { useState } from "react";
import Box from "@mui/material/Box";
import {
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Grid,
  Paper,
  Typography,
  Button,
  AppBar,
  TextField,
  InputAdornment,
  OutlinedInput,
  Tabs,
  Tab,
} from "@mui/material";
import styled from "styled-components";
import DoneIcon from "@mui/icons-material/Done";
import PaymentIcon from "@mui/icons-material/Payment";
import CurrencyRupeeIcon from "@mui/icons-material/CurrencyRupee";
import VerifiedIcon from "@mui/icons-material/Verified";
import Header from "../../components/common/Topbar";
import Footer from "../../components/common/Footer";
import ModalOne from "../../components/common/BookAppointmentModal";
import { useGetdoctorprofile } from "@/hooks/doctorprofile";

const Drprofwrapper = styled.div`
  padding: 40px;
  padding-top: 90px;

  .rating_wrp {
    margin-right: 20px;
  }

  .box_wrp {
    display: flex;
    padding: 20px;
  }

  .dr_cir_canv {
    width: 200px;
    margin-right: 10px;
  }
  .dr_cat_action_wrp {
    display: flex;
    justify-content: space-between;
    margin-left: 20px;
    align-items: flex-start;
  }
  .dr_cat_action_wrp .t1 {
    font-size: 2rem;
    font-weight: bold;
    color: #20ada0;
    display: flex;
    align-items: center;
  }
  .dr_cat_action_wrp .t2 {
    font-size: 1.2rem;
    font-weight: bold;
    color: #646464;
    margin-bottom: 20px;
    margin-top: 10px;
  }
  .dr_cat_action_wrp .t3 {
    font-size: 0.9rem;
    font-weight: 300;
    color: #646464;
  }
  .star_ico {
    width: 30px;
    height: 30px;
  }
  .rating_wrp {
    background-color: #ededed;
    height: auto;
    display: flex;
    width: 200px;
    flex-direction: column;
    margin-left: 20px;
    padding: 10px;
    border-radius: 10px;
    background-image: url(../assets/images/vector_plus.png);
    background-position: center;
    background-repeat: no-repeat;
    background-size: 102px;
  }
  .rating_wrp .tx1 {
    font-size: 2rem;
    text-align: center;
    color: black;
    font-weight: normal;
  }
  .rating_wrp span {
    font-size: 3rem;
    text-align: center;
    color: #20ada0;
    font-weight: bold;
  }

  .star_wrp {
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .expr {
    display: flex;
    align-items: center;
    margin-top: 20px;
  }
  .expr .t3 {
    font-size: 0.8rem;
    font-weight: 600;
    color: #354c5c;
    line-height: 1.2rem;
  }
  .para_info1 {
    font-size: 0.85rem;
    font-weight: 300;
    color: #354c5c;
    line-height: 1.2rem;
  }
  .trat_list {
  }
  .trat_list li {
    list-style: none;
    font-size: 0.8rem;
    font-weight: 300;
    color: #354c5c;
    line-height: 1.2rem;
    display: flex;
  }
  .trat_list li svg {
    font-size: 15px;
  }
  .treat_list_title {
    font-size: 1.25rem;
    font-weight: bold;
    color: #20ada0;
    line-height: 1.2rem;
    margin-top: 20px;
    margin-bottom: 10px;
  }
  .loc_1 .tx2 {
    font-size: 0.9rem;
    font-weight: 300;
    color: #354c5c;
    line-height: 1.2rem;
  }
  .loc_1 .tx1 {
    font-size: 1.25rem;
    font-weight: bold;
    color: #20ada0;
    line-height: 1.2rem;
    margin-top: 20px;
    margin-bottom: 10px;
  }
  .loc_1 .tx3 {
    font-size: 0.9rem;
    font-weight: 500;
    color: #000;
    line-height: 1.2rem;
    margin-top: 20px;
    margin-bottom: 10px;
  }
  .loc_1 {
    border-bottom: 1px solid gray;
    padding-bottom: 10px;
  }
  .dates .tx1 {
    font-size: 1rem;
    font-weight: 600;
    color: #20ada0;
    line-height: 1.2rem;
    margin-top: 20px;
    margin-bottom: 10px;
  }
  .dates .tx2 {
    font-size: 0.9rem;
    font-weight: 600;
    color: #000;
    line-height: 1.2rem;
    margin-top: 10px;
    margin-bottom: 10px;
  }
  .dates .tx3 {
    font-size: 0.8rem;
    font-weight: 300;
    color: #354c5c;
    line-height: 1.2rem;
  }
  .dates .tx4 {
    font-size: 0.8rem;
    font-weight: bold;
    color: #354c5c;
    line-height: 1.2rem;
    margin-top: 15px;
  }
  .visit_t .tx1 {
    font-size: 1rem;
    font-weight: 600;
    color: #20ada0;
    line-height: 1.2rem;
    margin-top: 20px;
    margin-bottom: 10px;
  }
  .blog_content .tx1 {
    font-size: 1rem;
    font-weight: 600;
    color: #20ada0;
    line-height: 1.2rem;
  }
  .blog_content .tx2 {
    font-size: 0.8rem;
    font-weight: bold;
    color: #354c5c;
    line-height: 1.2rem;
  }
  .verified {
    font-size: 0.8rem;
    font-weight: bold;
    color: #354c5c;
    line-height: 1.2rem;
    display: flex;
    align-items: center;
    margin-left: 10px;
    border: 1px solid #20ada0;
    border-radius: 4px;
    padding: 3px;
  }
  .verified svg {
    color: #20ada0;
    margin-right: 5px;
  }
  .Specialization .tx1 {
    font-size: 1rem;
    font-weight: 600;
    color: #20ada0;
    line-height: 1.2rem;
  }
  .availble .tx1 {
    font-size: 1rem;
    font-weight: 500;
    color: #20ada0;
    line-height: 1.2rem;
  }
  .availble .tx2 {
    font-size: 0.8rem;
    font-weight: 500;
    color: #354c5c;
    line-height: 1.2rem;
  }
  .availble .time_box {
    display: flex;
  }
  .availble .time_box li {
    margin-top: 10px;
    font-size: 0.8rem;
    font-weight: 300;
    color: #20ada0;
    line-height: 1.2rem;
    padding: 8px 10px;
    border: 1px solid #20ada0;
    border-radius: 4px;
    list-style: none;
    color: black;
    margin-right: 10px;
    cursor: pointer;
  }
`;

export default function DrProfile() {
  const [isModalOpen, setModalOpen] = useState(false);
  const [value, setValue] = useState(0);
  const [value1, setValue1] = useState(0);
  const searchParams = useSearchParams();
  // const id = "6707b2b474d820f1ad625603"; //testing code, remove this code and uncomment just below line.
  const id = searchParams.get("id");

  const { data: doctorData, swrLoading } = useGetdoctorprofile(
    [],
    `http://localhost:5050/api/v1/doctor/get/${id}`
  );

  const openModal = () => {
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
  };

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const handleChangeAppoint = (event, newValue) => {
    setValue1(newValue);
  };

  const handleClinicTabClick = (event, newValue) => {
    setValue1(newValue);
    setValue(1);
  };

  if (swrLoading) {
    return <div>Loading...</div>;
  }

  return (
    <Drprofwrapper>
      <Header />
      <ModalOne isOpen={isModalOpen} onClose={closeModal} />
      <Box sx={{ padding: "10px" }}>
        <Grid container spacing={3}>
          <Grid item xs={12} sm={12} md={12}>
            <Paper className="box_wrp">
              <Box className="dr_cir_canv_wrp">
                <Box
                  component="img"
                  className="dr_cir_canv"
                  alt="The doctor from the offer."
                  src="../assets/images/drRanjanaSharma.jpg"
                />
              </Box>
              <Box className="dr_cat_action_wrp">
                <Box className="dr_cap">
                  {/* Display fetched doctor data */}
                  <Typography variant="h4" component="h4" className="t1">
                    {doctorData ? doctorData.username : "Dr. Ranjana Sharma"}
                    <span className="verified">
                      <VerifiedIcon /> Verified profile
                    </span>
                  </Typography>
                  <Typography variant="h6" component="h6" className="t2">
                    General Physician
                  </Typography>
                  <Typography variant="h6" component="h6" className="t3">
                    {doctorData
                      ? doctorData.bio
                      : "M.B.B.S, DCh, DHA, RPSGT (USA)\nGeneral physician, Paediatrician Health Checkup (General), Sleep medicine, Pediatric gastroenterology, Pediatric infectious diseases, Allergy Treatment, Diabetes Management, Immunity Therapy, Hypertension Treatment, etc."}
                  </Typography>

                  <Box className="expr">
                    <Typography variant="h6" component="span" className="t3">
                      {doctorData
                        ? `${doctorData.experienceYears} years of experience`
                        : "42+ years of experience"}
                    </Typography>
                    <span className="exp_hrlne">|</span>
                    <Typography variant="h6" component="span" className="t3">
                      Speaks English, Hindi, Kannada, Telugu{" "}
                    </Typography>
                  </Box>
                  <Box>
                    <Button
                      onClick={openModal}
                      variant="contained"
                      sx={{
                        marginTop: 2,
                        width: "auto",
                        color: "#fff",
                        background: "#20ADA0",
                        borderRadius: "4px",
                        ":hover": {
                          bgcolor: "#20ADA0",
                          color: "white",
                        },
                      }}
                    >
                      Book a Video Appointment
                    </Button>
                    <Button
                      onClick={openModal}
                      variant="contained"
                      sx={{
                        marginTop: 2,
                        width: "auto",
                        color: "#fff",
                        background: "#20ADA0",
                        borderRadius: "4px",
                        marginLeft: "20px",
                        ":hover": {
                          bgcolor: "#20ADA0",
                          color: "white",
                        },
                      }}
                    >
                      Book an In-Clinic Appointment
                    </Button>
                  </Box>
                </Box>
              </Box>

              <Box className="rating_wrp">
                <Typography variant="h6" component="span" className="tx1">
                  Rating
                </Typography>
                <Typography variant="h6" component="span" className="tx2">
                  <span>5/5</span>
                </Typography>
                <Box className="star_wrp">
                  <Box
                    component="img"
                    className="star_ico"
                    alt="Star"
                    src={"../assets/images/star-fill.png"}
                  />
                  <Box
                    component="img"
                    className="star_ico"
                    alt="Star"
                    src={"../assets/images/star-fill.png"}
                  />
                  <Box
                    component="img"
                    className="star_ico"
                    alt="Star"
                    src={"../assets/images/star-fill.png"}
                  />
                  <Box
                    component="img"
                    className="star_ico"
                    alt="Star"
                    src={"../assets/images/star-fill.png"}
                  />
                  <Box
                    component="img"
                    className="star_ico"
                    alt="Star"
                    src={"../assets/images/star-fill.png"}
                  />
                </Box>
              </Box>
            </Paper>
          </Grid>
          <Grid item xs={12} sm={8} md={8}>
            <Box sx={{ width: "100%", background: "white" }}>
              <Tabs
                value={value}
                onChange={handleChange}
                variant="fullWidth"
                aria-label="Pill Tabs Example"
                sx={{
                  background: "#e8e8e8",
                  "& .MuiTabs-indicator": { display: "none" },
                  "& .MuiTab-root": {
                    textTransform: "none",
                    backgroundColor: "#f0f0f5",
                    "&.Mui-selected": {
                      backgroundColor: "#fff",
                      color: "#20ada0",
                      borderLeft: "1px solid #20ada0",
                      borderRight: "1px solid #20ada0",
                      borderTop: "1px solid #20ada0",
                    },
                  },
                }}
              >
                <Tab label="Profile" />
                <Tab label="Clinic Location" />
                <Tab label="Blog Post" />
              </Tabs>

              <Box sx={{ p: 3 }}>
                {value === 0 && (
                  <div>
                    <Box>
                      <Typography
                        variant="h6"
                        component="p"
                        className="para_info1"
                      >
                        Dr. Ranjana Sharma is a passionate and experienced
                        mental health professional. Completed MBBS from Manipal
                        University and post-graduation in psychiatry from St
                        John’s Medical College Bangalore.
                      </Typography>
                    </Box>
                    <Box>
                      <Typography
                        variant="h4"
                        component="h4"
                        className="treat_list_title"
                      >
                        Conditions Treated
                      </Typography>
                      <ul className="trat_list">
                        <li>
                          <DoneIcon sx={{ marginRight: "5px" }} /> Stress and
                          anger management
                        </li>
                        <li>
                          <DoneIcon sx={{ marginRight: "5px" }} /> Sleep
                          problems
                        </li>
                        <li>
                          <DoneIcon sx={{ marginRight: "5px" }} /> Communication
                          and relationship problems
                        </li>
                        <li>
                          {" "}
                          <DoneIcon sx={{ marginRight: "5px" }} />
                          Anxiety and Depressive disorders
                        </li>
                        <li>
                          {" "}
                          <DoneIcon sx={{ marginRight: "5px" }} />
                          Schizophrenia and psychotic disorders, OCD, Bipolar
                          disorders
                        </li>
                        <li>
                          {" "}
                          <DoneIcon sx={{ marginRight: "5px" }} />
                          ADHD, Autism
                        </li>
                        <li>
                          {" "}
                          <DoneIcon sx={{ marginRight: "5px" }} />
                          Childhood motor disorders
                        </li>
                        <li>
                          {" "}
                          <DoneIcon sx={{ marginRight: "5px" }} />
                          Childhood emotional and mental wellbeing
                        </li>
                        <li>
                          {" "}
                          <DoneIcon sx={{ marginRight: "5px" }} />
                          Career guidance
                        </li>
                      </ul>
                    </Box>
                  </div>
                )}
                {value === 1 && (
                  <div>
                    <Box className="locat_inf">
                      <Grid container spacing={3}>
                        <Grid item xs={12} sm={6} md={4}>
                          <Box className="loc_1">
                            <Typography
                              variant="h6"
                              component="h6"
                              className="tx1"
                            >
                              Location
                            </Typography>
                            <Typography
                              variant="h6"
                              component="h6"
                              className="tx2"
                            >
                              Gulmohar Park, New Delhi (Evening consultation
                              available. Call us to fix an appointment at
                              011-4118 3001, +91 98 1809 3267 )
                            </Typography>
                            <Typography
                              variant="h6"
                              component="h6"
                              className="tx3"
                            >
                              Chanakyapuri, New Delhi
                            </Typography>
                          </Box>
                        </Grid>
                        {/* Availability from API */}
                        <Grid item xs={12} sm={6} md={4} className="dates">
                          <Typography
                            variant="h6"
                            component="h6"
                            className="tx1"
                          >
                            Availability
                          </Typography>
                          {doctorData && doctorData.availability
                            ? doctorData.availability.map((slot, index) => (
                                <div key={index}>
                                  <Typography
                                    variant="h6"
                                    component="h6"
                                    className="tx2"
                                  >
                                    {slot.day}
                                  </Typography>
                                  <Typography
                                    variant="h6"
                                    component="h6"
                                    className="tx3"
                                  >
                                    {slot.startTime} - {slot.endTime}
                                  </Typography>
                                </div>
                              ))
                            : "No Availability"}
                        </Grid>
                        <Grid item xs={12} sm={6} md={4} className="dates">
                          <Typography
                            variant="h6"
                            component="h6"
                            className="tx1"
                          >
                            In-Clinic Visit
                          </Typography>
                          <Typography
                            variant="h6"
                            component="h6"
                            className="tx3"
                            sx={{ display: "flex" }}
                          >
                            <CurrencyRupeeIcon sx={{ marginRight: "5px" }} />
                            Fee : ₹ 1000 per consultation
                          </Typography>
                          <Typography
                            variant="h6"
                            component="h6"
                            className="tx3"
                            sx={{ display: "flex", marginTop: "15px" }}
                          >
                            {" "}
                            <PaymentIcon sx={{ marginRight: "5px" }} />
                            Online Payment Available
                          </Typography>
                          <Typography
                            variant="h6"
                            component="h6"
                            className="tx4"
                          >
                            Online Audio and Video Consultation
                          </Typography>
                          <Typography
                            variant="h6"
                            component="h6"
                            className="tx3"
                            sx={{ display: "flex", marginTop: "10px" }}
                          >
                            <CurrencyRupeeIcon sx={{ marginRight: "5px" }} />
                            Fee : ₹ 1000 per consultation
                          </Typography>
                        </Grid>
                      </Grid>
                    </Box>
                  </div>
                )}
                {value === 2 && (
                  <div>
                    <Box className="blog_content">
                      <Typography variant="h6" component="h6" className="tx1">
                        Home Consultation
                      </Typography>
                      <Typography
                        variant="h6"
                        component="h6"
                        className="tx2"
                        sx={{ display: "flex", marginTop: "10px" }}
                      >
                        Home visits available in New Delhi and Gurgaon only,
                        subject to doctor availability.
                      </Typography>
                    </Box>
                  </div>
                )}
              </Box>
            </Box>
          </Grid>
          <Grid item xs={12} sm={4} md={4}>
            <Box sx={{ width: "100%", background: "white" }}>
              <Tabs
                value={value1}
                onChange={handleChangeAppoint}
                variant="fullWidth"
                aria-label="appoint"
                sx={{
                  background: "#e8e8e8",
                  "& .MuiTabs-indicator": { display: "none" },
                  "& .MuiTab-root": {
                    textTransform: "none",
                    backgroundColor: "#f0f0f5",
                    "&.Mui-selected": {
                      backgroundColor: "#fff",
                      color: "#20ada0",
                      borderLeft: "1px solid #20ada0",
                      borderRight: "1px solid #20ada0",
                      borderTop: "1px solid #20ada0",
                    },
                  },
                }}
              >
                <Tab label="Video" />
                <Tab
                  label="Clinic"
                  onClick={(e) => handleClinicTabClick(e, 1)}
                />
              </Tabs>

              <Box sx={{ p: 3 }}>
                {value1 === 0 && (
                  <div>
                    <Box className="availble">
                      <Typography variant="h6" component="h6" className="tx1">
                        Available Tomorrow
                      </Typography>
                      <ul className="time_box">
                        <li>03:00 PM</li>
                        <li>06:00 PM</li>
                        <li>09:00 PM</li>
                      </ul>
                    </Box>
                  </div>
                )}
                {value1 === 1 && (
                  <div>
                    <Box className="availble">
                      <Typography variant="h6" component="h6" className="tx1">
                        Available Tomorrow
                      </Typography>
                      <Typography variant="h6" component="h6" className="tx2">
                        Delhi, Gurugram
                      </Typography>
                      <ul className="time_box">
                        <li>03:00 PM</li>
                        <li>06:00 PM</li>
                        <li>09:00 PM</li>
                      </ul>
                    </Box>
                  </div>
                )}
              </Box>
            </Box>
          </Grid>
        </Grid>
      </Box>
      <Footer />
    </Drprofwrapper>
  );
}
