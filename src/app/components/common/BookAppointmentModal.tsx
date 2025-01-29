import React, { useCallback, useEffect, useState } from "react";
import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";
import { useDispatch, useSelector } from "react-redux";
import { Formik, Form, Field } from "formik";
import * as Yup from "yup";
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
  InputAdornment,
  IconButton,
} from "@mui/material";
import InfoIcon from "@mui/icons-material/Info";
import {
  Assignment as AssignmentIcon,
  CalendarMonth as CalendarMonthIcon
} from "@mui/icons-material";
import ScheduleIcon from "@mui/icons-material/Schedule";
import BookOnlineIcon from "@mui/icons-material/BookOnline";
import ChecklistRtlIcon from "@mui/icons-material/ChecklistRtl";
import CloseIcon from "@mui/icons-material/Close";

import SnackbarComponent from "./Snackbar";
import type { AppDispatch, RootState } from "@/redux/store";
import { useCreateAppointment } from "@/hooks/appointment";
import { useRouter } from "next/navigation";
import { Utility } from "@/utils";
import { DoctorData } from "@/types/doctor";

dayjs.extend(customParseFormat);

const ModalOneSchema = Yup.object().shape({
  appointmentDate: Yup.date()
    .required("Date of Appointment is required")
    .nullable(),
  appointmentTime: Yup.string().required("Appointment Time is required"),
  appointmentType: Yup.string().required("Appointment Type is required"),
  symptomIds: Yup.array()
    .min(1, "At least one symptom is required")
    .required("Symptom is required"),
});

interface AppointmentFormValues {
  symptomIds: any[];
  appointmentDate: string;
  appointmentTime: string;
  appointmentType: string;
}

const initialValues: AppointmentFormValues = {
  symptomIds: [],
  appointmentDate: "",
  appointmentTime: "",
  appointmentType: ""
};

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  data: DoctorData | undefined;
}

