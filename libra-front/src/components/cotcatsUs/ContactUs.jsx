import Translate from 'i18n/Translate';
import styles from './ContactUs.module.scss';
import { useContext, useState } from 'react';
import { UseContext } from 'App';
import { contactIcons } from 'constants/contactIcons';
import * as yup from 'yup';
import { Formik } from 'formik';
import axios from "axios";

function ContactUs() {
  const { language } = useContext(UseContext);
  const [changeButton, setChangeButton] = useState(false);

  const validationSchema = yup.object().shape({
    name: yup.string().required(Translate('mandatory')).max(30, Translate('nameError')),
    email: yup.string().email(Translate('emailError')).required(Translate('mandatory')),
    phone: yup.string().matches(/^\+(?:[0-9] ?){6,14}[0-9]$/, { message: Translate('phoneError'), excludeEmptyString: true }).required(Translate('mandatory')),
    message: yup.string().required(Translate('mandatory')).max(250, Translate('messageError'))
  });

  const handleClick = () => {
    navigator.clipboard.writeText('https://maps.app.goo.gl/z7FW3faccz2bGV3d6')
        .then(() => alert('Link copied to clipboard!'))
  };

  return (
      <div className={styles.contactUs}>
        {/* Logo with Libra branding */}
        <h2 className={`${styles.contactTitle} ${language === 'am-am' && styles.armenianTitle}`}>
          {Translate('contacts')}
        </h2>

        <div className={styles.contactContainer}>
          {/* Map Section */}
          <div className={styles.mapContainer}>
            <div className={styles.mapWrapper}>
              <iframe
                  title='map'
                  className={styles.map}
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3046.841574311449!2d44.5325979!3d40.2125869!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x406aa2c8c143a0cd%3A0x72dffbe489313480!2sInformation%20and%20Automation%20Problems%20of%20The%20National%20Academy%20of%20Sciences%20Institute!5e0!3m2!1sru!2sam!4v1764796417405!5m2!1sru!2sam"                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
              />
            </div>

            <div className={styles.mapInfo}>
              <div className={styles.addressCard}>
                <div className={styles.addressHeader}>
                  <svg className={styles.addressIcon} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  <p className={styles.addressText}>
                    Libra 2213, 0069, C. Yerevan, Armenia, 1 Paruyr Sevak Street
                  </p>
                  <button onClick={handleClick} className={styles.copyBtn}>
                    <svg width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                      <path d="M4 1.5H3a2 2 0 0 0-2 2V14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V3.5a2 2 0 0 0-2-2h-1v1h1a1 1 0 0 1 1 1V14a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1V3.5a1 1 0 0 1 1-1h1v-1z"/>
                      <path d="M9.5 1a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-.5.5h-3a.5.5 0 0 1-.5-.5v-1a.5.5 0 0 1 .5-.5h3zm-3-1A1.5 1.5 0 0 0 5 1.5v1A1.5 1.5 0 0 0 6.5 4h3A1.5 1.5 0 0 0 11 2.5v-1A1.5 1.5 0 0 0 9.5 0h-3z"/>
                    </svg>
                  </button>
                </div>
              </div>

              <button
                  onClick={() => window.location.href = 'https://maps.app.goo.gl/tMrPtq4tFGXFqk596'}
                  className={styles.mapBtn}
              >
                {Translate('openInGoogle')}
              </button>
            </div>
          </div>

          {/* Form Section */}
          <div className={styles.formContainer}>
            {/* Social Icons */}
            <div className={styles.socialIcons}>
              {contactIcons.map(icon => (
                  <div className={styles.socialIconWrapper} key={icon.id}>
                    <button
                        onClick={() => window.location.href = icon.link}
                        className={styles.socialIconBtn}
                    >
                      <img src={icon.img} alt={icon.name} className={styles.socialIconImg} />
                    </button>
                    <span className={styles.socialIconName}>{icon.name}</span>
                  </div>
              ))}
            </div>

            {/* Contact Form */}
            <Formik
                initialValues={{
                  name: '',
                  email: '',
                  phone: '',
                  message: ''
                }}
                onSubmit={(values, { resetForm }) => {
                  const instance = axios.create({
                    baseURL: process.env.REACT_APP_API_URL,
                    httpsAgent: false
                  });
                  instance
                      .post('/api/mail/sendemail', values)
                      .then(() => {
                        setChangeButton(true);
                        resetForm();
                        setTimeout(() => setChangeButton(false), 5000);
                      })
                }}
                validateOnBlur
                validationSchema={validationSchema}
            >
              {({ values, errors, touched, handleChange, handleBlur, isValid, handleSubmit, dirty, setFieldValue }) => (
                  <form className={styles.form} onSubmit={handleSubmit}>
                    {/* Name Input */}
                    <div className={styles.inputGroup}>
                      <div className={styles.inputWrapper}>
                        <input
                            className={`${styles.input} ${errors.name && touched.name && styles.inputError}`}
                            type='text'
                            name='name'
                            onChange={handleChange}
                            onBlur={handleBlur}
                            value={values.name}
                            placeholder={language.startsWith('en') ? 'Name' : language === 'ru-ru' ? 'Имя' : 'Անուն'}
                            id='name'
                            autoFocus
                        />
                        {!!values.name.length && !errors.name && touched.name && (
                            <button
                                type="button"
                                onClick={() => setFieldValue('name', '')}
                                className={styles.clearBtn}
                            >
                              <svg width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                                <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z"/>
                                <path d="M4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 0 1 0-.708z"/>
                              </svg>
                            </button>
                        )}
                        {errors.name && touched.name && (
                            <span className={styles.errorIcon}>⚠</span>
                        )}
                      </div>
                      {touched.name && errors.name && <p className={styles.errorText}>{errors.name}</p>}
                    </div>

                    {/* Email Input */}
                    <div className={styles.inputGroup}>
                      <div className={styles.inputWrapper}>
                        <input
                            className={`${styles.input} ${errors.email && touched.email && styles.inputError}`}
                            type='text'
                            name='email'
                            onChange={handleChange}
                            onBlur={handleBlur}
                            value={values.email}
                            id='email'
                            placeholder={language.startsWith('en') ? 'Email' : language === 'ru-ru' ? 'Эл. почта' : 'Էլ․ հասցե'}
                        />
                        {!!values.email.length && !errors.email && touched.email && (
                            <button
                                type="button"
                                onClick={() => setFieldValue('email', '')}
                                className={styles.clearBtn}
                            >
                              <svg width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                                <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z"/>
                                <path d="M4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 0 1 0-.708z"/>
                              </svg>
                            </button>
                        )}
                        {errors.email && touched.email && (
                            <span className={styles.errorIcon}>⚠</span>
                        )}
                      </div>
                      {errors.email && touched.email && <p className={styles.errorText}>{errors.email}</p>}
                    </div>

                    {/* Phone Input */}
                    <div className={styles.inputGroup}>
                      <div className={styles.inputWrapper}>
                        <input
                            className={`${styles.input} ${errors.phone && touched.phone && styles.inputError}`}
                            type='string'
                            name='phone'
                            onChange={handleChange}
                            onBlur={handleBlur}
                            value={values.phone}
                            id='phone'
                            placeholder={language.startsWith('en') ? 'Phone' : language === 'ru-ru' ? 'Телефон' : 'Հեռախոս'}
                        />
                        {!!values.phone.length && !errors.phone && touched.phone && (
                            <button
                                type="button"
                                onClick={() => setFieldValue('phone', '')}
                                className={styles.clearBtn}
                            >
                              <svg width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                                <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z"/>
                                <path d="M4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 0 1 0-.708z"/>
                              </svg>
                            </button>
                        )}
                        {errors.phone && touched.phone && (
                            <span className={styles.errorIcon}>⚠</span>
                        )}
                      </div>
                      {errors.phone && touched.phone && <p className={styles.errorText}>{errors.phone}</p>}
                    </div>

                    {/* Message Textarea */}
                    <div className={styles.inputGroup}>
                      <div className={styles.inputWrapper}>
                    <textarea
                        className={`${styles.textarea} ${errors.message && touched.message && styles.inputError}`}
                        name='message'
                        onChange={handleChange}
                        onBlur={handleBlur}
                        value={values.message}
                        id='message'
                        placeholder={language.startsWith('en') ? 'Message' : language === 'ru-ru' ? 'Письмо' : 'Նամակ'}
                        rows={5}
                    />
                        {!!values.message.length && !errors.message && touched.message && (
                            <button
                                type="button"
                                onClick={() => setFieldValue('message', '')}
                                className={`${styles.clearBtn} ${styles.clearBtnTextarea}`}
                            >
                              <svg width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                                <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z"/>
                                <path d="M4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 0 1 0-.708z"/>
                              </svg>
                            </button>
                        )}
                        {errors.message && touched.message && (
                            <span className={`${styles.errorIcon} ${styles.errorIconTextarea}`}>⚠</span>
                        )}
                      </div>
                      {errors.message && touched.message && <p className={styles.errorText}>{errors.message}</p>}
                    </div>

                    {/* Submit Button or Success Message */}
                    {changeButton ? (
                        <div className={styles.successMessage}>
                          <svg className={styles.successIcon} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                          <p className={styles.successText}>{Translate('thanks')}</p>
                        </div>
                    ) : (
                        <button
                            disabled={!isValid || !dirty}
                            type='submit'
                            className={styles.submitBtn}
                        >
                          {Translate('send')}
                        </button>
                    )}
                  </form>
              )}
            </Formik>
          </div>
        </div>
      </div>
  );
}

export default ContactUs;