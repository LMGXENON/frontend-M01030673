const SHOP_URL = "http://localhost:3001"

const { createApp } = Vue

createApp({
    data() {
        return {
            pageTitle: "Lesson Shop",
            sortBy: "subject",
            sortOrder: "asc",
            showCart: false,
            orderSubmitted: false,
            loadError: false,
            orderError: false,
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
            return /^[A-Za-z]+( [A-Za-z]+)*$/.test(this.checkoutName.trim())
        },
        phoneIsValid() {
            return /^[0-9]{10,11}$/.test(this.checkoutPhone.trim())
        },
        canCheckout() {
            return this.nameIsValid && this.phoneIsValid
        }
    },
    created() {
        this.loadCart()
        this.fetchData()
    },
    methods: {
        async fetchData() {
            const url = SHOP_URL + "/lessons"
            this.loadError = false
            try {
                let response = await fetch(url)
                if (!response.ok) {
                    throw new Error("Server returned " + response.status)
                }
                this.lessons = await response.json()
                this.applyCartToLessons()
            } catch (error) {
                this.lessons = []
                this.loadError = true
            }
        },
        loadCart() {
            try {
                const saved = localStorage.getItem("lessonShopCart")
                if (saved) {
                    this.cart = JSON.parse(saved)
                }
            } catch (error) {
                this.cart = []
            }
        },
        saveCart() {
            localStorage.setItem("lessonShopCart", JSON.stringify(this.cart))
        },
        applyCartToLessons() {
            for (const entry of this.cart) {
                const lesson = this.lessons.find(l => l.id === entry.id)
                if (lesson) {
                    lesson.spaces -= entry.quantity
                }
            }
        },
        imageAddress(lesson) {
            return SHOP_URL + "/" + lesson.image
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
            this.saveCart()
        },
        removeFromCart(entry) {
            const lesson = this.lessons.find(l => l.id === entry.id)
            if (lesson) {
                lesson.spaces += entry.quantity
            }
            this.cart = this.cart.filter(e => e.id !== entry.id)
            this.saveCart()
        },
        increaseQuantity(entry) {
            const lesson = this.lessons.find(l => l.id === entry.id)
            if (!lesson || lesson.spaces === 0) {
                return
            }
            lesson.spaces -= 1
            entry.quantity += 1
            this.saveCart()
        },
        decreaseQuantity(entry) {
            const lesson = this.lessons.find(l => l.id === entry.id)
            if (lesson) {
                lesson.spaces += 1
            }
            entry.quantity -= 1
            if (entry.quantity === 0) {
                this.cart = this.cart.filter(e => e.id !== entry.id)
            }
            this.saveCart()
        },
        lessonSpaces(entry) {
            const lesson = this.lessons.find(l => l.id === entry.id)
            return lesson ? lesson.spaces : 0
        },
        toggleCart() {
            this.showCart = !this.showCart
        },
        async checkout() {
            const url = SHOP_URL + "/orders"
            const options = {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ name: this.checkoutName, phone: this.checkoutPhone, lessons: this.cart })
            }
            this.orderError = false
            try {
                let response = await fetch(url, options)
                if (!response.ok) {
                    throw new Error("Server returned " + response.status)
                }
            } catch (error) {
                this.orderError = true
                return
            }
            this.cart = []
            this.saveCart()
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
