import {
  Component,
  effect,
  EventEmitter,
  inject,
  input,
  InputSignal,
  OnInit,
  Output,
  signal,
  WritableSignal,
} from '@angular/core';
import { MainService } from '../../service/main.service';
import { chessFaction, chessField, chessPiece } from '../../service/models';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-chess-field',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './chess-field.component.html',
  styleUrl: './chess-field.component.scss',
})
export class ChessFieldComponent implements OnInit {
  mainService: MainService = inject(MainService);

  position: InputSignal<[number, number]> = input.required();
  field: InputSignal<chessField> = input.required();

  @Output() fieldSelectedEvent = new EventEmitter<[number, number]>();
  fieldSelected() {
    this.fieldSelectedEvent.emit(this.position());
  }

  piecePicture: WritableSignal<any> = signal(null);

  getPieceImage(piece: chessPiece, faction: chessFaction) {
    let imageLink: string = '';
    imageLink = `chess_pieces/standart/${piece}_${faction}.png`;
    return imageLink;
  }

  constructor(){
    effect(()=>{
      if (this.field().piece != 'empty') {
        this.piecePicture.set(
          this.getPieceImage(
            this.field().piece,
            this.field().faction
          )
        );

        console.log()
      } else {
        this.piecePicture.set(null)
      }
    }, {allowSignalWrites: true})
  }

  ngOnInit() {
    // if (this.field().piece != 'empty') {
    //   this.piecePicture.set(
    //     this.getPieceImage(
    //       this.field().piece,
    //       this.field().faction
    //     )
    //   );

    //   console.log()
    // }
  }
}
