# frontend-M01030673

CST3144 coursework. Student ID: M01030673.

This is the frontend of Lesson Shop, an online shop for lessons. I built it with Vue.js.

Each lesson has a subject, a location, a price, a number of spaces and a picture. You can sort the lessons, add them to a cart and check out with your name and phone number. The lesson data comes from my Express.js server.

## Links

These are the four links the coursework brief asks for.

1. [Vue.js App] GitHub repository: https://github.com/LMGXENON/frontend-M01030673
2. [Vue.js App] GitHub Pages, the app runs from here: https://lmgxenon.github.io/frontend-M01030673/
3. [Express.js App] GitHub repository: https://github.com/LMGXENON/backend-M01030673
4. [Express.js App] render.com route that returns all the lessons: https://backend-m01030673.onrender.com/

## What the app does

- Shows the lessons from the server with subject, location, price, spaces and a picture
- Sorts the lessons by subject, location, price or spaces, in ascending or descending order
- Every lesson has an add to cart button. It adds one space to the cart and lowers the number of spaces left. The button stays visible and is disabled when no spaces are left
- The cart button shows how many spaces are in the cart and opens the cart page. It is disabled when the cart is empty
- In the cart you can remove lessons again and the spaces go back to the lesson list. The cart shows the price for each line and the total
- The checkout form checks the name and phone number with regular expressions. The name must be letters only and the phone number must be numbers only. The checkout button is disabled until both are correct
- After checkout you see a thank you message and a button to continue shopping
- The lessons are loaded with a fetchData() method that Vue calls in created() when the page starts

## Running it on your computer

1. Start the server first (see the backend README): node server.js
2. Open this folder with Live Server and open index.html
3. The page asks the server at http://localhost:3001/ for the lessons. If the server is not running you see no lessons.

## What I built it with

Vue.js 3 loaded from a CDN, plus plain HTML, CSS and JavaScript. No other frameworks or libraries.
