"use client";
import { useEffect } from "react";
import io, { Socket } from "socket.io-client";

let doctorSock: Socket | null = null;
let apptSock: Socket | null = null;

function notify(title: string, body: string, url?: string) {
  if (typeof window === "undefined" || !("Notification" in window)) return;
  const fire = () => {
    const n = new Notification(title, { body });
    if (url) {
      n.onclick = () => {
        try { window.focus?.(); } catch {}
        try {
          if (document.visibilityState === "hidden") window.open(url, "_blank");
          else window.location.assign(url);
        } catch { window.location.href = url; }
        try { n.close?.(); } catch {}
      };
    }
  };
  if (Notification.permission === "granted") fire();
  else if (Notification.permission !== "denied") {
    Notification.requestPermission().then((p) => p === "granted" && fire());
  }
}

export default function SocketListener({ patientId }: { patientId?: string | null }) {
  useEffect(() => {
    // Doctor notifications socket
    if (!doctorSock) {
      doctorSock = io("https://arogyaa.f2fintech.in/doctor-notifications", {
        path: "/chat-service/socket.io",
        transports: ["websocket"],
        autoConnect: true,
      });

      doctorSock.on("connect", () => {
        if (patientId) doctorSock!.emit("joinPatientRoom", { patientId });
      });

      const onApproved = (pl: any) => {
        notify("Extension approved", "Doctor approved +20 min. Complete payment.");
        sessionStorage.setItem("extensionApproved", String(pl?.appointmentId || ""));
      };

      const onRejected = () => notify("Extension rejected", "Doctor rejected your request.");
      const onExtended = () => notify("Call extended", "Your call duration has been extended.");
      const onPaid = (pl: any) =>
        notify("Payment successful", `+${pl?.minutes ?? 20} min added.`);

      doctorSock.on("extension-approved", onApproved);
      doctorSock.on("extension-rejected", onRejected);
      doctorSock.on("call-extended", onExtended);
      doctorSock.on("extension-payment-success", onPaid);
      doctorSock.on("payment-success", (pl: any) => {
        if ((pl?.purpose || "").toUpperCase() === "EXTENSION") onPaid(pl);
      });
    }


    if (!apptSock) {
      apptSock = io("https://arogyaa.f2fintech.in/emergency-appointments", {
        path: "/appointment-service/socket.io",
        transports: ["websocket"],
        autoConnect: true,
        auth: patientId ? { userId: patientId } : undefined,
      });

      apptSock.on("emergency:accepted", (pl: { id: string; doctorName?: string }) => {
        const doc = pl.doctorName ? `Dr. ${pl.doctorName}` : "A doctor";
        notify("Emergency accepted", `${doc} accepted your request.`, "/profile?focus=" + pl.id);
      });
    }
  }, [patientId]);

  return null; 
}
