import * as React from 'react';

import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

export default function FAQ() {
  return (
    <div>
      <Accordion elevation={0}>
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="panel1-content"
          id="panel1-header"
        >
          What is online doctor consultation?
        </AccordionSummary>
        <AccordionDetails>
          Online doctor consultation allows you to connect with a qualified medical professional through the internet. You can discuss your health concerns, receive advice, and even get prescriptions, all from the comfort of your home.
        </AccordionDetails>
      </Accordion>
      <Accordion elevation={0}>
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="panel2-content"
          id="panel2-header"
        >
          How do I book an online consultation?
        </AccordionSummary>
        <AccordionDetails>
          To book an online consultation, follow these steps:
          <ul>
            <li>Visit our website and log in to your account.</li>
            <li>Choose the type of doctor or specialty you need.</li>
            <li>Select a time slot that suits you.</li>
            <li>Make the payment to confirm your appointment.</li>
            <li>You’ll receive a link to join the consultation at the scheduled time.</li>
          </ul>
        </AccordionDetails>
      </Accordion>
      <Accordion elevation={0}>
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="panel3-content"
          id="panel3-header"
        >
          What do I need for the online consultation?
        </AccordionSummary>
        <AccordionDetails>
          You’ll need:
          <ul>
            <li>A stable internet connection.</li>
            <li>A device with a camera and microphone (such as a smartphone, tablet, or computer).</li>
            <li>A quiet and private space for your consultation.</li>
          </ul>
        </AccordionDetails>

      </Accordion>
      <Accordion elevation={0}>
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="panel3-content"
          id="panel3-header"
        >
          Are the doctors on your platform qualified?
        </AccordionSummary>
        <AccordionDetails>
          Yes, all doctors on our platform are fully licensed and have been thoroughly vetted. They are qualified professionals with the appropriate certifications to practice medicine.
        </AccordionDetails>

      </Accordion>
      <Accordion elevation={0}>
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="panel3-content"
          id="panel3-header"
        >
          Can I get a prescription through online consultation?
        </AccordionSummary>
        <AccordionDetails>
          Yes, after evaluating your condition, the doctor may issue an e-prescription, which will be sent directly to your account. You can use this prescription at any pharmacy or opt for our home delivery service.
        </AccordionDetails>

      </Accordion>
      <Accordion elevation={0}>
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="panel3-content"
          id="panel3-header"
        >
          Is my information secure and private?
        </AccordionSummary>
        <AccordionDetails>
          Absolutely. We use advanced encryption and security protocols to protect your personal and medical information. Your consultations are confidential, and we comply with all relevant data protection regulations.
        </AccordionDetails>

      </Accordion>
      <Accordion elevation={0}>
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="panel3-content"
          id="panel3-header"
        >
          What if I need a physical examination?
        </AccordionSummary>
        <AccordionDetails>
          If the doctor determines that a physical examination is necessary, they will guide you on the next steps, which might include visiting a nearby clinic or hospital.
        </AccordionDetails>

      </Accordion>
      <Accordion elevation={0}>
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="panel3-content"
          id="panel3-header"
        >
          How do I make payments?
        </AccordionSummary>
        <AccordionDetails>
          Payments can be made securely through various methods, including credit/debit cards, mobile wallets, or online banking. All transactions are encrypted to ensure your financial data is safe.
        </AccordionDetails>

      </Accordion>
      <Accordion elevation={0}>
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="panel3-content"
          id="panel3-header"
        >
          What if I need to cancel or reschedule my appointment?
        </AccordionSummary>
        <AccordionDetails>
          You can cancel or reschedule your appointment through your account dashboard. Please note that cancellations made within a certain period before the consultation may be subject to a fee.
        </AccordionDetails>

      </Accordion>
      <Accordion elevation={0}>
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="panel3-content"
          id="panel3-header"
        >
          What should I do if I miss my appointment?
        </AccordionSummary>
        <AccordionDetails>
          If you miss your scheduled appointment, you can either reschedule it or contact our support team for assistance. Depending on the terms, you might need to book a new consultation.
        </AccordionDetails>

      </Accordion>
      <Accordion elevation={0}>
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="panel3-content"
          id="panel3-header"
        >
          Can I consult a doctor for my family members?
        </AccordionSummary>
        <AccordionDetails>
          Yes, you can book consultations on behalf of your family members. During the booking process, you can select the patient’s details for the consultation.
        </AccordionDetails>
        <Accordion  >
          <AccordionSummary
            expandIcon={<ExpandMoreIcon />}
            aria-controls="panel3-content"
            id="panel3-header"
          >
            What kind of health issues can I consult about online?
          </AccordionSummary>
          <AccordionDetails>
            You can consult about a wide range of non-emergency health issues, including:
            <ul>
              <li>Common illnesses (cold, flu, infections)</li>
              <li>Chronic conditions (diabetes, hypertension)</li>
              <li>Mental health concerns</li>
              <li>Dermatological issues</li>
              <li>Sexual health and family planning</li>
            </ul>
          </AccordionDetails>

        </Accordion>

      </Accordion>
      <Accordion elevation={0}>
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="panel3-content"
          id="panel3-header"
        >
          What if I need urgent medical attention?
        </AccordionSummary>
        <AccordionDetails>
          Online consultations are not suitable for medical emergencies. If you require urgent medical care, please visit your nearest emergency room or contact local emergency services immediately.
        </AccordionDetails>

      </Accordion>
      <Accordion elevation={0}>
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="panel3-content"
          id="panel3-header"
        >
          Are there any consultation limits?
        </AccordionSummary>
        <AccordionDetails>
          There are no strict limits on consultations, but it’s advisable to follow up with the same doctor if you have ongoing issues, as this allows for better continuity of care.
        </AccordionDetails>

      </Accordion>
      <Accordion elevation={0}>
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="panel3-content"
          id="panel3-header"
        >
          How can I contact customer support?
        </AccordionSummary>
        <AccordionDetails>
          If you need help, our customer support team is available 24/7. You can reach us via email, phone, or live chat on our website.
        </AccordionDetails>

      </Accordion>
      {/* </Container>
    </React.Fragment> */}
    </div>
  );
}
