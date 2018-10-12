-- SAKILA QUERIES ~ HW7
-- Yamini Sasidhar, T/Th Class (RUTSOM201807DATA5)

USE sakila;

-- 1a) display first and last name variables
SELECT first_name,last_name FROM actor
LIMIT 25;

-- 1b) display first and last name in concatenated string
SELECT CONCAT(first_name,' ',last_name) AS actor_name
FROM actor
LIMIT 25;

-- 2a) display id, first and last name for 'Joe'
SELECT actor_id,first_name,last_name
FROM actor
WHERE first_name = 'Joe'
LIMIT 25;

-- 2b) display actors with 'gen' in last name
SELECT CONCAT(first_name,' ',last_name) AS actor_gen
FROM actor
WHERE last_name like '%GEN%'
LIMIT 25;

-- 2c) display ordered actors with 'li' in last name
SELECT actor_id,last_name,first_name
FROM actor
WHERE last_name like '%LI%'
ORDER BY last_name,first_name
LIMIT 25;

-- 2d) display country and id for given list
SELECT country_id,country
FROM country
WHERE country IN (
	'Afghanistan',
    'Bangladesh',
    'China');

-- 3a) create descrip column with blob dtype
ALTER TABLE actor
ADD description BLOB;

-- 3b) drop the created descrip column
ALTER TABLE actor
DROP COLUMN description;

-- 4a) display count for each unique last name
SELECT last_name, count(last_name) AS 'count'
FROM actor
GROUP BY last_name
LIMIT 25;

-- 4b) display unique last names with count >= 2
SELECT last_name, count(last_name) AS 'count'
FROM actor
GROUP BY last_name
HAVING count(last_name) >= 2
LIMIT 25;

-- 4c) update groucho williams to harpo williams
UPDATE actor
SET first_name = 'HARPO'
WHERE first_name = 'GROUCHO'
AND last_name = 'WILLIAMS';

-- 4d) undo changes, back to groucho williams
UPDATE actor
SET first_name = 'GROUCHO'
WHERE first_name = 'HARPO'
AND last_name = 'WILLIAMS';

-- 5a) create new table, dtypes taken from object info
CREATE TABLE IF NOT EXISTS address (
	address_id SMALLINT(5) AUTO_INCREMENT NOT NULL,
    address VARCHAR(50) NOT NULL,
    address2 VARCHAR(50),
    district VARCHAR(20),
    city_id SMALLINT(5),
    postal_code VARCHAR(10),
    phone VARCHAR(20),
    location GEOMETRY,
    last_update TIMESTAMP,
    PRIMARY KEY (address_id)
);

-- 6a) join staff and address, display names and address
SELECT staff_id,first_name,last_name,address
FROM staff LEFT JOIN address
	ON staff.address_id = address.address_id;

-- 6b) join staff and payment, display total staff sales
SELECT staff.staff_id,
	   CONCAT(first_name,' ',last_name) AS staff_member,
	   SUM(amount) as total_amount
FROM staff LEFT JOIN payment
	ON staff.staff_id = payment.staff_id
WHERE MONTH(payment_date) = 08
AND YEAR(payment_date) = 2005
GROUP BY staff.staff_id;

-- 6c) join film and film_actor, display actor counts
SELECT title,COUNT(actor_id) AS listed_actors
FROM film INNER JOIN film_actor
	ON film.film_id = film_actor.film_id
GROUP BY actor_id
LIMIT 25;

-- 6d) count copies of given film in inventory
SELECT film.film_id,title,COUNT(*) AS copies
FROM film LEFT JOIN inventory
	ON film.film_id = inventory.film_id
WHERE title = 'Hunchback Impossible';

-- 6e) join customer and payment, display total paid
SELECT last_name,first_name,SUM(amount) AS total_paid
FROM customer LEFT JOIN payment
	ON customer.customer_id = payment.customer_id
GROUP BY customer.customer_id
ORDER BY last_name
LIMIT 25;

-- 7a) use subqueries for english films starting with K,Q
SELECT film_id,title
FROM film
WHERE title LIKE 'K%'
	OR title LIKE 'Q%'
