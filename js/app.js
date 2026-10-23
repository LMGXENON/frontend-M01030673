const { createApp } = Vue

createApp({
    data() {
        return {
            pageTitle: "Lesson Shop",
            sortBy: "subject",
            sortOrder: "asc",
            showCart: false,
            orderSubmitted: false,
            checkoutName: "",
            checkoutPhone: "",
            cart: [],
            lessons: [
                { id: 1, subject: "Maths", location: "Hendon", price: 100, spaces: 5, image: "images/maths.png", imageAlt: "Maths lesson" },
                { id: 2, subject: "English", location: "Westminster", price: 80, spaces: 5, image: "images/english.png", imageAlt: "English lesson" },
                { id: 3, subject: "Science", location: "Wembley", price: 90, spaces: 5, image: "images/science.png", imageAlt: "Science lesson" },
                { id: 4, subject: "Art", location: "Stratford", price: 95, spaces: 5, image: "images/art.png", imageAlt: "Art lesson" },
                { id: 5, subject: "Music", location: "Knightsbridge", price: 120, spaces: 5, image: "images/music.png", imageAlt: "Music lesson" },
                { id: 6, subject: "Drama", location: "Camden", price: 85, spaces: 5, image: "images/drama.png", imageAlt: "Drama lesson" },
                { id: 7, subject: "French", location: "Shoreditch", price: 110, spaces: 5, image: "images/french.png", imageAlt: "French lesson" },
                { id: 8, subject: "Computing", location: "Islington", price: 105, spaces: 5, image: "images/computing.png", imageAlt: "Computing lesson" },
                { id: 9, subject: "History", location: "Greenwich", price: 75, spaces: 5, image: "images/history.png", imageAlt: "History lesson" },
                { id: 10, subject: "Geography", location: "Clapham", price: 90, spaces: 5, image: "images/geography.png", imageAlt: "Geography lesson" },
                { id: 11, subject: "Sports", location: "Brixton", price: 70, spaces: 5, image: "images/sports.png", imageAlt: "Sports lesson" },
                { id: 12, subject: "Cooking", location: "Hackney", price: 115, spaces: 5, image: "images/cooking.png", imageAlt: "Cooking lesson" }
            ]
        }
    },
    computed: {
        sortedLessons() {
            const key = this.sortBy
            const dir = this.sortOrder === "asc" ? 1 : -1
            return [...this.lessons].sort((a, b) => {
                if (key === "price" || key === "spaces") {
                    return (a[key] - b[key]) * dir
                }
                return String(a[key]).localeCompare(String(b[key])) * dir
            })
        },
        cartCount() {
            return this.cart.reduce((total, entry) => total + entry.quantity, 0)
        },
        cartTotal() {
            return this.cart.reduce((total, entry) => total + entry.price * entry.quantity, 0)
        }
    },
    methods: {
        addToCart(lesson) {
            if (lesson.spaces === 0) {
                return
            }
            lesson.spaces -= 1
            const entry = this.cart.find(e => e.id === lesson.id)
            if (entry) {
                entry.quantity += 1
            } else {
                this.cart.push({ id: lesson.id, subject: lesson.subject, location: lesson.location, price: lesson.price, quantity: 1 })
            }
        },
        removeFromCart(entry) {
            const lesson = this.lessons.find(l => l.id === entry.id)
            if (lesson) {
                lesson.spaces += entry.quantity
            }
            this.cart = this.cart.filter(e => e.id !== entry.id)
        },
        toggleCart() {
            this.showCart = !this.showCart
        },
        checkout() {
            this.cart = []
            this.orderSubmitted = true
        },
        continueShopping() {
            this.showCart = false
            this.orderSubmitted = false
            this.checkoutName = ""
            this.checkoutPhone = ""
        }
    }
}).mount("#app")
