"use client";

import React, { useEffect, useState } from "react";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import {
  Autocomplete,
  Box,
  Button,
  CircularProgress,
  Grid,
  InputAdornment,
  MenuItem,
  Modal,
  TextField,
  Typography,
} from "@mui/material";
import LocalHospitalIcon from "@mui/icons-material/LocalHospital";
import MyLocationIcon from "@mui/icons-material/MyLocation";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import InfoIcon from "@mui/icons-material/Info";
import SearchIcon from "@mui/icons-material/Search";
import { useRouter } from "next/navigation";
import { fetcher, creator } from "@/apis/apiClient";
import { Utility } from "@/utils";
import { useCreateAppointment } from "@/hooks/appointment";

/* ---------- Shared Styles ---------- */
const inputStyles = {
  fontFamily: "Poppins",
  backgroundColor: "transparent",
  "& .MuiInputBase-root": {
    fontFamily: "Poppins",
    backgroundColor: "transparent",
  },
  "& .MuiInputLabel-root": {
    color: "#29175E",
    fontFamily: "Poppins",
    "&.Mui-focused": { color: "#29175E" },
  },
  "& .MuiOutlinedInput-root": {
    fontFamily: "Poppins",
    "& fieldset": { borderColor: "#29175E" },
    "&:hover fieldset": { borderColor: "#29175E" },
    "&.Mui-focused fieldset": { borderColor: "#29175E" },
  },
  input: { fontFamily: "Poppins" },
} as const;

const shellBoxSx = {
  position: "absolute" as const,
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: "90%",
  maxWidth: "900px",
  background: "#beb0e1",
  boxShadow: 24,
  borderRadius: "8px",
  overflow: "hidden",
};

const sectionBoxSx = { p: 2, maxHeight: "72vh", overflowY: "auto" };
const footerSx = {
  borderTop: "1px solid #ababab",
  p: 1.5,
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
};

/* ---------- Types ---------- */
type Speciality = { _id: string; name: string };
export type AppointmentType = "online" | "in-person";
export type DurationOpt = 10 | 15 | 20 | 30 | 45 | 60;

interface EmergencySearchValues {
  speciality?: Speciality | null;
  appointmentType: AppointmentType | "";
  location: string;
  duration: DurationOpt | "";
}

/* ---------- Validation ---------- */
const EmergencySearchSchema = Yup.object().shape({
  speciality: Yup.object().nullable().required("Speciality is required"),
  appointmentType: Yup.string()
    .oneOf(["online", "in-person"])
    .required("Type is required"),
  location: Yup.string().trim().required("Location is required"),
  duration: Yup.number()
    .oneOf([10, 15, 20, 30, 45, 60])
    .required("Duration is required"),
});

/* ============================================================
 * 1) EmergencySearchModal
 * ============================================================ */
interface EmergencySearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSearch?: (payload: {
    specialityId: string;
    appointmentType: AppointmentType;
    location: string;
    duration: DurationOpt;
  }) => Promise<void> | void;
}

