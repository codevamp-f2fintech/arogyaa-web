import axios from "axios";
import React, { useState, useEffect, useRef } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Cookies from "js-cookie";
import {
  Modal,
  Box,
  Button,
  IconButton,
  TextField,
  Typography,
  useTheme,
  Slide,
  keyframes,
  List,
  ListItem,
  ListItemText,
  Menu,
  MenuItem,
  ListItemIcon,
  Chip,
  CardActions,
  CardContent,
  Divider,
  Card,
  Avatar,
  Grid,
} from "@mui/material";
import {
  Close,
  Send,
  SmartToy,
  LightMode,
  DarkMode,
  ClearAll,
  Person,
  Settings,
  School,
  Work,
  CurrencyRupee,
  LocalHospital,
  Event,
  VerifiedUser,
} from "@mui/icons-material";
import ChatPreferencesDialog from "./ChatPreferencesDialog";
import BookAppointmentModal from "./common/BookAppointmentModal";

// Enhanced Type Definitions
type Message = {
  id: string;
  content: string;
  sender: "user" | "ai";
  timestamp: Date;
  conversationType?: 'medical' | 'general' | 'health_info' | 'diet_plan';
  doctors?: DoctorRecommendation[];
};

interface DoctorRecommendation {
  id: string;
  username: string;
  specialization: string;
  qualifications: string;
  experience: string;
  consultationFee: string | number;
  availability: Array<{
    day: string;
    startTime: string;
    endTime: string;
    hospital: {
      name: string;
      location: string;
      _id: string;
    } | null;
    _id: string;
  }>;
  location: string;
  contact: string;
  bookingId: string;
  profilePicture?: string;
  isVerified?: boolean;
}

interface ChatResponse {
  success: boolean;
  response: string;
  conversationType: 'medical' | 'general' | 'health_info' | 'diet_plan';
  timestamp: string;
  sessionId: string;
  isNewSession: boolean;
  doctors?: DoctorRecommendation[];
  doctorCount?: number;
  error?: string;
  message?: string;
}

interface UserPreferences {
  dietaryRestrictions?: string[];
  healthGoals?: string[];
  medicalConditions?: string[];
}

// Enhanced Chat Service
class ChatService {
  private sessionId: string | null = null;
  private baseUrl = process.env.NEXT_PUBLIC_CHAT_URL || 'http://localhost:3001';

  constructor() {
    this.sessionId = this.getStoredSessionId();
  }

  private getStoredSessionId(): string | null {
    try {
      if (typeof window !== 'undefined') {
        return sessionStorage.getItem('chatSessionId');
      }
    } catch (error) {
      console.warn('Storage not available:', error);
    }
    return null;
  }

  private storeSessionId(sessionId: string): void {
    try {
      if (typeof window !== 'undefined') {
        sessionStorage.setItem('chatSessionId', sessionId);
      }
    } catch (error) {
      console.warn('Could not store session ID:', error);
    }
  }

