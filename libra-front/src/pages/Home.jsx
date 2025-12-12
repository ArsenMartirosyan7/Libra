import { useEffect } from 'react';
import SubscriptionComponent from '../components/subscribtion/subsciption-component';
import MainSlider from '../components/mainSlider/MainSlider';
import WhyChoose from '../components/homePageComponents/homeWhyChoose/WhyChoose';
import { Page } from '../components/Page';
import HomeEbooksSection from "../components/homePageComponents/homeEbooksSection/HomeEbooksSection";

export const Home = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [])

  return (
    <Page>
      <MainSlider />
        <WhyChoose />
      <HomeEbooksSection />
      <SubscriptionComponent />
    </Page>
  );
}