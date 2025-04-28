import { Component, Input } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { AppComponent } from '../app.component';

@Component({
  selector: 'app-book-component',
  templateUrl: './book-component.component.html',
  styleUrl: './book-component.component.css'
})
export class BookComponentComponent {

  ISBN!: string;
  title!: string;
  author!: string;
  @Input() text!: string;
  readonly url="http://localhost:8080/bookAPI";

  constructor(private http: HttpClient, private appComponent: AppComponent) {}

  ngOnInit(){
    this.updateBookDetails(this.text);
  }

  updateBookDetails(jsonText: string){
    const { title, author, isbn } = JSON.parse(jsonText);
    this.title = title;
    this.author = author;
    this.ISBN = isbn;
  }

  editBook(newTitle: string, newAuthor: string){
    let newBook: string = '{';
    if (newTitle!=null){
      newBook += "\"title\":\""+newTitle+"\",";
    }
    if (newAuthor!=null){
      newBook += "\"author\":\""+newAuthor+"\"";
    }
    newBook += '}';
    this.http.patch(this.url+"?ISBN="+this.ISBN, newBook, {headers: new HttpHeaders({ 'Content-Type': 'application/json' })}).subscribe(response => {
      this.updateBookDetails(JSON.stringify(response, null, 2));
    });
  }

  openEditDialog() {
    const dialog = document.getElementById("dialogEditBox"+this.ISBN);
    if (dialog) {
        (dialog as HTMLDialogElement).showModal();
    } else {
        console.error("Dialog element not found");
    }
  }

  closeEditDialog() {
    const dialog = document.getElementById("dialogEditBox"+this.ISBN);
    if (dialog) {
        (dialog as HTMLDialogElement).close();
    } else {
        console.error("Dialog element not found");
    }
  }

  deleteBook(){
    this.http.delete(this.url+"?ISBN="+this.ISBN, {observe: "response"}).subscribe({
      next: response => {
        if (response.status==200){
          this.appComponent.showDialog("Book deleted successfully");
          this.appComponent.showAllBooks();
        }
      }, error:error => {
        if (error.status==404){
          this.appComponent.showDialog("Book doesn't exist");
        }
      }
    });
  }
  
}

