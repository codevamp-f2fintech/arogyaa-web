import axios from 'axios';
import React, { useState, useEffect, useRef } from 'react';
import {
    Modal,
    Box,
    Button,
    IconButton,
    TextField,
    Typography,
    useTheme,
    Slide,
    Fade,
    keyframes
} from '@mui/material';
import {
    Close,
    Send,
    SmartToy,
    LightMode,
    DarkMode,
    Brightness4,
    Brightness7
} from '@mui/icons-material';

type Message = {
    id: string;
    content: string;
    sender: "user" | "ai";
    timestamp: Date;
};

const bounce = keyframes`
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-5px); }
`;

const AIAssistant = () => {
    const theme = useTheme();
    const [open, setOpen] = useState(false);
    const [userMessage, setUserMessage] = useState('');
    const [messages, setMessages] = useState<Message[]>([{
        id: "1",
        content: "Hello! How can I assist you today?",
        sender: "ai",
        timestamp: new Date(),
    }]);
    const [isTyping, setIsTyping] = useState(false);
    const [darkMode, setDarkMode] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLInputElement>();

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages, isTyping]);

    useEffect(() => {
        if (open) {
            setTimeout(() => {
                inputRef.current?.focus();
            }, 300);
        }
    }, [open]);

    const handleSendMessage = async () => {
        if (!userMessage.trim()) return;

        // Add user message
        const newUserMessage: Message = {
            id: Date.now().toString(),
            content: userMessage,
            sender: "user",
            timestamp: new Date(),
        };
        setMessages(prev => [...prev, newUserMessage]);
        setUserMessage('');
        setIsTyping(true);

        try {
            const res = await axios.post(`http://localhost:4009/api/v1/chat-service/chat-with-ai`, {
                userMessage,
            });

            const aiResponse: Message = {
                id: (Date.now() + 1).toString(),
                content: res.data.doctorRecommendations,
                sender: "ai",
                timestamp: new Date(),
            };
            setMessages(prev => [...prev, aiResponse]);
        } catch (error) {
            const errorResponse: Message = {
                id: (Date.now() + 1).toString(),
                content: 'Error processing the request',
                sender: "ai",
                timestamp: new Date(),
            };
            setMessages(prev => [...prev, errorResponse]);
        }
        setIsTyping(false);
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSendMessage();
        }
    };

    return (
        <>
            {/* Floating Action Button */}
            <Button
                sx={{
                    backgroundColor: "#56428b !important",
                    position: 'fixed',
                    bottom: 24,
                    right: 24,
                    zIndex: 1000,
                    minWidth: 0,
                    width: 56,
                    height: 56,
                    borderRadius: '50%',
                    boxShadow: 6,
                    '&:hover': {
                        transform: 'scale(1.1)',
                    },
                    transition: 'transform 0.3s',
                }}
                onClick={() => setOpen(true)}
            >
                <SmartToy sx={{ color: 'white' }} />
            </Button>

            {/* Chat Modal */}
            <Modal
                open={open}
                onClose={() => setOpen(false)}
                sx={{
                    display: 'flex',
                    justifyContent: 'flex-end',
                    alignItems: 'flex-end',
                    p: 2,
                }}
                closeAfterTransition
            >
                <Slide in={open} direction="up" timeout={300}>
                    <Box
                        sx={{
                            width: { xs: '100%', sm: 400 },
                            height: '80vh',
                            bgcolor: darkMode ? 'grey.900' : 'background.paper',
                            borderRadius: 2,
                            boxShadow: 24,
                            display: 'flex',
                            flexDirection: 'column',
                        }}
                    >
                        {/* Header */}
                        <Box
                            sx={{
                                p: 2,
                                display: 'flex',
                                justifyContent: 'space-between',
                                alignItems: 'center',
                                borderBottom: '1px solid',
                                borderColor: 'divider',
                            }}
                        >
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                <SmartToy color="primary" />
                                <Typography variant="h6">AI Assistant</Typography>
                            </Box>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                <IconButton onClick={() => setDarkMode(!darkMode)}>
                                    {darkMode ? <LightMode /> : <DarkMode />}
                                </IconButton>
                                <IconButton onClick={() => setOpen(false)}>
                                    <Close />
                                </IconButton>
                            </Box>
                        </Box>

                        {/* Messages Container */}
                        <Box
                            sx={{
                                flex: 1,
                                overflowY: 'auto',
                                p: 2,
                                bgcolor: darkMode ? 'grey.900' : 'grey.50',
                                backgroundImage: darkMode
                                    ? 'linear-gradient(to bottom, #1a1a1a, #000)'
                                    : 'linear-gradient(to bottom, #fafafa, #fff)',
                            }}
                        >
                            {messages.map((message) => (
                                <Box
                                    key={message.id}
                                    sx={{
                                        display: 'flex',
                                        justifyContent: message.sender === 'user' ? 'flex-end' : 'flex-start',
                                        mb: 2,
                                    }}
                                >
                                    <Box
                                        sx={{
                                            maxWidth: '80%',
                                            p: 2,
                                            borderRadius: 4,
                                            bgcolor: message.sender === 'user'
                                                ? 'primary.main'
                                                : darkMode ? 'grey.800' : 'grey.100',
                                            color: message.sender === 'user' ? 'white' : 'text.primary',
                                            position: 'relative',
                                        }}
                                    >
                                        <Typography variant="body1">{message.content}</Typography>
                                        <Typography
                                            variant="caption"
                                            sx={{
                                                display: 'block',
                                                mt: 0.5,
                                                color: message.sender === 'user' ? 'primary.light' : 'text.secondary',
                                            }}
                                        >
                                            {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                        </Typography>
                                    </Box>
                                </Box>
                            ))}
                            {isTyping && (
                                <Box sx={{ display: 'flex', justifyContent: 'flex-start', mb: 2 }}>
                                    <Box
                                        sx={{
                                            p: 2,
                                            borderRadius: 4,
                                            bgcolor: darkMode ? 'grey.800' : 'grey.100',
                                        }}
                                    >
                                        <Box sx={{ display: 'flex', gap: 1 }}>
                                            {[0, 0.3, 0.6].map((delay) => (
                                                <Box
                                                    key={delay}
                                                    sx={{
                                                        width: 8,
                                                        height: 8,
                                                        bgcolor: 'text.secondary',
                                                        borderRadius: '50%',
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
                                borderTop: '1px solid',
                                borderColor: 'divider',
                                bgcolor: darkMode ? 'grey.900' : 'background.paper',
                            }}
                        >
                            <Box sx={{ position: 'relative' }}>
                                <TextField
                                    inputRef={inputRef}
                                    fullWidth
                                    placeholder="Ask about doctors..."
                                    value={userMessage}
                                    onChange={(e) => setUserMessage(e.target.value)}
                                    onKeyDown={handleKeyDown}
                                    sx={{
                                        '& .MuiOutlinedInput-root': {
                                            borderRadius: 28,
                                            pr: 6,
                                        },
                                    }}
                                />
                                <IconButton
                                    sx={{
                                        position: 'absolute',
                                        right: 8,
                                        top: '50%',
                                        transform: 'translateY(-50%)',
                                        bgcolor: userMessage.trim() ? 'primary.main' : 'action.disabled',
                                        color: 'white',
                                        '&:hover': {
                                            bgcolor: 'primary.dark',
                                        },
                                    }}
                                    onClick={handleSendMessage}
                                    disabled={!userMessage.trim()}
                                >
                                    <Send />
                                </IconButton>
                            </Box>
                        </Box>
                    </Box>
                </Slide>
            </Modal>
        </>
    );
};

export default AIAssistant;