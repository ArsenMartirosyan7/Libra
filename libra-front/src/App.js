import { createContext, useEffect, useMemo, useState } from 'react'
import 'react-quill/dist/quill.snow.css'
import { ApplicationRoutes } from './pages/application/ApplicationRoutes'
import './App.scss'
import 'react-toastify/dist/ReactToastify.css'
import {ToastContainer} from "react-toastify"
import { LANGUAGES } from 'i18n/languages'
import { I18nProvider } from 'i18n'

const App = () => {
  const [ language] = useState((localStorage.getItem('language') || LANGUAGES.ENGLISH))

  useEffect(() => {
    localStorage.setItem('language', language)
  }, [ language ])

  const providerValue = useMemo(() => ({ language,}), [  ])

  return (
    <UseContext.Provider value={providerValue}>
      <I18nProvider locale={language}>
        <div className='App'>
          <ApplicationRoutes />
          <ToastContainer />
        </div>
      </I18nProvider>
    </UseContext.Provider>
  )
}

export default App
export const UseContext = createContext([])