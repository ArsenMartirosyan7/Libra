import {LazyLoadPage} from './components/lazy-load-page';
import {PageName} from './constants';


export const Page = {
    [PageName.Home]: (
        <LazyLoadPage
            loader={() =>
                import(
                    /* webpackPrefetch: true */
                    /* webpackChunkName: "pages" */
                    /* webpackMode: "lazy" */
                    '../Home'
                    )
            }
            name={PageName.Home}
        />
    ),
    [PageName.Contact]: (
        <LazyLoadPage
            loader={() =>
                import(
                    /* webpackPrefetch: true */
                    /* webpackChunkName: "pages" */
                    /* webpackMode: "lazy" */
                    '../Contact'
                    )
            }
            name={PageName.Contact}
        />
    ),
    [PageName.LoginPage]: (
        <LazyLoadPage
            loader={() =>
                import(
                    /* webpackPrefetch: true */
                    /* webpackChunkName: "pages" */
                    /* webpackMode: "lazy" */
                    '../LoginPage'
                    )
            }
            name={PageName.LoginPage}
        />
    ),
    [PageName.EBooks]: (
        <LazyLoadPage
            loader={() =>
                import(
                    /* webpackPrefetch: true */
                    /* webpackChunkName: "pages" */
                    /* webpackMode: "lazy" */
                    '../EBooks'
                    )
            }
            name={PageName.EBooks}
        />
    ),
    [PageName.Catalogue]: (
        <LazyLoadPage
            loader={() =>
                import(
                    /* webpackPrefetch: true */
                    /* webpackChunkName: "pages" */
                    /* webpackMode: "lazy" */
                    '../Catalogue'
                    )
            }
            name={PageName.Catalogue}
        />
    ),
    [PageName.AdminDashboard]: (
        <LazyLoadPage
            loader={() =>
                import(
                    /* webpackPrefetch: true */
                    /* webpackChunkName: "pages" */
                    /* webpackMode: "lazy" */
                    '../../admin/adminDashboard/AdminDashboard'
                    )
            }
            name={PageName.AdminDashboard}
        />
    ),
    [PageName.BookManagement]: (
        <LazyLoadPage
            loader={() =>
                import(
                    /* webpackPrefetch: true */
                    /* webpackChunkName: "pages" */
                    /* webpackMode: "lazy" */
                    '../../admin/BookManagement/BookManagement'
                    )
            }
            name={PageName.BookManagement}
        />
    ),
    [PageName.BorrowManagement]: (
        <LazyLoadPage
            loader={() =>
                import(
                    /* webpackPrefetch: true */
                    /* webpackChunkName: "pages" */
                    /* webpackMode: "lazy" */
                    '../../admin/BorrowManagement/BorrowManagement'
                    )
            }
            name={PageName.BorrowManagement}
        />
    ),
    [PageName.LockerReservation]: (
        <LazyLoadPage
            loader={() =>
                import(
                    /* webpackPrefetch: true */
                    /* webpackChunkName: "pages" */
                    /* webpackMode: "lazy" */
                    '../../admin/LockerReservation/LockerReservation'
                    )
            }
            name={PageName.LockerReservation}
        />
    ),
    [PageName.UserManagement]: (
        <LazyLoadPage
            loader={() =>
                import(
                    /* webpackPrefetch: true */
                    /* webpackChunkName: "pages" */
                    /* webpackMode: "lazy" */
                    '../../admin/UserManagement/UserManagement'
                    )
            }
            name={PageName.UserManagement}
        />
    ),
    [PageName.UserProfile]: (
        <LazyLoadPage
            loader={() =>
                import(
                    /* webpackPrefetch: true */
                    /* webpackChunkName: "pages" */
                    /* webpackMode: "lazy" */
                    '../../user/profile/UserProfile'
                    )
            }
            name={PageName.UserProfile}
        />
    ),
    [PageName.UserDashboard]: (
        <LazyLoadPage
            loader={() =>
                import(
                    /* webpackPrefetch: true */
                    /* webpackChunkName: "pages" */
                    /* webpackMode: "lazy" */
                    '../../user/dashboard/UserDashboard'
                    )
            }
            name={PageName.UserDashboard}
        />
    ),
    [PageName.AvailableBooks]: (
        <LazyLoadPage
            loader={() =>
                import(
                    /* webpackPrefetch: true */
                    /* webpackChunkName: "pages" */
                    /* webpackMode: "lazy" */
                    '../../user/books/AvailableBooks'
                    )
            }
            name={PageName.AvailableBooks}
        />
    ),
    [PageName.BorrowBooks]: (
        <LazyLoadPage
            loader={() =>
                import(
                    /* webpackPrefetch: true */
                    /* webpackChunkName: "pages" */
                    /* webpackMode: "lazy" */
                    '../../user/books/BorrowBooks'
                    )
            }
            name={PageName.BorrowBooks}
        />
    ),
    [PageName.ReserveBooks]: (
        <LazyLoadPage
            loader={() =>
                import(
                    /* webpackPrefetch: true */
                    /* webpackChunkName: "pages" */
                    /* webpackMode: "lazy" */
                    '../../user/books/ReserveBooks'
                    )
            }
            name={PageName.ReserveBooks}
        />
    ),
    [PageName.ReturnBooks]: (
        <LazyLoadPage
            loader={() =>
                import(
                    /* webpackPrefetch: true */
                    /* webpackChunkName: "pages" */
                    /* webpackMode: "lazy" */
                    '../../user/books/ReturnBooks'
                    )
            }
            name={PageName.ReturnBooks}
        />
    ),
    [PageName.BorrowHistory]: (
        <LazyLoadPage
            loader={() =>
                import(
                    /* webpackPrefetch: true */
                    /* webpackChunkName: "pages" */
                    /* webpackMode: "lazy" */
                    '../../user/history/BorrowHistory'
                    )
            }
            name={PageName.BorrowHistory}
        />
    ),
    [PageName.LockerReservationUser]: (
        <LazyLoadPage
            loader={() =>
                import(
                    /* webpackPrefetch: true */
                    /* webpackChunkName: "pages" */
                    /* webpackMode: "lazy" */
                    '../../user/locker/LockerReservationUser'
                    )
            }
            name={PageName.LockerReservationUser}
        />
    ),
};
