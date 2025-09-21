import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../shared/services/auth.service';


@Component({
  selector: 'app-publication',
  imports: [RouterLink],
  templateUrl: './publication.component.html',
  styleUrl: './publication.component.css'
})
export class PublicationComponent {

  publications = [
    {
      title:'Impacto del Diseño Urbano en el Bienestar Psicológico: Un Estudio Multinivel en Ciudades Contemporáneas',
      authors:'Dr. María González Rodríguez',
      institute:'INstituto XYZ',
      keywords:'sjdh,eagf,kjsehf',
      content:'irshgs ughidrhg lisrhgsirhgisrhgiserhglisrhoigh',
      pages:10,
      year:2024,
      url:'http://example.com'
    },
    {
      title:'Impacto del Diseño Urbano en el Bienestar Psicológico: Un Estudio Multinivel en Ciudades Contemporáneas',
      authors:'Dr. María González Rodríguez',
      institute:'INstituto XYZ',
      keywords:'sjdh,eagf,kjsehf',
      content:'irshgs ughidrhg lisrhgsirhgisrhgiserhglisrhoigh',
      pages:10,
      year:2024,
      url:'http://example.com'
    },
    {
      title:'Impacto del Diseño Urbano en el Bienestar Psicológico: Un Estudio Multinivel en Ciudades Contemporáneas',
      authors:'Dr. María González Rodríguez',
      institute:'INstituto XYZ',
      keywords:'sjdh,eagf,kjsehf',
      content:'irshgs ughidrhg lisrhgsirhgisrhgiserhglisrhoigh',
      pages:10,
      year:2024,
      url:'http://example.com'
    },

  ]

}
