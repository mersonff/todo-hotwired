import { Controller } from '@hotwired/stimulus'

// Connects to data-controller="form-submit"
export default class extends Controller {
  static targets = ['button']

  connect() {
    // Escuta eventos do turbo para saber quando o formulário foi processado
    this.element.addEventListener('turbo:submit-end', () => {
      this.resetButton()
    })
  }

  submit() {
    this.buttonTarget.classList.add('submitting')
    this.buttonTarget.textContent = 'Adicionando...'
    this.buttonTarget.disabled = true
  }

  resetButton() {
    if (this.hasButtonTarget) {
      this.buttonTarget.classList.remove('submitting')
      this.buttonTarget.textContent = 'Adicionar'
      this.buttonTarget.disabled = false
    }
  }
}
