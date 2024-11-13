// components/Modal.tsx
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import styled from "styled-components";
import {
  TextField,
  Button,
  Stack,
  Box,
  Modal,
  Typography,
  Grid,
  FormControl,
  Select,
  MenuItem,
  InputLabel,
  Autocomplete,
  SelectChangeEvent,
} from "@mui/material";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import ScheduleIcon from "@mui/icons-material/Schedule";
import BookOnlineIcon from "@mui/icons-material/BookOnline";
import ChecklistRtlIcon from "@mui/icons-material/ChecklistRtl";
import CloseIcon from "@mui/icons-material/Close";

import SnackbarComponent from "./Snackbar";
import type { AppDispatch, RootState } from "@/redux/store";
import { useCreateAppointment } from "@/hooks/appointment";
import { useRouter } from "next/navigation";
import { Utility } from "@/utils";
import { Formik } from "formik";
import * as Yup from "yup";

const ModalOneSchema = Yup.object().shape({
  name: Yup.string()

    .min(2, "name is too short!")
    .max(20, "name is too long!")
    .required("name is required"),
  age: Yup.number()
    .typeError("Age must be a number")
    .min(0, "Age must be at least 0")
    .max(120, "Age must be at most 120")
    .required("Age is required"),
  phoneNumber: Yup.string()
    .typeError("Phone Number must be a number")
    .min(10, "Phone Number must be at least 10")
    .max(10, "Phone Number must be at most 10")
    .required("Phone Number is requred"),
  gender: Yup.string(),
  appointmentDate: Yup.date()
    .required("Date of Appointment is required")
    .nullable(),
});

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
}
const ModalHeader = styled.div`
  padding: 15px 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px solid #ababab;
  .tx1 {
    font-size: 1.25rem;
    font-weight: 600;
    color: #20ada0;
  }
  .tx2 {
    font-size: 1.1rem;
    font-weight: 300;
    color: #000;
  }
  .tx2 span {
    font-size: 1.1rem;
    font-weight: 600;
    color: #20ada0;
  }
`;
const ModalBody = styled.div`
  overflow-x: auto;
  max-height: 72vh;
  padding: 10px 20px;
  margin-top: 15px;
  .locat {
    font-size: 1rem;
    font-weight: 300;
    color: #000;
    margin-bottom: 20px;
    display: flex;
    align-items: center;
  }
  .time_box {
    display: flex;
    flex-wrap: wrap;
    width: 100%;
  }
  .time_box li {
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
  .time_box li:hover {
    cursor: pointer;
    background: #20ada0;
    color: white;
  }
  .tx2date {
    font-size: 1rem;
    font-weight: 300;
    color: #000;
    margin-bottom: 16px;
    display: flex;
    align-items: center;
  }
  .tx2date svg {
    margin-right: 7px;
  }
  input.Mui-disabled {
    opacity: 1;
    -webkit-text-fill-color: rgb(0 0 0 / 100%);
  }
  .MuiFormLabel-filled.Mui-disabled {
    color: rgba(0, 0, 0, 0.6);
  }
  .fldset_lgend {
    background: white;
    margin-left: 15px;
    font-size: 0.7rem;
    font-weight: 500;
    color: #20ada0;
    padding: 0px 5px;
  }
  .fieldset_wrap {
    padding: 20px;
    padding-bottom: 20px;
    padding-top: 10px;
    border-color: #efefef;
    margin-bottom: 10px;
  }
  .MuiPickersTextField {
    width: 100%;
  }
  .pric_tw {
    border: 1px solid #b1b1b1;
  }
`;
const ModalFooter = styled.div`
  padding: 15px 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-top: 1px solid #ababab;
  display: flex;
  justify-content: center;
  .footer_btn_wrp {
    display: flex;
    justify-content: center;
  }
`;
const Pricewrap = styled.div`
  .price_header_txt {
    font-size: 1.1rem;
    font-weight: 600;
    color: #000;
    line-height: 1.2rem;
    padding: 15px 10px;
    background: #efefef;
  }
  .tx1 {
    font-size: 1.1rem;
    font-weight: 500;
    color: #000000;
    margin-top: 10px;
  }
  .tx2 {
    font-size: 1rem;
    font-weight: normal;
    color: #1f1f1f;
    margin-top: 5px;
    padding-bottom: 10px;
  }
  .tx3 {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 10px 0px;
    border-top: 1px solid #bababa;
  }
  .tx3 .spntx1 {
    font-size: 0.9rem;
    font-weight: normal;
    color: #000;
  }
  .tx3 .spntx2 {
    font-size: 0.9rem;
    font-weight: normal;
    color: #000;
  }
  .tx4 {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 10px 0px;
    border-top: 1px solid #bababa;
  }
  .tx4 .spntx1 {
    font-size: 1rem;
    font-weight: 500;
    color: #20ada0;
  }
  .tx4 .spntx2 {
    font-size: 1rem;
    font-weight: 500;
    color: #20ada0;
  }
  .prc_contnt {
    padding: 10px;
    padding-bottom: 0px;
  }
`;

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
}

