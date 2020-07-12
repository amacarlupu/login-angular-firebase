import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { UsuarioModel } from '../../models/usuario.model';
import { AuthService } from '../../services/auth.service';

// Importar SweetAlert2
// import swal from 'sweetalert2';
import Swal from 'sweetalert2';
import { Router } from '@angular/router';


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  // Instanciar clase UsuarioModel e inicializarla como objeto tipo UsuarioModel
  usuario:UsuarioModel=new UsuarioModel();;
  recordarme=false; // Propiedad para usar chek en el formulario

  constructor( private auth:AuthService,
                private router:Router ) { }

  ngOnInit() {

    // Si existe el email en el LocalStorage asignarle ese valor al campo
    // 'this.usuario.email' y mantener el check en el boton recordarme
    if( localStorage.getItem('email') ){
      this.usuario.email=localStorage.getItem('email');
      this.recordarme=true;
    }

  }


// Login Funcion
  login( form:NgForm ){

       // Si el formulario no es valido (campos no validados en el template)
       if(form.invalid){
        return;
      }

      // Usar SweetAlert2 el allowOutsideClick es para que no se cierre si
      // doy click fuera de la alerta
      Swal.fire({
        allowOutsideClick: false,
        text: 'Espere por favor...',
        icon: 'info'
      });
      Swal.showLoading(); // Transforma boton de Ok en un loading


      // Consumir servicio login
      this.auth.login( this.usuario )
        .subscribe( resp => {

          console.log(resp);
          Swal.close(); // Cerrar el sweetalert

          // Cuando el login es valido y se aplasto el boton check
          // guardar el email en LocalStorage
          if( this.recordarme ){
            localStorage.setItem('email',this.usuario.email);
          }

          this.router.navigateByUrl('/home');

        }, err => {

          console.log(err.error.error.message);
          // Si hay erro mostrar un sweetalert con el error
          Swal.fire({
            icon:'error',
            title:'Error al autenticar',
            text:err.error.error.message
          });

        });

    // console.log('Imprimir si el formulario es válido');
    // console.log(form);
  }

}
