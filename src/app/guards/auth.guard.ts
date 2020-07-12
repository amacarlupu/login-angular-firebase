import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from '../services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor( private auth:AuthService,
                private router:Router ){
  }

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    console.log('Guard');

    // Si es true si puede acceder sino se bloquea y redirige a login
    if( this.auth.estadoAutenticar() ){
      return true
    }else{
      this.router.navigateByUrl('/login');
      return false; // Siempre retorna falso si no entra a home
    }

  }

}
