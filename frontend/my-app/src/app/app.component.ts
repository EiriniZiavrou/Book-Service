import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component, OnInit, ViewChild, ViewContainerRef, ComponentRef, AfterViewInit, ElementRef } from '@angular/core';
import { BookComponentComponent } from './book-component/book-component.component';
import { DialogComponentComponent } from './dialog-component/dialog-component/dialog-component.component';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements AfterViewInit{

  @ViewChild('bookViewerContainer', { read: ViewContainerRef }) bookContainer!: ViewContainerRef;
  @ViewChild('dialogContainer', { read: ViewContainerRef }) dialogContainer!: ViewContainerRef;
  @ViewChild('bookScrollableContainer', {static: true}) bookScrollableContainer!: ElementRef;
  isbn: string = "";
  total!: number;

  constructor(private http: HttpClient) {}

  ngAfterViewInit(){
    this.showAllBooks();
  }

  showDialog(message: string){
    this.dialogContainer.clear();
    const componentRef: ComponentRef<DialogComponentComponent> = this.dialogContainer.createComponent(DialogComponentComponent);
    componentRef.instance.message = message;
  }

  searchFor(isbn: string){
    console.log("Searching for book with ISBN: "+isbn);
    this.http.get("http://localhost:8080/bookAPI?ISBN="+isbn , {observe: "response"}).subscribe({
      next: response => {
        if (response.status == 200){
          this.total = 1;
          this.bookContainer.clear();
          const bookString = JSON.stringify(response.body, null, 2);
          const componentRef: ComponentRef<BookComponentComponent> = this.bookContainer.createComponent(BookComponentComponent);
          componentRef.instance.text = bookString;
        }
      },
      error: error => {
        if (error.status == 404) {
          this.showDialog("Book doesn't exist");
        }
      }
    });
  }

  showAllBooks(){
    this.total = 0;
    this.http.get<string[]>("http://localhost:8080/bookAPI").subscribe(response => {
      this.bookContainer.clear();
      response.forEach((bookDetails: string)=> {
        const bookString = JSON.stringify(bookDetails);
        const componentRef: ComponentRef<BookComponentComponent> = this.bookContainer.createComponent(BookComponentComponent);
        componentRef.instance.text = bookString;
        this.total++;
      })
    });
  }

  addBook(title: string, author: string, isbn: string){
    const newBook = {title, author, isbn};
    this.http.post("http://localhost:8080/bookAPI", newBook, {headers: new HttpHeaders({ 'Content-Type': 'application/json' }),observe: 'response'}).subscribe(response => {
      if (response.status == 201){
        this.showDialog("Book added successfully");
        this.showAllBooks();
      }
    }, error => {
      if (error.status == 409){
        this.showDialog("Book already exists");
      }
      else if (error.status == 400){
        this.showDialog("Book ISBN is invalid");
      }
    });
  }

  clearInput(input: HTMLInputElement){
    input.value = "";
    this.showAllBooks();
  }

  openDialog(id: string) {
    //const dialog = document.getElementById("dialogBox");
    const dialog = document.getElementById(id);
    if (dialog) {
        (dialog as HTMLDialogElement).showModal();
    } else {
        console.error("Dialog element not found");
    }
  }

  closeDialog(id: string) {
    //const dialog = document.getElementById("dialogBox");
    const dialog = document.getElementById(id);
    if (dialog) {
        (dialog as HTMLDialogElement).close();
    } else {
        console.error("Dialog element not found");
    }
  }

  scrollRight() {
    this.bookScrollableContainer.nativeElement.scrollBy({ left: 500, behavior: 'smooth' });
  }

  scrollLeft() {
    this.bookScrollableContainer.nativeElement.scrollBy({ left: -500, behavior: 'smooth' });
  }

}