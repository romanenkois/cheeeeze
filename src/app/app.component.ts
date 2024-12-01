import { Component, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { MainService } from './service/main.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  private mainService: MainService = inject(MainService);

  title = 'cheeeeze';
}
