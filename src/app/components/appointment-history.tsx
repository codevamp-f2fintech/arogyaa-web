"use client";

import React, { useState, useEffect, useMemo, useRef } from "react";
import {
  Container,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  TablePagination,
  Alert,
  Box,
  Chip,
  Tooltip,
  Button,
  CircularProgress,
} from "@mui/material";
import {
  EventAvailable as AppointmentIcon,
  CalendarMonth,
  Phone,
  WhatsApp,
  VideoCall,
} from "@mui/icons-material";
import { Utility } from "@/utils";
import { creator, fetcher } from "@/apis/apiClient";
import CreateTestimonialDialog from "./common/createTestimonialDialog";
import DailyIframe from "@daily-co/daily-js";

interface Doctor {
  _id: string;
  username: string;
  email: string;
  contact: string;
  gender: string;
  status: string;
  consultationFee?: string;
}

interface Patient {
  _id: string;
  username: string;
  gender: string;
}

interface Appointment {
  _id: string;
  patientId: Patient;
  doctorId: Doctor;
  appointmentTime: string;
  appointmentDate: string;
  appointmentDateTime: string;
  appointmentType: string;
  status: string;
  hospitalName: string;
  paymentStatus: string;
  consultationFee?: string;
}

interface RoomResponse {
  roomId?: string;
  url?: string;
  expiresAt?: string;
  message?: string;
  scheduledAt?: string;
}