function ModalOne({ isOpen, onClose }: ModalProps) {
  const [Gender, setGender] = useState("");
  const [name, setFirstName] = useState("");
  const [age, setAge] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [symptoms, setSymptoms] = useState([]);
  const [appointmentDate, setAppointmentDate] = useState<Date | null>(null);
  const [selectedTimeSlot, setSelectedTimeSlot] = useState<string | null>(null);
  const { snackbar } = useSelector((state: RootState) => state.snackbar);

  const dispatch: AppDispatch = useDispatch();
  const router = useRouter();
  const { snackbarAndNavigate } = Utility();

  const { createdAppointment, createAppointment } = useCreateAppointment(
    `${process.env.NEXT_PUBLIC_APPOINTMENT_URL}/appointments/create-appointments`
  );

  // Define the snackbar close handler
  const handleSnackbarClose = (
    event?: React.SyntheticEvent | Event,
    reason?: string
  ) => {
    if (reason === "clickaway") {
      return;
    }
  };

  const handleChange = (event: SelectChangeEvent) => {
    setGender(event.target.value as string);
  };

  const handleTimeSlotClick = (time: string) => {
    setSelectedTimeSlot(time);
  };

  const handleBookNowClick = async () => {
    if (!appointmentDate) {
      snackbarAndNavigate(
        dispatch,
        true,
        "error",
        "Please select an appointment date."
      );
      return;
    }

    if (!selectedTimeSlot) {
      snackbarAndNavigate(
        dispatch,
        true,
        "error",
        "Please select a time slot."
      );

      return;
    }

    await createNewAppointment(appointmentDate);
    snackbarAndNavigate(dispatch, true, "success", "Successfully got");
  };

  async function createNewAppointment(appointmentTime) {
    const doctorId = "67064426c3f5d295a53132bf";
    const patientId = "6706303eda4bfa3afd2962dd";

    try {
      const appointmentData = {
        patientId,
        doctorId,
        appointmentTime,
        status: "scheduled",
      };
      await createAppointment(appointmentData);
    } catch (error) {
      console.error("Error creating appointment:", error);
      return false; // Return false in case of error
    }
  }

  useEffect(() => {
    if (createdAppointment) {
      console.log("createdAppointment", createdAppointment);
      if (createdAppointment.status === "scheduled") {
        snackbarAndNavigate(dispatch, true, "warning", "Successfully got");

        router.push("/"); // Redirect to the homepage
      } else {
        snackbarAndNavigate(dispatch, true, "warning", "Successfully got");
      }
    }
  }, [createdAppointment]);

  if (!isOpen) return null;

  console.log("appointmentDate", appointmentDate);

  function handleSignup(values: {
    name: string;
    age: string;
    gender: string;
    phoneNumber: string;
  }) {
    throw new Error("Function not implemented.");
  }

  return (
    <>
      <Modal
        open={isOpen}
        onClose={onClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <ModalHeader>
            <Typography id="" variant="h6" component="h2" className="tx1">
              Book Appointment
            </Typography>
            <CloseIcon sx={{ cursor: "pointer" }} onClick={onClose} />
          </ModalHeader>
          <ModalBody>
            <Grid container spacing={3}>
              <Grid item xs={12} sm={4} md={4}>
                {/* <Typography className='locat'>
                                <LocationOnIcon /> St John’s Medical College Bangalore
                            </Typography> */}
                <Formik
                  initialValues={{
                    name: "",
                    age: "",
                    gender: "",
                    phoneNumber: "",
                    appointmentDate: null,
                    // role: "sales",
                  }}
                  validationSchema={ModalOneSchema}
                  onSubmit={async (values, { setSubmitting, resetForm }) => {
                    setSubmitting(true);
                    await handleSignup(values);
                    setSubmitting(false);
                    resetForm();
                  }}
                >
                  {({
                    values,
                    errors,
                    touched,
                    handleChange,
                    handleBlur,
                    isSubmitting,
                    dirty,
                  }) => (
                    <form>
                      <Stack
                        spacing={2}
                        direction="row"
                        sx={{ marginBottom: 2 }}
                      >
                        <TextField
                          type="text"
                          variant="outlined"
                          color="primary"
                          label="Name"
                          name="name" // Formik field name
                          value={values.name} // Set value from Formik's values
                          onChange={handleChange} // Use Formik's handleChange
                          onBlur={handleBlur} // Use Formik's handleBlur for touch handling
                          fullWidth
                          required
                          error={touched.name && Boolean(errors.name)} // Show error based on touched and errors
                          helperText={touched.name && errors.name} // Display error message
                        />
                      </Stack>
                      <Stack
                        spacing={2}
                        direction="row"
                        sx={{ marginBottom: 2 }}
                      >
                        <TextField
                          type="text"
                          variant="outlined"
                          color="primary"
                          label="Age"
                          name="age"
                          value={values.age}
                          onChange={handleChange} // Use Formik's handleChange
                          onBlur={handleBlur} // Use Formik's handleBlur for touch handling
                          fullWidth
                          required
                          error={touched.age && Boolean(errors.age)} // Show error based on touched and errors
                          helperText={touched.age && errors.age}
                        />
                        <FormControl fullWidth>
                          <InputLabel id="demo-simple-select-label">
                            Gender
                          </InputLabel>
                          <Select
                            labelId="demo-simple-select-label"
                            id="demo-simple-select"
                            name="gender"
                            value={values.gender}
                            label="Gender"
                            onChange={handleChange}
                            onBlur={handleBlur} // Use Formik's handleBlur for touch handling
                            fullWidth
                            required
                            error={touched.gender && Boolean(errors.gender)} // Show error based on touched and errors
                            // helperText={touched.gender && errors.gender}
                          >
                            <MenuItem value="male">Male</MenuItem>
                            <MenuItem value="female">Female</MenuItem>
                            <MenuItem value="other">Other</MenuItem>
                          </Select>
                        </FormControl>
                      </Stack>

                      <TextField
                        type="number"
                        variant="outlined"
                        color="primary"
                        label="Phone Number"
                        name="phoneNumber"
                        value={values.phoneNumber}
                        onChange={handleChange} // Use Formik's handleChange
                        onBlur={handleBlur} // Use Formik's handleBlur for touch handling
                        fullWidth
                        required
                        error={
                          touched.phoneNumber && Boolean(errors.phoneNumber)
                        } // Show error based on touched and errors
                        helperText={touched.phoneNumber && errors.phoneNumber}
                      />
                      <FormControl fullWidth>
                        <LocalizationProvider dateAdapter={AdapterDayjs}>
                          <DatePicker
                            label="Choose Date of Appointment"
                            value={values.appointmentDate}
                            onChange={(newValue) => {
                              setFieldValue("appointmentDate", newValue);
                            }}
                            renderInput={(params) => (
                              <TextField
                                {...params}
                                fullWidth
                                error={
                                  touched.appointmentDate &&
                                  Boolean(errors.appointmentDate)
                                }
                                helperText={
                                  touched.appointmentDate &&
                                  errors.appointmentDate
                                }
                              />
                            )}
                          />
                        </LocalizationProvider>
                      </FormControl>
                      <FormControl fullWidth sx={{ marginTop: "15px" }}>
                        <MultiSelect
                          symptoms={symptoms}
                          setSymptoms={setSymptoms}
                        />
                      </FormControl>
                    </form>
                  )}
                </Formik>
              </Grid>
              <Grid item xs={12} sm={5} md={5}>
                <Pricewrap>
                  {/* <Typography className='tx2date'>
                                <ChecklistRtlIcon />40 Slots Available
                            </Typography> */}
                  <Box
                    component="fieldset"
                    className="fieldset_wrap"
                    sx={{ marginTop: "-5px" }}
                  >
                    <legend className="fldset_lgend">Morning Slots</legend>
                    <ul className="time_box">
                      {["03:00 AM", "06:00 AM", "09:00 AM"].map((time) => (
                        <li
                          key={time}
                          onClick={() => handleTimeSlotClick(time)}
                          style={{
                            background:
                              selectedTimeSlot === time ? "#20ada0" : "",
                            color:
                              selectedTimeSlot === time ? "white" : "black",
                          }}
                        >
                          {time}
                        </li>
                      ))}
                    </ul>
                  </Box>
                  <Box component="fieldset" className="fieldset_wrap">
                    <legend className="fldset_lgend">Afternoon Slots</legend>
                    <ul className="time_box">
                      {["12:00 PM", "03:00 PM", "05:00 PM"].map((time) => (
                        <li
                          key={time}
                          onClick={() => handleTimeSlotClick(time)}
                          style={{
                            background:
                              selectedTimeSlot === time ? "#20ada0" : "",
                            color:
                              selectedTimeSlot === time ? "white" : "black",
                          }}
                        >
                          {time}
                        </li>
                      ))}
                    </ul>
                  </Box>
                  <Box component="fieldset" className="fieldset_wrap">
                    <legend className="fldset_lgend">Evening Slots</legend>
                    <ul className="time_box">
                      {["06:00 PM", "07:00 PM", "08:00 PM"].map((time) => (
                        <li
                          key={time}
                          onClick={() => handleTimeSlotClick(time)}
                          style={{
                            background:
                              selectedTimeSlot === time ? "#20ada0" : "",
                            color:
                              selectedTimeSlot === time ? "white" : "black",
                          }}
                        >
                          {time}
                        </li>
                      ))}
                    </ul>
                  </Box>
                  <Box component="fieldset" className="fieldset_wrap">
                    <legend className="fldset_lgend">Night Slots</legend>
                    <ul className="time_box">
                      {["09:00 PM", "10:00 PM", "11:00 PM"].map((time) => (
                        <li
                          key={time}
                          onClick={() => handleTimeSlotClick(time)}
                          style={{
                            background:
                              selectedTimeSlot === time ? "#20ada0" : "",
                            color:
                              selectedTimeSlot === time ? "white" : "black",
                          }}
                        >
                          {time}
                        </li>
                      ))}
                    </ul>
                  </Box>
                </Pricewrap>
              </Grid>
              <Grid item xs={12} sm={3} md={3}>
                <Pricewrap className="pric_tw">
                  <Typography className="price_header_txt">
                    Consultation Details
                  </Typography>
                  <Box className="prc_contnt">
                    <Typography className="tx1">Dr. Ranjana Sharma</Typography>
                    <Typography className="tx2">Fever</Typography>
                    <Typography className="tx3">
                      <span className="spntx1">Price</span>
                      <span className="spntx2">$ 500</span>
                    </Typography>
                    <Typography className="tx4">
                      <span className="spntx1">Total</span>
                      <span className="spntx2">$ 500</span>
                    </Typography>
                  </Box>
                </Pricewrap>
              </Grid>
            </Grid>
          </ModalBody>
          <ModalFooter>
            <Box className="footer_btn_wrp">
              <Button
                variant="contained"
                sx={{
                  width: "auto",
                  minWidth: "150px",
                  color: "#fff",
                  background: "#20ADA0",
                  borderRadius: "4px",
                  marginLeft: "20px",
                  ":hover": {
                    bgcolor: "#20ADA0", // theme.palette.primary.main
                    color: "white",
                  },
                }}
                onClick={handleBookNowClick}
              >
                <BookOnlineIcon sx={{ marginRight: 1 }} />
                Book Now
              </Button>
              <Button
                onClick={onClose}
                variant="contained"
                sx={{
                  width: "auto",
                  minWidth: "150px",
                  color: "#fff",
                  background: "#20ADA0",
                  borderRadius: "4px",
                  marginLeft: "20px",
                  ":hover": {
                    bgcolor: "#20ADA0", // theme.palette.primary.main
                    color: "white",
                  },
                }}
              >
                Cancel
              </Button>
            </Box>
          </ModalFooter>
        </Box>
      </Modal>
      <SnackbarComponent
        alerting={snackbar.snackbarAlert}
        severity={snackbar.snackbarSeverity}
        message={snackbar.snackbarMessage}
        onClose={handleSnackbarClose}
      />
    </>
  );
}
const style = {
  position: "absolute" as "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: "90%",
  maxWidth: "1200px",
  bgcolor: "background.paper",
  border: "2px solid #000",
  boxShadow: 24,
};

const styles = {
  modalOverlay: {
    position: "fixed" as "fixed",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    backgroundColor: "rgba(0, 0, 0, 0.8)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 1000,
  },
  modalContent: {
    backgroundColor: "#fff",
    padding: "20px",
    borderRadius: "10px",
    maxWidth: "1000px",
    width: "100%",
    textAlign: "center" as "center",
  },
  closeButton: {
    marginTop: "20px",
  },
};

export default ModalOne;

interface MultiSelectProps {
  symptoms: string[];
  setSymptoms: React.Dispatch<React.SetStateAction<string[]>>;
}

const MultiSelect = ({ symptoms, setSymptoms }: MultiSelectProps) => {
  const options = [
    { title: "Fever" },
    { title: "Cold" },
    { title: "Cough" },
    { title: "Headache" },
  ];

  return (
    <Autocomplete
      multiple
      options={options}
      getOptionLabel={(option) => option.title}
      value={options.filter((option) => symptoms.includes(option.title))} // Ensure the selected values are shown
      onChange={(event, newValue) => {
        setSymptoms(newValue.map((option) => option.title)); // Map the selected options to their titles
      }}
      renderInput={(params) => (
        <TextField
          {...params}
          variant="outlined"
          label="Select Symptoms"
          placeholder="Options"
        />
      )}
    />
  );
};
