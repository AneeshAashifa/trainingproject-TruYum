import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule, HTTP_INTERCEPTORS, HttpInterceptor, HttpRequest, HttpHandler, HttpEvent } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';
import { Observable } from 'rxjs';

// ✅ Standalone Components
import { AppComponent } from './app/app.component';
import { RegisterComponent } from './app/register/register.component';
import { UserLoginComponent } from './app/user-login/user-login.component';
import { AdminLoginComponent } from './app/admin-login/admin-login.component';
import { VerifyComponent } from './app/verify/verify.component';
import { MenuComponent } from './app/menu/menu.component';
import { CartComponent } from './app/cart/cart.component';
import { OrderPlacedComponent } from './app/order-placed/order-placed.component';
import { ChatComponent } from './app/chat/chat.component';

// ✅ Inline JWT Interceptor
export class JwtInterceptor implements HttpInterceptor {
  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const token = localStorage.getItem('token');
    if (token) {
      req = req.clone({
        setHeaders: { Authorization: `Bearer ${token}` }
      });
    }
    return next.handle(req);
  }
}

// ✅ Routing Setup
const routes: Routes = [
  { path: 'register', component: RegisterComponent },
  { path: 'user-login', component: UserLoginComponent },
  { path: 'admin-login', component: AdminLoginComponent },
  { path: 'verify', component: VerifyComponent },
  { path: 'menu', component: MenuComponent },
  { path: 'cart', component: CartComponent },
  { path: 'order-placed', component: OrderPlacedComponent },
  { path: 'chat', component: ChatComponent }, 
  { path: '', redirectTo: '/menu', pathMatch: 'full' }
];

@NgModule({
  imports: [
    BrowserModule,
    HttpClientModule,
    FormsModule,
    RouterModule.forRoot(routes),

    // 👇 Import standalone components here
    AppComponent,
    RegisterComponent,
    UserLoginComponent,
    AdminLoginComponent,
    VerifyComponent,
    MenuComponent,
    CartComponent,
    OrderPlacedComponent,
    ChatComponent
  ],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true }
  ],
  bootstrap: [AppComponent] // ✅ Bootstrap root component
})
export class AppModule { }
