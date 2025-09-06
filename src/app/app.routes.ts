import { Routes } from '@angular/router';
import { LandingComponent } from './landing/landing.component';
import { MenuComponent } from './menu/menu.component';
import { CartComponent } from './cart/cart.component';
import { UserLoginComponent } from './user-login/user-login.component';
import { AdminLoginComponent } from './admin-login/admin-login.component';
import { RegisterComponent } from './register/register.component';
import { AdminComponent } from './admin/admin.component';
import { OrderPlacedComponent } from './order-placed/order-placed.component';
import { LoginChoiceComponent } from './login-choice/login-choice.component';

export const routes: Routes = [
  { path: '', component: LandingComponent },
  { path: 'login', component: LoginChoiceComponent },
  { path: 'user-login', component: UserLoginComponent },
  { path: 'admin-login', component: AdminLoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'menu', component: MenuComponent },
  { path: 'cart', component: CartComponent },
  { path: 'admin', component: AdminComponent },
  { path: 'order-placed', component: OrderPlacedComponent },
  { path: '**', redirectTo: '' }
];
