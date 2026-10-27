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
            lessons: []
        }
    },
    computed: {
        cartCount() {
            return this.cart.reduce((total, entry) => total + entry.quantity, 0)
        },
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
        cartTotal() {
            return this.cart.reduce((total, entry) => total + entry.price * entry.quantity, 0)
        },
        nameIsValid() {
            return /^[A-Za-z ]+$/.test(this.checkoutName.trim())
        },
        phoneIsValid() {
            return /^[0-9]+$/.test(this.checkoutPhone.trim())
        },
        canCheckout() {
            return this.nameIsValid && this.phoneIsValid
        }
    },
    created() {
        this.fetchData()
    },
    methods: {
        async fetchData() {
            const url = "http://localhost:3001/"
            let response = await fetch(url)
            this.lessons = await response.json()
        },
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
