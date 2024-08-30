'use client';

import dynamic from 'next/dynamic';

import BannerComponent from "./Banner";
import SpecialitySlider from "./SpecialitySlider";

import ExpertSpecialistSlider from './ExpertSpecialistSlider';
import SymptomCards from './SymptomCards';
import AboutUs from './AboutUs';
import Testimonials from './Testimonials';
import BannerBottom from './BannerBottom';

const Home = () => {
    return (
        <>
            <BannerComponent />
            <SpecialitySlider />
            <ExpertSpecialistSlider />
            <SymptomCards />
            <AboutUs />
            <Testimonials />
            <BannerBottom />
        </>
    );
};

export default Home;