  async sendMessage(userMessage: string, userPreferences?: UserPreferences): Promise<ChatResponse> {
    try {
      const payload = {
        userMessage,
        sessionId: this.sessionId,
        userPreferences
      };

      const response = await fetch(`${this.baseUrl}/chat-with-ai`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data: ChatResponse = await response.json();

      if (!data.success) {
        throw new Error(data.message || 'Failed to send message');
      }

      // Store session ID for future requests
      if (data.sessionId) {
        this.sessionId = data.sessionId;
        this.storeSessionId(data.sessionId);
      }

      return data;
    } catch (error) {
      console.error('Error sending message:', error);
      throw new Error('Failed to send message. Please try again.');
    }
  }

  clearSession(): void {
    this.sessionId = null;
    try {
      if (typeof window !== 'undefined') {
        sessionStorage.removeItem('chatSessionId');
      }
    } catch (error) {
      console.warn('Could not clear session storage:', error);
    }
  }

  getSessionId(): string | null {
    return this.sessionId;
  }
}

// Animation keyframes
const bounce = keyframes`
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-5px); }
`;

// Doctor Card Component
const DoctorCard = ({ doctor, darkMode, onBookAppointment }: {
  doctor: DoctorRecommendation;
  darkMode: boolean;
  onBookAppointment: (doctor: DoctorRecommendation) => void;
}) => {
  const router = useRouter();

  return (
    <Card
      sx={{
        mb: 2,
        borderRadius: 3,
        background: darkMode
          ? 'linear-gradient(135deg, #2d2d2d 0%, #1a1a1a 100%)'
          : 'linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%)',
        border: `2px solid ${darkMode ? '#444' : '#e0e0e0'}`,
        overflow: 'hidden',
        transition: 'all 0.3s ease',
        position: 'relative',
        '&:hover': {
          transform: 'translateY(-4px)',
          boxShadow: darkMode
            ? '0 8px 25px rgba(86, 66, 139, 0.3)'
            : '0 8px 25px rgba(41, 23, 94, 0.15)',
          border: `2px solid ${darkMode ? '#56428b' : '#56428b'}`,
        }
      }}
    >
      {/* Verification Badge */}
      {doctor.isVerified && (
        <Box
          sx={{
            position: 'absolute',
            top: 12,
            right: 12,
            zIndex: 2,
            background: 'linear-gradient(45deg, #2ecc71, #27ae60)',
            borderRadius: '50%',
            p: 0.5,
            boxShadow: '0 2px 8px rgba(46, 204, 113, 0.3)'
          }}
        >
          <VerifiedUser sx={{ color: 'white', fontSize: 16 }} />
        </Box>
      )}

      <CardContent sx={{ p: 3 }}>
        {/* Doctor Header */}
        <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2, mb: 2 }}>
          <Avatar
            src={doctor.profilePicture || "/assets/images/online-doctor-with-white-coat.png"}
            alt={doctor.username}
            sx={{
              width: 60,
              height: 60,
              border: '3px solid #29175e',
              boxShadow: '0 4px 12px rgba(41, 23, 94, 0.2)'
            }}
          />

          <Box sx={{ flex: 1 }}>
            <Typography
              variant="h6"
              sx={{
                fontWeight: 'bold',
                color: darkMode ? '#fff' : '#29175e',
                mb: 0.5,
                fontSize: '1.1rem'
              }}
            >
              {doctor.username}
            </Typography>

            <Chip
              label={doctor.specialization}
              size="small"
              sx={{
                background: 'linear-gradient(45deg, #56428b, #29175e)',
                color: 'white',
                fontWeight: 'bold',
                fontSize: '0.75rem',
                mb: 1
              }}
            />