const AppointmentHistory: React.FC = () => {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [totalCount, setTotalCount] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [creatingRoom, setCreatingRoom] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [message, setMessage] = useState("");
  const [activeRoomUrl, setActiveRoomUrl] = useState<string | null>(null);
  const iframeRef = useRef<HTMLIFrameElement | null>(null);
  const [dailyCall, setDailyCall] = useState<any>(null);

  useEffect(() => {
    if (activeRoomUrl && iframeRef.current) {
      const callFrame = DailyIframe.wrap(iframeRef.current);
      setDailyCall(callFrame);

      callFrame.on("left-meeting", () => {
        const appointmentId = sessionStorage.getItem("dailyRoom_appointmentId");
        if (appointmentId) handleRoomClosed(appointmentId);
        setActiveRoomUrl(null);
      });

      callFrame.on("error", (e) => {
        console.error("Daily iframe error", e);
      });
    }
  }, [activeRoomUrl]);

  const [activeCall, setActiveCall] = useState<{
    appointmentId: string;
    expiresAt: string;
    doctorName: string;
  } | null>(null);
  const [testimonialDialogOpen, setTestimonialDialogOpen] = useState(false);
  const [doctorId, setDoctorId] = useState<string>("");
  const [profileData, setProfileData] = useState<any>(null);
  const [countdowns, setCountdowns] = useState<{ [id: string]: string }>({});

  const { decodedToken } = Utility();
  const patientId = decodedToken()?.id;
  useEffect(() => {
    const interval = setInterval(() => {
      const newCountdowns: { [id: string]: string } = {};

      appointments.forEach((appointment) => {
        const { canJoin, minutesLeft, message, isFuture, daysUntil } =
          getJoinCallInfo(
            appointment.appointmentDate,
            appointment.appointmentTime
          );

        const appointmentId = appointment._id;

        if (daysUntil === 0) {
          if (!canJoin && minutesLeft > 0) {
            const now = new Date();
            const [time, period] = appointment.appointmentTime.split(" ");
            const [hours, mins] = time.split(":").map(Number);

            let apptHour = hours;
            if (period === "PM" && hours !== 12) apptHour += 12;
            if (period === "AM" && hours === 12) apptHour = 0;

            const apptDateTime = new Date(appointment.appointmentDate);
            apptDateTime.setHours(apptHour, mins, 0, 0);

            const diffSeconds = Math.max(
              0,
              Math.floor((apptDateTime.getTime() - now.getTime()) / 1000)
            );

            const hrs = Math.floor(diffSeconds / 3600);
            const minsLeft = Math.floor((diffSeconds % 3600) / 60);
            const secsLeft = diffSeconds % 60;

            const countdownText =
              hrs > 0
                ? `Can join in ${hrs}h:${minsLeft}m`
                : `Can join in ${String(minsLeft).padStart(2, "0")}m:${String(
                    secsLeft
                  ).padStart(2, "0")}s`;

            newCountdowns[appointmentId] = countdownText;
          } else {
            // Either can join or time has passed
            newCountdowns[appointmentId] = message;
          }
        } else {
          // ❌ Not today — show static message
          newCountdowns[appointmentId] = message;
        }
      });

      setCountdowns(newCountdowns);
    }, 1000);

    return () => clearInterval(interval);
  }, [appointments]);

  const fetchAppointments = React.useCallback(async () => {
    if (patientId) {
      try {
        const response = await fetcher(
          "appointment",
          `get-patients-appointment/${patientId}?page=${
            page + 1
          }&limit=${rowsPerPage}`
        );
        if (!response || !response.results) {
          throw new Error("No data found");
        }
        setAppointments(response.results || []);
        setTotalCount(response.count || 0);
        setError(null);
      } catch (error) {
        console.error("Error fetching appointments:", error);
        setError(error instanceof Error ? error.message : String(error));
        setAppointments([]);
        setTotalCount(0);
      }
    }
  }, [patientId, page, rowsPerPage]);

  const handlePayNow = async (
    appointment: Appointment,
    isExtension: boolean = false
  ) => {
    setIsProcessing(true);
    setMessage("");

    try {
      const consultationFeeStr = appointment.doctorId?.consultationFee;
      const consultationFee = Number(consultationFeeStr);

      if (!consultationFee || consultationFee <= 0) {
        setMessage(
          "Doctor's consultation fee is not set. Please contact support."
        );
        setIsProcessing(false);
        return;
      }

      const paymentData = {
        patientId: appointment.patientId?._id || appointment.patientId,
        doctorId: appointment.doctorId?._id || appointment.doctorId,
        appointmentId: appointment._id,
        amount: consultationFee,
        currency: "INR",
        transactionMethod: "card",
        patientName: appointment.patientId?.username || "",
        doctorName: appointment.doctorId?.username || "",
      };

      const res = await creator("payment", "/initiate-payment", paymentData);

      if (res?.txnid && res?.html) {
        const container = document.createElement("div");
        container.innerHTML = res.html;
        document.body.appendChild(container);
        container.querySelector("form")?.submit();
      } else {
        setMessage("Payment initiation failed.");
      }
    } catch (error: any) {
      setMessage(error.message || "Error initiating payment.");
    } finally {
      setIsProcessing(false);
    }
  };
  // const handlePayNow = async (appointment: Appointment) => {
  //   setIsProcessing(true);
  //   setMessage("");

  //   try {
  //     const consultationFeeStr = appointment.doctorId?.consultationFee;
  //     const consultationFee = Number(consultationFeeStr);

  //     if (!consultationFee || consultationFee <= 0) {
  //       setMessage(
  //         "Doctor's consultation fee is not set. Please contact support."
  //       );
  //       setIsProcessing(false);
  //       return;
  //     }

  //     const paymentData = {
  //       patientId: appointment.patientId?._id || appointment.patientId,
  //       doctorId: appointment.doctorId?._id || appointment.doctorId,
  //       appointmentId: appointment._id,
  //       amount: consultationFee,
  //       currency: "INR",
  //       transactionMethod: "card",
  //       patientName: appointment.patientId?.username || "",
  //       doctorName: appointment.doctorId?.username || "",
  //     };

  //     const res = await creator("payment", "/initiate-payment", paymentData);

  //     if (res?.txnid && res?.html) {
  //       const container = document.createElement("div");
  //       container.innerHTML = res.html;
  //       document.body.appendChild(container);
  //       container.querySelector("form")?.submit();
  //     } else {
  //       setMessage("Payment initiation failed.");
  //     }
  //   } catch (error: any) {
  //     setMessage(error.message || "Error initiating payment.");
  //   } finally {
  //     setIsProcessing(false);
  //   }
  // };

  const fetchTestimonials = async () => {
    // Dummy function - no functionality
    console.log("Fetching testimonials...");
  };

  const closeTestimonialDialog = () => {
    setTestimonialDialogOpen(false);
    setDoctorId("");
    setProfileData(null);
  };

  useEffect(() => {
    fetchAppointments();
  }, [fetchAppointments]);

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setRowsPerPage(Number.parseInt(event.target.value, 10));
    setPage(0);
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "completed":
        return "success";
      case "pending":
        return "warning";
      case "cancelled":
        return "error";
      default:
        return "default";
    }
  };

  // Daily.co room creation and management
  const createRoom = async (appointment: Appointment) => {
    setCreatingRoom(appointment._id);
    try {
      const roomData = {
        type: "video",
        doctorId: appointment.doctorId._id,
        patientId: appointment.patientId._id,
        duration: "20",
        appointmentId: appointment._id,
        scheduledAt: appointment.appointmentDateTime,
        appointmentTime: appointment.appointmentTime,
      };

      const response = await creator(
        "chat",
        "create-room",
        JSON.stringify(roomData),
        {
          "Content-Type": "application/json",
        }
      );

      if (response.url && response.expiresAt) {
        // Store session data for redirection handling
        const sessionData = {
          appointmentId: appointment._id,
          roomUrl: response.url,
          expiresAt: response.expiresAt,
          doctorName: appointment.doctorId.username,
          doctorId: appointment.doctorId._id, // Add this line
          returnUrl: `${window.location.origin}/profile?rating&doctorId=${
            appointment.doctorId._id
          }&doctorName=${encodeURIComponent(appointment.doctorId.username)}`,
          joinedAt: new Date().toISOString(),
        };

        // Store in sessionStorage
        Object.entries(sessionData).forEach(([key, value]) => {
          sessionStorage.setItem(`dailyRoom_${key}`, value);
        });

        // Set active call state
        setActiveCall({
          appointmentId: appointment._id,
          expiresAt: response.expiresAt,
          doctorName: appointment.doctorId.username,
        });

        // Open room in a new window/tab
        setActiveRoomUrl(response.url);
        // Flag to track if the call is opened in
        sessionStorage.setItem("dailyRoom_isActive", "true");

        // Monitor the room window
        const checkClosed = setInterval(() => {
          if (roomWindow?.closed) {
            clearInterval(checkClosed);
            handleRoomClosed(appointment._id);
          }
        }, 1000);

        // Set up expiration time
        // r
        const expirationTime = new Date(response.expiresAt).getTime();
        const currentTime = new Date().getTime();
        const timeUntilExpiration = expirationTime - currentTime;

        if (timeUntilExpiration > 0) {
          setTimeout(() => {
            if (roomWindow && !roomWindow.closed) {
              roomWindow.close();
            }
            handleRoomExpired(appointment._id);
            setActiveRoomUrl(null);
          }, timeUntilExpiration);
        }
      } else if (response.message) {
        // Room was scheduled
        alert(response.message);
      }
    } catch (error) {
      console.error("Error creating room:", error);
      alert("Failed to create room. Please try again.");
    } finally {
      setCreatingRoom(null);
    }
  };

  // Handle room closed (manually by user)
  const handleRoomClosed = (appointmentId: string) => {
    console.log("Room closed for appointment:", appointmentId);

    // Get doctor info from session BEFORE clearing
    const doctorIdFromSession =
      sessionStorage.getItem("dailyRoom_doctorId") || "";
    const doctorNameFromSession =
      sessionStorage.getItem("dailyRoom_doctorName") || "";

    // Clear session data
    const keysToRemove = [
      "appointmentId",
      "roomUrl",
      "expiresAt",
      "doctorName",
      "doctorId",
      "returnUrl",
      "joinedAt",
      "dailyRoom_isActive",
    ];
    keysToRemove.forEach((key) => {
      sessionStorage.removeItem(`dailyRoom_${key}`);
    });

    // Clear active call state
    setActiveCall(null);

    // Show completion message
    alert("Video call ended. Thank you for using our service!");

    // Set doctor info and open testimonial dialog
    if (doctorIdFromSession && doctorNameFromSession) {
      setDoctorId(doctorIdFromSession);
      setProfileData({ data: { username: doctorNameFromSession } });
      setTestimonialDialogOpen(true);
    }

    // Refresh appointments
    fetchAppointments();
  };

  // Handle room expiration
  const handleRoomExpired = (appointmentId: string) => {
    console.log("Room expired for appointment:", appointmentId);

    // Get doctor info from session BEFORE clearing
    const doctorIdFromSession =
      sessionStorage.getItem("dailyRoom_doctorId") || "";
    const doctorNameFromSession =
      sessionStorage.getItem("dailyRoom_doctorName") || "";

    // Clear session data
    const keysToRemove = [
      "appointmentId",
      "roomUrl",
      "expiresAt",
      "doctorName",
      "doctorId",
      "returnUrl",
      "joinedAt",
      "dailyRoom_isActive",
    ];
    keysToRemove.forEach((key) => {
      sessionStorage.removeItem(`dailyRoom_${key}`);
    });

    // Clear active call state
    setActiveCall(null);

    // Show expiration message
    alert("Video call has expired. Thank you for using our service!");

    // Set doctor info and open testimonial dialog
    if (doctorIdFromSession && doctorNameFromSession) {
      setDoctorId(doctorIdFromSession);
      setProfileData({ data: { username: doctorNameFromSession } });
      setTestimonialDialogOpen(true);
    }

    // Refresh appointments
    fetchAppointments();
  };

  // Check for active sessions on component mount
  useEffect(() => {
    const checkActiveSession = () => {
      const appointmentId = sessionStorage.getItem("dailyRoom_appointmentId");
      const expiresAt = sessionStorage.getItem("dailyRoom_expiresAt");
      const doctorName = sessionStorage.getItem("dailyRoom_doctorName");

      if (appointmentId && expiresAt && doctorName) {
        const expirationTime = new Date(expiresAt).getTime();
        const currentTime = new Date().getTime();

        if (currentTime < expirationTime) {
          // Session is still active
          setActiveCall({
            appointmentId,
            expiresAt,
            doctorName,
          });

          // Set up expiration timer
          const timeUntilExpiration = expirationTime - currentTime;
          setTimeout(() => {
            handleRoomExpired(appointmentId);
          }, timeUntilExpiration);
        } else {
          // Session has expired, clean up
          handleRoomExpired(appointmentId);
        }
      }
    };

    checkActiveSession();
  }, []);

  // Handle page visibility change
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (!document.hidden) {
        // User returned to the tab, check if there's an active session
        const appointmentId = sessionStorage.getItem("dailyRoom_appointmentId");
        const expiresAt = sessionStorage.getItem("dailyRoom_expiresAt");

        if (appointmentId && expiresAt) {
          const expirationTime = new Date(expiresAt).getTime();
          const currentTime = new Date().getTime();

          if (currentTime >= expirationTime) {
            handleRoomExpired(appointmentId);
          }
        }
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);
    return () =>
      document.removeEventListener("visibilitychange", handleVisibilityChange);
  }, []);

  // Rejoin active call
  const rejoinCall = () => {
    const roomUrl = sessionStorage.getItem("dailyRoom_roomUrl");
    if (roomUrl) {
      setActiveRoomUrl(response.url);

      // Monitor the reopened window
      const checkClosed = setInterval(() => {
        if (roomWindow?.closed) {
          clearInterval(checkClosed);
          const appointmentId = sessionStorage.getItem(
            "dailyRoom_appointmentId"
          );
          if (appointmentId) {
            handleRoomClosed(appointmentId);
          }
        }
      }, 1000);
    }
  };

  // const isAppointmentImminent = (
  //   appointmentDate: string,
  //   appointmentTime: string,
  //   durationMinutes: number = 2
  // ): boolean => {
  //   const now = new Date();
  //   const appointmentDay = new Date(appointmentDate);

  //   // Check if it's the same date
  //   const isSameDate =
  //     now.getFullYear() === appointmentDay.getFullYear() &&
  //     now.getMonth() === appointmentDay.getMonth() &&
  //     now.getDate() === appointmentDay.getDate();

  //   if (!isSameDate) return false;

  //   // Parse appointment time (assuming format like "11:36 AM")
  //   const [time, period] = appointmentTime.split(" ");
  //   const [hours, minutes] = time.split(":").map(Number);

  //   let appointmentHours = hours;
  //   if (period === "PM" && hours !== 12) {
  //     appointmentHours += 12;
  //   } else if (period === "AM" && hours === 12) {
  //     appointmentHours = 0;
  //   }

  //   // Set full appointment datetime
  //   const appointmentDateTime = new Date(appointmentDay);
  //   appointmentDateTime.setHours(appointmentHours, minutes, 0, 0);

  //   // Calculate time difference in minutes
  //   const diffMinutes =
  //     (appointmentDateTime.getTime() - now.getTime()) / (1000 * 60);
  //   const endTime = new Date(
  //     appointmentDateTime.getTime() + durationMinutes * 60 * 1000
  //   );

  //   // If current time is between [appointmentTime - 10min] and [appointmentTime + 2min]
  //   return diffMinutes <= 10 && now <= endTime;
  // };

  const canCreateRoom = (appointment: Appointment) => {
    return (
      appointment.appointmentType === "online" &&
      appointment.paymentStatus === "success" &&
      getJoinCallInfo(appointment.appointmentDate, appointment.appointmentTime)
    );
  };
  const getJoinCallInfo = (
    appointmentDate: string,
    appointmentTime: string
  ): {
    canJoin: boolean;
    minutesLeft: number;
    isFuture: boolean;
    daysUntil: number;
    message: string;
  } => {
    const now = new Date();
    const appointmentDay = new Date(appointmentDate);

    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const apptDateOnly = new Date(
      appointmentDay.getFullYear(),
      appointmentDay.getMonth(),
      appointmentDay.getDate()
    );

    const isSameDate = today.getTime() === apptDateOnly.getTime();
    const isFutureDate = apptDateOnly > today;
    const isPastDate = apptDateOnly < today;
    const dayDiff = Math.floor(
      (apptDateOnly.getTime() - today.getTime()) / (1000 * 60 * 60 * 24)
    );

    // Convert appointmentTime like "01:30 PM" into 24-hour format
    const [time, period] = appointmentTime.split(" ");
    const [hours, minutes] = time.split(":").map(Number);

    let apptHour = hours;
    if (period === "PM" && hours !== 12) apptHour += 12;
    if (period === "AM" && hours === 12) apptHour = 0;

    const apptDateTime = new Date(appointmentDay);
    apptDateTime.setHours(apptHour, minutes, 0, 0);

    // ✅ Future Appointment (Not Today)
    if (isFutureDate) {
      const diffMinutes = Math.ceil(
        (apptDateTime.getTime() - now.getTime()) / (1000 * 60)
      );
      return {
        canJoin: false,
        minutesLeft: diffMinutes,
        isFuture: true,
        daysUntil: dayDiff,
        message:
          dayDiff === 1
            ? `Appointment is tomorrow at ${appointmentTime}`
            : `Appointment in ${dayDiff} days at ${appointmentTime}`,
      };
    }

    // ❌ Past Appointment
    if (isPastDate) {
      return {
        canJoin: false,
        minutesLeft: -1,
        isFuture: false,
        daysUntil: -1,
        message: "Join time has passed",
      };
    }

    // ✅ Today: Same-day logic
    const diffMinutes = (apptDateTime.getTime() - now.getTime()) / (1000 * 60);
    const endTime = new Date(apptDateTime.getTime() + 10 * 60 * 1000); // Allow joining up to 10 minutes after

    if (diffMinutes <= 10 && now <= endTime) {
      return {
        canJoin: true,
        minutesLeft: Math.ceil(diffMinutes),
        isFuture: false,
        daysUntil: 0,
        message:
          diffMinutes > 0
            ? `Can join in ${Math.ceil(diffMinutes)} mins`
            : "Join now",
      };
    }

    return {
      canJoin: false,
      minutesLeft: Math.ceil(diffMinutes),
      isFuture: false,
      daysUntil: 0,
      message:
        diffMinutes > 10
          ? `Can join in ${Math.ceil(diffMinutes)} mins`
          : "Join time has passed",
    };
  };
  const anyJoinable = appointments.some((appt) => {
    const { canJoin } = getJoinCallInfo(
      appt.appointmentDate,
      appt.appointmentTime
    );
    return canJoin;
  });
  // const paginatedAppointments = useMemo(() => {
  //   const startIndex = page * rowsPerPage;
  //   return appointments.slice(startIndex, startIndex + rowsPerPage);
  // }, [appointments, page, rowsPerPage]);

  const headerStyle = {
    fontWeight: 600,
    textTransform: "uppercase",
    color: "#fff",
  };

  useEffect(() => {
    const appointmentId = sessionStorage.getItem("dailyRoom_appointmentId");

    if (!appointmentId) return;

    const interval = setInterval(async () => {
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_CHAT_URL}/extension-status/${appointmentId}`
        );
        const data = await res.json();

        if (data?.extensionStatus === "approved") {
          sessionStorage.setItem("extensionApproved", appointmentId);
        }
      } catch (err) {
        console.error("Extension status polling failed", err);
      }
    }, 5000); // every 5 seconds

    return () => clearInterval(interval);
  }, []);

  // console.log("appointments>>>", appointments);

  return (
    <Container maxWidth="lg">
      {error && (
        <Alert severity="error" sx={{ mb: 2, borderRadius: 2 }}>
          {error}
        </Alert>
      )}

      {activeRoomUrl && (
        <Box sx={{ mt: 3 }}>
          <Box sx={{ display: "flex", justifyContent: "space-between", mb: 1 }}>
            <strong style={{ color: "#fff" }}>Video Call in Progress</strong>
            <Button
              variant="outlined"
              color="error"
              onClick={() => {
                const appointmentId = sessionStorage.getItem(
                  "dailyRoom_appointmentId"
                );
                if (appointmentId) handleRoomClosed(appointmentId);
                setActiveRoomUrl(null); // remove iframe
              }}
            >
              End Call
            </Button>
          </Box>
          <iframe
            ref={iframeRef}
            src={activeRoomUrl}
            width="100%"
            height="600"
            allow="camera; microphone; fullscreen"
            style={{ border: "2px solid #ccc", borderRadius: "8px" }}
            title="Video Call"
          />
        </Box>
      )}

      {activeCall && (
        <Alert
          severity="info"
          sx={{
            mb: 2,
            borderRadius: 2,
            backgroundColor: "#e3f2fd",
            "& .MuiAlert-message": {
              display: "flex",
              alignItems: "center",
              gap: 1,
              justifyContent: "space-between",
              flexWrap: "wrap",
            },
          }}
        >
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 1,
              flexWrap: "wrap",
            }}
          >
            <VideoCall sx={{ fontSize: 20 }} />
            Active call with {activeCall.doctorName} - Expires at{" "}
            {new Date(activeCall.expiresAt).toLocaleTimeString("en-US", {
              hour: "numeric",
              minute: "2-digit",
              hour12: true,
            })}
          </Box>

          <Box sx={{ display: "flex", gap: 1 }}>
            {sessionStorage.getItem("dailyRoom_isActive") === "true" ? (
              <Box sx={{ color: "green", fontWeight: "bold" }}>
                Already Joined
              </Box>
            ) : (
              <Button
                size="small"
                variant="outlined"
                onClick={rejoinCall}
                sx={{ ml: 2 }}
              >
                Rejoin Call
              </Button>
            )}

            {(() => {
              const expiryTime = new Date(activeCall.expiresAt).getTime();
              const now = Date.now();
              const minutesLeft = Math.floor((expiryTime - now) / (1000 * 60));

              if (minutesLeft <= 18) {
                return (
                  <Button
                    size="small"
                    variant="outlined"
                    color="secondary"
                    onClick={async () => {
                      const appointmentId = sessionStorage.getItem(
                        "dailyRoom_appointmentId"
                      );
                      if (!appointmentId) return;

                      try {
                        const response = await fetch(
                          `${process.env.NEXT_PUBLIC_CHAT_URL}/extend-call/${appointmentId}`,
                          {
                            method: "POST",
                            headers: {
                              "Content-Type": "application/json",
                            },
                            body: JSON.stringify({ duration: 10 }),
                          }
                        );

                        const data = await response.json();
                        if (response.ok && data.success) {
                          alert("Extension request sent to doctor.");
                        } else {
                          alert("Failed to request extension.");
                          console.error("API Error:", data?.message);
                        }
                      } catch (err: any) {
                        console.error("Network error:", err);
                        alert("Something went wrong while sending request.");
                      }
                    }}
                  >
                    Request +10 min
                  </Button>
                );
              }

              return null;
            })()}

            {/* ✅ Show Pay Now only if extension approved */}
            {/* {sessionStorage.getItem("extensionApproved") ===
              activeCall.appointmentId && (
              <Button
                size="small"
                variant="contained"
                color="primary"
                onClick={() =>
                  handlePayNow({ _id: activeCall.appointmentId }, true)
                }
              >
                Pay Now for Extension
              </Button>
            )} */}
          </Box>
        </Alert>
      )}

      <TableContainer
        component={Paper}
        sx={{ backgroundColor: "#7b56ce", mt: 3 }}
      >
        <Table>
          <TableHead>
            <TableRow>
              <TableCell sx={headerStyle} align="center">
                Doctor
              </TableCell>
              <TableCell sx={headerStyle} align="center">
                Contact
              </TableCell>

              <TableCell sx={headerStyle} align="center">
                Date
              </TableCell>
              <TableCell sx={headerStyle} align="center">
                Time
              </TableCell>
              <TableCell sx={headerStyle}>Fees</TableCell>
              <TableCell sx={headerStyle} align="center">
                Status
              </TableCell>
              <TableCell sx={headerStyle} align="center">
                Action
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {appointments.length > 0 ? (
              appointments.map((appointment) => (
                <TableRow
                  key={appointment._id}
                  hover
                  sx={{
                    "& td": {
                      py: 2,
                      borderBottom: "1px solid #ffffff66",
                      color: "#fff",
                    },
                  }}
                >
                  <TableCell>
                    {appointment?.doctorId?.username || "N/A"}
                  </TableCell>
                  {appointment.paymentStatus === "success" &&
                  appointment.appointmentType === "online" &&
                  (() => {
                    const { canJoin } = getJoinCallInfo(
                      appointment.appointmentDate,
                      appointment.appointmentTime
                    );
                    return canJoin;
                  })() ? (
                    <TableCell>
                      <Box
                        sx={{ display: "flex", alignItems: "center", gap: 1 }}
                      >
                        <span>{appointment?.doctorId?.contact || "N/A"}</span>
                        {appointment?.doctorId?.contact && (
                          <Tooltip title="Message on WhatsApp">
                            <a
                              href={`https://wa.me/91${appointment?.doctorId?.contact}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              style={{
                                color: "#25D366",
                                display: "flex",
                                alignItems: "center",
                              }}
                            >
                              <WhatsApp fontSize="small" />
                            </a>
                          </Tooltip>
                        )}
                      </Box>
                    </TableCell>
                  ) : (
                    <TableCell>-</TableCell>
                  )}

                  <TableCell sx={{ textAlign: "center" }}>
                    {appointment?.appointmentDate
                      ? new Date(appointment.appointmentDate)
                          .toISOString()
                          .split("T")[0]
                      : "N/A"}
                  </TableCell>

                  <TableCell>{appointment?.appointmentTime || "N/A"}</TableCell>
                  <TableCell align="center">
                    {appointment?.doctorId?.consultationFee
                      ? `₹${appointment.doctorId.consultationFee}`
                      : "N/A"}
                  </TableCell>

                  <TableCell>
                    <Chip
                      icon={<AppointmentIcon />}
                      label={appointment?.status || "N/A"}
                      color={getStatusColor(appointment?.status)}
                      size="small"
                      variant="outlined"
                    />
                  </TableCell>
                  <TableCell align="center">
                    {appointment.appointmentType === "online" ? (
                      <>
                        {appointment.paymentStatus === "pending" ? (
                          // Show Pay Now button when paymentStatus is "pending"
                          <Tooltip
                            title={(() => {
                              const now = new Date();
                              const apptDate = new Date(
                                appointment.appointmentDate
                              );
                              const [time, period] =
                                appointment.appointmentTime.split(" ");
                              const [hours, minutes] = time
                                .split(":")
                                .map(Number);
                              let apptHour = hours;
                              if (period === "PM" && hours !== 12)
                                apptHour += 12;
                              if (period === "AM" && hours === 12) apptHour = 0;
                              apptDate.setHours(apptHour, minutes, 0, 0);
                              const isPast = now > apptDate;
                              return isPast
                                ? "Payment window has expired"
                                : "Payment is required to join the session";
                            })()}
                            arrow
                            componentsProps={{
                              tooltip: {
                                sx: {
                                  backgroundColor: "#fff",
                                  color: "#7b56ce",
                                  fontSize: "14px",
                                  fontWeight: "bold",
                                  borderRadius: "8px",
                                  px: 1,
                                  py: 0.6,
                                },
                              },
                              arrow: {
                                sx: {
                                  color: "#fff",
                                },
                              },
                            }}
                          >
                            {(() => {
                              const now = new Date();
                              const apptDate = new Date(
                                appointment.appointmentDate
                              );
                              const [time, period] =
                                appointment.appointmentTime.split(" ");
                              const [hours, minutes] = time
                                .split(":")
                                .map(Number);
                              let apptHour = hours;
                              if (period === "PM" && hours !== 12)
                                apptHour += 12;
                              if (period === "AM" && hours === 12) apptHour = 0;
                              apptDate.setHours(apptHour, minutes, 0, 0);
                              const isPast = now > apptDate;

                              return isPast ? (
                                <Box
                                  sx={{ color: "#fff", fontStyle: "italic" }}
                                >
                                  Payment window has expired
                                </Box>
                              ) : (
                                <Button
                                  variant="contained"
                                  size="small"
                                  color="warning"
                                  onClick={() => handlePayNow(appointment)}
                                  sx={{
                                    background:
                                      "linear-gradient(90deg, #7b56ce 0%, #9e6df7 100%)",
                                    color: "#fff",
                                    fontWeight: "bold",
                                    textTransform: "none",
                                    borderRadius: "30px",
                                    px: 2,
                                    py: 0.5,
                                    boxShadow:
                                      "0 4px 15px rgba(123, 86, 206, 0.4)",
                                    transition: "all 0.3s ease",
                                    whiteSpace: "nowrap",
                                    "&:hover": {
                                      background:
                                        "linear-gradient(90deg, #9e6df7 0%, #7b56ce 100%)",
                                      boxShadow:
                                        "0 6px 20px rgba(123, 86, 206, 0.5)",
                                    },
                                  }}
                                >
                                  Pay Now
                                </Button>
                              );
                            })()}
                          </Tooltip>
                        ) : appointment.paymentStatus === "success" ? (
                          // Handle cases when paymentStatus is "success"
                          appointment.status === "scheduled" &&
                          canCreateRoom(appointment) ? (
                            // Show Join Call button when status is "scheduled" and room can be created
                            <>
                              {(() => {
                                const { canJoin, message } = getJoinCallInfo(
                                  appointment.appointmentDate,
                                  appointment.appointmentTime
                                );
                                return (
                                  <>
                                    <Button
                                      variant="contained"
                                      size="small"
                                      startIcon={
                                        creatingRoom === appointment._id ? (
                                          <CircularProgress
                                            size={16}
                                            color="inherit"
                                          />
                                        ) : (
                                          <VideoCall />
                                        )
                                      }
                                      onClick={() => createRoom(appointment)}
                                      disabled={
                                        creatingRoom === appointment._id ||
                                        activeCall !== null ||
                                        !canJoin
                                      }
                                      sx={{
                                        backgroundColor: "#4caf50",
                                        "&:hover": {
                                          backgroundColor: "#45a049",
                                        },
                                        "&:disabled": {
                                          backgroundColor: "#cccccc",
                                        },
                                        textTransform: "none",
                                        whiteSpace: "nowrap",
                                      }}
                                    >
                                      {creatingRoom === appointment._id
                                        ? "Creating..."
                                        : "Join Call"}
                                    </Button>
                                    {!canJoin && (
                                      <Box
                                        sx={{
                                          mt: 1,
                                          fontSize: "12px",
                                          color: "#fff",
                                        }}
                                      >
                                        {countdowns[appointment._id] || message}
                                      </Box>
                                    )}
                                  </>
                                );
                              })()}
                            </>
                          ) : (
                            // Show message when status is "pending" (or not "scheduled")
                            <Box sx={{ color: "#fff", fontStyle: "italic" }}>
                              {appointment.status === "completed"
                                ? "Attended The Session"
                                : appointment.status === "rejected"
                                ? "Doctor is busy, choose another appointment slot"
                                : "Doctor has not yet scheduled this appointment."}
                            </Box>
                          )
                        ) : (
                          // Optional: Handle other payment statuses (e.g., "failed", null)
                          <Box sx={{ color: "#fff" }}>
                            Payment status:{" "}
                            {appointment.paymentStatus || "Unknown"}
                          </Box>
                        )}
                      </>
                    ) : (
                      <></>
                    )}
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={8} align="center">
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                      gap: 2,
                      color: "#fff",
                    }}
                  >
                    <CalendarMonth sx={{ fontSize: 18, color: "#fff" }} />
                    No Appointment History
                  </Box>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>

        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={totalCount}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
          sx={{
            "& .MuiTablePagination-selectLabel": {
              fontWeight: 500,
              color: "#fff",
            },
            "& .MuiTablePagination-select": {
              fontWeight: 500,
              color: "#fff",
              backgroundColor: "#7b56ce",
              border: "2px solid #7b56ce",
              borderRadius: "8px",
            },
            "& .MuiSelect-icon": {
              color: "#fff",
            },
            "& .MuiTablePagination-displayedRows": {
              color: "#fff",
            },
            "& .MuiTablePagination-actions": {
              color: "#fff",
            },
            "& .MuiIconButton-root": {
              color: "#fff",
            },
          }}
          SelectProps={{
            MenuProps: {
              sx: {
                "& .MuiPaper-root": {
                  backgroundColor: "#7b56ce",
                  color: "#fff",
                },
                "& .MuiMenuItem-root": {
                  color: "#fff",
                  "&.Mui-selected": {
                    backgroundColor: "#6a4bb8",
                  },
                  "&:hover": {
                    backgroundColor: "#7050c1",
                  },
                },
              },
            },
          }}
        />

        <CreateTestimonialDialog
          open={testimonialDialogOpen}
          onClose={closeTestimonialDialog}
          doctorId={doctorId}
          doctorName={profileData?.data?.username || "Unknown"}
          fetchTestimonials={fetchTestimonials}
        />
      </TableContainer>
    </Container>
  );
};

export default AppointmentHistory;
