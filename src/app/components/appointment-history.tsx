"use client";

import React, { useState, useEffect, useRef } from "react";
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
  WhatsApp,
  VideoCall,
} from "@mui/icons-material";
import { Utility } from "@/utils";
import { creator,modifier, fetcher } from "@/apis/apiClient";
import CreateTestimonialDialog from "./common/createTestimonialDialog";
import io from "socket.io-client";
import { useSearchParams } from "next/navigation";

/* ---------- Types ---------- */
type IdLike = string | { _id: string; username?: string; consultationFee?: number };
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
  patientId: Patient | string;
  doctorId: Doctor | string | null;
  appointmentTime: string;
  appointmentDate: string;
  appointmentDateTime: string;
  appointmentType: string;
  status: string;
  hospitalName: string;
  paymentStatus: string;
  consultationFee?: string;
  pickedUpAt?: string;
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
  const [apptSock, setApptSock] = useState<any>(null);

  // Inline Daily call
  const [activeRoomUrl, setActiveRoomUrl] = useState<string | null>(null);
  const iframeRef = useRef<HTMLIFrameElement | null>(null);
  const query = useSearchParams();
  const purposeParam = (query.get("purpose") || "all").toUpperCase();
  const paymentQ = (
    query.get("payment") ||
    query.get("status") ||
    ""
  ).toLowerCase();
  const isExtendedPaid = paymentQ === "success" && purposeParam === "EXTENSION";

  // Active call banner
  const [activeCall, setActiveCall] = useState<{
    appointmentId: string;
    expiresAt: string;
    doctorName: string;
  } | null>(null);

  // Testimonial dialog

  const [testimonialDialogOpen, setTestimonialDialogOpen] = useState(false);
  const [doctorId, setDoctorId] = useState<string>("");
  const [profileData, setProfileData] = useState<any>(null);

  // Countdown labels
  const [countdowns, setCountdowns] = useState<{ [id: string]: string }>({});

  // Socket + extension states
  const [socket, setSocket] = useState<any>(null);
  const [extensionPendingFor, setExtensionPendingFor] = useState<string | null>(
    null
  );
  const [extensionApprovedFor, setExtensionApprovedFor] = useState<
    string | null
  >(null);
  const [extensionRejectedFor, setExtensionRejectedFor] = useState<
    string | null
  >(null);

  const { decodedToken } = Utility();
  const patientId = decodedToken()?.id;

  const strEq = (a?: any, b?: any) => String(a || "") === String(b || "");

  /* ---------- Fetch appointments ---------- */
  const fetchAppointments = React.useCallback(async () => {
    if (!patientId) return;
    try {
      const response = await fetcher(
        "appointment",
        `get-patients-appointment/${patientId}?page=${
          page + 1
        }&limit=${rowsPerPage}`
      );
      if (!response || !response.results) throw new Error("No data found");
      setAppointments(response.results || []);
      setTotalCount(response.count || 0);
      setError(null);
    } catch (err: any) {
      console.error("Error fetching appointments:", err);
      setError(err?.message || "Failed to load appointments");
      setAppointments([]);
      setTotalCount(0);
    }
  }, [patientId, page, rowsPerPage]);

  useEffect(() => {
    fetchAppointments();
  }, [fetchAppointments]);

  /* ---------- Countdown updater (every second) ---------- */
  useEffect(() => {
    const i = setInterval(() => {
      const newCountdowns: { [id: string]: string } = {};
      appointments.forEach((appointment) => {
        const info = getJoinCallInfo(
          appointment.appointmentDate,
          appointment.appointmentTime
        );
        const appointmentId = appointment._id;
        if (info.daysUntil === 0 && !info.canJoin && info.minutesLeft > 0) {
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
          newCountdowns[appointmentId] =
            hrs > 0
              ? `Can join in ${hrs}h:${minsLeft}m`
              : `Can join in ${String(minsLeft).padStart(2, "0")}m:${String(
                  secsLeft
                ).padStart(2, "0")}s`;
        } else {
          newCountdowns[appointmentId] = info.message;
        }
      });
      setCountdowns(newCountdowns);
    }, 1000);
    return () => clearInterval(i);
  }, [appointments]);

  /* ---------- Socket: join patient room + extension events ---------- */
  useEffect(() => {
    if (!patientId) return;
    const s = io("https://arogyaa.f2fintech.in/doctor-notifications", {
      path: "/chat-service/socket.io",
      transports: ["websocket"],
      autoConnect: true,
    });

    s.on("connect", () => {
      // Join patient_<id> room
      s.emit("joinPatientRoom", { patientId });
    });

    const onApproved = (payload: any) => {
      const apptId = String(payload?.appointmentId || "");
      console.log("[patient] extension approved payload:", payload);
      if (!apptId) return;
      if (extensionApprovedFor === apptId) return;

      if (activeCall && !strEq(activeCall.appointmentId, apptId)) {
        sessionStorage.setItem("extensionApproved", apptId);
        sessionStorage.setItem("extensionStatus", `approved:${apptId}`);
        return;
      }

      setExtensionApprovedFor(apptId);
      setExtensionPendingFor(null);
      sessionStorage.setItem("extensionApproved", apptId);
      sessionStorage.setItem("extensionStatus", `approved:${apptId}`);
      sessionStorage.removeItem("extensionPending");

      alert("Doctor approved your +20 min extension. Please pay to extend.");
    };

    const onRejected = (payload: any) => {
      const apptId = String(payload?.appointmentId || "");

      setExtensionRejectedFor(apptId || null);
      setExtensionPendingFor(null);

      sessionStorage.removeItem("extensionApproved");
      sessionStorage.removeItem("extensionPending");
      if (apptId)
        sessionStorage.setItem("extensionStatus", `rejected:${apptId}`);

      alert("Doctor rejected the extension request.");
    };

    const onExtended = (data: {
      appointmentId: string;
      newEndTime: string;
    }) => {
      if (activeCall && strEq(activeCall.appointmentId, data.appointmentId)) {
        setActiveCall({ ...activeCall, expiresAt: data.newEndTime });
        sessionStorage.setItem("dailyRoom_expiresAt", data.newEndTime);
      }
      setExtensionApprovedFor(null);
      sessionStorage.removeItem("extensionApproved");
      sessionStorage.removeItem("extensionPending");
      sessionStorage.removeItem("extensionStatus");
    };

    // ✅ NEW: when payment is actually done (server emits)
    const onExtensionPaid = (payload: {
      appointmentId: string;
      minutes?: number;
      txnid?: string;
      mode?: string;
    }) => {
      const apptId = String(payload?.appointmentId || "");
      if (!apptId) return;

      if (activeCall && String(activeCall.appointmentId) === apptId) {
        const addMs = (payload.minutes ?? 20) * 60 * 1000;
        const base = Math.max(
          Date.now(),
          new Date(activeCall.expiresAt).getTime()
        );
        const newEnd = new Date(base + addMs).toISOString();
        setActiveCall({ ...activeCall, expiresAt: newEnd });
        sessionStorage.setItem("dailyRoom_expiresAt", newEnd);
      }

      setExtensionApprovedFor(null);
      setExtensionPendingFor(null);
      ["extensionApproved", "extensionPending", "extensionStatus"].forEach(
        (k) => sessionStorage.removeItem(k)
      );

      alert(
        `Extension paid: +${payload.minutes ?? 20} min${
          payload.txnid ? ` (Txn ${payload.txnid})` : ""
        }`
      );
    };

    // ✅ generic fallback in case server emits only 'payment-success'
    const onAnyPaymentSuccess = (pl: any) => {
      if ((pl?.purpose || "").toUpperCase() === "EXTENSION")
        onExtensionPaid(pl);
    };

    // All ways the server may notify approvals/rejections
    s.on("extension-approved-awaiting-payment", onApproved);
    s.on("extension-approved", onApproved);
    s.on("doctor-approved-extension", onApproved);

    s.on("extension-rejected", onRejected);
    s.on("doctor-rejected-extension", onRejected);

    s.on("call-extended", onExtended);

    // ✅ NEW listeners
    s.on("extension-payment-success", onExtensionPaid);
    s.on("payment-success", onAnyPaymentSuccess);

    setSocket(s);
    return () => {
      s.off("extension-approved-awaiting-payment", onApproved);
      s.off("extension-approved", onApproved);
      s.off("doctor-approved-extension", onApproved);

      s.off("extension-rejected", onRejected);
      s.off("doctor-rejected-extension", onRejected);

      s.off("call-extended", onExtended);

      s.off("extension-payment-success", onExtensionPaid);
      s.off("payment-success", onAnyPaymentSuccess);

      s.removeAllListeners();
      s.close();
    };
  }, [patientId, activeCall, extensionApprovedFor]);
  // --- Picked-up join window: 10 minutes from pickedUpAt (fallback: appointmentDateTime) ---
  const pickedStartTime = (a: Appointment) => {
    if (a.pickedUpAt) return new Date(a.pickedUpAt);

    // fallback to appointment date + time if pickedUpAt missing
    const apptDay = new Date(a.appointmentDate);
    const [time, period] = (a.appointmentTime || "12:00 AM").split(" ");
    const [hh, mm] = time.split(":").map(Number);
    let H = hh;
    if (period === "PM" && hh !== 12) H += 12;
    if (period === "AM" && hh === 12) H = 0;
    apptDay.setHours(H, mm || 0, 0, 0);
    return apptDay;
  };

  const canJoinPickedUp = (a: Appointment) => {
    const start = pickedStartTime(a).getTime();
    const end = start + 10 * 60 * 1000; // 10 minutes window
    const now = Date.now();
    return now <= end;
  };

  useEffect(() => {
    if (!patientId) return;

    const base =
      process.env.NEXT_PUBLIC_APPOINTMENT_SOCKET_ENDPOINT ||
      window.location.origin;

    const s = io(`${base}/emergency-appointments`, {
      transports: ["websocket"],
      auth: { userId: patientId }, // personal room join will happen server-side
    });

    setApptSock(s);

    const onAccepted = (payload: {
      id: string;
      doctorId?: string;
      doctorName?: string;
      status?: string;
      pickedUpAt?: string;
    }) => {
      setAppointments((prev) =>
        prev.map((a) =>
          String(a._id) === String(payload.id)
            ? {
                ...a,
                status: payload.status || "picked_up",
                pickedUpAt: payload.pickedUpAt || a.pickedUpAt,
                doctorId:
                  a.doctorId ||
                  (payload.doctorId
                    ? { ...(a.doctorId as any), _id: payload.doctorId }
                    : a.doctorId),
              }
            : a
        )
      );

      const doc = payload.doctorName ? `Dr. ${payload.doctorName}` : "A doctor";
      const dest =
        (process.env.NEXT_PUBLIC_PATIENT_APPT_ROUTE || "/profile") +
        `?focus=${encodeURIComponent(payload.id)}`;
      showBrowserNotification(
        "✅ Emergency accepted",
        `${doc} has accepted your emergency request. Tap to open.`,
        dest
      );
    };

    s.on("emergency:accepted", onAccepted);

    function showBrowserNotification(
      title: string,
      body: string,
      url?: string
    ) {
      if (typeof window === "undefined") return;
      if (!("Notification" in window)) return;
      const fire = () => {
        try {
          const n = new Notification(title, { body });
          if (url) {
            n.onclick = () => {
              try {
                window.focus?.();
              } catch {}
              try {
                if (document.visibilityState === "hidden")
                  window.open(url, "_blank");
                else window.location.assign(url);
              } catch {
                window.location.href = url;
              }
              try {
                n.close?.();
              } catch {}
            };
          }
        } catch {}
      };
      if (Notification.permission === "granted") fire();
      else if (Notification.permission !== "denied") {
        Notification.requestPermission().then((p) => p === "granted" && fire());
      }
    }

    return () => {
      try {
        s.off("emergency:accepted", onAccepted);
        s.removeAllListeners();
      } catch {}
      s.close();
    };
  }, [patientId]);

  /* ---------- Restore session + extension flags on mount ---------- */
  useEffect(() => {
    const apptId = sessionStorage.getItem("dailyRoom_appointmentId");
    const expiresAt = sessionStorage.getItem("dailyRoom_expiresAt");
    const doctorName = sessionStorage.getItem("dailyRoom_doctorName");

    const pend = sessionStorage.getItem("extensionPending");
    const appr = sessionStorage.getItem("extensionApproved");
    const status = sessionStorage.getItem("extensionStatus");

    if (pend) setExtensionPendingFor(pend);
    if (appr) setExtensionApprovedFor(appr);

    if (status?.startsWith("approved:")) {
      setExtensionApprovedFor(status.split(":")[1]);
    } else if (status?.startsWith("pending:")) {
      setExtensionPendingFor(status.split(":")[1]);
    }

    if (apptId && expiresAt && doctorName) {
      const exp = new Date(expiresAt).getTime();
      const now = Date.now();
      if (now < exp) {
        setActiveCall({ appointmentId: apptId, expiresAt, doctorName });
        const roomUrl = sessionStorage.getItem("dailyRoom_roomUrl");
        if (roomUrl) setActiveRoomUrl(roomUrl);

        // 👉 presence (restore): mark as joined again
        try {
          apptSock?.emit("appointment:join", {
            appointmentId: apptId,
            as: "patient",
          });
          apptSock?.emit("appointment:get_state", { appointmentId: apptId });
        } catch {}

        const t = setTimeout(() => handleRoomExpired(apptId), exp - now);
        return () => clearTimeout(t);
      } else {
        handleRoomExpired(apptId);
      }
    }
  }, [apptSock]);

  /* ---------- Page visibility re-check ---------- */
  useEffect(() => {
    const onVis = () => {
      if (document.hidden) return;
      const apptId = sessionStorage.getItem("dailyRoom_appointmentId");
      const expiresAt = sessionStorage.getItem("dailyRoom_expiresAt");
      if (!apptId || !expiresAt) return;
      if (Date.now() >= new Date(expiresAt).getTime()) {
        handleRoomExpired(apptId);
      }
    };
    document.addEventListener("visibilitychange", onVis);
    return () => document.removeEventListener("visibilitychange", onVis);
  }, []);

  /* ---------- Payment (base consultation) ---------- */
    const handlePayNow = async (appointment: Appointment) => {
      setIsProcessing(true);
      setMessage("");
      try {
        const doc = appointment.doctorId as Doctor;
        const consultationFee = Number(doc?.consultationFee);
        if (!consultationFee || consultationFee <= 0) {
          setMessage(
            "Doctor's consultation fee is not set. Please contact support."
          );
          setIsProcessing(false);
          return;
        }
        const paymentData = {
          patientId:
            (appointment.patientId as Patient)?._id || appointment.patientId,
          doctorId: (appointment.doctorId as Doctor)?._id || appointment.doctorId,
          appointmentId: appointment._id,
          amount: consultationFee,
          currency: "INR",
          transactionMethod: "card",

          patientName: (appointment.patientId as Patient)?.username || "",
          doctorName: (appointment.doctorId as Doctor)?.username || "",
        };
        const res = await creator("payment", "/initiate-payment", paymentData);
        if (res?.txnid && res?.html) {
          const container = document.createElement("div");
          container.innerHTML = res.html;
          sessionStorage.setItem(
            `extensionTxn:${appointment._id}`,
            String(res.txnid)
          );
          document.body.appendChild(container);
          container.querySelector("form")?.submit();
        } else {
          setMessage("Payment initiation failed.");
        }
      } catch (e: any) {
        setMessage(e?.message || "Error initiating payment.");
      } finally {
        setIsProcessing(false);
      }
    };

  const handlePayExtensionNow = async (
    appointment: Appointment,
    minutes: number = 20
  ) => {
    setIsProcessing(true);
    setMessage("");
    try {
      const pat = appointment.patientId as Patient;
      const doc = appointment.doctorId as Doctor;

      // doctor fee → per-minute calc
      const baseFee = Number(doc?.consultationFee || 0);
      const perMinute = baseFee ? baseFee / 10 : 0;
      const extensionAmount = perMinute * minutes;

      const payload = {
        patientId: pat?._id || appointment.patientId,
        doctorId: doc?._id || appointment.doctorId,
        appointmentId: appointment._id,
        transactionMethod: "card",
        purpose: "EXTENSION",
        minutes,
        amount: extensionAmount || 100,
        currency: "INR",
      };

      const res = await creator("payment", "/initiate-payment", payload);

      if (res?.txnid && res?.html) {
        const container = document.createElement("div");
        container.innerHTML = res.html;
        document.body.appendChild(container);
        container.querySelector("form")?.submit();
      } else {
        setMessage("Extension payment initiation failed.");
      }
    } catch (e: any) {
      setMessage(e?.message || "Error initiating extension payment.");
    } finally {
      setIsProcessing(false);
    }
  };

  /* ---------- Handle PayU redirect (EXTENSION success) ---------- */
  useEffect(() => {
    const qs = new URLSearchParams(window.location.search);

    const redirectPurpose = (qs.get("purpose") || "").toUpperCase();
    const status = (qs.get("status") || "").toLowerCase();
    const apptId = qs.get("appointmentId") || qs.get("apptId") || "";
    const txnId =
      qs.get("txnid") || qs.get("mihpayid") || qs.get("paymentId") || "";
    const minutes = Number(qs.get("minutes") || "10");
    const method = qs.get("method") || "card";

    if (
      redirectPurpose === "EXTENSION" &&
      status === "success" &&
      apptId &&
      txnId
    ) {
      (async () => {
        try {
          setIsProcessing(true);

          const res = await creator(
            "chat",
            `/confirm-extension-payment/${apptId}`,
            {
              minutes,
              purpose: "EXTENSION",
              txnId,
              method,
              status: "success",
            }
          );

          if (res?.success) {
            if (
              res?.newEndTime &&
              activeCall &&
              String(activeCall.appointmentId) === String(apptId)
            ) {
              setActiveCall({ ...activeCall, expiresAt: res.newEndTime });
              sessionStorage.setItem("dailyRoom_expiresAt", res.newEndTime);
              sessionStorage.setItem(
                `extensionApplied:${apptId}`,
                String(txnId)
              );
              sessionStorage.removeItem(`extensionTxn:${apptId}`);
            }

            setExtensionApprovedFor(null);
            setExtensionPendingFor(null);
            [
              "extensionApproved",
              "extensionPending",
              "extensionStatus",
            ].forEach((k) => sessionStorage.removeItem(k));

            alert(`Extension successful: +${minutes} min added.`);
            fetchAppointments();
          } else {
            alert(
              res?.message ||
                "Payment captured, but extension confirmation failed."
            );
          }
        } catch (e) {
          console.error(e);
          alert(
            "Payment success, but failed to confirm extension. Please contact support."
          );
        } finally {
          setIsProcessing(false);
          const url = new URL(window.location.href);
          url.search = "";
          window.history.replaceState({}, "", url.toString());
        }
      })();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeCall?.appointmentId]);

  /* ---------- Create room (inline iframe) ---------- */
  const createRoom = async (appointment: Appointment) => {
    setCreatingRoom(appointment._id);
    try {
      const doc = appointment.doctorId as Doctor;
      const pat = appointment.patientId as Patient;

      const roomData = {
        type: "video",
        doctorId: doc._id,
        patientId: pat._id,
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

      if (response?.url && response?.expiresAt) {
        sessionStorage.setItem("dailyRoom_appointmentId", appointment._id);
        sessionStorage.setItem("dailyRoom_roomUrl", response.url);
        sessionStorage.setItem("dailyRoom_expiresAt", response.expiresAt);
        sessionStorage.setItem(
          "dailyRoom_doctorName",
          (appointment.doctorId as Doctor).username
        );
        sessionStorage.setItem(
          "dailyRoom_doctorId",
          (appointment.doctorId as Doctor)._id
        );
        sessionStorage.setItem("dailyRoom_isActive", "true");

        setActiveCall({
          appointmentId: appointment._id,
          expiresAt: response.expiresAt,
          doctorName: (appointment.doctorId as Doctor).username,
        });
        setActiveRoomUrl(response.url);

        // 👉 presence: tell server patient joined this appointment
        try {
          apptSock?.emit("appointment:join", {
            appointmentId: appointment._id,
            as: "patient",
          });
          apptSock?.emit("appointment:get_state", {
            appointmentId: appointment._id,
          });
        } catch {}

        const exp = new Date(response.expiresAt).getTime();
        const now = Date.now();
        if (exp > now) {
          setTimeout(() => {
            handleRoomExpired(appointment._id);
            setActiveRoomUrl(null);
          }, exp - now);
        }
      } else if (response?.message) {
        alert(response.message); // scheduled in future
      }
    } catch (e) {
      console.error("Error creating room:", e);
      alert("Failed to create room. Please try again.");
    } finally {
      setCreatingRoom(null);
    }
  };

  /* ---------- Rejoin call ---------- */
  const rejoinCall = () => {
    const apptId = sessionStorage.getItem("dailyRoom_appointmentId");
    const roomUrl = sessionStorage.getItem("dailyRoom_roomUrl");
    if (roomUrl) {
      setActiveRoomUrl(roomUrl);
      sessionStorage.setItem("dailyRoom_isActive", "true");
      // 👉 presence: re-join announcement
      if (apptId) {
        try {
          apptSock?.emit("appointment:join", {
            appointmentId: apptId,
            as: "patient",
          });
          apptSock?.emit("appointment:get_state", { appointmentId: apptId });
        } catch {}
      }
    }
  };

  /* ---------- Close / Expire handlers ---------- */
  const handleRoomClosed = (appointmentId: string) => {
    // 👉 presence: patient leaving
    try {
      apptSock?.emit("appointment:leave", {
        appointmentId,
        as: "patient",
      });
    } catch {}

    setActiveRoomUrl(null);
    const docId = sessionStorage.getItem("dailyRoom_doctorId") || "";
    const docName = sessionStorage.getItem("dailyRoom_doctorName") || "";

    [
      "appointmentId",
      "roomUrl",
      "expiresAt",
      "doctorName",
      "doctorId",
      "returnUrl",
      "joinedAt",
      "dailyRoom_isActive",
    ].forEach((k) => sessionStorage.removeItem(`dailyRoom_${k}`));

    setActiveCall(null);
    alert("Video call ended. Thank you!");

    if (docId && docName) {
      setDoctorId(docId);
      setProfileData({ data: { username: docName } });
      setTestimonialDialogOpen(true);
    }
    fetchAppointments();
  };

  const handleRoomExpired = (appointmentId: string) => {
    // 👉 presence: patient leaving
    try {
      apptSock?.emit("appointment:leave", {
        appointmentId,
        as: "patient",
      });
    } catch {}

    const docId = sessionStorage.getItem("dailyRoom_doctorId") || "";
    const docName = sessionStorage.getItem("dailyRoom_doctorName") || "";

    [
      "appointmentId",
      "roomUrl",
      "expiresAt",
      "doctorName",
      "doctorId",
      "returnUrl",
      "joinedAt",
      "dailyRoom_isActive",
    ].forEach((k) => sessionStorage.removeItem(`dailyRoom_${k}`));

    setActiveRoomUrl(null);
    setActiveCall(null);
    alert("Video call has expired.");

    if (docId && docName) {
      setDoctorId(docId);
      setProfileData({ data: { username: docName } });
      setTestimonialDialogOpen(true);
    }
    fetchAppointments();
  };

  const requestExtension = async (appointmentId: string) => {
    const apptId = String(appointmentId);
    try {
      setExtensionPendingFor(apptId);
      sessionStorage.setItem("extensionPending", apptId);
      sessionStorage.setItem("extensionStatus", `pending:${apptId}`);

      const res = await fetch(
        `${process.env.NEXT_PUBLIC_CHAT_URL}/extend-call/${apptId}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ duration: 20 }),
        }
      );

      const data = await res.json();
      if (res.ok && data?.success) {
        alert("Extension request sent to doctor.");
      } else {
        setExtensionPendingFor(null);
        sessionStorage.removeItem("extensionPending");
        sessionStorage.removeItem("extensionStatus");
        alert(data?.message || "Failed to request extension.");
      }
    } catch (e) {
      console.error(e);
      setExtensionPendingFor(null);
      sessionStorage.removeItem("extensionPending");
      sessionStorage.removeItem("extensionStatus");
      alert("Network error while sending extension request.");
    }
  };

  // --- Auto end based on expiresAt (fallback: +10 or +20 logic you had) ---
  useEffect(() => {
    if (!activeCall) return;

    const HARD_LIMIT_MS = isExtendedPaid ? 40 * 60 * 1000 : 20 * 60 * 1000;

    const serverMsLeft = activeCall.expiresAt
      ? new Date(activeCall.expiresAt).getTime() - Date.now()
      : Number.POSITIVE_INFINITY;

    const msLeft = Math.max(0, Math.min(serverMsLeft, HARD_LIMIT_MS));

    if (msLeft === 0) {
      setActiveRoomUrl(null);
      handleRoomExpired(String(activeCall.appointmentId));
      return;
    }

    const t = window.setTimeout(() => {
      setActiveRoomUrl(null);
      handleRoomExpired(String(activeCall.appointmentId));
    }, msLeft);

    return () => clearTimeout(t);
  }, [activeCall?.appointmentId, activeCall?.expiresAt, isExtendedPaid]);

  // --- Optional Poll: align with /extension-status (paid/none) ---
  useEffect(() => {
    if (!activeCall) return;
    const apptId = String(activeCall.appointmentId);

    const tick = async () => {
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_CHAT_URL}/extension-status/${apptId}`
        );
        const data = await res.json();
        const st = String(data?.extensionStatus || "").toLowerCase();

        if (st === "paid") {
          const addMs = 10 * 60 * 1000;
          const base = Math.max(
            Date.now(),
            new Date(activeCall.expiresAt).getTime()
          );
          const newEnd = new Date(base + addMs).toISOString();
          setActiveCall({ ...activeCall, expiresAt: newEnd });
          sessionStorage.setItem("dailyRoom_expiresAt", newEnd);

          setExtensionApprovedFor(null);
          setExtensionPendingFor(null);
          ["extensionApproved", "extensionPending", "extensionStatus"].forEach(
            (k) => sessionStorage.removeItem(k)
          );
          clearInterval(timer);
        }
      } catch {}
    };

    const timer = window.setInterval(tick, 3000);
    tick();

    return () => clearInterval(timer);
  }, [activeCall?.appointmentId]);

  useEffect(() => {
    if (!activeCall) return;

    const HARD_LIMIT_MS = 20 * 60 * 1000;
    const expMs = activeCall.expiresAt
      ? new Date(activeCall.expiresAt).getTime() - Date.now()
      : HARD_LIMIT_MS;

    const msLeft = Math.max(0, expMs);

    if (msLeft === 0) {
      setActiveRoomUrl(null);
      handleRoomExpired(String(activeCall.appointmentId));
      return;
    }

    const t = window.setTimeout(() => {
      setActiveRoomUrl(null);
      handleRoomExpired(String(activeCall.appointmentId));
    }, msLeft);

    return () => clearTimeout(t);
  }, [activeCall?.appointmentId, activeCall?.expiresAt]);

  // 👉 unmount cleanup: send leave if still active
  useEffect(() => {
    return () => {
      const apptId = sessionStorage.getItem("dailyRoom_appointmentId");
      if (apptId) {
        try {
          apptSock?.emit("appointment:leave", {
            appointmentId: apptId,
            as: "patient",
          });
        } catch {}
      }
    };
  }, [apptSock]);

  /* ---------- Helpers ---------- */
  const getStatusColor = (status: string) => {
    switch ((status || "").toLowerCase()) {
      case "completed":
        return "success";
      case "pending":
        return "warning";
      case "picked_up":
        return "success";
      case "cancelled":
        return "error";
      default:
        return "default";
    }
  };

  const canCreateRoom = (appointment: Appointment) =>
    appointment.appointmentType === "online" &&
    appointment.paymentStatus === "success";

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
    const apptDay = new Date(appointmentDate);

    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const apptDateOnly = new Date(
      apptDay.getFullYear(),
      apptDay.getMonth(),
      apptDay.getDate()
    );

    const isFutureDate = apptDateOnly > today;
    const isPastDate = apptDateOnly < today;
    const dayDiff = Math.floor(
      (apptDateOnly.getTime() - today.getTime()) / (1000 * 60 * 60 * 24)
    );

    const [time, period] = appointmentTime.split(" ");
    const [hours, minutes] = time.split(":").map(Number);
    let apptHour = hours;
    if (period === "PM" && hours !== 12) apptHour += 12;
    if (period === "AM" && hours === 12) apptHour = 0;

    const apptDateTime = new Date(apptDay);
    apptDateTime.setHours(apptHour, minutes, 0, 0);

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
    if (isPastDate) {
      return {
        canJoin: false,
        minutesLeft: -1,
        isFuture: false,
        daysUntil: -1,
        message: "Join time has passed",
      };
    }

    const diffMinutes = (apptDateTime.getTime() - now.getTime()) / (1000 * 60);
    const endTime = new Date(apptDateTime.getTime() + 10 * 60 * 1000);

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

  const headerStyle = {
    fontWeight: 600,
    textTransform: "uppercase" as const,
    color: "#fff",
  };
  const joinEnabledForRow = (a: Appointment) => {
    const st = (a.status || "").toLowerCase();
    if (a.appointmentType !== "online") return false;

    if (st === "picked_up") return true;

    if (
      st === "scheduled" &&
      String(a.paymentStatus).toLowerCase() === "success"
    ) {
      return getJoinCallInfo(a.appointmentDate, a.appointmentTime).canJoin;
    }
    return false;
  };

  const isExtensionApprovedFor = (apptId: string) => {
    const st = sessionStorage.getItem("extensionStatus") || "";
    return st === `approved:${apptId}` || extensionApprovedFor === apptId;
  };

  const isExtensionPendingFor = (apptId: string) => {
    const st = sessionStorage.getItem("extensionStatus") || "";
    return st === `pending:${apptId}` || extensionPendingFor === apptId;
  };

  /* ---------- Pagination handlers ---------- */
  const handleChangePage = (_: unknown, newPage: number) => setPage(newPage);
  const handleChangeRowsPerPage = (e: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(e.target.value, 10));
    setPage(0);
  };

  /* ---------- JSX ---------- */
  return (
    <Container maxWidth="lg">
      {error && (
        <Alert severity="error" sx={{ mb: 2, borderRadius: 2 }}>
          {error}
        </Alert>
      )}
      {/* Inline call container */}
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
                setActiveRoomUrl(null);
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

      {/* Active call banner + extension actions */}
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
            Active call with {activeCall.doctorName} — Expires at{" "}
            {new Date(
              purposeParam === "EXTENSION"
                ? new Date(activeCall.expiresAt).getTime() + 10 * 60 * 1000
                : new Date(activeCall.expiresAt).getTime()
            ).toLocaleTimeString("en-US", {
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
              const minutesLeft = Math.floor(
                (expiryTime - Date.now()) / (1000 * 60)
              );
              const apptId = String(activeCall.appointmentId);

              const statusQ = (query.get("status") || "").toLowerCase();
              const paymentQ = (query.get("payment") || "").toLowerCase();
              const purposeQ = (query.get("purpose") || "").toUpperCase();
              const apptIdQ = (query.get("appointmentId") ||
                query.get("apptId") ||
                "") as string;

              const paidSuccess =
                (statusQ === "success" || paymentQ === "success") &&
                (purposeQ === "EXTENDED" || purposeQ === "EXTENSION");

              const isPaidForThisAppt =
                paidSuccess && (!apptIdQ || apptIdQ === apptId);

              if (isPaidForThisAppt) {
                return (
                  <Button size="small" variant="contained" disabled>
                    Payment Successful
                  </Button>
                );
              }

              const storedStatus =
                sessionStorage.getItem("extensionStatus") ?? "";

              const isApproved =
                storedStatus === `approved:${apptId}` ||
                strEq(extensionApprovedFor ?? "", apptId) ||
                strEq(
                  sessionStorage.getItem("extensionApproved") ?? "",
                  apptId
                );

              const isPending =
                !isApproved &&
                (storedStatus === `pending:${apptId}` ||
                  strEq(extensionPendingFor ?? "", apptId) ||
                  strEq(
                    sessionStorage.getItem("extensionPending") ?? "",
                    apptId
                  ));

              if (isApproved) {
                return (
                  <Button
                    size="small"
                    variant="contained"
                    color="primary"
                    disabled={isProcessing}
                    onClick={() => {
                      const appt = appointments.find((a) => a._id === apptId);
                      if (appt) handlePayExtensionNow(appt, 10);
                    }}
                  >
                    {isProcessing ? "Processing..." : "Pay Now for Extension"}
                  </Button>
                );
              }

              if (isPending) {
                return (
                  <Button size="small" variant="outlined" disabled>
                    Pending approval…
                  </Button>
                );
              }

              if (minutesLeft <= 5) {
                return (
                  <Button
                    size="small"
                    variant="outlined"
                    color="secondary"
                    onClick={() => requestExtension(apptId)}
                  >
                    Request +20 Min Extension
                  </Button>
                );
              }
              return null;
            })()}
          </Box>
        </Alert>
      )}

      {/* Appointments table */}
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
              {/* <TableCell sx={headerStyle} align="center">
                Contact
              </TableCell> */}
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
              appointments.map((appointment) => {
                const canJoinInfo = getJoinCallInfo(
                  appointment.appointmentDate,
                  appointment.appointmentTime
                );
                const doc = appointment.doctorId as Doctor;

                return (
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
                    <TableCell>{doc?.username || "N/A"}</TableCell>

                    {/* Show contact only around join window
                    {appointment.paymentStatus === "success" &&
                    appointment.appointmentType === "online" &&
                    canJoinInfo.canJoin ? (
                      <TableCell>
                        <Box
                          sx={{ display: "flex", alignItems: "center", gap: 1 }}
                        >
                          <span>{doc?.contact || "N/A"}</span>
                          {doc?.contact && (
                            <Tooltip title="Message on WhatsApp">
                              <a
                                href={`https://wa.me/91${doc.contact}`}
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
                    )} */}

                    <TableCell sx={{ textAlign: "center" }}>
                      {appointment?.appointmentDate
                        ? new Date(appointment.appointmentDate)
                            .toISOString()
                            .split("T")[0]
                        : "N/A"}
                    </TableCell>

                    <TableCell>
                      {appointment?.appointmentTime || "N/A"}
                    </TableCell>
                    <TableCell align="center">
                      {(appointment?.doctorId as Doctor)?.consultationFee
                        ? `₹${(appointment.doctorId as Doctor).consultationFee}`
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
                          {/* ✅ PICKED_UP => always allow Join Call immediately */}
                          {String(appointment.status).toLowerCase() ===
                          "picked_up" ? (
                            canJoinPickedUp(appointment) ? (
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
                                  activeCall !== null
                                }
                                sx={{
                                  backgroundColor: "#4caf50",
                                  "&:hover": { backgroundColor: "#45a049" },
                                  "&:disabled": { backgroundColor: "#cccccc" },
                                  textTransform: "none",
                                  whiteSpace: "nowrap",
                                }}
                              >
                                {creatingRoom === appointment._id
                                  ? "Creating..."
                                  : "Join Call"}
                              </Button>
                            ) : (
                              <Box sx={{ color: "#fff", fontStyle: "italic" }}>
                                Joining time elapsed
                              </Box>
                            )
                          ) : (
                            /* rest of your original flow */

                            /* rest of your original flow */
                            <>
                              {appointment.paymentStatus === "pending" ? (
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
                                    if (period === "AM" && hours === 12)
                                      apptHour = 0;
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
                                    arrow: { sx: { color: "#fff" } },
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
                                    if (period === "AM" && hours === 12)
                                      apptHour = 0;
                                    apptDate.setHours(apptHour, minutes, 0, 0);
                                    const isPast = now > apptDate;

                                    return isPast ? (
                                      <Box
                                        sx={{
                                          color: "#fff",
                                          fontStyle: "italic",
                                        }}
                                      >
                                        Payment window has expired
                                      </Box>
                                    ) : (
                                      <Button
                                        variant="contained"
                                        size="small"
                                        color="warning"
                                        onClick={() =>
                                          handlePayNow(appointment)
                                        }
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
                                appointment.status === "scheduled" &&
                                canCreateRoom(appointment) ? (
                                  <>
                                    {(() => {
                                      const { canJoin, message } =
                                        getJoinCallInfo(
                                          appointment.appointmentDate,
                                          appointment.appointmentTime
                                        );
                                      return (
                                        <>
                                          <Button
                                            variant="contained"
                                            size="small"
                                            startIcon={
                                              creatingRoom ===
                                              appointment._id ? (
                                                <CircularProgress
                                                  size={16}
                                                  color="inherit"
                                                />
                                              ) : (
                                                <VideoCall />
                                              )
                                            }
                                            onClick={() =>
                                              createRoom(appointment)
                                            }
                                            disabled={
                                              creatingRoom ===
                                                appointment._id ||
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
                                              {countdowns[appointment._id] ||
                                                message}
                                            </Box>
                                          )}
                                        </>
                                      );
                                    })()}
                                  </>
                                ) : (
                                  <Box
                                    sx={{ color: "#fff", fontStyle: "italic" }}
                                  >
                                    {appointment.status === "completed"
                                      ? "Attended The Session"
                                      : appointment.status === "rejected"
                                      ? "Doctor is busy, choose another appointment slot"
                                      : "Doctor has not yet scheduled this appointment."}
                                  </Box>
                                )
                              ) : (
                                <Box sx={{ color: "#fff" }}>
                                  Payment status:{" "}
                                  {appointment.paymentStatus || "Unknown"}
                                </Box>
                              )}
                            </>
                          )}
                        </>
                      ) : null}
                    </TableCell>
                  </TableRow>
                );
              })
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
          onPageChange={(_e, newPage) => setPage(newPage)}
          onRowsPerPageChange={(e) => {
            setRowsPerPage(parseInt(e.target.value, 10));
            setPage(0);
          }}
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
            "& .MuiSelect-icon": { color: "#fff" },
            "& .MuiTablePagination-displayedRows": { color: "#fff" },
            "& .MuiTablePagination-actions": { color: "#fff" },
            "& .MuiIconButton-root": { color: "#fff" },
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
                  "&.Mui-selected": { backgroundColor: "#6a4bb8" },
                  "&:hover": { backgroundColor: "#7050c1" },
                },
              },
            },
          }}
        />

        <CreateTestimonialDialog
          open={testimonialDialogOpen}
          onClose={() => {
            setTestimonialDialogOpen(false);
            setDoctorId("");
            setProfileData(null);
          }}
          doctorId={doctorId}
          doctorName={profileData?.data?.username || "Unknown"}
          fetchTestimonials={() => {}}
        />
      </TableContainer>
    </Container>
  );
};

export default AppointmentHistory;
