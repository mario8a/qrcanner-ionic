import { Injectable } from '@angular/core';
import { Registro } from '../models/registro.model';
import { Storage } from '@ionic/storage';
import { NavController } from '@ionic/angular';
import { InAppBrowser } from '@ionic-native/in-app-browser/ngx';

@Injectable({
  providedIn: 'root'
})
export class DataLocalService {

  guardados: Registro[] = [];

  constructor(private storage: Storage, private navCtrl: NavController, private iab: InAppBrowser) {
    //cargar registros
    //mi solucion
    // this.cargarStorage();
    //solucion del video

    
  }
  
  
  async guardarRegistro(format: string, text: string) {
    
    
    await this.cargarStorage();

    const nuevoRegistro = new Registro(format, text);
    this.guardados.unshift(nuevoRegistro);

    console.log(this.guardados);
    //guardar en storagre 'registros'
    this.storage.set('registros', this.guardados);

    this.abrirRegistro(nuevoRegistro);
  }

  //mi solucion
  // async cargarStorage() {
  //   const registros = await this.storage.get('registros');
  //   this.guardados = registros || [];
  //   return this.guardados;
  //   }
  //

  //La del video
  async cargarStorage() {
    this.guardados  = await this.storage.get('registros') || [];
  
  }
///_system para que abra en el navegador por defecto
  abrirRegistro(registro: Registro) {

    this.navCtrl.navigateForward('/tabs/tab2');

    switch(registro.type) {
      
      case 'http':
        //abrir el navegador web
        this.iab.create(registro.text, '_system');
        break;
    }

  }
}
