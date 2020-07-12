import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  constructor( private auth:AuthService, private router:Router) { }

  ngOnInit() {
  }

  // Funcion para deslogearse usando servicios y luego redireccionar a login
  salir(){
    this.auth.logout();
    this.router.navigateByUrl('/login');
  }
}
