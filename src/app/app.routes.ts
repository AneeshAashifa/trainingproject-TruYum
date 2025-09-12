import { Routes } from '@angular/router';
import { LandingComponent } from './landing/landing.component';
import { MenuComponent } from './menu/menu.component';
import { CartComponent } from './cart/cart.component';
import { UserLoginComponent } from './user-login/user-login.component';
import { AdminLoginComponent } from './admin-login/admin-login.component';
import { RegisterComponent } from './register/register.component';
import { OrderPlacedComponent } from './order-placed/order-placed.component';
import { LoginChoiceComponent } from './login-choice/login-choice.component';
import { OrderConfirmationComponent } from './order-confirmation/order-confirmation.component';
import { OrderHistoryComponent } from './order-history/order-history.component';
import { AdminDashboardComponent } from './admin-dashboard/admin-dashboard.component';
import { AdminGuard } from './admin.guard';
import { UnauthorizedComponent } from './unauthorized/unauthorized.component';
export const routes: Routes = [
  { path: '', component: LandingComponent },
  { path: 'login', component: LoginChoiceComponent },
  { path: 'user-login', component: UserLoginComponent },
  { path: 'admin-login', component: AdminLoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'menu', component: MenuComponent },
  { path: 'cart', component: CartComponent },
  { path: 'order-placed', component: OrderPlacedComponent },
  { path: 'order-confirmation', component: OrderConfirmationComponent},
  { path: 'order-history', component: OrderHistoryComponent},
  { path: 'admin-dashboard', component: AdminDashboardComponent,canActivate: [AdminGuard]},
  { path: 'unauthorized', component: UnauthorizedComponent},
  { path: '**', redirectTo: '' }
];
