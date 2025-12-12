import './subscribe.scss'
import { useContext, useState } from 'react'
import { UseContext } from 'App'
import Translate from 'i18n/Translate'
import axios from "axios"

const SubscriptionComponent = () => {
  const { language } = useContext(UseContext)
  const [email, setEmail] = useState('')
  const [notification, setNotification] = useState(null)

  const validateEmail = () => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailRegex.test(email)
  }

  const subscribersData = {
    email
  }

  const handleSubmit = async () => {
    if (!validateEmail()) {
      setNotification(
          language === 'am-am'
              ? 'Անվավեր էլ․ հասցե'
              : language === 'ru-ru'
                  ? 'Неверный адрес электронной почты'
                  : 'Invalid email address'

      )
      clearNotification()
      return
    }

    try {
      const instance = axios.create({
        baseURL: process.env.REACT_APP_API_URL,
        httpsAgent: false
      })

      const res = await instance.post('/api/subscribe/', subscribersData)
      const data = await res.data
      if (data.httpStatusCode === 201) {
        setNotification(language.startsWith('en') ? 'Thanks for subscribing.' : language === 'ru-ru' ? 'Спасибо за подписку.' : 'Շնորհակալություն բաժանորդագրվելու համար:'
        )
        setEmail('')
      } else {
        setNotification(data.data)
      }

      clearNotification()
    } catch (error) {
      setNotification(error)
      clearNotification()
    }
  }

  const clearNotification = () => {
    setTimeout(() => {
      setNotification(null)
    }, 2000)
  }

  return (
    <div className='subscribe_home_section'>
      <div className="subscribe_home_section_container">
        <p className='subscribe_home_section_container_text'>{Translate('subscribeText1')}</p>
        {/* <p className='subscribe_home_section_container_text'>{Translate('subscribeText2')}</p> */}
        <div className="subscribe_home_section_input_frame">
          <input
              placeholder={language.startsWith('en') ? 'Email' : language === 'ru-ru' ? 'Эл. почта' : 'էլ. հասցե'}
              value={email}
            onChange={e => setEmail(e.target.value)}
            className='subscribe_home_section_input'
            type="text"
          />
          <img src="/images/filter_clear.svg" alt="" className="subscribe_home_section_icon" />
          <p className="required_error">{Translate('mandatory')}</p>
        </div>
        <span onClick={handleSubmit} className='subscribe_home_section_btn'>{Translate('subscribe')}</span>
        {
          notification && typeof notification === 'string' &&
          <div className={`notification ${notification.includes('failed') ? 'error' : 'success' }`}>
            {notification}
          </div>
        }
      </div>
    </div>
  )
}

export default SubscriptionComponent
