import React, { useState } from 'react';
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    TextField,
    Chip,
    Box,
    Typography,
    IconButton,
    Autocomplete,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    Divider,
} from '@mui/material';
import { Close, Add, Delete } from '@mui/icons-material';

interface UserPreferences {
    dietaryRestrictions?: string[];
    healthGoals?: string[];
    medicalConditions?: string[];
}

interface ChatPreferencesDialogProps {
    open: boolean;
    onClose: () => void;
    onSave: (preferences: UserPreferences) => void;
    currentPreferences?: UserPreferences;
    darkMode?: boolean;
}

const ChatPreferencesDialog: React.FC<ChatPreferencesDialogProps> = ({
    open,
    onClose,
    onSave,
    currentPreferences = {},
    darkMode = false
}) => {
    const [preferences, setPreferences] = useState<UserPreferences>(currentPreferences);
    const [newRestriction, setNewRestriction] = useState('');
    const [newGoal, setNewGoal] = useState('');
    const [newCondition, setNewCondition] = useState('');

    // Predefined options for better UX
    const commonDietaryRestrictions = [
        'Vegetarian', 'Vegan', 'Gluten-Free', 'Dairy-Free', 'Nut-Free',
        'Low-Sodium', 'Low-Sugar', 'Keto', 'Paleo', 'Mediterranean',
        'Halal', 'Kosher', 'Raw Food', 'Low-Carb'
    ];

    const commonHealthGoals = [
        'Weight Loss', 'Weight Gain', 'Muscle Building', 'Heart Health',
        'Better Sleep', 'Stress Management', 'Increased Energy',
        'Better Digestion', 'Mental Wellness', 'Immune Support',
        'Joint Health', 'Skin Health', 'Blood Sugar Control'
    ];

    const commonMedicalConditions = [
        'Diabetes', 'Hypertension', 'Heart Disease', 'Asthma',
        'Arthritis', 'Allergies', 'Anxiety', 'Depression',
        'Migraine', 'IBS', 'GERD', 'Thyroid Disorders',
        'High Cholesterol', 'Osteoporosis'
    ];

    const handleAddItem = (type: keyof UserPreferences, value: string) => {
        if (!value.trim()) return;

        setPreferences(prev => ({
            ...prev,
            [type]: [...(prev[type] || []), value.trim()]
        }));

        // Clear the input
        if (type === 'dietaryRestrictions') setNewRestriction('');
        if (type === 'healthGoals') setNewGoal('');
        if (type === 'medicalConditions') setNewCondition('');
    };

    const handleRemoveItem = (type: keyof UserPreferences, index: number) => {
        setPreferences(prev => ({
            ...prev,
            [type]: prev[type]?.filter((_, i) => i !== index) || []
        }));
    };

    const handleSave = () => {
        onSave(preferences);
        onClose();
    };

    const PreferenceSection = ({
        title,
        type,
        options,
        newValue,
        setNewValue,
        placeholder
    }: {
        title: string;
        type: keyof UserPreferences;
        options: string[];
        newValue: string;
        setNewValue: (value: string) => void;
        placeholder: string;
    }) => (
        <Box sx={{ mb: 3 }}>
            <Typography variant="h6" sx={{ mb: 2, color: darkMode ? '#fff' : '#333' }}>
                {title}
            </Typography>

            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 2 }}>
                {preferences[type]?.map((item, index) => (
                    <Chip
                        key={index}
                        label={item}
                        onDelete={() => handleRemoveItem(type, index)}
                        sx={{
                            bgcolor: darkMode ? '#56428b' : '#b1a2dc',
                            color: '#fff',
                            '& .MuiChip-deleteIcon': { color: '#fff' }
                        }}
                    />
                ))}
            </Box>

            <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
                <Autocomplete
                    freeSolo
                    options={options}
                    value={newValue}
                    onInputChange={(_, value) => setNewValue(value)}
                    sx={{ flex: 1 }}
                    renderInput={(params) => (
                        <TextField
                            {...params}
                            placeholder={placeholder}
                            size="small"
                            sx={{
                                '& .MuiOutlinedInput-root': {
                                    bgcolor: darkMode ? 'grey.800' : 'white',
                                    color: darkMode ? '#fff' : '#333',
                                },
                            }}
                        />
                    )}
                />
                <Button
                    variant="contained"
                    onClick={() => handleAddItem(type, newValue)}
                    disabled={!newValue.trim()}
                    sx={{
                        bgcolor: '#56428b',
                        '&:hover': { bgcolor: '#3d2d5f' }
                    }}
                    startIcon={<Add />}
                >
                    Add
                </Button>
            </Box>
        </Box>
    );

    return (
        <Dialog
            open={open}
            onClose={onClose}
            maxWidth="md"
            fullWidth
            PaperProps={{
                sx: {
                    bgcolor: darkMode ? 'grey.900' : 'white',
                    color: darkMode ? '#fff' : '#333'
                }
            }}
        >
            <DialogTitle sx={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                bgcolor: darkMode ? 'grey.800' : '#b1a2dc',
                color: '#fff'
            }}>
                <Typography variant="h5">Chat Preferences</Typography>
                <IconButton onClick={onClose} sx={{ color: '#fff' }}>
                    <Close />
                </IconButton>
            </DialogTitle>

            <DialogContent sx={{ p: 3 }}>
                <Typography variant="body2" sx={{ mb: 3, color: darkMode ? '#ccc' : '#666' }}>
                    Customize your chat experience by adding your dietary restrictions, health goals,
                    and medical conditions. This helps me provide more personalized advice.
                </Typography>

                <PreferenceSection
                    title="Dietary Restrictions"
                    type="dietaryRestrictions"
                    options={commonDietaryRestrictions}
                    newValue={newRestriction}
                    setNewValue={setNewRestriction}
                    placeholder="Add dietary restriction..."
                />

                <Divider sx={{ my: 2 }} />

                <PreferenceSection
                    title="Health Goals"
                    type="healthGoals"
                    options={commonHealthGoals}
                    newValue={newGoal}
                    setNewValue={setNewGoal}
                    placeholder="Add health goal..."
                />

                <Divider sx={{ my: 2 }} />

                <PreferenceSection
                    title="Medical Conditions"
                    type="medicalConditions"
                    options={commonMedicalConditions}
                    newValue={newCondition}
                    setNewValue={setNewCondition}
                    placeholder="Add medical condition..."
                />
            </DialogContent>

            <DialogActions sx={{ p: 3, bgcolor: darkMode ? 'grey.800' : '#f5f5f5' }}>
                <Button onClick={onClose} sx={{ color: darkMode ? '#fff' : '#333' }}>
                    Cancel
                </Button>
                <Button
                    onClick={handleSave}
                    variant="contained"
                    sx={{
                        bgcolor: '#56428b',
                        '&:hover': { bgcolor: '#3d2d5f' }
                    }}
                >
                    Save Preferences
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default ChatPreferencesDialog;
