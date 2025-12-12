import {Page} from '../components/Page'
import { useParams } from 'react-router-dom'
import Book from 'components/Book/Book'
import { useEffect } from 'react'

export const Catalogue = () => {
  useEffect(() => { window.scrollTo() }, [])
  
  const { id } = useParams()
  const content =  id ? <Book/> :
  <>
    <Book />
  </>

  return (
    <Page>
      { content }
    </Page>
  )
}