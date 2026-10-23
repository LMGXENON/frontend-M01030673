const { createApp } = Vue

createApp({
    data() {
        return {
            pageTitle: "Lesson Shop",
            lessons: [
                { id: 1, subject: "Maths", location: "Hendon", price: 100, image: "images/maths.png", imageAlt: "Maths lesson" },
                { id: 2, subject: "English", location: "Westminster", price: 80, image: "images/english.png", imageAlt: "English lesson" },
                { id: 3, subject: "Science", location: "Wembley", price: 90, image: "images/science.png", imageAlt: "Science lesson" },
                { id: 4, subject: "Art", location: "Stratford", price: 95, image: "images/art.png", imageAlt: "Art lesson" },
                { id: 5, subject: "Music", location: "Knightsbridge", price: 120, image: "images/music.png", imageAlt: "Music lesson" },
                { id: 6, subject: "Drama", location: "Camden", price: 85, image: "images/drama.png", imageAlt: "Drama lesson" },
                { id: 7, subject: "French", location: "Shoreditch", price: 110, image: "images/french.png", imageAlt: "French lesson" },
                { id: 8, subject: "Computing", location: "Islington", price: 105, image: "images/computing.png", imageAlt: "Computing lesson" },
                { id: 9, subject: "History", location: "Greenwich", price: 75, image: "images/history.png", imageAlt: "History lesson" },
                { id: 10, subject: "Geography", location: "Clapham", price: 90, image: "images/geography.png", imageAlt: "Geography lesson" },
                { id: 11, subject: "Sports", location: "Brixton", price: 70, image: "images/sports.png", imageAlt: "Sports lesson" },
                { id: 12, subject: "Cooking", location: "Hackney", price: 115, image: "images/cooking.png", imageAlt: "Cooking lesson" }
            ]
        }
    }
}).mount("#app")
