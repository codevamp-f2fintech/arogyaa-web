// components/ShareButton.tsx
import { useState } from "react";
import { IconButton, Tooltip, Snackbar, Alert } from "@mui/material";
import ShareIcon from "@mui/icons-material/Share";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";

interface ShareButtonProps {
  url?: string; // override link if needed
  title?: string; // share sheet title
  text?: string; // share sheet body
}

export default function ShareButton({
  url = typeof window !== "undefined" ? window.location.href : "",
  title = "Check out this doctor",
  text = "Found this doctor profile on Arogyaa:",
}: ShareButtonProps) {
  const [open, setOpen] = useState(false);

  const handleShare = async () => {
    // 1️⃣  Prefer native share if supported
    if (navigator.share) {
      try {
        await navigator.share({ title, text, url });
      } catch (err) {
        /* user cancelled – silently ignore */
      }
      return;
    }

    // 2️⃣  Fallback: copy to clipboard
    try {
      await navigator.clipboard.writeText(url);
      setOpen(true);
    } catch {
      alert("Could not copy link. Please copy it manually.");
    }
  };

  return (
    <>
      <IconButton
        sx={{
          color: "#fff",
          display: "flex",
          alignItems: "center",
          gap: 1,
          "&:hover": {
            background: "transparent",
            color: "#b497d6",
          },
          "& .button-text": {
            transition: "opacity 0.2s ease",
            fontSize: "15px",
          },
          "&:hover .button-text": {
            color: "white",
            background: "transprent",
          },
        }}
        onClick={handleShare}
        aria-label=""
      >
        {/* Show copy icon if web‑share unavailable */}
        <span className="button-text "></span>

        {navigator.share ? <ShareIcon /> : <ContentCopyIcon />}
      </IconButton>

      {/* Snackbar for “Link copied” */}
      <Snackbar
        open={open}
        autoHideDuration={3000}
        onClose={() => setOpen(false)}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert severity="success" sx={{ width: "100%" }}>
          Link copied to clipboard!
        </Alert>
      </Snackbar>
    </>
  );
}
