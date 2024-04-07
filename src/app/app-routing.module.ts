import { NgModule, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CanActivateFn, PreloadAllModules, Router, RouterModule, Routes } from '@angular/router';
import { NotFoundComponent } from './components/not-found/not-found.component';
import { Observable, tap } from 'rxjs';
import { AuthService } from './services/auth.service';

export const authGuard: CanActivateFn = (): Observable<boolean> => {
  const router = inject(Router);
  return inject(AuthService).isAuth$.pipe(
    tap((isAuth) => {
      if (!isAuth) {
        router.navigate(['/auth']);
      }
    })
  );
}

const routes: Routes = [
  {
    path: 'auth',
    loadChildren: () => import('./modules/auth/auth.module').then(m => m.AuthModule),
  },
  {
    path: '',
    loadChildren: () => import('./modules/core/core.module').then(m => m.CoreModule),
    canActivate: [authGuard],
  },
  { path: '**', component: NotFoundComponent }
];

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules }),
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