            {/* Qualifications & Experience */}
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 1 }}>
              <School sx={{ color: '#2ecc71', fontSize: 16 }} />
              <Typography
                variant="body2"
                sx={{
                  color: darkMode ? '#ddd' : '#666',
                  fontSize: '0.85rem'
                }}
              >
                {doctor.qualifications !== 'Not specified' ? doctor.qualifications : 'MBBS'}
                {doctor.experience !== 'Not specified' && ` • ${doctor.experience}`}
              </Typography>
            </Box>
          </Box>
        </Box>

        {/* Consultation Fee */}
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            p: 2,
            borderRadius: 2,
            background: darkMode
              ? 'rgba(86, 66, 139, 0.1)'
              : 'rgba(41, 23, 94, 0.05)',
            border: `1px solid ${darkMode ? 'rgba(86, 66, 139, 0.3)' : 'rgba(41, 23, 94, 0.1)'}`,
            mb: 2
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <CurrencyRupee sx={{ color: '#2ecc71', fontSize: 18 }} />
            <Typography variant="body2" sx={{ color: darkMode ? '#fff' : '#333', fontWeight: 'bold' }}>
              Consultation Fee
            </Typography>
          </Box>
          <Typography
            variant="h6"
            sx={{
              color: '#2ecc71',
              fontWeight: 'bold',
              fontSize: '1.1rem'
            }}
          >
            {typeof doctor.consultationFee === 'number'
              ? `₹${doctor.consultationFee}`
              : doctor.consultationFee !== 'Not specified'
                ? doctor.consultationFee
                : '₹500'}
          </Typography>
        </Box>

        {/* Availability Section */}
        {doctor.availability && doctor.availability.length > 0 && (
          <Box sx={{ mb: 2 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
              <Event sx={{ color: '#56428b', fontSize: 16 }} />
              <Typography
                variant="body2"
                sx={{
                  fontWeight: 'bold',
                  color: darkMode ? '#fff' : '#333',
                  fontSize: '0.9rem'
                }}
              >
                Available Slots
              </Typography>
            </Box>

            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
              {doctor.availability.slice(0, 2).map((slot, index) => {
                const timeSlot = `${slot.day} (${slot.startTime}-${slot.endTime})`;
                const hospitalInfo = slot.hospital?.name ? ` at ${slot.hospital.name}` : '';
                const displayText = `${timeSlot}${hospitalInfo}`;

                return (
                  <Chip
                    key={slot._id || index}
                    label={displayText}
                    size="small"
                    sx={{
                      background: 'linear-gradient(45deg, #ffd700, #ffed4e)',
                      color: '#29175e',
                      fontWeight: 'bold',
                      fontSize: '0.75rem',
                      maxWidth: '200px',
                      '&:hover': {
                        background: 'linear-gradient(45deg, #ffed4e, #ffd700)',
                      }
                    }}
                  />
                );
              })}
              {doctor.availability.length > 2 && (
                <Chip
                  label={`+${doctor.availability.length - 2} more`}
                  size="small"
                  sx={{
                    backgroundColor: darkMode ? '#666' : '#ddd',
                    color: darkMode ? 'white' : '#333',
                    fontSize: '0.75rem',
                    fontWeight: 'bold'
                  }}
                />
              )}
            </Box>
          </Box>
        )}
      </CardContent>

      <Divider sx={{ borderColor: darkMode ? '#444' : '#e0e0e0' }} />

      <CardActions sx={{ p: 2, gap: 1 }}>
        <Button
          variant="outlined"
          startIcon={<Person />}
          onClick={() => {
            router.push(
              `/doctors/profile/${encodeURIComponent(doctor.id)}`
            );
          }}
          sx={{
            flex: 1,
            border: `2px solid ${darkMode ? '#56428b' : '#56428b'}`,
            color: darkMode ? '#56428b' : '#56428b',
            textTransform: 'none',
            fontWeight: 'bold',
            borderRadius: 2,
            '&:hover': {
              background: darkMode ? 'rgba(86, 66, 139, 0.1)' : 'rgba(86, 66, 139, 0.05)',
              border: `2px solid ${darkMode ? '#29175e' : '#29175e'}`,
            }
          }}
        >
          View Profile
        </Button>

        <Button
          variant="contained"
          startIcon={<Event />}
          onClick={() => onBookAppointment(doctor)}
          sx={{
            flex: 1,
            background: 'linear-gradient(45deg, #29175e, #56428b)',
            '&:hover': {
              background: 'linear-gradient(45deg, #1a0f3a, #29175e)',
              transform: 'translateY(-1px)',
              boxShadow: '0 4px 12px rgba(41, 23, 94, 0.3)'
            },
            textTransform: 'none',
            fontWeight: 'bold',
            borderRadius: 2,
            transition: 'all 0.3s ease'
          }}
        >
          Book Now
        </Button>
      </CardActions>
    </Card>
  );
};

