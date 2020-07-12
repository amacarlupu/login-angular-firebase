import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { UsuarioModel } from '../models/usuario.model';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  // Variables que contiene elementos comunes en la url
  // COMENTADA por seguridad en GitHub
  // private url='https://identitytoolkit.googleapis.com/v1/accounts';
  // private apiKey='AIzaSyDtUAj1UkmER7VrrEAr-KIVNkKrY46yRhw';

  // Propiedad que almacenara valor de idToken
  userToken:string;

  constructor( private http:HttpClient ) {

    // Leer los datos de LocalStorage una vez se inicia el servicio
    this.leerToken();
   }



// Metodo para salir destruyendo el token del LocalStorage
logout(){
  localStorage.removeItem('token');
}



// Logearse
login( usuario:UsuarioModel ){

  const authData={
    ...usuario,
    returnSecureToken:true
  };

  // LLamar al servicio 'Sign In' de Firebase mediante peticion http POST
  // devuelve un observable
  // Mediante el pipe y map se filtra los valores antes de llegar al component
  // El map solo se ejecuta si no hay errores
  return this.http.post(
    `${ this.url }:signInWithPassword?key=${ this.apiKey }`,
    authData
  ).pipe(
    map( resp =>{
      console.log('Entro en el mapa del RJXS');
        this.guardarToken( resp['idToken'] );
        return resp;
    })
  );

}



// Registrar un nuevo usuario y guardarlo en Firebase
nuevoUsuario( usuario:UsuarioModel ){

  // Informacion a mandar al endpoint
  const authData={
    // email:usuario.email,
    // password:usuario.password,
    // ...usuario -> es lo mismo que lo anterior solo resumido aunque
    // tambien envia el campo nombre no afecta la peticion
    ...usuario,
    returnSecureToken:true
  };

  // LLamar el servicio 'Sign up' de Firebase mediante peticion http POST
  // devuelve un observable
  return this.http.post(
    `${ this.url }:signUp?key=${ this.apiKey }`,
    authData
  ).pipe(
    map( resp =>{
      this.guardarToken( resp['idToken'] );
      return resp;
    })
  );

}



// Guardar el Token en LocalStorage
private guardarToken( idToken:string ){

  this.userToken=idToken;
  localStorage.setItem('token',idToken);

  let hoy=new Date();
  hoy.setSeconds(3600); // Asignarle 3600s o 1hora a variable hoy

  // Guardarlo como campo 'expira' en LocalStorage, converir antes en string
  localStorage.setItem('expira', hoy.getTime().toString());
}



// Leer el LocalStorage
leerToken(){

  // Validar que el campo 'token' de LocaStorage no este vacio
  if( localStorage.getItem('token') ){
    this.userToken=localStorage.getItem('token');
  }else{
    this.userToken='';
  }

  return this.userToken;
}



// Enviar valor booleano de autenticar al Guard para restringir paginas
estadoAutenticar():boolean{

  // Si tiene menos de 2 caracteres entonces es Falso
  if( this.userToken.length<2 ){
    return false;
  }

  // Obtener valor representativo de fecha de expiracion de token en LocalStorage
  // Luego crear otra variable y asignarle el valor de 'expira'
  const expira=Number(localStorage.getItem('expira'));
  const expiraDate= new Date();
  expiraDate.setTime(expira);

  // Si el valor de expira es mayor al de la fecha actual quiere decir que
  // todavia no vence, sino quiere decir que ya vencio
  if( expiraDate> new Date() ){
    return true;
  }else{
    return false;
  }

}


}

