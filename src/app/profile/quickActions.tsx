// import React from "react";
// import { Grid, Paper, Typography, Box } from "@mui/material";
// import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
// import FolderIcon from "@mui/icons-material/Folder";
// import CheckCircleIcon from "@mui/icons-material/CheckCircle";
// import CurrencyRupeeIcon from "@mui/icons-material/CurrencyRupee";
// import AppointmentHistory from "../components/appointment-history";
// import TestHistory from "../components/Test-history";
// import BillingHistory from "../components/Billing-history";
// import TreatmentHistory from "../components/Treatment-history";

// const quickActions = [
//   { icon: CalendarTodayIcon, label: "Appointments", value: "appointments" },
//   { icon: FolderIcon, label: "Tests", value: "tests" },
//   { icon: CheckCircleIcon, label: "Treatments", value: "treatments" },
//   { icon: CurrencyRupeeIcon, label: "Billings", value: "billings" },
// ];

// // Inline version of CustomMenuItem
// const CustomMenuItem = ({
//   icon: Icon,
//   label,
//   value,
//   activeView,
//   setActiveView,
//   sx = {},
// }) => (
//   <Paper
//     elevation={3}
//     sx={{
//       display: "flex",
//       flexDirection: "column",
//       alignItems: "center",
//       padding: "1rem",
//       borderRadius: "12px",
//       cursor: "pointer",
//       transition: "all 0.3s ease",
//       "&:hover": {
//         transform: "translateY(-5px)",
//         boxShadow: "0 8px 16px rgba(0,0,0,0.1)",
//       },
//       "& .MuiTypography-root": {
//         color: activeView === value ? "#29175e" : "#29175e",
//         fontWeight: activeView === value ? "550" : "570",
//         fontFamily: "Poppins",
//       },
//       "& .MuiSvgIcon-root": {
//         color: activeView === value ? "#29175e" : "#B497D6",
//       },
//       ...sx,
//     }}
//     onClick={() => setActiveView(value)}
//   >
//     <Icon sx={{ fontSize: "2rem", mb: 1 }} />
//     <Typography variant="body2">{label}</Typography>
//   </Paper>
// );

// const QuickActionsPanel = ({ activeView, setActiveView }) => {
//   return (
//     <Grid sx={{ height: "90vh" }} item xs={12} md={8}>
//       <Paper
//         elevation={3}
//         sx={{
//           p: { xs: 1.5, sm: 2 },
//           width: "100%",
//           height: "auto",
//           minHeight: { xs: "240px", sm: "260px", md: "280px" },
//           borderRadius: "16px",
//           background: "#7b56ce",
//           border: "1px solid #29175e",
//           boxShadow: "0 4px 12px rgba(0, 0, 0, 0.08)",
//           transition: "all 0.25s cubic-bezier(0.4, 0, 0.2, 1)",
//           "&:hover": {
//             transform: "translateY(-2px)",
//             boxShadow: "0 6px 16px rgba(0, 0, 0, 0.12)",
//             borderColor: "#29175e",
//           },
//         }}
//       >
//         <Typography
//           variant="h6"
//           sx={{
//             mb: 3,
//             ml: { xs: 2, sm: 3 },
//             color: "#fff",
//             fontWeight: "700",
//             fontSize: { xs: "1.125rem", sm: "1.25rem" },
//             position: "relative",
//             fontFamily: "Poppins",
//             "&::after": {
//               content: '""',
//               position: "absolute",
//               bottom: -8,
//               left: 0,
//               width: "40px",
//               height: "3px",
//               background: "linear-gradient(90deg, #29175e, transparent)",
//               borderRadius: "3px",
//               transition: "width 0.3s ease",
//             },
//             "&:hover::after": {
//               width: "80px",
//             },
//           }}
//         >
//           Quick Actions
//         </Typography>

//         <Grid
//           container
//           spacing={{ xs: 0.5, sm: 1 }}
//           sx={{ justifyContent: "space-around" }}
//         >
//           {quickActions.map((action, index) => (
//             <Grid item xs={6} sm={4} md={2} key={index}>
//               <Box
//                 sx={{
//                   height: "100%",
//                   transition: "all 0.2s ease",
//                   "&:hover": {
//                     transform: "scale(1.02)",
//                   },
//                 }}
//               >
//                 <CustomMenuItem
//                   icon={action.icon}
//                   label={action.label}
//                   value={action.value}
//                   activeView={activeView}
//                   setActiveView={setActiveView}
//                   sx={{
//                     transition: "all 0.2s ease",
//                     "&:hover": {
//                       backgroundColor: "rgba(245, 245, 245, 0.7)",
//                     },
//                     fontSize: { xs: "0.875rem", sm: "1rem" },
//                     padding: { xs: "8px", sm: "12px" },
//                   }}
//                 />
//               </Box>
//             </Grid>
//           ))}
//         </Grid>
//       </Paper>

//       <Paper
//         elevation={3}
//         sx={{
//           marginTop: { xs: "10px", sm: "15px", md: "20px" },
//           p: { xs: 2, sm: 3, md: 4 },
//           borderRadius: { xs: "12px", sm: "16px", md: "20px" },
//           background: "#7b56ce",
//           border: "1px solid #29175e",
//         }}
//       >
//         {activeView === "appointments" && <AppointmentHistory />}
//         {activeView === "tests" && <TestHistory />}
//         {activeView === "billings" && <BillingHistory />}
//         {activeView === "treatments" && <TreatmentHistory />}
//       </Paper>
//     </Grid>
//   );
// };

// export default QuickActionsPanel;
