// "use client";

// import React from "react";
// import { Box, Typography, Button } from "@mui/material";
// import EventIcon from "@mui/icons-material/Event";

// interface VisitInfoSecProps {
//   previousVisit: {
//     appointmentDate: string;
//     appointmentTime: string;
//   } | null;
//   nextVisit: {
//     appointmentDate: string;
//     appointmentTime: string;
//   } | null;
//   isEditing: boolean;
//   updateUserProfile: () => void;
//   handleCancelEdit: () => void;
// }

// const VisitInfoSec: React.FC<VisitInfoSecProps> = ({
//   previousVisit,
//   nextVisit,
//   isEditing,
//   updateUserProfile,
//   handleCancelEdit,
// }) => {
//   return (
//     <Box
//       sx={{
//         p: { xs: 1.5, sm: 2 },
//         borderRadius: "16px",
//         background: "rgba(255, 255, 255, 0.9)",
//         boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.1)",
//         width: "95%",
//         mx: "auto",
//         my: 3,
//         position: "relative",
//       }}
//     >
//       <Typography
//         variant="body1"
//         sx={{
//           fontWeight: "700",
//           color: "#B497D6",
//           mb: 2,
//           textTransform: "uppercase",
//           letterSpacing: "0.5px",
//           fontSize: "1rem",
//         }}
//       >
//         Visit Information
//       </Typography>

//       <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
//         {/* Previous Visit */}
//         <Box
//           sx={{
//             display: "flex",
//             flexDirection: { xs: "column", sm: "row" },
//             alignItems: { xs: "flex-start", sm: "center" },
//             justifyContent: "space-between",
//             px: 2,
//             py: 1.5,
//             borderRadius: "12px",
//             backgroundColor: "#F8F5FF",
//             boxShadow: "0px 2px 6px rgba(0, 0, 0, 0.05)",
//             gap: { xs: 1, sm: 0 },
//           }}
//         >
//           <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
//             <EventIcon sx={{ color: "#B497D6" }} />
//             <Typography
//               sx={{
//                 fontWeight: 600,
//                 fontSize: "0.95rem",
//                 color: "#29175e",
//               }}
//             >
//               Previous Visit:
//             </Typography>
//           </Box>
//           <Typography
//             sx={{
//               fontSize: "0.9rem",
//               fontWeight: "500",
//               color: "#29175e",
//             }}
//           >
//             {previousVisit
//               ? `${new Date(
//                   previousVisit.appointmentDate
//                 ).toLocaleDateString()} at ${previousVisit.appointmentTime}`
//               : "N/A"}
//           </Typography>
//         </Box>

//         {/* Next Visit */}
//         <Box
//           sx={{
//             display: "flex",
//             flexDirection: { xs: "column", sm: "row" },
//             alignItems: { xs: "flex-start", sm: "center" },
//             justifyContent: "space-between",
//             px: 2,
//             py: 1.5,
//             borderRadius: "12px",
//             backgroundColor: "#F8F5FF",
//             boxShadow: "0px 2px 6px rgba(0, 0, 0, 0.05)",
//             gap: { xs: 1, sm: 0 },
//           }}
//         >
//           <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
//             <EventIcon sx={{ color: "#B497D6" }} />
//             <Typography
//               sx={{
//                 fontWeight: 600,
//                 fontSize: "0.95rem",
//                 color: "#29175e",
//               }}
//             >
//               Next Visit:
//             </Typography>
//           </Box>
//           <Typography
//             sx={{
//               fontSize: "0.9rem",
//               fontWeight: "500",
//               color: "#2C3E50",
//             }}
//           >
//             {nextVisit
//               ? `${new Date(
//                   nextVisit.appointmentDate
//                 ).toLocaleDateString()} at ${nextVisit.appointmentTime}`
//               : "N/A"}
//           </Typography>
//         </Box>
//       </Box>
//     </Box>
//   );
// };

// export default VisitInfoSec;
