import dynamic from "next/dynamic";
import { Suspense } from 'react';

import Loader from "./common/Loader";
import BannerComponent from "./Banner";

const SpecialitySlider = dynamic(() => import("./SpecialitySlider"), { suspense: true });
const ExpertSpecialistSlider = dynamic(() => import("./ExpertSpecialistSlider"), { suspense: true });
const SymptomCards = dynamic(() => import("./SymptomCards"), { suspense: true });
const AboutUs = dynamic(() => import("./AboutUs"), { suspense: true });
const Testimonials = dynamic(() => import("./Testimonials"), { suspense: true });
const BannerBottom = dynamic(() => import("./BannerBottom"), { suspense: true });

const Home = () => {
  return (
    <Suspense fallback={<Loader />}>
      <BannerComponent />
      <SpecialitySlider />
      <ExpertSpecialistSlider />
      <SymptomCards />
      <AboutUs />
      <Testimonials />
      <BannerBottom />
    </Suspense>
  );
};

export default Home;
