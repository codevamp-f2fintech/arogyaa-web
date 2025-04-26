// import { Box, Typography, Select, MenuItem, TextField } from "@mui/material";
// import {
//   Phone as PhoneIcon,
//   Email as EmailIcon,
//   Wc as WcIcon,
//   CalendarMonth as CalendarMonthIcon,
//   Straighten,
//   MonitorWeight,
//   LocationOn as LocationOnIcon,
//   Favorite as FavoriteIcon,
//   MedicalInformation as MedicalInformationIcon,
//   Healing as HealingIcon,
//   Medication as MedicationIcon,
// } from "@mui/icons-material";
// import React from "react";

// interface Props {
//   isEditing: boolean;
//   user: Record<string, any>;
//   editValues: Record<string, any>;
//   handleInputChange: (key: string, value: string) => void;
//   errors: Record<string, string>;
// }

// const UserDetailsSection: React.FC<Props> = ({
//   isEditing,
//   user,
//   editValues,
//   handleInputChange,
//   errors,
// }) => {
//   const fields = [
//     { icon: <PhoneIcon />, label: "Contact", key: "contact" },
//     { icon: <EmailIcon />, label: "Email", key: "email" },
//     { icon: <WcIcon />, label: "Gender", key: "gender" },
//     { icon: <CalendarMonthIcon />, label: "Age", key: "age" },
//     { icon: <Straighten />, label: "Height", key: "height" },
//     { icon: <MonitorWeight />, label: "Weight", key: "weight" },
//     { icon: <LocationOnIcon />, label: "Address", key: "address" },
//     { icon: <FavoriteIcon />, label: "Blood Group", key: "bloodGroup" },
//     {
//       icon: <MedicalInformationIcon />,
//       label: "Medical History",
//       key: "medicalHistory",
//     },
//     { icon: <HealingIcon />, label: "Allergies", key: "allergies" },
//     {
//       icon: <MedicationIcon />,
//       label: "Current Medication",
//       key: "currentMedication",
//     },
//   ];

//   return (
//     <Box
//       sx={{
//         display: "flex",
//         flexDirection: "column",
//         gap: 1.5,
//         width: "100%",
//         px: { xs: 1, sm: 2 },
//         "& .css-1n4twyu-MuiInputBase-input-MuiOutlinedInput-input": {
//           color: "#000",
//         },
//       }}
//     >
//       {fields.map((item, index) => (
//         <Box
//           key={index}
//           sx={{
//             display: "flex",
//             alignItems: "center",
//             gap: 1,
//             px: { xs: 2, sm: 3 },
//             py: { xs: 1, sm: 1.5 },
//             borderRadius: "50px",
//             backgroundColor: "rgba(255, 255, 255, 0.9)",
//             boxShadow: "0px 2px 6px rgba(0, 0, 0, 0.05)",
//             width: "100%",
//             transition: "all 0.2s ease-in-out",
//             "&:hover": {
//               transform: "translateY(-2px)",
//               boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.1)",
//             },
//             "&:hover .MuiOutlinedInput-notchedOutline": {
//               borderColor: "#aaa",
//             },
//           }}
//         >
//           <Box
//             sx={{
//               display: "flex",
//               alignItems: "center",
//               justifyContent: "center",
//               width: "32px",
//               height: "32px",
//               borderRadius: "50%",
//               backgroundColor: "#B497D6",
//             }}
//           >
//             {React.cloneElement(item.icon, {
//               sx: { color: "#29175e", fontSize: "18px" },
//               fontSize: "small",
//             })}
//           </Box>

//           <Typography
//             sx={{
//               fontWeight: 600,
//               fontSize: "0.9rem",
//               minWidth: { xs: "50px", sm: "60px" },
//               color: "#56428B",
//             }}
//           >
//             {item.label}:
//           </Typography>

//           <Box
//             sx={{
//               flex: 1,
//               textAlign: "left",
//               overflow: "hidden",
//               "&:hover .MuiOutlinedInput-notchedOutline": {
//                 borderColor: "#aaa",
//               },
//               "& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline":
//                 {
//                   borderColor: "#b1a2dc",
//                 },
//             }}
//           >
//             {isEditing ? (
//               item.key === "gender" ? (
//                 <Select
//                   size="small"
//                   value={editValues[item.key] || ""}
//                   onChange={(e) => handleInputChange(item.key, e.target.value)}
//                   sx={{ width: "100%" }}
//                   MenuProps={{
//                     PaperProps: {
//                       sx: {
//                         backgroundColor: "#fff",
//                         color: "#000",
//                         "& .MuiMenuItem-root": {
//                           color: "#000",
//                         },
//                       },
//                     },
//                   }}
//                 >
//                   <MenuItem value="Male">Male</MenuItem>
//                   <MenuItem value="Female">Female</MenuItem>
//                   <MenuItem value="Other">Other</MenuItem>
//                 </Select>
//               ) : (
//                 <TextField
//                   size="small"
//                   value={
//                     item.key === "bloodGroup"
//                       ? editValues[item.key] || "A+"
//                       : editValues[item.key] || ""
//                   }
//                   onChange={(e) => handleInputChange(item.key, e.target.value)}
//                   error={!!errors[item.key]}
//                   helperText={errors[item.key]}
//                   type={item.key === "email" ? "email" : "text"}
//                   sx={{ width: "100%" }}
//                 />
//               )
//             ) : (
//               <Typography
//                 sx={{
//                   fontSize: "0.9rem",
//                   color: "#2C3E50",
//                   whiteSpace: "nowrap",
//                   overflow: "hidden",
//                   textOverflow: "ellipsis",
//                 }}
//               >
//                 {item.key === "email"
//                   ? user?.[item.key]
//                     ? `${user[item.key].substring(0, 3)}...${user[
//                         item.key
//                       ].substring(user[item.key].indexOf("@"))}`
//                     : "N/A"
//                   : user?.[item.key] ??
//                     (item.key === "bloodGroup" ? "A+" : "N/A")}
//               </Typography>
//             )}
//           </Box>
//         </Box>
//       ))}
//     </Box>
//   );
// };

// export default UserDetailsSection;
