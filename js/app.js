const SHOP_URL = "https://backend-m01030673.onrender.com"

const { createApp } = Vue

createApp({
    data() {
        return {
            pageTitle: "Lesson Shop",
            sortBy: "subject",
            sortOrder: "asc",
            searchText: "",
            showCart: false,
            orderSubmitted: false,
            loadError: false,
            orderError: false,
            checkoutName: "",
            checkoutPhone: "",
            cart: [],
            lessons: [],
            teachers: [],
            teacherId: "",
            teacherLessonIds: []
        }
    },
    computed: {
        cartCount() {
            return this.cart.reduce((total, entry) => total + entry.quantity, 0)
        },
        sortedLessons() {
            const key = this.sortBy
            const dir = this.sortOrder === "asc" ? 1 : -1
            // a picked teacher narrows the list down to the lessons they teach
            const lessons = this.teacherId === ""
                ? this.lessons
                : this.lessons.filter(l => this.teacherLessonIds.includes(l.id))
            return [...lessons].sort((a, b) => {
                if (key === "price" || key === "spaces") {
                    return (a[key] - b[key]) * dir
                }
                return String(a[key]).localeCompare(String(b[key])) * dir
            })
        },
        cartLines() {
            const lines = []
            for (const entry of this.cart) {
                const lesson = this.lessons.find(l => l.id === entry.id)
                if (lesson) {
                    lines.push({ entry: entry, lesson: lesson })
                }
            }
            return lines
        },
        cartTotal() {
            return this.cartLines.reduce((total, line) => total + line.lesson.price * line.entry.quantity, 0)
        },
        noResultsText() {
            if (this.searchText.trim() !== "") {
                return "No lessons match your search."
            } else if (this.teacherId !== "") {
                return "This teacher has no lessons."
            } else {
                return "No lessons to show."
            }
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
        this.loadTeachers()
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
                await this.loadEnrolment()
            } catch (error) {
                this.lessons = []
                this.loadError = true
            }
        },
        async loadEnrolment() {
            // ask the server how many spaces of each lesson have already been sold
            for (const lesson of this.lessons) {
                lesson.enrolment = 0
                try {
                    let response = await fetch(SHOP_URL + "/enrolment/" + lesson.id)
                    if (response.ok) {
                        let data = await response.json()
                        lesson.enrolment = data.enrolment
                    }
                } catch (error) {
                    lesson.enrolment = 0
                }
            }
        },
        async searchLessons() {
            const text = this.searchText.trim()
            if (text === "") {
                // nothing typed, so show the whole list again
                await this.fetchData()
                return
            }
            this.loadError = false
            try {
                let response = await fetch(SHOP_URL + "/search/" + encodeURIComponent(text))
                if (!response.ok) {
                    throw new Error("Server returned " + response.status)
                }
                this.lessons = await response.json()
                this.applyCartToLessons()
                await this.loadEnrolment()
            } catch (error) {
                this.lessons = []
                this.loadError = true
            }
        },
        async clearSearch() {
            this.searchText = ""
            await this.fetchData()
        },
        async loadTeachers() {
            // fill the teacher picker with every teacher in the database
            try {
                let response = await fetch(SHOP_URL + "/teachers")
                if (!response.ok) {
                    throw new Error("Server returned " + response.status)
                }
                this.teachers = await response.json()
            } catch (error) {
                this.teachers = []
            }
        },
        async loadTeacherLessons() {
            this.teacherLessonIds = []
            if (this.teacherId === "") {
                // no teacher picked, so the whole list is shown again
                return
            }
            try {
                let response = await fetch(SHOP_URL + "/teachers/" + this.teacherId + "/lessons")
                if (!response.ok) {
                    throw new Error("Server returned " + response.status)
                }
                let data = await response.json()
                // the page already has the lessons, so it only needs the id numbers to filter by
                this.teacherLessonIds = data.lessons.map(l => l.id)
            } catch (error) {
                this.teacherLessonIds = []
            }
        },
        async updateLesson(lesson, updates) {
            const url = SHOP_URL + "/lessons/" + lesson._id
            const options = {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(updates)
            }
            let response = await fetch(url, options)
            return response
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
                // the cart only stores the id number of the lesson, not all its details
                this.cart.push({ id: lesson.id, quantity: 1 })
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
                // the order is saved, so store the new number of spaces for each lesson in the database
                for (const entry of this.cart) {
                    const lesson = this.lessons.find(l => l.id === entry.id)
                    if (lesson) {
                        await this.updateLesson(lesson, { spaces: lesson.spaces })
                    }
                }
            } catch (error) {
                this.orderError = true
                return
            }
            this.cart = []
            this.saveCart()
            this.checkoutName = ""
            this.checkoutPhone = ""
            this.orderSubmitted = true
            // read the lessons again so the pages show the spaces left in the database
            this.fetchData()
        },
        continueShopping() {
            this.showCart = false
            this.orderSubmitted = false
            this.checkoutName = ""
            this.checkoutPhone = ""
        }
    }
}).mount("#app")
