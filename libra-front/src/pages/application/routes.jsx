import * as paths from './paths';
import { ProtectedRoute } from './ProtectedRoute';
import {Page} from './Page';

class Route {
    constructor(path, element, children) {
        this.path = path;
        this.element = element;
        this.children = children;
    }
}

const routesBase = [
    new Route(paths.HOME_PAGE, Page.Home),
    new Route(paths.LOGIN_PAGE, Page.LoginPage),
    new Route(paths.CONTACT_PAGE, Page.Contact),
    new Route(paths.EBOOKS_PAGE, Page.EBooks),
    new Route(paths.CATALOGUE_PAGE, Page.Catalogue),
];

const routesUser = [
    new Route(paths.USER_DASHBOARD_PAGE, Page.UserDashboard),
    new Route(paths.USER_PROFILE_PAGE, Page.UserProfile),
    new Route(paths.USER_AVAILABLE_BOOKS_PAGE, Page.AvailableBooks),
    new Route(paths.USER_BORROW_BOOKS_PAGE, Page.BorrowBooks),
    new Route(paths.USER_RESERVE_BOOKS_PAGE, Page.ReserveBooks),
    new Route(paths.USER_RETURN_BOOKS_PAGE, Page.ReturnBooks),
    new Route(paths.USER_BORROW_HISTORY_PAGE, Page.BorrowHistory),
    new Route(paths.USER_LOCKER_RESERVATION_PAGE, Page.LockerReservationUser),
];

const routesAdmin = [
    new Route(paths.ADMIN_DASHBOARD_PAGE, Page.AdminDashboard),
    new Route(paths.ADMIN_BOOK_MANAGEMENT_PAGE, Page.BookManagement),
    new Route(paths.ADMIN_BORROW_MANAGEMENT_PAGE, Page.BorrowManagement),
    new Route(paths.ADMIN_LOCKER_RESERVATION_PAGE, Page.LockerReservation),
    new Route(paths.ADMIN_USER_MANAGEMENT_PAGE, Page.UserManagement),

];

export const routes = [...routesBase, ...routesAdmin, ...routesUser];