const ModalOne: React.FC<ModalProps> = ({ isOpen, onClose, data }) => {
  const [loading, setLoading] = useState<boolean>(false);
  const { snackbar } = useSelector((state: RootState) => state.snackbar);
  const dispatch: AppDispatch = useDispatch();
  const router = useRouter();
  const { capitalizeFirstLetter, decodedToken, getIdsFromObject, snackbarAndNavigate } = Utility();
  // ---- TRACK SELECTED DAY & TIME SLOT IN LOCAL STATE ----
  const [selectedDayName, setSelectedDayName] = useState<string | null>(null);
  const [selectedTimeSlot, setSelectedTimeSlot] = useState<string>("");
  // ---- BUCKETS THAT WILL HOLD MORNING / AFTERNOON / EVENING / NIGHT SLOTS ----
  const [timeBuckets, setTimeBuckets] = useState<{
    morning: string[];
    afternoon: string[];
    evening: string[];
    night: string[];
  }>({ morning: [], afternoon: [], evening: [], night: [] });

  // ---- Whenever selectedDayName changes, generate new time slots from data.availability ----
  useEffect(() => {
    if (!selectedDayName || !data?.availability) {
      setTimeBuckets({ morning: [], afternoon: [], evening: [], night: [] });
      return;
    }

    // Find the entry in availability that matches the chosen weekday
    const dayAvailability = data.availability.find(
      (slot) => slot.day?.toLowerCase() === selectedDayName.toLowerCase()
    );
    if (!dayAvailability) {
      setTimeBuckets({ morning: [], afternoon: [], evening: [], night: [] });
      return;
    }

    // Generate discrete time slots from (startTime, endTime) in steps of 60 min
    const slots = generateTimeSlots(dayAvailability.startTime, dayAvailability.endTime, 60);
    const buckets = { morning: [] as string[], afternoon: [] as string[], evening: [] as string[], night: [] as string[] };
    slots.forEach((slotTime) => {
      const part = getTimeOfDaySlot(slotTime);
      buckets[part].push(slotTime);
    });
    setTimeBuckets(buckets);
  }, [selectedDayName, data?.availability]);

  // ---- Helper: Generate array of times from start->end, e.g. ["07:30 AM","08:30 AM", ...] ----
  function generateTimeSlots(start: string, end: string, stepInMinutes = 60) {
    if (!start || !end) return [];
    let current = dayjs(start.trim(), "HH:mm");
    let endTime = dayjs(end.trim(), "HH:mm");

    const slots: string[] = [];
    while (current <= endTime) {
      slots.push(current.format("hh:mm A")); // e.g. "07:30 AM"
      current = current.add(stepInMinutes, "minute");
    }
    return slots;
  }

  // ---- Helper: Return which “bucket” (morning/afternoon/evening/night) a given "07:30 AM" belongs in ----
  function getTimeOfDaySlot(timeString: string) {
    const hour = dayjs(timeString, "hh:mm A").hour(); // 0–23
    if (hour < 12) return "morning";     // 00:00–11:59
    if (hour < 16) return "afternoon";   // 12:00–15:59
    if (hour < 20) return "evening";     // 16:00–19:59
    return "night";                      // 20:00–23:59
  }

  const { createAppointment } = useCreateAppointment(
    'create-appointment'
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

  const handleTimeSlotClick = (time: string, setFieldValue: Function) => {
    setSelectedTimeSlot(time);
    setFieldValue("appointmentTime", time);
  };

  const handleBookAppointment = useCallback(
    async (values: AppointmentFormValues) => {
      const doctorId = data?._id;
      const patientId = decodedToken()?.id;

      if (!doctorId || !patientId) {
        snackbarAndNavigate(
          dispatch,
          true,
          "error",
          "Missing doctorId or patientId—cannot create appointment",
          null,
          true
        );
        return;
      }
      try {
        const appointmentData = {
          ...values,
          patientId,
          doctorId,
          status: "scheduled",
          symptomIds: getIdsFromObject(values?.symptomIds),
        };

        const response = await createAppointment(appointmentData);
        if (response?.statusCode === 201) {
          snackbarAndNavigate(
            dispatch,
            true,
            "success",
            "Created Successfully",
            null,
            true
          );
        }
      } catch (error: any) {
        const errorMessage =
          error?.response?.data?.message ||
          "Error creating Appointment, please try again.";
        snackbarAndNavigate(
          dispatch,
          true,
          "error",
          errorMessage,
          null,
          true
        );
      } finally {
        setLoading(false);
      }
    },
    [data?._id]
  );

  const priceWrapSx = {
    "& .price_header_txt": {
      fontSize: "1.1rem",
      fontWeight: 600,
      color: "#000",
      lineHeight: "1.2rem",
      padding: "15px 10px",
      background: "#efefef",
    },
    "& .tx1": {
      fontSize: "1.1rem",
      fontWeight: 500,
      color: "#000",
      marginTop: "10px",
    },
    "& .tx2": {
      fontSize: "1rem",
      fontWeight: "normal",
      color: "#1f1f1f",
      marginTop: "5px",
      paddingBottom: "10px",
    },
    "& .tx3": {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      padding: "10px 0px",
      borderTop: "1px solid #bababa",
      "& .spntx1": {
        fontSize: "0.9rem",
        fontWeight: "normal",
        color: "#000",
      },
      "& .spntx2": {
        fontSize: "0.9rem",
        fontWeight: "normal",
        color: "#000",
      },
    },
    "& .tx4": {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      padding: "10px 0px",
      borderTop: "1px solid #bababa",
      "& .spntx1": {
        fontSize: "1rem",
        fontWeight: 500,
        color: "#20ada0",
      },
      "& .spntx2": {
        fontSize: "1rem",
        fontWeight: 500,
        color: "#20ada0",
      },
    },
    "& .prc_contnt": {
      padding: "10px",
      paddingBottom: "0px",
    },
  };

  if (!isOpen) return null;

  return (
    <Modal
      open={isOpen}
      onClose={onClose}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
    >
      {/* Outer Box that wraps the entire Modal content */}
      <Box
        sx={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: "90%",
          maxWidth: "1200px",
          bgcolor: "background.paper",
          border: "2px solid #000",
          boxShadow: 24,
        }}
      >
        {/* ===== ModalHeader ===== */}
        <Box
          sx={{
            padding: "15px 20px",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            borderBottom: "1px solid #ababab",
          }}
        >
          <Typography
            sx={{
              fontSize: "1.25rem",
              fontWeight: 600,
              color: "#20ada0",
            }}
          >
            Book Appointment With {capitalizeFirstLetter(data?.username) || "Doctor"}
          </Typography>
          <CloseIcon sx={{ cursor: "pointer" }} onClick={onClose} />
        </Box>

        <Formik
          initialValues={initialValues}
          validationSchema={ModalOneSchema}
          onSubmit={values => handleBookAppointment(values)}
        >
          {({
            dirty,
            errors,
            touched,
            values,
            isSubmitting,
            setFieldValue,
          }) => (
            <Form>
              {/* ===== ModalBody ===== */}
              <Box
                sx={{
                  overflowX: "auto",
                  maxHeight: "72vh",
                  padding: "10px 20px",
                  marginTop: "15px",
                  "& .locat": {
                    fontSize: "1rem",
                    fontWeight: 300,
                    color: "#000",
                    marginBottom: "20px",
                    display: "flex",
                    alignItems: "center",
                  },
                  "& .time_box": {
                    display: "flex",
                    flexWrap: "wrap",
                    width: "100%",
                    "& li": {
                      marginTop: "10px",
                      fontSize: "0.8rem",
                      fontWeight: 300,
                      lineHeight: "1.2rem",
                      padding: "8px 10px",
                      border: "1px solid #20ada0",
                      borderRadius: "4px",
                      listStyle: "none",
                      marginRight: "10px",
                      cursor: "pointer",
                      color: "black",
                      "&:hover": {
                        background: "#20ada0",
                        color: "white",
                      },
                    },
                  },
                  "& .tx2date": {
                    fontSize: "1rem",
                    fontWeight: 300,
                    color: "#000",
                    marginBottom: "16px",
                    display: "flex",
                    alignItems: "center",
                    "& svg": {
                      marginRight: "7px",
                    },
                  },
                  "& input.Mui-disabled": {
                    opacity: 1,
                    WebkitTextFillColor: "rgb(0 0 0 / 100%)",
                  },
                  "& .MuiFormLabel-filled.Mui-disabled": {
                    color: "rgba(0, 0, 0, 0.6)",
                  },
                  "& .fldset_lgend": {
                    background: "white",
                    marginLeft: "15px",
                    fontSize: "0.7rem",
                    fontWeight: 500,
                    color: "#20ada0",
                    padding: "0px 5px",
                  },
                  "& .fieldset_wrap": {
                    padding: "20px",
                    paddingBottom: "20px",
                    paddingTop: "10px",
                    borderColor: "#efefef",
                    marginBottom: "10px",
                    border: "1px solid #efefef",
                  },
                  "& .MuiPickersTextField": {
                    width: "100%",
                  },
                  "& .pric_tw": {
                    border: "1px solid #b1b1b1",
                  },
                }}
              >
                <Grid container spacing={3}>
                  {/* ===== Left Section  ===== */}
                  <Grid item xs={12} sm={4} md={4}>
                    <Field
                      fullWidth
                      as={TextField}
                      label="Date Of Appointment *"
                      name="appointmentDate"
                      type="date"
                      value={
                        values.appointmentDate ? dayjs(values.appointmentDate).format("YYYY-MM-DD") : ""
                      }
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                        const formattedDate = dayjs(e.target.value).format(
                          "YYYY-MM-DD"
                        );
                        setFieldValue("appointmentDate", formattedDate);
                        const dayName = dayjs(e.target.value).format("dddd");
                        setSelectedDayName(dayName);
                        setSelectedTimeSlot("");
                        setFieldValue("appointmentTime", "");
                      }}
                      InputLabelProps={{ shrink: true }}
                      sx={{
                        position: "relative",
                        "& input[type=date]::-webkit-calendar-picker-indicator": {
                          zIndex: 3,
                          cursor: "pointer",
                        },
                      }}
                      InputProps={{
                        endAdornment: (
                          <InputAdornment
                            position="end"
                            sx={{
                              pointerEvents: "none", // Let clicks pass through
                              position: "absolute",
                              right: "12px",
                              zIndex: 1,
                            }}
                          >
                            <CalendarMonthIcon />
                          </InputAdornment>
                        ),
                      }}
                      error={touched.appointmentDate && Boolean(errors.appointmentDate)}
                      helperText={touched.appointmentDate && errors.appointmentDate}
                    />
                    <FormControl
                      fullWidth
                      error={touched.appointmentType && Boolean(errors.appointmentType)}
                    >
                      <InputLabel> Appointment Type </InputLabel>
                      <Select
                        label="Appointment Type "
                        name="appointmentType"
                        value={values.appointmentType}
                        onChange={(e) => setFieldValue("appointmentType", e.target.value)}
                        startAdornment={
                          <InputAdornment position="start">
                            <InfoIcon color="primary" />
                          </InputAdornment>
                        }
                      >
                        <MenuItem value="online">Online</MenuItem>
                        <MenuItem value="in-person">In-Person</MenuItem>
                      </Select>
                      {touched.appointmentType && errors.appointmentType && (
                        <Typography color="error" variant="body2">
                          {errors.appointmentType}
                        </Typography>
                      )}
                    </FormControl>
                    <Autocomplete
                      multiple
                      disableCloseOnSelect
                      options={data?.symptomIds || []}
                      getOptionLabel={option => option.name}
                      isOptionEqualToValue={(option, value) => option._id === value._id}
                      value={values.symptomIds || undefined}
                      onChange={(event, value) => setFieldValue("symptomIds", value)}
                      sx={{ gridColumn: "span 2" }}
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          label="Symptom *"
                          name="symptomIds"
                          type="text"
                          error={!!touched.symptomIds && !!errors.symptomIds}
                          helperText={
                            touched.symptomIds && typeof errors.symptomIds === "string"
                              ? errors.symptomIds
                              : ""
                          }
                          InputProps={{
                            ...params.InputProps,
                            startAdornment: (
                              <>
                                <InputAdornment position="start">
                                  <AssignmentIcon color="primary" />
                                </InputAdornment>
                                {params.InputProps.startAdornment}
                              </>
                            ),
                          }}
                        />
                      )}
                    />
                  </Grid>
                  <Field type="hidden" name="appointmentTime" />    {/* Hidden Formik Field so Formik tracks appointmenttime errors*/}

                  {/* ===== Middle Section (Dynamic Time Slots) ===== */}
                  <Grid item xs={12} sm={5} md={5}>
                    <Box sx={priceWrapSx}>
                      <Box
                        component="fieldset"
                        className="fieldset_wrap"
                        sx={{ marginTop: "-5px" }}
                      >
                        <legend className="fldset_lgend">Morning Slots</legend>
                        <ul className="time_box">
                          {timeBuckets.morning.map((time) => (
                            <li
                              key={time}
                              onClick={() => handleTimeSlotClick(time, setFieldValue)}
                              style={{
                                background: selectedTimeSlot === time ? "#20ada0" : "",
                                color: selectedTimeSlot === time ? "white" : "black",
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
                          {timeBuckets.afternoon.map((time) => (
                            <li
                              key={time}
                              onClick={() => handleTimeSlotClick(time, setFieldValue)}
                              style={{
                                background: selectedTimeSlot === time ? "#20ada0" : "",
                                color: selectedTimeSlot === time ? "white" : "black",
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
                          {timeBuckets.evening.map((time) => (
                            <li
                              key={time}
                              onClick={() => handleTimeSlotClick(time, setFieldValue)}
                              style={{
                                background: selectedTimeSlot === time ? "#20ada0" : "",
                                color: selectedTimeSlot === time ? "white" : "black",
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
                          {timeBuckets.night.map((time) => (
                            <li
                              key={time}
                              onClick={() => handleTimeSlotClick(time, setFieldValue)}
                              style={{
                                background: selectedTimeSlot === time ? "#20ada0" : "",
                                color: selectedTimeSlot === time ? "white" : "black",
                              }}
                            >
                              {time}
                            </li>
                          ))}
                        </ul>
                      </Box>
                    </Box>
                    {touched.appointmentTime && errors.appointmentTime && (
                      <Typography color="error" variant="body2" paddingLeft='38px'>
                        {errors.appointmentTime}
                      </Typography>
                    )}
                  </Grid>

                  {/* ===== Right Section (Price/Consultation Details) ===== */}
                  <Grid item xs={12} sm={3} md={3}>
                    <Box sx={{ ...priceWrapSx, border: "1px solid #b1b1b1" }}>
                      <Typography className="price_header_txt">
                        Consultation Details
                      </Typography>
                      <Box className="prc_contnt">
                        <Typography className="tx1">
                          {capitalizeFirstLetter(data?.username) || "Doctor"}
                        </Typography>
                        <Typography className="tx3">
                          <span className="spntx1">Price</span>
                          <span className="spntx2">
                            {(values.appointmentDate && values.appointmentTime && values.symptomIds.length > 0
                              && values.appointmentType) ? `₹${data?.consultationFee}` : "--"}
                          </span>
                        </Typography>
                        <Typography className="tx4">
                          <span className="spntx1">Total</span>
                          <span className="spntx2">
                            {(values.appointmentDate && values.appointmentTime && values.symptomIds.length > 0
                              && values.appointmentType) ? `₹${data?.consultationFee}` : "--"}
                          </span>
                        </Typography>
                      </Box>
                    </Box>
                  </Grid>
                </Grid>
              </Box>

              {/* ===== ModalFooter ===== */}
              <Box
                sx={{
                  padding: "15px 20px",
                  borderTop: "1px solid #ababab",
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  "& .footer_btn_wrp": {
                    display: "flex",
                    justifyContent: "center",
                  },
                }}
              >
                <Box className="footer_btn_wrp">
                  <Button
                    disabled={!dirty || isSubmitting}
                    variant="contained"
                    type="submit"
                    sx={{
                      minWidth: "150px",
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
                    <BookOnlineIcon sx={{ marginRight: 1 }} />
                    Book Now
                  </Button>
                  <Button
                    onClick={onClose}
                    variant="contained"
                    sx={{
                      minWidth: "150px",
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
                    Cancel
                  </Button>
                </Box>
              </Box>
            </Form>
          )}
        </Formik>
        <SnackbarComponent
          alerting={snackbar.snackbarAlert}
          severity={snackbar.snackbarSeverity}
          message={snackbar.snackbarMessage}
          onClose={handleSnackbarClose}
        />
      </Box>
    </Modal>
  );
}

export default ModalOne;