export const EmergencySearchModal: React.FC<EmergencySearchModalProps> = ({
  isOpen,
  onClose,
  onSearch,
}) => {
  const { decodedToken } = Utility();
  const router = useRouter();
  const [specialities, setSpecialities] = useState<Speciality[]>([]);
  const [loadingSpecs, setLoadingSpecs] = useState(false);

  useEffect(() => {
    if (!isOpen) return;
    const load = async () => {
      try {
        setLoadingSpecs(true);
        const res = await fetcher(
          "speciality",
          "get-specialities?page=1&limit=200"
        );
        setSpecialities(res?.results || []);
      } catch (e) {
        console.error("Failed to load specialities", e);
      } finally {
        setLoadingSpecs(false);
      }
    };
    load();
  }, [isOpen]);

  const initialValues: EmergencySearchValues = {
    speciality: null,
    appointmentType: "",
    location: "",
    duration: "",
  };

  const handleSubmit = async (
    values: EmergencySearchValues,
    { setSubmitting }: { setSubmitting: (v: boolean) => void }
  ) => {
    setSubmitting(true);

    try {
     
      const { decodedToken } = Utility();
      const patientId = decodedToken()?.id || decodedToken()?.userId || "";
      if (!patientId) {
        alert("Login required: patientId not found in token.");
        return;
      }

    
      const payload = {
        specialityId: values.speciality?._id!,
        appointmentType: values.appointmentType as AppointmentType,
        location: values.location.trim(),
        duration: values.duration as DurationOpt,
      };

      // basic validation (front-end)
      if (!payload.specialityId) throw new Error("Please choose a speciality");
      if (!payload.appointmentType)
        throw new Error("Please choose appointment type");
      if (!payload.location) throw new Error("Please enter location");

      const DRY_RUN = false;


      const broadcastRes = await creator("doctor", "emergency/broadcast", {
        specialityId: payload.specialityId,
        specialityName: values.speciality?.name,
        location: payload.location,
        appointmentType: payload.appointmentType,
        duration: payload.duration,
        dryRun: DRY_RUN,
      });

      if (DRY_RUN) {
        const matched = broadcastRes?.matched ?? 0;
        const preview = (broadcastRes?.recipientsPreview || []).join(", ");
        alert(
          matched
            ? `Preview: ${matched} doctor(s)\n${preview}`
            : "Preview: No matching doctors."
        );
        return;
      }

      const createBody = {
        patientId,
        appointmentType: payload.appointmentType,
        specialityId: payload.specialityId,
        location: payload.location,
        durationMinutes: Number(payload.duration),
      };
      console.log("create-auto body =>", createBody);

      const apptRes = await creator(
        "appointment",
        "emergency/create-auto",
        createBody
      );

      const apptId = apptRes?.data?._id || apptRes?._id || "N/A";

      const sent = broadcastRes?.sent ?? 0;
      const matched = broadcastRes?.matched ?? 0;

      alert(
        `Emails sent to ${sent}/${matched} doctor(s).\nAppointment created with ID: ${apptId}`
      );
      await onSearch?.({
        specialityId: payload.specialityId,
        appointmentType: payload.appointmentType,
        location: payload.location,
        duration: payload.duration,
      });
      onClose();
    } catch (e: any) {
      console.error("Emergency flow failed", e);
      alert(e?.message || "Emergency flow failed");
    } finally {
      setSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <Modal
      open={isOpen}
      onClose={(_, r) => {
        if (r !== "backdropClick") onClose();
      }}
    >
      <Box sx={shellBoxSx}>
        <Box sx={{ p: 1.25 }}>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1 }}>
            <Typography
              sx={{
                fontSize: { xs: "1.05rem", sm: "1.2rem", md: "1.35rem" },
                fontWeight: 600,
                color: "#29175e",
                fontFamily: "Poppins",
              }}
            >
              Emergency — Find Doctors Fast
            </Typography>
          </Box>
          <Box sx={{ borderBottom: "1px solid #ccc", mb: 1 }} />
        </Box>

        <Formik
          initialValues={initialValues}
          validationSchema={EmergencySearchSchema}
          onSubmit={(values, helpers) => handleSubmit(values, helpers)}
        >
          {({ values, setFieldValue, touched, errors, isSubmitting }) => (
            <Form>
              <Box sx={sectionBoxSx}>
                <Grid container spacing={2.5}>
                  {/* Speciality */}
                  <Grid item xs={12} md={6}>
                    <Autocomplete<Speciality>
                      options={specialities}
                      loading={loadingSpecs}
                      value={values.speciality}
                      onChange={(_, v) => setFieldValue("speciality", v)}
                      getOptionLabel={(o) => o?.name || ""}
                      isOptionEqualToValue={(o, v) => o._id === v._id}
                      slotProps={{
                        paper: {
                          sx: {
                            bgcolor: "#fff",
                            color: "#29175E",
                            "& .MuiAutocomplete-option": {
                              fontFamily: "Poppins",
                              "&[aria-selected='true']": {
                                bgcolor: "#7A4D9C",
                                color: "#fff",
                              },
                              "&.Mui-focused": {
                                bgcolor: "#463073",
                                color: "#fff",
                              },
                            },
                          },
                        },
                      }}
                      ListboxProps={{
                        sx: {
                          "&::-webkit-scrollbar": { width: 8 },
                          "&::-webkit-scrollbar-thumb": {
                            bgcolor: "#7A4D9C",
                            borderRadius: 8,
                          },
                        },
                      }}
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          label="Speciality *"
                          placeholder="Cardiologist, Dermatologist…"
                          sx={inputStyles}
                          InputProps={{
                            ...params.InputProps,
                            startAdornment: (
                              <>
                                <InputAdornment position="start">
                                  <LocalHospitalIcon
                                    sx={{ color: "#7A4D9C" }}
                                  />
                                </InputAdornment>
                                {params.InputProps.startAdornment}
                              </>
                            ),
                            endAdornment: (
                              <>
                                {loadingSpecs ? (
                                  <CircularProgress size={18} sx={{ mr: 1 }} />
                                ) : null}
                                {params.InputProps.endAdornment}
                              </>
                            ),
                          }}
                          error={
                            touched.speciality && Boolean(errors.speciality)
                          }
                          helperText={
                            touched.speciality && (errors.speciality as string)
                          }
                        />
                      )}
                    />
                  </Grid>

                  {/* Appointment Type */}
                  <Grid item xs={12} md={6}>
                    <TextField
                      select
                      fullWidth
                      label="Appointment Type *"
                      value={values.appointmentType}
                      onChange={(e) =>
                        setFieldValue("appointmentType", e.target.value)
                      }
                      sx={inputStyles}
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <InfoIcon sx={{ color: "#7A4D9C" }} />
                          </InputAdornment>
                        ),
                      }}
                      SelectProps={{
                        MenuProps: {
                          PaperProps: {
                            sx: {
                              bgcolor: "#29175E",
                              color: "#29175E",
                              "& .MuiMenuItem-root": {
                                fontFamily: "Poppins",
                                "&.Mui-selected": {
                                  bgcolor: "#7A4D9C",
                                  color: "#fff",
                                },
                                "&.Mui-focused": {
                                  bgcolor: "#463073",
                                  color: "#fff",
                                },
                              },
                            },
                          },
                        },
                      }}
                      error={
                        touched.appointmentType &&
                        Boolean(errors.appointmentType)
                      }
                      helperText={
                        touched.appointmentType &&
                        (errors.appointmentType as string)
                      }
                    >
                      <MenuItem value="online">Online</MenuItem>
                      <MenuItem value="in-person">In-Person</MenuItem>
                    </TextField>
                  </Grid>

                  {/* Location */}
                  <Grid item xs={12} md={6}>
                    <TextField
                      fullWidth
                      label="Location *"
                      placeholder="e.g., Sector 62 Noida, 110096"
                      value={values.location}
                      onChange={(e) =>
                        setFieldValue("location", e.target.value)
                      }
                      sx={inputStyles}
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <MyLocationIcon sx={{ color: "#7A4D9C" }} />
                          </InputAdornment>
                        ),
                      }}
                      error={touched.location && Boolean(errors.location)}
                      helperText={
                        touched.location && (errors.location as string)
                      }
                    />
                  </Grid>

                  {/* Duration */}
                  <Grid item xs={12} md={6}>
                    <TextField
                      select
                      fullWidth
                      label="Expected Duration *"
                      value={values.duration}
                      onChange={(e) =>
                        setFieldValue("duration", Number(e.target.value))
                      }
                      sx={inputStyles}
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <AccessTimeIcon sx={{ color: "#7A4D9C" }} />
                          </InputAdornment>
                        ),
                      }}
                      SelectProps={{
                        MenuProps: {
                          PaperProps: {
                            sx: {
                              bgcolor: "#29175E",
                              color: "#29175E",
                              "& .MuiMenuItem-root": {
                                fontFamily: "Poppins",
                                "&.Mui-selected": {
                                  bgcolor: "#7A4D9C",
                                  color: "#fff",
                                },
                                "&.Mui-focused": {
                                  bgcolor: "#463073",
                                  color: "#fff",
                                },
                              },
                            },
                          },
                        },
                      }}
                      error={touched.duration && Boolean(errors.duration)}
                      helperText={
                        touched.duration && (errors.duration as string)
                      }
                    >
                      {[10, 15, 20, 30, 45, 60].map((d) => (
                        <MenuItem key={d} value={d}>
                          {d} mins
                        </MenuItem>
                      ))}
                    </TextField>
                  </Grid>
                </Grid>
              </Box>

              <Box sx={footerSx}>
                <Button
                  type="submit"
                  variant="contained"
                  sx={{
                    minWidth: 160,
                    color: "#fff",
                    background: "#29175E",
                    borderRadius: "4px",
                    textTransform: "none",
                    ":hover": {
                      bgcolor: "#7A4D9C",
                      color: "white",
                      transform: "scale(1.03)",
                    },
                  }}
                  startIcon={<SearchIcon />}
                  disabled={isSubmitting}
                >
                  {isSubmitting ? "Sending…" : "Emergency — Find Doctors Fast"}
                </Button>
                <Button
                  onClick={onClose}
                  variant="contained"
                  sx={{
                    ml: 2,
                    minWidth: 140,
                    color: "#fff",
                    background: "#29175E",
                    borderRadius: "4px",
                    textTransform: "none",
                    ":hover": { bgcolor: "#7A4D9C", color: "white" },
                  }}
                >
                  Close
                </Button>
              </Box>
            </Form>
          )}
        </Formik>
      </Box>
    </Modal>
  );
};

