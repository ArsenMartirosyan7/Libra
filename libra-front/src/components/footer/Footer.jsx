import { Link } from 'react-router-dom';
import styles from './footer.module.scss';
import { footerIcons } from 'constants/footerIcons';
import Translate from '../../i18n/Translate';

const Footer = () => {
  return (
      <footer className={styles.footer}>
        <div className={styles.footerContainer}>
          <div className={styles.footerContent}>
            {/* Main Columns */}
            <div className={styles.footerColumns}>
              {/* Column 1 - Main Links */}
              <div className={styles.footerColumn}>
                <h3 className={styles.footerColumnTitle}>Explore</h3>
                <div className={styles.footerLinks}>
                  <Link to='/' className={styles.footerLink}>
                    {Translate('home')}
                  </Link>
                  <Link to='/catalogue' className={styles.footerLink}>
                    {Translate('catalogue')}
                  </Link>
                  <Link to='/ebooks' className={styles.footerLink}>
                    {Translate('eBooks')}
                  </Link>
                  <Link to='/login' className={styles.footerLink}>
                    {Translate('signin')}
                  </Link>
                  <Link to='/contact' className={styles.footerLink}>
                    {Translate('contacts')}
                  </Link>
                </div>
              </div>

              {/* Column 2 - Collections */}
              <div className={styles.footerColumn}>
                <h3 className={styles.footerColumnTitle}>Collections</h3>
                <div className={styles.footerLinks}>
                  <Link to='/catalogue' className={styles.footerLink}>
                    {Translate('Fiction')}
                  </Link>
                  <Link to='/catalogue' className={styles.footerLink}>
                    {Translate('Mystery')}
                  </Link>
                  <Link to='/catalogue' className={styles.footerLink}>
                    {Translate('Thriller')}
                  </Link>
                  <Link to='/catalogue' className={styles.footerLink}>
                    {Translate('Romance')}
                  </Link>
                  <Link to='/catalogue' className={styles.footerLink}>
                    {Translate('Science Fiction')}
                  </Link>
                </div>
              </div>

              {/* Column 3 - Contact Info */}
              <div className={styles.footerColumn}>
                <h3 className={styles.footerColumnTitle}>Get in Touch</h3>
                <div className={styles.footerContactCard}>
                  <div className={styles.footerContactItem}>
                    <svg className={styles.footerContactIcon} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    <div className={styles.footerContactText}>
                      {Translate('address1')}
                      <br />
                      {Translate('address2')}
                    </div>
                  </div>
                  <a href="mailto:info@libra.am" className={styles.footerContactItem}>
                    <svg className={styles.footerContactIcon} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                    <span className={styles.footerContactText}>info@libra.am</span>
                  </a>
                  <a href='tel:+374 33 07 60 62' className={styles.footerContactItem}>
                    <svg className={styles.footerContactIcon} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                    </svg>
                    <span className={styles.footerContactText}>+374 33 07 60 62</span>
                  </a>
                </div>
              </div>

              {/* Column 4 - Social Links */}
              <div className={styles.footerColumn}>
                <h3 className={styles.footerColumnTitle}>Follow Us</h3>
                <div className={styles.footerSocials}>
                  {footerIcons.map(icon => (
                      <a
                          key={icon.id}
                          href={icon.link}
                          className={styles.footerSocialLink}
                          target="_blank"
                          rel="noopener noreferrer"
                      >
                        <img className={styles.footerSocialIcon} src={icon.img} alt='' />
                      </a>
                  ))}
                </div>
              </div>
            </div>

            {/* Bottom Bar */}
            <div className={styles.footerBottom}>
              <div className={styles.footerLogo}>Libra</div>
              <p className={styles.footerCopyright}>
                {Translate('copyright')}
              </p>
            </div>
          </div>
        </div>
      </footer>
  );
};

export default Footer;