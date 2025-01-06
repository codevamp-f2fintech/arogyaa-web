import * as React from 'react';

import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import CssBaseline from '@mui/material/CssBaseline';
import Container from '@mui/material/Container';
import { Box } from '@mui/material';

import faqData from './faq.json';

const FAQ: React.FC = () => {
  return (
    <React.Fragment>
      <CssBaseline />
      <Container>
        {faqData.faq.map((item, index) => (
          <Accordion key={index} elevation={0}>
            <AccordionSummary
              expandIcon={<ExpandMoreIcon />}
              aria-controls={`panel${index + 1}-content`}
              id={`panel${index + 1}-header`}
            >
              {item.title}
            </AccordionSummary>
            <AccordionDetails>
              <Box dangerouslySetInnerHTML={{ __html: item.content }} />
            </AccordionDetails>
          </Accordion>
        ))}
      </Container>
    </React.Fragment>
  );
}

export default FAQ;
