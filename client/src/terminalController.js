import ComponentBuilder from "./components.js"
export default class TerminalController {
    #usersColors = new Map()

    constructor () {}

    #pickColor () {
        return `#${((1 << 24) * Math.random() | 0).toString(16)}-fg`
    }

    #getUserColor (username) {
        if(this.#usersColors.has(username)) return this.#usersColors.get(username)

        const color = this.#pickColor()
        this.#usersColors.set(username, color)

        return color
    }

    #onInputReceived (eventEmitter) {
        return function () {
            const message = this.getValue()
            console.log(message)
            this.clearValue()
        }
    }

    #onMessageReceived ({ screen, chat }) {
        return msg => {
            const { username, message } = msg 
            const color = this.#getUserColor(username)

            chat.addItem(`{${color}}{bold}${username}{/}: ${message}`)

            screen.render()
        }
    }

    #registerEvents (eventEmitter, components) {
        eventEmitter.on('message:received', this.#onMessageReceived(components))
    }

    async initializeTable (eventEmitter) {
        const components = new ComponentBuilder()
            .setScreen({ title: 'KoolHackerChat'})
            .setLayoutComponent()
            .setInputComponent(this.#onInputReceived(eventEmitter))
            .setChatComponent()
            .build()

        this.#registerEvents(eventEmitter, components)

        components.input.focus()
        components.screen.render()

        setInterval(() => {
            eventEmitter.emit('message:received', { message: 'hey', username: 'pedrolontro' })
            eventEmitter.emit('message:received', { message: 'ho', username: 'gabi' })
            eventEmitter.emit('message:received', { message: 'lalau', username: 'jão' })
        }, 1000);
    }
}