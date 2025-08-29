import { Controller } from "@hotwired/stimulus"

// Connects to data-controller="task-animation"
export default class extends Controller {
  connect() {
    // Remove a classe de animação após a animação terminar
    this.element.addEventListener('animationend', () => {
      this.element.classList.remove('task-item-new')
    })
  }
}
