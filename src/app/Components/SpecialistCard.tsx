import React from 'react';
import { Box, Button } from "@mui/material";
import ArrowCircleRightIcon from "@mui/icons-material/ArrowCircleRight";

import styles from "../page.module.css";

interface SpecialistCardProps {
    icon: string;
    name: string;
    description: string;
    onConsult: () => void;
}

const SpecialistCard: React.FC<SpecialistCardProps> = React.memo(({ icon, name, description, onConsult }) => {
    return (
        <Box className={styles.specialistBox}>
            <div className={styles.specialistIcon}>
                <img src="/assets/images/speciality-icons/vector_plus.png" alt="Add Icon" width={24} height={24} />
            </div>
            <Box className={styles.specialistImage}>
                <img src={icon} alt={`${name} Icon`} width={80} height={80} style={{ objectFit: "contain" }} />
            </Box>
            <h2 className={styles.specialistTitle}>{name}</h2>
            <h4 className={styles.specialistCaption}>{description}</h4>
            <Button
                variant="contained"
                className={styles.readMoreButton}
                endIcon={<ArrowCircleRightIcon />}
                onClick={onConsult}
            >
                Consult Now
            </Button>
        </Box>
    );
});

export default SpecialistCard;
