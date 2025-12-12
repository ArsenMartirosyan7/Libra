import Ebooks from '../components/EBooks/Ebooks';
import { Page } from 'components/Page';
import { useEffect } from 'react';

export const EBooks = () => {
  useEffect(() => { window.scrollTo(0, 0) }, [])

  const content =
  <Page>
    <Ebooks />
  </Page>

  return (
    <>
      { content }
    </>
  )
}