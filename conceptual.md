### Conceptual Exercise

Answer the following questions below:

- What is PostgreSQL? Is an open source relational database system utilizing SQL.

- What is the difference between SQL and PostgreSQL? SQL is the original database system while Postgre is more advanced with more advanced functions.

- In `psql`, how do you connect to a database? \c DB_NAME

- What is the difference between `HAVING` and `WHERE`? HAVING applies only to groups as a whole as opposed to WHERE which applies to individual rows.

- What is the difference between an `INNER` and `OUTER` join? INNER join is the overlap between two tables where OUTER is what doesn't overlap.

- What is the difference between a `LEFT OUTER` and `RIGHT OUTER` join? LEFT OUTER returns all rows from LEFT table and matching records between both tables, RIGHT OUTER is the same but returns all rows from RIGHT table.

- What is an ORM? What do they do? ORM stands for "object-relational mapper" which provides an object-oriented layer between relational databases and object-oriented programming languages without having to write SQL queries.

- What are some differences between making HTTP requests using AJAX 
  and from the server side using a library like `requests`? Loading time and JSON response.

- What is CSRF? What is the purpose of the CSRF token? CSRF is a "cross-site request forgery" utilizing a token so that a server or page knows that the user is supposed to have access.

- What is the purpose of `form.hidden_tag()`? This generates a hidden field that includes a token that is used to protect the form against CSRF attacks.
