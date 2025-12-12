import { useEffect } from 'react';
import ContactUs from '../components/cotcatsUs/ContactUs';
import { Page } from '../components/Page';

export const Contact = () => {
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])

  return (
    <Page>
      <ContactUs />
    </Page>
  );
}