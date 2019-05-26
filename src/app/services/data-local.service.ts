import { Injectable } from '@angular/core';
import { Registro } from '../models/registro.model';
import { Storage } from '@ionic/storage';
import { NavController } from '@ionic/angular';
import { InAppBrowser } from '@ionic-native/in-app-browser/ngx';
import { File } from '@ionic-native/file/ngx';
import { EmailComposer } from '@ionic-native/email-composer/ngx';

@Injectable({
  providedIn: 'root'
})
export class DataLocalService {

  guardados: Registro[] = [];

  constructor(private storage: Storage,
              private navCtrl: NavController,
              private iab: InAppBrowser,
              private file: File,
              private emailComposer: EmailComposer) {
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

        case 'geo':
        this.navCtrl.navigateForward(`/tabs/tab2/mapa/${registro.text}`);
        break;
    }


  }

  enviarCorreo() {
    
    const arrTemp = [];
    const titulos = 'Tipo, Formato, Creado en, Texto\n';

    arrTemp.push(titulos);

    this.guardados.forEach(registro => {

      const linea = `${registro.type}, ${registro.format}, ${registro.created}, ${registro.text.replace(',', ' ')}\n`;

      arrTemp.push(linea);


    });

    //console.log(arrTemp.join(''));
    this.crearArchivoFisico(arrTemp.join(''));
  }

  crearArchivoFisico(text: string) {

    //verifica si el archivo existe
    this.file.checkFile(this.file.dataDirectory, 'registros.csv')
        .then(existe => {
          console.log('Existe archivo?', existe);
          return this.escribirEnArchivo(text);
        })//si no existe lo crea y manda escribit en el archvip
        .catch( err => {

          return this.file.createFile(this.file.dataDirectory, 'registros.csv', false)
                    .then( creado => this.escribirEnArchivo(text) )
                    .catch( err2 => console.log('no se pudo crear el archivo', err2));
        });
  }

  async escribirEnArchivo(text: string) {
    await this.file.writeExistingFile(this.file.dataDirectory, 'registros.csv', text);

    const archivo = `${this.file.dataDirectory}registros.csv`;
    //console.log('archivo creado');

    const email = {
      to: 'mario8ato@hotmail.com',
      //cc: 'erika@mustermann.de',
      //bcc: ['john@doe.com', 'jane@doe.com'],
      attachments: [
        archivo
      ],
      subject: 'Back up de scanns',
      body: 'Aqui son los back ups de los scans - qrscanner',
      isHtml: true
    };
    
    // Send a text message using default options
    this.emailComposer.open(email);
  }
}