const AIAssistant = () => {
  const theme = useTheme();
  const [open, setOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [selectedDoctor, setSelectedDoctor] = useState<DoctorRecommendation | null>(null);
  const [userMessage, setUserMessage] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [isTyping, setIsTyping] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [conversationType, setConversationType] = useState<string>('general');
  const [preferencesOpen, setPreferencesOpen] = useState(false);
  const [menuAnchor, setMenuAnchor] = useState<null | HTMLElement>(null);
  const [userPreferences, setUserPreferences] = useState<UserPreferences>({});

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>();
  const chatService = useRef(new ChatService());
  const router = useRouter();
  const searchParams = useSearchParams();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  useEffect(() => {
    if (open) {
      loadInitialMessages();
      setTimeout(() => {
        inputRef.current?.focus();
      }, 300);
    }
  }, [open]);

  useEffect(() => {
    const handleAutoBooking = async () => {
      const autoBookDoctorId = searchParams.get('autoBookDoctorId');

      if (autoBookDoctorId && Cookies.get("token")) {
        // First, try to find doctor from recent messages
        const recentMessages = messages.slice(-10); // Check last 10 messages
        let foundDoctor = null;

        for (const message of recentMessages) {
          if (message.doctors) {
            foundDoctor = message.doctors.find(d => d.bookingId === autoBookDoctorId);
            if (foundDoctor) break;
          }
        }

        // If not found in messages, try sessionStorage
        if (!foundDoctor) {
          try {
            const storedDoctor = sessionStorage.getItem('pendingBookingDoctor');
            console.log(storedDoctor, 'storeddoc')
            if (storedDoctor) {
              const doctorData = JSON.parse(storedDoctor);
              if (doctorData.bookingId === autoBookDoctorId) {
                foundDoctor = doctorData;
              }
              // Clean up stored data
              sessionStorage.removeItem('pendingBookingDoctor');
            }
          } catch (error) {
            console.warn('Error retrieving stored doctor data:', error);
          }
        }

        console.log(foundDoctor, 'founddoc')
        if (foundDoctor) {
          setSelectedDoctor(foundDoctor);
          setIsModalOpen(true);

          // Clean up URL
          const newUrl = window.location.pathname + window.location.hash;
          window.history.replaceState({}, '', newUrl);
        } else {
          // If still not found, you might want to show a message or make an API call
          console.warn('Doctor not found for auto-booking:', autoBookDoctorId);
          // Optionally show a toast/notification that the booking session expired
        }
      }
    };

    if (typeof window !== 'undefined') {
      handleAutoBooking();
    }
  }, [messages]);

  const loadInitialMessages = () => {
    const welcomeMessage = getPersonalizedWelcome();
    setMessages([
      {
        id: "welcome",
        content: welcomeMessage,
        sender: "ai",
        timestamp: new Date(),
        conversationType: 'general'
      },
    ]);
  };

  const getPersonalizedWelcome = () => {
    const hasPreferences = Object.values(userPreferences).some(arr => arr && arr.length > 0);

    if (!hasPreferences) {
      return "Hello! I'm Dr. AI, your friendly medical assistant. I can help you with finding doctors, health information, diet planning, and general wellness questions. You can set your preferences in the menu for personalized advice. How can I assist you today?";
    }

    let welcome = "Hello! I'm Dr. AI, your personalized medical assistant. ";

    if (userPreferences.healthGoals?.length) {
      welcome += `I see you're working towards ${userPreferences.healthGoals.join(', ').toLowerCase()}. `;
    }

    if (userPreferences.dietaryRestrictions?.length) {
      welcome += `I'll keep in mind your dietary preferences: ${userPreferences.dietaryRestrictions.join(', ').toLowerCase()}. `;
    }

    welcome += "How can I help you today?";
    return welcome;
  };

  const getConversationTypeColor = (type?: string) => {
    switch (type) {
      case 'medical': return '#e74c3c';
      case 'diet_plan': return '#27ae60';
      case 'health_info': return '#3498db';
      default: return '#9b59b6';
    }
  };

  const getConversationTypeLabel = (type?: string) => {
    switch (type) {
      case 'medical': return 'Medical';
      case 'diet_plan': return 'Nutrition';
      case 'health_info': return 'Health Info';
      default: return 'General';
    }
  };

  const handleBookAppointment = (doctor: DoctorRecommendation) => {
    const userToken = Cookies.get("token");

    if (!userToken) {
      // Store doctor data in sessionStorage for retrieval after login
      try {
        sessionStorage.setItem('pendingBookingDoctor', JSON.stringify(doctor));
      } catch (error) {
        console.warn('Could not store doctor data:', error);
      }

      const encodedReturnUrl = encodeURIComponent(
        `${window.location.pathname}?autoBookDoctorId=${doctor.bookingId}`
      );
      router.push(`/signup?redirect=${encodedReturnUrl}`);
      return;
    }

    setSelectedDoctor(doctor);
    setIsModalOpen(true);
  };

  const handleSendMessage = async () => {
    if (!userMessage.trim() || isTyping) return;

    const userMsg = userMessage.trim();
    setUserMessage("");
    setIsTyping(true);

    const newUserMessage: Message = {
      id: Date.now().toString(),
      content: userMsg,
      sender: "user",
      timestamp: new Date(),
    };
    setMessages((prev) => [...prev, newUserMessage]);

    try {
      const response = await chatService.current.sendMessage(userMsg, userPreferences);

      if (response.isNewSession || !sessionId) {
        setSessionId(response.sessionId);
      }

      setConversationType(response.conversationType);

      const aiResponse: Message = {
        id: (Date.now() + 1).toString(),
        content: response.response,
        sender: "ai",
        timestamp: new Date(response.timestamp),
        conversationType: response.conversationType,
        doctors: response.doctors || []
      };
      setMessages((prev) => [...prev, aiResponse]);

    } catch (error) {
      console.error('Error sending message:', error);
      const errorResponse: Message = {
        id: (Date.now() + 1).toString(),
        content: "I apologize, but I'm experiencing technical difficulties. Please try again later.",
        sender: "ai",
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, errorResponse]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const clearChat = () => {
    loadInitialMessages();
    setSessionId(null);
    setConversationType('general');
    chatService.current.clearSession();
    setMenuAnchor(null);
  };

  const handleSavePreferences = (preferences: UserPreferences) => {
    setUserPreferences(preferences);
    loadInitialMessages();
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedDoctor(null);
  };

  return (
    <>
      {/* Floating Action Button */}
      <Button
        sx={{
          backgroundColor: "#56428b !important",
          position: "fixed",
          bottom: 24,
          right: 24,
          zIndex: 1000,
          minWidth: 0,
          width: 56,
          height: 56,
          borderRadius: "50%",
          boxShadow: 6,
          "&:hover": {
            transform: "scale(1.1)",
          },
          transition: "transform 0.3s",
        }}
        onClick={() => setOpen(true)}
      >
        <SmartToy sx={{ color: "white" }} />
      </Button>

      {/* Chat Modal */}
      <Modal
        open={open}
        onClose={() => setOpen(false)}
        sx={{
          display: "flex",
          justifyContent: "flex-end",
          alignItems: "flex-end",
          p: 2,
        }}
        closeAfterTransition
      >
        <Slide in={open} direction="up" timeout={300}>
          <Box
            sx={{
              width: { xs: "100%", sm: 420 },
              height: "85vh",
              bgcolor: darkMode ? "grey.900" : "#b1a2dc",
              borderRadius: 2,
              boxShadow: 24,
              display: "flex",
              flexDirection: "column",
              overflow: "hidden",
            }}
          >
            {/* Header */}
            <Box
              sx={{
                p: 2,
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                borderBottom: "1px solid",
                borderColor: "divider",
                background: darkMode
                  ? "linear-gradient(135deg, #2d1b69 0%, #1a0f3a 100%)"
                  : "linear-gradient(135deg, #b1a2dc 0%, #56428b 100%)",
              }}
            >
              <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                <SmartToy sx={{ color: "#fff" }} />
                <Box>
                  <Typography sx={{ fontFamily: "Poppins", color: "#fff" }} variant="h6">
                    Dr. AI Assistant
                  </Typography>
                  {sessionId && (
                    <Typography variant="caption" sx={{ color: "rgba(255,255,255,0.7)" }}>
                      Session: {sessionId.substring(8, 20)}...
                    </Typography>
                  )}
                </Box>
              </Box>

              <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                <Chip
                  label={getConversationTypeLabel(conversationType)}
                  size="small"
                  sx={{
                    bgcolor: getConversationTypeColor(conversationType),
                    color: 'white',
                    fontSize: '0.7rem'
                  }}
                />

                <IconButton
                  sx={{ color: "#fff" }}
                  onClick={(e) => setMenuAnchor(e.currentTarget)}
                  title="Menu"
                >
                  <Settings />
                </IconButton>

                <IconButton
                  sx={{
                    color: "#fff",
                    "&:hover": { color: "red" },
                  }}
                  onClick={() => setOpen(false)}
                >
                  <Close />
                </IconButton>
              </Box>

              {/* Settings Menu */}
              <Menu
                anchorEl={menuAnchor}
                open={Boolean(menuAnchor)}
                onClose={() => setMenuAnchor(null)}
                PaperProps={{
                  sx: {
                    bgcolor: darkMode ? 'grey.800' : 'white',
                    minWidth: 200,
                  }
                }}
              >
                <MenuItem onClick={() => {
                  setPreferencesOpen(true);
                  setMenuAnchor(null);
                }}>
                  <ListItemIcon>
                    <Person sx={{ color: darkMode ? '#fff' : '#333' }} />
                  </ListItemIcon>
                  <ListItemText
                    primary="Preferences"
                    sx={{ color: darkMode ? '#fff' : '#333' }}
                  />
                </MenuItem>

                <MenuItem onClick={() => {
                  setDarkMode(!darkMode);
                  setMenuAnchor(null);
                }}>
                  <ListItemIcon>
                    {darkMode ? <LightMode sx={{ color: '#fff' }} /> : <DarkMode />}
                  </ListItemIcon>
                  <ListItemText
                    primary={darkMode ? "Light Mode" : "Dark Mode"}
                    sx={{ color: darkMode ? '#fff' : '#333' }}
                  />
                </MenuItem>

                <MenuItem onClick={clearChat}>
                  <ListItemIcon>
                    <ClearAll sx={{ color: darkMode ? '#fff' : '#333' }} />
                  </ListItemIcon>
                  <ListItemText
                    primary="Clear Chat"
                    sx={{ color: darkMode ? '#fff' : '#333' }}
                  />
                </MenuItem>
              </Menu>
            </Box>

            {/* Messages Container */}
            <Box
              sx={{
                flex: 1,
                overflowY: "auto",
                p: 2,
                backgroundImage: darkMode
                  ? "linear-gradient(to bottom, #1a1a1a, #000)"
                  : "linear-gradient(to bottom, #fff, #fff)",
              }}
            >
              {messages.map((message) => (
                <Box
                  key={message.id}
                  sx={{
                    display: "flex",
                    justifyContent:
                      message.sender === "user" ? "flex-end" : "flex-start",
                    mb: 2,
                  }}
                >
                  <Box
                    sx={{
                      maxWidth: "85%",
                      p: 2,
                      borderRadius: 4,
                      bgcolor:
                        message.sender === "user"
                          ? "#344e41"
                          : darkMode
                            ? "grey.800"
                            : "#29175e",
                      color: message.sender === "user" ? "#fff" : "#ffd700",
                      position: "relative",
                    }}
                  >
                    {message.conversationType && message.sender === "ai" && (
                      <Chip
                        label={getConversationTypeLabel(message.conversationType)}
                        size="small"
                        sx={{
                          mb: 1,
                          bgcolor: getConversationTypeColor(message.conversationType),
                          color: 'white',
                          fontSize: '0.6rem',
                          height: 20
                        }}
                      />
                    )}
                    <Typography variant="body1" sx={{ whiteSpace: 'pre-wrap', wordBreak: 'break-word', color: darkMode ? '#fff' : '#333' }}>
                      {message.content}
                    </Typography>
                    <Typography
                      variant="caption"
                      sx={{
                        display: "block",
                        mt: 1,
                        color: message.sender === "user" ? "#fff" : "rgba(255,215,0,0.7)",
                        fontSize: "0.7rem"
                      }}
                    >
                      {message.timestamp.toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </Typography>
                    {message.doctors && message.doctors.length > 0 && (
                      <Box sx={{ mt: 2 }}>
                        <Typography
                          variant="h6"
                          sx={{
                            color: darkMode ? '#ffd700' : '#29175e',
                            fontWeight: 'bold',
                            mb: 2,
                            textAlign: 'center'
                          }}
                        >
                          🩺 Available Doctors ({message.doctors.length})
                        </Typography>

                        <Grid container spacing={2}>
                          {message.doctors.map(doc => (
                            <Grid item xs={12} key={doc.id}>
                              <DoctorCard
                                doctor={doc}
                                darkMode={darkMode}
                                onBookAppointment={handleBookAppointment}
                              />
                            </Grid>
                          ))}
                        </Grid>
                      </Box>
                    )}
                  </Box>
                </Box>
              ))}

              {isTyping && (
                <Box
                  sx={{ display: "flex", justifyContent: "flex-start", mb: 2 }}
                >
                  <Box
                    sx={{
                      p: 2,
                      borderRadius: 4,
                      bgcolor: darkMode ? "grey.800" : "#29175e",
                    }}
                  >
                    <Box sx={{ display: "flex", gap: 1 }}>
                      {[0, 0.3, 0.6].map((delay) => (
                        <Box
                          key={delay}
                          sx={{
                            width: 8,
                            height: 8,
                            bgcolor: "#ffd700",
                            borderRadius: "50%",
                            animation: `${bounce} 1s infinite`,
                            animationDelay: `${delay}s`,
                          }}
                        />
                      ))}
                    </Box>
                  </Box>
                </Box>
              )}
              <div ref={messagesEndRef} />
            </Box>

            {/* Input Area */}
            <Box
              sx={{
                p: 2,
                borderTop: "1px solid",
                borderColor: "divider",
                bgcolor: darkMode ? "grey.900" : "#b1a2dc",
              }}
            >
              {/* Show active preferences chips */}
              {Object.values(userPreferences).some(arr => arr && arr.length > 0) && (
                <Box sx={{ mb: 1, display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                  {userPreferences.dietaryRestrictions?.slice(0, 2).map((item, index) => (
                    <Chip key={`diet-${index}`} label={item} size="small" sx={{ fontSize: '0.7rem', height: 20 }} />
                  ))}
                  {userPreferences.healthGoals?.slice(0, 2).map((item, index) => (
                    <Chip key={`goal-${index}`} label={item} size="small" sx={{ fontSize: '0.7rem', height: 20 }} />
                  ))}
                  {(userPreferences.dietaryRestrictions?.length || 0) + (userPreferences.healthGoals?.length || 0) > 4 && (
                    <Chip label="..." size="small" sx={{ fontSize: '0.7rem', height: 20 }} />
                  )}
                </Box>
              )}

              <Box sx={{ position: "relative" }}>
                <TextField
                  inputRef={inputRef}
                  fullWidth
                  placeholder="Ask about doctors, health, or get personalized medical advice..."
                  value={userMessage}
                  onChange={(e) => setUserMessage(e.target.value)}
                  onKeyDown={handleKeyDown}
                  disabled={isTyping}
                  multiline
                  maxRows={3}
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      borderRadius: 28,
                      pr: 6,
                      bgcolor: darkMode ? "grey.800" : "white",
                    },
                    "& .MuiInputBase-input": {
                      color: darkMode ? "#fff" : "#333",
                    },
                    "& fieldset": {
                      borderColor: darkMode ? "#666" : "#333",
                    },
                    "&:hover fieldset": {
                      borderColor: "#56428b",
                    },
                    "&.Mui-focused fieldset": {
                      borderColor: "#56428b",
                    },
                  }}
                />
                <IconButton
                  sx={{
                    position: "absolute",
                    right: 8,
                    top: "50%",
                    transform: "translateY(-50%)",
                    bgcolor: userMessage.trim() && !isTyping ? "#29175e" : "action.disabled",
                    color: "white",
                    "&:hover": {
                      bgcolor: userMessage.trim() && !isTyping ? "#1a0f3a" : "action.disabled",
                    },
                  }}
                  onClick={handleSendMessage}
                  disabled={!userMessage.trim() || isTyping}
                >
                  <Send />
                </IconButton>
              </Box>
            </Box>
          </Box>
        </Slide>
      </Modal>

      {/* Preferences Dialog */}
      <ChatPreferencesDialog
        open={preferencesOpen}
        onClose={() => setPreferencesOpen(false)}
        onSave={handleSavePreferences}
        currentPreferences={userPreferences}
        darkMode={darkMode}
      />

      <BookAppointmentModal
        isOpen={isModalOpen}
        onClose={closeModal}
        data={selectedDoctor}
      />
    </>
  );
};

export default AIAssistant;