/* ============================================================
 * 2) SpecialityPickerModal (optional helper)
 * ============================================================ */
interface SpecialityPickerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onPick?: (spec: Speciality) => void;
}

export const SpecialityPickerModal: React.FC<SpecialityPickerModalProps> = ({
  isOpen,
  onClose,
  onPick,
}) => {
  const [specialities, setSpecialities] = useState<Speciality[]>([]);
  const [filtered, setFiltered] = useState<Speciality[]>([]);
  const [loading, setLoading] = useState(false);
  const [q, setQ] = useState("");

  useEffect(() => {
    if (!isOpen) return;
    const load = async () => {
      try {
        setLoading(true);
        const res = await fetcher(
          "speciality",
          "get-specialities?page=1&limit=500"
        );
        const list = res?.results || [];
        setSpecialities(list);
        setFiltered(list);
      } catch (e) {
        console.error("Failed to load specialities", e);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [isOpen]);

  useEffect(() => {
    const t = q.trim().toLowerCase();
    if (!t) {
      setFiltered(specialities);
      return;
    }
    setFiltered(specialities.filter((s) => s.name?.toLowerCase().includes(t)));
  }, [q, specialities]);

  if (!isOpen) return null;

  return (
    <Modal
      open={isOpen}
      onClose={(_, r) => {
        if (r !== "backdropClick") onClose();
      }}
    >
      <Box sx={{ ...shellBoxSx, maxWidth: "700px" }}>
        <Box sx={{ p: 1.25 }}>
          <Typography
            sx={{
              fontSize: { xs: "1.05rem", sm: "1.2rem", md: "1.35rem" },
              fontWeight: 600,
              color: "#29175e",
              fontFamily: "Poppins",
            }}
          >
            Choose Speciality
          </Typography>
          <Box sx={{ borderBottom: "1px solid #ccc", mt: 1 }} />
        </Box>

        <Box sx={{ px: 2, pb: 2 }}>
          <TextField
            fullWidth
            placeholder="Search specialities…"
            value={q}
            onChange={(e) => setQ(e.target.value)}
            sx={inputStyles}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon sx={{ color: "#7A4D9C" }} />
                </InputAdornment>
              ),
            }}
          />
        </Box>

        <Box sx={{ px: 2, pb: 2, maxHeight: "60vh", overflowY: "auto" }}>
          {loading ? (
            <Box sx={{ display: "flex", justifyContent: "center", py: 6 }}>
              <CircularProgress />
            </Box>
          ) : filtered.length === 0 ? (
            <Typography sx={{ textAlign: "center", color: "#29175E", py: 4 }}>
              No specialities found.
            </Typography>
          ) : (
            <Grid container spacing={1.5}>
              {filtered.map((spec) => (
                <Grid item xs={12} sm={6} key={spec._id}>
                  <Button
                    fullWidth
                    variant="outlined"
                    onClick={() => {
                      onPick?.(spec);
                      onClose();
                    }}
                    sx={{
                      justifyContent: "flex-start",
                      textTransform: "none",
                      borderColor: "#29175E",
                      color: "#29175E",
                      fontFamily: "Poppins",
                      ":hover": {
                        borderColor: "#7A4D9C",
                        background: "#efe7ff",
                      },
                    }}
                    startIcon={<LocalHospitalIcon />}
                  >
                    {spec.name}
                  </Button>
                </Grid>
              ))}
            </Grid>
          )}
        </Box>

        <Box sx={footerSx}>
          <Button
            onClick={onClose}
            variant="contained"
            sx={{
              minWidth: 140,
              color: "#fff",
              background: "#29175E",
              borderRadius: "4px",
              textTransform: "none",
              ":hover": { bgcolor: "#7A4D9C", color: "white" },
            }}
          >
            Close
          </Button>
        </Box>
      </Box>
    </Modal>
  );
};
