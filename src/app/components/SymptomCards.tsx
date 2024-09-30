import ArrowCircleRightIcon from '@mui/icons-material/ArrowCircleRight';
import { Box, Button, CardMedia, CardContent, Grid, Paper, Typography } from '@mui/material';

import en from '@/locales/en.json';
import { symptomsList } from "@/static-data";

import styles from '../page.module.css';

interface Symptom {
    title: string;
    image: string;
    Consult: string;
}

const SymptomCards: React.FC = () => {
    return (
        <Box className={styles.symptomBox}>
            <Typography variant="h2" component="h2" className={styles.symptomTitle}>
                <span className={styles.symptomTitleSpan}>{en.homepage.symptomCards.title1}</span>
                <br />
                {en.homepage.symptomCards.title2}
            </Typography>

            <Grid container columns={{ xs: 4, sm: 8, md: 12 }}>
                {symptomsList.map((item: Symptom, index: number) => (
                    <Grid xs={3} className={styles.symptomGrid} key={index}>
                        <Paper className={styles.symptomPaper}>
                            <CardMedia
                                component="img"
                                className={styles.symptomCardMedia}
                                image={item.image}
                                alt={item.title}
                            />
                            <CardContent>
                                <Typography variant="h5" component="h5" className={styles.symptomCardTitle}>
                                    {item.title}
                                </Typography>

                                <Button
                                    variant="contained"
                                    className={styles.symptomButton}
                                    endIcon={<ArrowCircleRightIcon />}
                                >
                                    {item.Consult}
                                </Button>
                            </CardContent>
                        </Paper>
                    </Grid>
                ))}
            </Grid>

            <Grid container spacing={2} columns={{ xs: 4, sm: 8, md: 12 }}>
                <Grid xs={12} sx={{ textAlign: 'center', marginTop: '20px' }}>
                    <Button
                        variant="contained"
                        className={styles.gridButton}
                        endIcon={<ArrowCircleRightIcon />}
                    >
                        {en.homepage.symptomCards.buttonText}
                    </Button>
                </Grid>
            </Grid>
        </Box>
    );
};

export default SymptomCards;
