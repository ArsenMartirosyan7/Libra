/* eslint-disable react/prop-types */
import { IntlProvider } from "react-intl"
import { LANGUAGES } from "./languages"
import { Fragment } from "react"
import messages from "./messages"

function Provider({children, locale = (localStorage.getItem('language') || LANGUAGES.ENGLISH)}) {
  return (
    <IntlProvider locale={locale} textComponent={Fragment} messages={messages[locale]}>
      {children}
    </IntlProvider>
  )
}

export default Provider