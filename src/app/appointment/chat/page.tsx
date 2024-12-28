"use client";
import Topbar from "../../Components/common/Topbar";
import React, { useState, useEffect, useRef } from "react";
import { io, Socket } from "socket.io-client";
import {
  TextField,
  Button,
  Box,
  Typography,
  Avatar,
  List,
  ListItem,
  ListItemText,
  Divider,
  IconButton,
  Menu,
  MenuItem,
  InputAdornment,
} from "@mui/material";
import PersonIcon from "@mui/icons-material/Person";
import LocalHospitalIcon from "@mui/icons-material/LocalHospital";
import LightModeIcon from "@mui/icons-material/LightMode";
import DarkModeIcon from "@mui/icons-material/DarkMode";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import DeleteIcon from "@mui/icons-material/Delete";
import SearchIcon from '@mui/icons-material/Search';
import { useGetDoctors } from "@/hooks/doctor";
interface Message {
  sender: string;
  message: string;
  timestamp: string;
}

const Chat: React.FC = () => {
  const {
    value: doctorList,
    swrLoading,
    error
  } = useGetDoctors(
    null,
    "get-doctors",
    1,
    6
  );
  useEffect(() => {
    if (doctorList && doctorList.results && doctorList.results.length > 0) {
      setSelectedDoctor(doctorList.results[0].username);
    }
  }, [doctorList]);

  const patientId = "67319b8ac6323f30b321365f";
  const [selectedDoctor, setSelectedDoctor] = useState<string>("doctor1");
  const [role, setRole] = useState<"patient" | "doctor">("patient");
  const [socket, setSocket] = useState<Socket | null>(null);
  const [message, setMessage] = useState<string>("");
  const [chatMessages, setChatMessages] = useState<Message[]>([]);
  const [filteredMessages, setFilteredMessages] = useState<Message[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [darkMode, setDarkMode] = useState(false);
  const [isTyping, setIsTyping] = useState<string | null>(null);
  const [connected, setConnected] = useState(false);

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const roomId = `${patientId}-${selectedDoctor}`;
  const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Fetch messages when room changes
  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const response = await fetch(
          `http://localhost:4009/api/v1/chat-service/get-messages?roomId=${roomId}`
        );
        if (!response.ok) {
          throw new Error(`Error: ${response.statusText}`);
        }
        const data: Message[] = await response.json();
        setChatMessages(data);
        setFilteredMessages(data);
      } catch (error) {
        console.error("Failed to fetch messages:", error);
      }
    };

    fetchMessages();
  }, [roomId]);

  // Socket.io connection
  useEffect(() => {
    const socketInstance = io("http://localhost:4009");
    setSocket(socketInstance);

    socketInstance.emit("register", {
      id: role === "patient" ? patientId : selectedDoctor,
    });
    socketInstance.emit("joinRoom", roomId);

    socketInstance.on("connect", () => setConnected(true));
    socketInstance.on("disconnect", () => setConnected(false));

    socketInstance.on("receiveMessage", (data: Message) => {
      setChatMessages((prevMessages) => {
        const updatedMessages = [...prevMessages, data];
        setFilteredMessages(filterMessages(updatedMessages, searchQuery));
        return updatedMessages;
      });
    });

    socketInstance.on("userTyping", (data: any) => {
      const typingUser = data.sender === patientId ? "Patient" : "Doctor";
      setIsTyping(typingUser);
      if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
      typingTimeoutRef.current = setTimeout(() => setIsTyping(null), 3000);
    });

    return () => {
      socketInstance.disconnect();
    };
  }, [roomId, role]);

  const handleDeleteAllMessages = async () => {
    try {
      const response = await fetch(
        `http://localhost:4009/api/chat/delete-messages?roomId=${roomId}`,
        { method: "DELETE" }
      );
      if (!response.ok) {
        throw new Error(`Error: ${response.statusText}`);
      }
      setChatMessages([]);
      alert("All messages have been deleted.");
    } catch (error) {
      console.error("Failed to delete all messages:", error);
      alert("Failed to delete all messages. Please try again.");
    }
  };

  // Filter messages when search query changes
  useEffect(() => {
    setFilteredMessages(filterMessages(chatMessages, searchQuery));
  }, [searchQuery, chatMessages]);

  const filterMessages = (messages: Message[], query: string) => {
    return messages.filter((msg) =>
      msg.message.toLowerCase().includes(query.toLowerCase())
    );
  };

  const handleSendMessage = async () => {
    if (socket && message.trim()) {
      const timestamp = new Date().toISOString();
      const senderId = role === "patient" ? patientId : selectedDoctor;

      const newMessage = {
        roomId,
        sender: senderId,
        message,
        timestamp,
      };

      socket.emit("sendMessage", newMessage);

      try {
        const response = await fetch(
          "http://localhost:4009/api/v1/chat-service/save-message",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(newMessage),
          }
        );

        if (!response.ok) {
          throw new Error(`Error: ${response.statusText}`);
        }

        setChatMessages((prevMessages) => [...prevMessages, newMessage]);
        setMessage("");
      } catch (error) {
        console.error("Failed to save message:", error);
      }
    }
  };

  const handleTyping = () => {
    if (socket) {
      const senderId = role === "patient" ? patientId : selectedDoctor;
      socket.emit("typing", { roomId, sender: senderId });
    }
  };

  const handleToggleTheme = () => setDarkMode(!darkMode);

  const handleMenuClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  return (
    <div>
      <Topbar />
      <Box
        sx={{
          display: "flex",
          height: "100vh",
          backgroundColor: darkMode ? "#121212" : "#eef2f5",
          marginTop: "64px",
        }}
      >
        {/* Sidebar */}
        <Box
          sx={{
            width: "300px",
            padding: 2,
            background: darkMode
              ? "#1d1d1d"
              : "linear-gradient(to right, #20ada0, #1d8a7b)",
            color: "#fff",
            boxShadow: "2px 0 5px rgba(0,0,0,0.1)",
          }}
        >
          <Typography variant="h5" gutterBottom>
            Doctors
          </Typography>
          <List>
            {Array.isArray(doctorList?.results) &&
              doctorList.results.map((doctor) => (
                <ListItem
                  key={doctor.username}
                  button
                  selected={selectedDoctor === doctor.username}
                  onClick={() => setSelectedDoctor(doctor.username)}
                  sx={{
                    backgroundColor:
                      selectedDoctor === doctor.username
                        ? "#00f2fe"
                        : "transparent",
                    borderRadius: "8px",
                    marginBottom: 1,
                  }}
                >
                  <Avatar
                    sx={{ marginRight: 1, bgcolor: "#fff", color: "#00f2fe" }}
                  >
                    <LocalHospitalIcon />
                  </Avatar>
                  <ListItemText primary={`${doctor.username}`} />
                </ListItem>
              ))}
          </List>
          <Divider sx={{ borderColor: "rgba(255,255,255,0.5)" }} />
          <Typography variant="h6" sx={{ marginTop: 2, marginBottom: 1 }}>
            Role
          </Typography>
          <List>
            <ListItem
              button
              selected={role === "patient"}
              onClick={() => setRole("patient")}
              sx={{ borderRadius: "8px" }}
            >
              <Avatar
                sx={{ marginRight: 1, bgcolor: "#fff", color: "#4facfe" }}
              >
                <PersonIcon />
              </Avatar>
              <ListItemText primary="Patient" />
            </ListItem>
            <ListItem
              button
              selected={role === "doctor"}
              onClick={() => setRole("doctor")}
              sx={{ borderRadius: "8px" }}
            >
              <Avatar
                sx={{ marginRight: 1, bgcolor: "#fff", color: "#4facfe" }}
              >
                <LocalHospitalIcon />
              </Avatar>
              <ListItemText primary="Doctor" />
            </ListItem>
          </List>
        </Box>

        <Box sx={{ flex: 1, display: "flex", flexDirection: "column" }}>
          {/* Header */}
          <Box
            sx={{
              padding: 2,
              background: darkMode ? "#333" : "#20ada0",
              color: "#fff",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <Box sx={{ display: "flex", alignItems: "center" }}>
              <Avatar
                sx={{ marginRight: 2, bgcolor: "#fff", color: "#6a11cb" }}
              >
                {role === "patient" ? "P" : "D"}
              </Avatar>
              <Box>
                <Typography variant="h6">
                  {role === "patient" ? "Patient" : "Doctor"}
                </Typography>
                {/* <Typography variant="body2" sx={{ color: "#e0f7fa" }}>
                  {connected ? "Online" : "Offline"}
                </Typography> */}
              </Box>
            </Box>

            <Box sx={{ display: "flex", alignItems: "center" }}>
              <IconButton sx={{ color: "#fff" }}>
                <Typography
                  variant="caption"
                  sx={{
                    background: "#ff1744",
                    color: "#fff",
                    borderRadius: "50%",
                    padding: "2px 6px",
                    fontSize: "0.75rem",
                    position: "absolute",
                    top: "-5px",
                    right: "-5px",
                  }}
                ></Typography>
              </IconButton>

              <IconButton sx={{ color: "#fff" }} onClick={handleToggleTheme}>
                {darkMode ? <LightModeIcon /> : <DarkModeIcon />}
              </IconButton>

              <IconButton
                onClick={handleMenuClick}
                sx={{ color: "#fff", marginLeft: 2 }}
              >
                <Typography sx={{ marginRight: 1 }}>
                  {role === "patient" ? "Patient" : "Doctor"}
                </Typography>
                <ArrowDropDownIcon />
              </IconButton>
              <Menu
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={handleMenuClose}
              >
                <MenuItem onClick={() => console.log("Profile clicked")}>
                  Profile
                </MenuItem>

                <MenuItem onClick={handleDeleteAllMessages}>
                  <DeleteIcon fontSize="small" sx={{ marginRight: 1 }} />
                  Delete All Chat
                </MenuItem>
              </Menu>
            </Box>
          </Box>

          {/* Chat Messages */}
          <Box
            sx={{
              flex: 1,
              overflowY: "auto",
              padding: 3,
              backgroundColor: darkMode ? "#121212" : "#f4f4f9",
            }}
          >
            {filteredMessages.map((msg, index) => (
              <Box
                key={index}
                sx={{
                  marginBottom: 2,
                  display: "flex",
                  justifyContent:
                    msg.sender === patientId ? "flex-start" : "flex-end",
                }}
              >
                <Avatar
                  sx={{
                    bgcolor: msg.sender === patientId ? "#20ada0" : "#20ada0",
                    marginRight: msg.sender === patientId ? "10px" : "0",
                    marginLeft: msg.sender === patientId ? "0" : "10px",
                  }}
                >
                  {msg.sender === patientId ? "P" : "D"}
                </Avatar>
                <Box
                  sx={{
                    maxWidth: "60%",
                    padding: 2,
                    background:
                      msg.sender === patientId
                        ? "linear-gradient(to right, #e1e4ed, #cfd9df)"
                        : "linear-gradient(to right, #d3e0ea, #cfd9df )",
                    color: darkMode ? "#fff" : "#333",
                    borderRadius: "12px",
                  }}
                >
                  <Typography
                    variant="body1"
                    gutterBottom
                    sx={{ fontSize: "1rem", lineHeight: "1.5" }}
                  >
                    {msg.message}
                  </Typography>
                  <Typography
                    variant="caption"
                    sx={{ display: "block", marginTop: 1, color: "#666" }}
                  >
                    {new Date(msg.timestamp).toLocaleString()}
                  </Typography>
                </Box>
              </Box>
            ))}
          </Box>

          {/* Input Box */}
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              padding: 2,
              borderTop: "1px solid #ddd",
            }}
          >
            <TextField
              fullWidth
              variant="outlined"
              placeholder="Type a message"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyPress={handleTyping}
            />
            <Button
              variant="contained"
              color="primary"
              sx={{
                marginLeft: 2,
                backgroundColor: darkMode ? "#4caf50" : "#4caf50",
                color: "#fff",
                borderRadius: "5px",
                padding: "10px 20px",
                fontSize: "16px",
                textTransform: "none",
                boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.1)",
                "&:hover": {
                  backgroundColor: darkMode ? "#388e3c" : "#45a049",
                  boxShadow: "0px 6px 8px rgba(0, 0, 0, 0.2)",
                },
              }}
              onClick={handleSendMessage}
            >
              Send
            </Button>
          </Box>
        </Box>
      </Box>
    </div>
  );
};

export default Chat;
