import { Component, OnInit, AfterViewInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

declare var mapboxgl: any;

@Component({
  selector: 'app-mapa',
  templateUrl: './mapa.page.html',
  styleUrls: ['./mapa.page.scss'],
})
export class MapaPage implements OnInit, AfterViewInit {

  lat: number;
  lng: number;

  constructor(private route: ActivatedRoute) { }

  ngOnInit() {

    let geo: any = this.route.snapshot.paramMap.get('geo');

    //extrayendo desde la posicion 4
    geo = geo.substr(4);
    //separando por , latitud, lng
    geo = geo.split(',');

    this.lat = Number(geo[0]);
    this.lng = Number(geo[1]);

    console.log(this.lat, this.lng);

  }

  //ciclo de vida que indica cuando ya se cargo el componente
  ngAfterViewInit() {


    mapboxgl.accessToken = 'pk.eyJ1IjoibWFyaW84YSIsImEiOiJjanZ2eWwwNTIwY2E1NDhvM2FxMDh0NDdsIn0.K8BoQY8cHvd3_9zwjPaKeA';
    
    const map = new mapboxgl.Map({
      container: 'map',
      style: 'mapbox://styles/mapbox/streets-v11'
    });
      
  }

}
