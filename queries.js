// queries.js

// Find all books in a specific genre (e.g., "Dystopian")
db.books.find({ genre: "Dystopian" });

// Find books published after a certain year (e.g., 2000)
db.books.find({ published_year: { $gt: 2000 } });

// Find books by a specific author (e.g., "J.K. Rowling")
db.books.find({ author: "J.K. Rowling" });

// Update the price of a specific book (e.g., "1984" to 130)
db.books.updateOne({ title: "1984" }, { $set: { price: 130 } });

// Delete a book by its title (e.g., "The Catcher in the Rye")
db.books.deleteOne({ title: "The Catcher in the Rye" });


// Advanced Queries

// Books in stock and published after 2010
db.books.find({ in_stock: true, published_year: { $gt: 2010 } });

// Projection: title, author, price
db.books.find({}, { _id: 0, title: 1, author: 1, price: 1 });

// Sort by price ascending
db.books.find().sort({ price: 1 });

// Sort by price descending
db.books.find().sort({ price: -1 });

// Pagination: 5 books per page, page 1
db.books.find().skip(0).limit(5);

// Pagination: 5 books per page, page 2
db.books.find().skip(5).limit(5);


// Aggregation

// Average price of books by genre
db.books.aggregate([
  { $group: { _id: "$genre", avgPrice: { $avg: "$price" } } }
]);

// Author with the most books
db.books.aggregate([
  { $group: { _id: "$author", count: { $sum: 1 } } },
  { $sort: { count: -1 } },
  { $limit: 1 }
]);

// Group books by publication decade
db.books.aggregate([
  { 
    $group: {
      _id: { $floor: { $divide: ["$published_year", 10] } },
      count: { $sum: 1 }
    }
  },
  { 
    $project: {
      decade: { $concat: [
        { $toString: { $multiply: ["$_id", 10] } }, 
        "s"
      ] },
      count: 1,
      _id: 0
    }
  }
]);

// Indexing

// Index on title
db.books.createIndex({ title: 1 });

// Compound index on author and published_year
db.books.createIndex({ author: 1, published_year: 1 });

// Example of explain()
db.books.find({ title: "1984" }).explain("executionStats");
