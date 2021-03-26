import ComponentBuilder from "./components.js"
export default class TerminalController {
    constructor () {}

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

            chat.addItem(`{bold}${username}{/}: ${message}`)

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
    }
}