
import dynamic from 'next/dynamic';
import DemoSymptoms from '../symptoms/DemoSymptoms';

const BannerComponent = dynamic(() => import('./Banner'));
const SpecialitySlider = dynamic(() => import('./SpecialitySlider'));
const ExpertSpecialistSlider = dynamic(() => import('./ExpertSpecialistSlider'));
const SymptomCards = dynamic(() => import('./SymptomCards'));
const AboutUs = dynamic(() => import('./AboutUs'));
const Testimonials = dynamic(() => import('./Testimonials'));
const BannerBottom = dynamic(() => import('./BannerBottom'));

const Home = () => {
    return (
        <>
            <BannerComponent />
            {/* <DemoSymptoms initialData={[]}/> */}
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
