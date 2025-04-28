package niki.project.backend.controller;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import niki.project.backend.model.Book;

import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.http.ResponseEntity;


@RestController
@RequestMapping("/bookAPI")
@CrossOrigin(origins = "http://localhost:4200")
public class BookController {

    //private List<Book> books = new ArrayList<>();
    private List<Book> books = new ArrayList<Book>() {{
            add(new Book("The Hobbit", "J.R.R. Tolkien", "9780345339683"));
            add(new Book("The Lord of the Rings", "J.R.R. Tolkien", "9780007182367"));
            add(new Book("Harry Potter and the Philosopher's Stone", "J.K. Rowling", "059035342X"));
            add(new Book("Harry Potter and the Chamber of Secrets", "J.K. Rowling", "9780747538493"));
            add(new Book("Harry Potter and the Prisoner of Azkaban", "J.K. Rowling", "0439136369"));
            add(new Book("Harry Potter and the Goblet of Fire", "J.K. Rowling", "074754624X"));
            add(new Book("Harry Potter and the Order of the Phoenix", "J.K. Rowling", "9780747551003"));
            add(new Book("Harry Potter and the Half-Blood Prince", "J.K. Rowling", "9780439785969"));
            add(new Book("Harry Potter and the Deathly Hallows", "J.K. Rowling", "0747591059"));
            add(new Book("Angels & Demons", "Dan Brown", "9780671027360"));
            add(new Book("Inferno", "Dan Brown", "1400079152"));
            add(new Book("The Lost Symbol", "Dan Brown", "9780552161237"));
            add(new Book("Digital Fortress", "Dan Brown", "9780552161268"));
            add(new Book("Deception Point", "Dan Brown", "0743490304"));
            add(new Book("Origin", "Dan Brown", "9780552172356"));
            add(new Book("Brida", "Paulo Coelho", "0061578959"));
            add(new Book("Deception Point", "Dan Brown", "0671027387"));
        }};
    

    @PostMapping
    public ResponseEntity<?> addBook(@RequestBody Book book) {
        if (findBookByISBN(book.getISBN()).isPresent()) return ResponseEntity.status(409).build();
        if (!checkValidityOfISBN(book.getISBN())) return ResponseEntity.status(400).build();
        books.add(book);
        return ResponseEntity.status(201).body(book);
    }

    private Boolean checkValidityOfISBN(String ISBN) {
        if (ISBN.length()==10) return checkValidity10(ISBN);
        if (ISBN.length()==13) return checkValidity13(ISBN);
        return false;
    }

    private Boolean checkValidity10(String ISBN) {
        int sum = 0;
        for (int i=0; i<=8; i++){
            sum += Character.getNumericValue(ISBN.charAt(i)) * (10-i);
        }
        if (ISBN.charAt(9) == 'X') sum += 10;
        else sum += Character.getNumericValue(ISBN.charAt(9));
        return sum % 11 == 0;
    }

    private Boolean checkValidity13(String ISBN) {
        int sum = 0;
        for (int i=0; i<=12; i++){
            if (i%2==0) sum += Character.getNumericValue(ISBN.charAt(i));
            else sum += Character.getNumericValue(ISBN.charAt(i)) * 3;
        }
        return sum % 10 == 0;
    }

    @GetMapping
    public ResponseEntity<?> getBook(@RequestParam(required = false) String ISBN) {
        if (ISBN == null) return getBooks();
        return getBookByISBN(ISBN);
    }

    private ResponseEntity<List<Book>> getBooks() {
        return ResponseEntity.ok(books);
    }

    private ResponseEntity<?> getBookByISBN(@RequestParam String ISBN) {
        Optional<Book> book = findBookByISBN(ISBN);
        if (!book.isPresent()) return ResponseEntity.status(404).body("{\"message\":\"Book with ISBN " + ISBN + " not found.\"}");
        return ResponseEntity.ok(book.get());
    }

    private Optional<Book> findBookByISBN(String ISBN) {
        return books.stream().filter(book -> book.getISBN().equals(ISBN)).findFirst();
    }

    @PatchMapping
    public ResponseEntity<?> updateBookTitle(@RequestParam String ISBN, @RequestBody Book newBook) {
        Optional<Book> book = findBookByISBN(ISBN);
        if (!book.isPresent()) return ResponseEntity.status(404).body("Book with ISBN " + ISBN + " not found.");
        if (newBook.getTitle() != null) book.get().setTitle(newBook.getTitle());
        if (newBook.getAuthor() != null) book.get().setAuthor(newBook.getAuthor());
        return ResponseEntity.ok(book.get());
    }

    @DeleteMapping
    public ResponseEntity<?> deleteBook(@RequestParam String ISBN) {
        Optional<Book> book = findBookByISBN(ISBN);
        if (!book.isPresent()) return ResponseEntity.status(404).body("Book with ISBN " + ISBN + " not found.");
        books.remove(book.get());
        return ResponseEntity.ok(books);
    }

}
