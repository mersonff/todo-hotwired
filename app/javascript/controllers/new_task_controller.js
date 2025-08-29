import { Controller } from '@hotwired/stimulus'

export default class extends Controller {
  connect() {
    // Remove a classe de animação após a animação terminar
    this.element.addEventListener('animationend', this.handleAnimationEnd.bind(this))
  }

  disconnect() {
    this.element.removeEventListener('animationend', this.handleAnimationEnd.bind(this))
  }

  handleAnimationEnd(event) {
    if (event.animationName === 'taskAppear') {
      this.element.classList.remove('new-task')
    }
  }
}
