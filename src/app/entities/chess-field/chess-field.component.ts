import {
  Component,
  computed,
  effect,
  EventEmitter,
  input,
  InputSignal,
  Output,
  signal,
  WritableSignal,
} from '@angular/core';
import { chessFaction, chessField, chessPiece } from '@models/index';
import { CommonModule } from '@angular/common';
import { NumberToLetter } from "@pipes/index";

@Component({
  selector: 'app-chess-field',
  standalone: true,
  imports: [CommonModule, NumberToLetter],
  templateUrl: './chess-field.component.html',
  styleUrl: './chess-field.component.scss',
})
export class ChessFieldComponent {
  field: InputSignal<chessField> = input.required();
  position: InputSignal<[number, number]> = input.required();
  positionToShow: InputSignal<[number, number]> = input.required();
  showIndex: InputSignal<boolean> = input.required();
  showRealIndex: InputSignal<boolean> = input.required();
  onFocus: InputSignal<'selected' | 'toBeAttacked' | 'toBeMoved' | null> = input.required();

  @Output() fieldSelectedEvent = new EventEmitter<[number, number]>();
  fieldSelected() {
    this.fieldSelectedEvent.emit(this.position());
  }

  piecePicture: WritableSignal<any> = signal(null);
  fieldColor = computed(() => {
    return (this.position()[1] % 2 == 0 && this.position()[0] % 2 == 0) ||
      (this.position()[1] % 2 != 0 && this.position()[0] % 2) != 0
      ? 'black'
      : 'white';
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
