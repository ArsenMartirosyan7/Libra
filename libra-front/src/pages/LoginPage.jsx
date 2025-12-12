import Login from '../components/Login/Login'
import { Page } from '../components/Page'
import { useEffect } from 'react'

export const LoginPage = () => {
  useEffect(() => { window.scrollTo(0, 0) }, [])
  
  const content =
  <>
    <Login />
  </>

  return (
    <Page>
      { content }
    </Page>
  )
}