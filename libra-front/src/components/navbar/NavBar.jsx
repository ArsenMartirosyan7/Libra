import { useContext} from 'react'
import { NavLink, useNavigate } from 'react-router-dom'
import { languages } from 'constants/languages'
import styles from './navbar.module.scss'
import Translate from 'i18n/Translate'
import { UseContext } from 'App'
import classNames from 'classnames'

const NavBar = () => {
  const { handleLanguageChange, language} = useContext(UseContext)
  const navigate = useNavigate()



  return (
    <nav className={styles.nav}>
      <div className={styles.navRelativeContainer}>
        <div className={styles.navContainer}>
          <h1 className={styles.navLogo} onClick={() => navigate('/')}>Libra</h1>
          <div className={styles.navItems}>
            <div className={styles.navItem}>
              <p onClick={() => navigate('/')} className={styles.navItemText}>{Translate('home')}</p>
            </div>
            <div className={styles.navItem}>
              <p onClick={() => navigate('/catalogue')} className={styles.navItemText}>{Translate('catalogue')}</p>
            </div>
            <div className={styles.navItem}>
              <NavLink className={styles.navA} to='/ebooks'>
                <p className={styles.navItemText}>{Translate('eBooks')}</p>
              </NavLink>
            </div>
            <div className={styles.navItem}>
              <NavLink className={styles.navA} to='/login'>
                <p className={styles.navItemText}>{Translate('signin')}</p>
              </NavLink>
            </div>
            <div className={classNames(styles.navItem, styles.additionalClass)}>
              <img className={styles.navSelectedLanguage} src={language.startsWith('en') ? languages[1].img : language === 'ru-ru' ? languages[2].img : languages[0].img} alt="" />
              <img className={styles.navArrow} src='/images/hamburger_arrow_down.svg' alt="" />
              <div className={styles.navLanguages}>
                {
                  languages.map(e =>
                    <div onClick={() => handleLanguageChange(e.language)} className={styles.navLanguagesLanguage} key={e.id}>
                      <img className={styles.navLanguageFlagImg} src={e.img} alt="" />
                      <p className={styles.navLanguageLanguage}>{Translate(e.text)}</p>
                    </div>
                  )
                }
              </div>
            </div>
            <div className={styles.navItem}>
              <NavLink className={styles.navA} to='/contact'>
                <p className={styles.navItemText}>{Translate('contacts')}</p>
              </NavLink>
            </div>
          </div>
        </div>
      </div>
    </nav>
  )
}

export default NavBar