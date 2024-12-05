import {
  Component,
  computed,
  effect,
  EventEmitter,
  inject,
  input,
  InputSignal,
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
export class ChessFieldComponent {
  mainService: MainService = inject(MainService);

  position: InputSignal<[number, number]> = input.required();
  field: InputSignal<chessField> = input.required();
  showIndex: InputSignal<boolean> = input.required();
  onFocus: InputSignal<boolean> = input.required();

  @Output() fieldSelectedEvent = new EventEmitter<[number, number]>();
  fieldSelected() {
    this.fieldSelectedEvent.emit(this.position());
  }

  piecePicture: WritableSignal<any> = signal(null);
  fieldColor = computed(() => {
    return (this.position()[1] % 2 == 0 && this.position()[0] % 2 == 0) ||
      (this.position()[1] % 2 != 0 && this.position()[0] % 2) != 0
      ? 'white'
      : 'black';
  });

  getPieceImage(piece: chessPiece, faction: chessFaction, theme: 'standart') {
    let imageLink: string = '';
    imageLink = `chess_pieces/${theme}/${piece}_${faction}.png`;
    return imageLink;
  }

  constructor() {
    effect(
      () => {
        // sets the picture of piece
        if (this.field().piece != 'empty') {
          this.piecePicture.set(
            this.getPieceImage(
              this.field().piece,
              this.field().faction,
              'standart'
            )
          );
        } else {
          this.piecePicture.set(null);
        }
      },
      { allowSignalWrites: true }
    );
  }
}