AND language_id IN (
	SELECT language_id
    FROM language
    WHERE name = 'English')
LIMIT 25;

-- 7b) use subqueries for all actors in given film
SELECT actor_id,CONCAT(first_name,' ',last_name) AS actor_name
from actor
WHERE actor_id IN (
	SELECT actor_id
    FROM film_actor
    WHERE film_id IN (
		SELECT film_id
        FROM film
        WHERE title = 'Alone Trip'));

-- 7c) use multiple joins to retrieve customer info
SELECT last_name,first_name,email,country
FROM customer
LEFT JOIN address
	ON customer.address_id = address.address_id
LEFT JOIN city
	ON address.city_id = city.city_id
LEFT JOIN country
	ON city.country_id = country.country_id
WHERE country = 'Canada'
LIMIT 25;

-- 7d) use subqueries to select all family films
SELECT title AS family_films
FROM film
WHERE film_id IN (
	SELECT film_id
    FROM film_category
    WHERE category_id IN (
		SELECT category_id
        FROM category
        WHERE name = 'Family'));

-- 7e) display most frequently rented movies in desc order
SELECT title,count(rental.inventory_id) AS rental_count
FROM film
LEFT JOIN inventory
	ON film.film_id = inventory.film_id
LEFT JOIN rental
	ON inventory.inventory_id = rental.inventory_id
GROUP BY title
ORDER BY rental_count DESC;

-- 7f) use multiple joins to retrieve profit per store
SELECT store.store_id,SUM(amount) AS total_profit
FROM store
LEFT JOIN inventory
	ON store.store_id = inventory.store_id
LEFT JOIN rental
	ON inventory.inventory_id = rental.inventory_id
LEFT JOIN payment
	ON rental.rental_id = payment.rental_id
GROUP BY store.store_id;

-- 7g) display location details for each store
SELECT store_id,address,city,country
FROM store
LEFT JOIN address
	ON store.address_id = address.address_id
LEFT JOIN city
	ON address.city_id = city.city_id
LEFT JOIN country
	ON city.country_id = country.country_id;
    
-- 7h) list top five genres in gross revenue
SELECT name AS genre,SUM(amount) AS gross_rev
FROM category
LEFT JOIN film_category
	ON category.category_id = film_category.category_id
LEFT JOIN inventory
	ON film_category.film_id = inventory.film_id
LEFT JOIN rental
	ON inventory.inventory_id = rental.inventory_id
LEFT JOIN payment
	ON rental.rental_id = payment.rental_id
GROUP BY category.category_id
ORDER BY gross_rev DESC
LIMIT 5;

-- 8a) create view for previous query (7h)
CREATE OR REPLACE VIEW top_five AS (
	SELECT name AS genre,SUM(amount) AS gross_rev
    FROM category
    LEFT JOIN film_category
		ON category.category_id = film_category.category_id
	LEFT JOIN inventory
		ON film_category.film_id = inventory.film_id
	LEFT JOIN rental
		ON inventory.inventory_id = rental.inventory_id
	LEFT JOIN payment
		ON rental.rental_id = payment.rental_id
	GROUP BY category.category_id
	ORDER BY gross_rev DESC
	LIMIT 5);

-- 8b) display view created in (8a)
SELECT genre,gross_rev FROM top_five;

-- 8c) drop view created in (8a)
DROP VIEW IF EXISTS top_five;

-- for my convenience
SELECT * FROM actor LIMIT 25;
SELECT * FROM address LIMIT 25;
SELECT * FROM category LIMIT 25;
SELECT * FROM city LIMIT 25;
SELECT * FROM country LIMIT 25;
SELECT * FROM customer LIMIT 25;
SELECT * FROM film LIMIT 25;
SELECT * FROM film_actor LIMIT 25;
SELECT * FROM film_category LIMIT 25;
SELECT * FROM inventory LIMIT 25;
SELECT * FROM language LIMIT 25;
SELECT * FROM payment LIMIT 25;
SELECT * FROM rental LIMIT 25;
SELECT * from staff LIMIT 25;
SELECT * from store LIMIT 25;