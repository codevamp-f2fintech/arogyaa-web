"use client";

import Link from "next/link";
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
  TextField,
} from "@mui/material";
import styled from "styled-components";
import Header from "../../components/common/Topbar";
import Footer from "../../components/common/Footer";
import { useGetdoctorlist } from "@/hooks/doctorlist";

export default function BasicSelect() {
  const [selectedValue, setSelectedValue] = useState("");

  const handleChange = (event) => {
    setSelectedValue(event.target.value);
  };

  const {
    data: doctorList,
    swrLoading,
    error,
  } = useGetdoctorlist([], "http://localhost:5050/api/doctor/get");

  const DoctorList = styled.div`
    padding: 50px;
    margin-top: 40px;
    padding-bottom: 0;
  `;
  const DocListItem = styled.div`
    .box_wrp {
      display: flex;
      margin-top: 15px;
    }
    .dr_cir_canv {
      width: 160px;
      height: auto;
      border: 4px solid #20ada0;
    }
    .dr_cir_canv_wrp {
      padding: 20px;
      border-radius: 20px;
      display: flex;
      align-items: center;
    }
    .exp_hrlne {
      margin: 0px 10px;
    }
    .dr_cap {
    }

    .dr_cap .t1 {
      font-size: 1.25rem;
      font-weight: 600;
      color: black;
      line-height: 1.5rem;
      margin-bottom: 10px;
    }
    .dr_cap .t2 {
      font-size: 0.9rem;
      font-weight: 400;
      color: gray;
      line-height: 1.2rem;
      margin-top: 5px;
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
    .star_ico_wrp {
      display: flex;
      align-items: center;
      margin-top: 20px;
    }
    .star_ico_wrp .star_ico {
      width: 24px;
      width: 24px;
      margin-right: 3px;
    }
    .exp_hrlne {
      color: gray;
    }
    .star_ico_wrp .t3 {
      font-size: 0.9rem;
      font-weight: 400;
      color: gray;
      line-height: 1.2rem;
    }
    .dr_action {
      display: flex;
      flex-direction: column;
      min-width: 200px;
    }
    .dr_action .t1 {
      font-size: 0.9rem;
      font-weight: 600;
      color: #354c5c;
      line-height: 1.2rem;
    }
    .dr_action span {
      color: #20ada0;
    }
    .dr_cat_action_wrp {
      display: flex;
      justify-content: space-between;
      width: 100%;
      padding: 20px;
    }
  `;
  const DrFilter = styled.div`
    margin-bottom: 10px;
    .filter_opt {
      font-size: 0.8rem;
      font-weight: 400;
      color: #354c5c;
      line-height: 1.2rem;
    }
    li {
      font-size: 0.8rem;
      font-weight: 400;
      color: #354c5c;
      line-height: 1.2rem;
    }
  `;
  const DrlistCol2 = styled.div`
    padding: 10px;
    background: white;
    margin-top: 15px;
    .t1 {
      color: #20ada0;
      font-size: 1rem;
      font-weight: bold;
    }
    .t2 {
      color: black;
      font-size: 0.9rem;
      font-weight: 400;
      margin-top: 10px;
    }
    .ul_li {
      margin-top: 10px;
    }
    .ul_li li {
      color: gray;
      font-size: 0.8rem;
      font-weight: 400;
      list-style: none;
      margin-top: 5px;
    }
  `;
  const DrlistForm = styled.div`
    margin-top: 15px;
    background: white;
    padding: 10px;
    input {
      width: 100%;
    }
    .txt1 {
      color: #20ada0;
      font-size: 1.25rem;
      font-weight: bold;
      list-style: none;
      margin-top: 5px;
      text-align: center;
    }
    .txt2 {
      color: gray;
      font-size: 0.8rem;
      font-weight: 400;
      list-style: none;
      margin-top: 5px;
      text-align: center;
      margin-bottom: 20px;
    }
    inputsize {
      height: 30px;
    }
  `;

  if (swrLoading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error loading doctor list: {error.message}</div>;
  }

  return (
    <DoctorList>
      <Header />
      <DrFilter>
        <Paper sx={{ padding: "10px" }}>
          <Grid container spacing={3}>
            <Grid item xs={12} sm={6} md={2}>
              <FormControl variant="standard" sx={{ width: "100%" }}>
                <InputLabel id="demo-simple-select-standard-label">
                  Gender
                </InputLabel>
                <Select
                  labelId="demo-simple-select-standard-label"
                  id="demo-simple-select-standard"
                  value={selectedValue}
                  onChange={handleChange}
                  label="Gender"
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
              <FormControl variant="standard" sx={{ width: "100%" }}>
                <InputLabel id="exp">Experience</InputLabel>
                <Select
                  labelId="exp"
                  id="demo-simple-select-standard1"
                  value={selectedValue}
                  onChange={handleChange}
                  label="Experience"
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
              <FormControl variant="standard" sx={{ width: "100%" }}>
                <InputLabel id="fee">Fees</InputLabel>
                <Select
                  labelId="fee"
                  id="demo-simple-select-standard3"
                  value={selectedValue}
                  onChange={handleChange}
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
              <Button
                variant="contained"
                sx={{
                  width: "auto",
                  marginTop: "8px",
                  color: "#fff",
                  background: "#20ADA0",
                  borderRadius: "4px",
                  ":hover": {
                    bgcolor: "#20ADA0",
                    color: "white",
                  },
                }}
              >
                Filter
              </Button>
            </Grid>
          </Grid>
        </Paper>
      </DrFilter>

      {/* Doctor list */}
      <DocListItem>
        <Grid container spacing={3}>
          <Grid item xs={12} sm={8} md={8}>
            {doctorList.map((doctor) => (
              <Paper className="box_wrp" key={doctor._id}>
                <Box className="dr_cir_canv_wrp">
                  <Box
                    component="img"
                    className="dr_cir_canv"
                    alt={doctor.username}
                    // You can use a placeholder image if no image URL is provided in the API
                    src={"../assets/images/drRanjanaSharma.jpg"}
                  />
                </Box>
                <Box className="dr_cat_action_wrp">
                  <Box className="dr_cap">
                    <Typography variant="h4" component="h4" className="t1">
                      {doctor.username || "Unknown Doctor"}
                    </Typography>
                    {/* Replace bio with specializationId and qualificationIds */}
                    <Typography variant="h6" component="h6" className="t2">
                      Specialization:{" "}
                      {doctor.specializationId?.join(", ") || "Not available"}
                    </Typography>
                    <Typography variant="h6" component="h6" className="t2">
                      Qualifications:{" "}
                      {doctor.qualificationIds?.join(", ") || "Not available"}
                    </Typography>
                    <Box className="expr">
                      <Typography variant="h6" component="span" className="t3">
                        {doctor.experienceYears
                          ? `${doctor.experienceYears} years of experience`
                          : "Experience not available"}
                      </Typography>
                      <span className="exp_hrlne">|</span>
                      <Typography variant="h6" component="span" className="t3">
                        {doctor.languages
                          ? doctor.languages.join(", ")
                          : "Languages not available"}
                      </Typography>
                    </Box>
                    <Box className="star_ico_wrp">
                      <Typography variant="h6" component="span" className="t3">
                        {doctor.rating || "No rating available"}
                      </Typography>
                      <span className="exp_hrlne">|</span>
                      {[...Array(4)].map((_, index) => (
                        <Box
                          key={index}
                          component="img"
                          className="star_ico"
                          alt="Rating Star"
                          src={"../assets/images/star-fill.png"}
                        />
                      ))}
                      <Box
                        component="img"
                        className="star_ico"
                        alt="Half Rating Star"
                        src={"../assets/images/half-star.png"}
                      />
                    </Box>
                  </Box>
                  <Box className="dr_action">
                    <Typography variant="h6" component="span" className="t1">
                      Consultation Fee{" "}
                      <span>₹{doctor.consultationFee || 500}</span>
                    </Typography>
                    <Link
                      href={`/doctor/profile?id=${doctor._id}`}
                      className="dr_action"
                      passHref
                    >
                      <Button
                        variant="contained"
                        sx={{
                          marginTop: 2,
                          width: "auto",
                          color: "#fff",
                          background: "#20ADA0",
                          ":hover": {
                            bgcolor: "#20ADA0",
                            color: "white",
                          },
                        }}
                      >
                        view profile
                      </Button>
                    </Link>
                    <Button
                      variant="contained"
                      sx={{
                        marginTop: 2,
                        width: "auto",
                        color: "#fff",
                        background: "#20ADA0",
                        ":hover": {
                          bgcolor: "#20ADA0",
                          color: "white",
                        },
                      }}
                    >
                      Book Appointment
                    </Button>
                  </Box>
                </Box>
              </Paper>
            ))}
          </Grid>

          {/* Right Column Content */}
          <Grid item xs={12} sm={4} md={4}>
            <DrlistCol2>
              <Typography className="t1">
                Book an Appointment with Expert Dietitians
              </Typography>
              <Typography className="t2">
                Diet Consultation @Rs.299 Only
              </Typography>
              <ul className="ul_li">
                <li>With over 50+ expert Dietitians</li>
                <li>Get personalized diet plan</li>
              </ul>
            </DrlistCol2>
            <DrlistForm>
              <Typography className="txt1">We are Here to Help!</Typography>
              <Typography className="txt2">
                Get instant call back in few mins
              </Typography>
              <FormControl fullWidth>
                <TextField
                  id="outlined-basic"
                  label="Enter Name"
                  variant="outlined"
                  inputProps={{
                    style: { fontSize: ".8rem" },
                  }}
                  InputLabelProps={{
                    style: { fontSize: ".8rem" },
                  }}
                />
                <TextField
                  id="outlined-basic"
                  label="Enter Phone Number"
                  variant="outlined"
                  sx={{ marginTop: "10px", marginBottom: "10px" }}
                  inputProps={{
                    style: { fontSize: ".8rem" },
                  }}
                  InputLabelProps={{
                    style: { fontSize: ".8rem" },
                  }}
                />

                <TextField
                  id="outlined-select-currency"
                  select
                  label="Select"
                  defaultValue=""
                  helperText="Please select your Location"
                  sx={{ fontSize: ".8rem" }}
                >
                  {currencies.map((option) => (
                    <MenuItem key={option.location} value={option.location}>
                      {option.location}
                    </MenuItem>
                  ))}
                </TextField>
                <Button
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
                  Book Now
                </Button>
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
    drsrc: "../assets/images/drRanjanaSharma.jpg",
    name: "Dr. Ranjana Sharma",
    type: "General Physician",
    work: "MS GR Medical College, Gwalior",
    exep: "42+ years of experience",
    lang: "Hindi, English, Bit of Arabic",
    rating: "Rating 4.5",
    button1: "View Profile",
    button2: "Book Appointment",
    onsultationfee: "Consultation Fees",
    rs: "500",
  },
  {
    drsrc: "../assets/images/drNidhiSharma.jpg",
    name: "Dr. Nidhi Sharma",
    type: "General Physician",
    work: "MS (Obgyn) PGIMS, Rohtak",
    exep: "13+ years of experience",
    lang: "Speaks Hindi, English, French, Punjabi, Marathi",
    rating: "Rating 4.5",
    button1: "View Profile",
    button2: "Book Appointment",
    onsultationfee: "Consultation Fees",
    rs: "700",
  },
  {
    drsrc: "../assets/images/niranjanaDr.jpg",
    name: "Dr.Niranjana Jayakrishnan",
    type: "General Physician",
    work: "MD Amrita Vishwa Vidyapeetham University, Kochi",
    exep: "13+ years of experience",
    lang: "Speaks Hindi, English, French, Punjabi, Marathi",
    rating: "Rating 4.5",
    button1: "View Profile",
    button2: "Book Appointment",
    onsultationfee: "Consultation Fees",
    rs: "1000",
  },
];

const currencies = [
  {
    location: "Haldwani",
  },
  {
    location: "Dehradun",
  },
];
