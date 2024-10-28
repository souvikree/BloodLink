import React from 'react'
import HeroSection from './sections/HeroSection'
import WhatIsBloodLink from './sections/WhatIsBloodLink'
import Banner from './sections/Banner'
import ServicesPage from './sections/ServicesPage'
import Footer from './sections/Footer'
import WorkSection from './sections/WorkSection'


export default function LandingPage() {
    return (
        <>
        <HeroSection />
        <WhatIsBloodLink />
        <ServicesPage />
        <Banner />
        <WorkSection />
        <Footer />
        </>
    )
};

