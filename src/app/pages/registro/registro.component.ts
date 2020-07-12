import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';

// Cosas que yo importe
import { UsuarioModel } from '../../models/usuario.model';
import { AuthService } from '../../services/auth.service';
import Swal from 'sweetalert2';
import { Router } from '@angular/router';

@Component({
  selector: 'app-registro',
  templateUrl: './registro.component.html',
  styleUrls: ['./registro.component.css']
})
export class RegistroComponent implements OnInit {

  // Instanciar clase UsuarioModel
  usuario:UsuarioModel;
  recordarme=false;

  constructor( private auth:AuthService,
                private router:Router ) { }

  ngOnInit() {

    // Inicializar la instancia de UsuarioModel, un objeto topo UsuarioModel
    this.usuario=new UsuarioModel();

    // this.usuario.email='amacarlupup@gmail.com';
  }

  onSubmit( form:NgForm ){

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
    })
    Swal.showLoading(); // Transforma boton de Ok en un loading


    this.auth.nuevoUsuario( this.usuario )
      .subscribe( resp => {

        console.log(resp);
        Swal.close(); // Cerrar sweet alert si puede logearse

        // Si se dio click a recordarme almacenar el email en LocalStorage
        if( this.recordarme ){
          localStorage.setItem('email',this.usuario.email);
        }

        // Navegar hacia el home si se logea, usar 'navigateUrl' porque
        // actualiza toda la url en cambia 'navigate' solo lo parchea
        this.router.navigateByUrl('/home');

      }, err => {

        console.log(err);
        console.log(err.error.error.message);
        Swal.fire({
          icon:'error',
          title:'Error al registrarse',
          text:err.error.error.message
        })

      })

    // console.log('Formulario enviado');
    // console.log(this.usuario);
    // console.log(form);

  }

}
