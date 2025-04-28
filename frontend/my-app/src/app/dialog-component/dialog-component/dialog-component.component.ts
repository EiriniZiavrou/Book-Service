import { Component, Input, OnInit} from '@angular/core';

@Component({
  selector: 'app-dialog-component',
  templateUrl: './dialog-component.component.html',
  styleUrl: './dialog-component.component.css'
})
export class DialogComponentComponent {

  @Input() message: string = "This is a message";

  ngOnInit(){
    this.openDialog();
  }

  openDialog() {
    const dialog = document.getElementById("dialog");
    if (dialog) {
        (dialog as HTMLDialogElement).showModal();
    } else {
        console.error("Dialog element not found");
    }
  }

  closeDialog() {
    const dialog = document.getElementById("dialog");
    if (dialog) {
        (dialog as HTMLDialogElement).close();
    } else {
        console.error("Dialog element not found");
    }
  }
}
