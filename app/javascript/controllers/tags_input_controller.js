import { Controller } from "@hotwired/stimulus"

// Connects to data-controller="tags-input"
export default class extends Controller {
  static targets = ["input", "hiddenInput", "badgeContainer"]

  connect() {
    this.tags = []
    this.loadExistingTags()
  }

  loadExistingTags() {
    const existingTags = this.element.querySelector('input[type="text"]').value
    if (existingTags && existingTags.trim()) {
      this.tags = existingTags.split(',').map(tag => tag.trim()).filter(tag => tag)
      this.updateUI()
      this.element.querySelector('input[type="text"]').value = ""
    }
  }

  handleInput(event) {
    if (event.key === "," || event.key === "Enter") {
      event.preventDefault()
      const newTag = event.target.value.trim().replace(/,/g, '')
      if (newTag && !this.tags.includes(newTag)) {
        this.addTag(newTag)
      }
      event.target.value = ""
    }
  }

  addTag(tag) {
    this.tags.push(tag)
    this.updateUI()
  }

  removeTag(event) {
    const tagToRemove = event.currentTarget.dataset.tag
    this.tags = this.tags.filter(t => t !== tagToRemove)
    this.updateUI()
  }

  updateUI() {
    this.badgeContainerTarget.innerHTML = ""
    this.tags.forEach(tag => {
      const badge = document.createElement("span")
      badge.className = "tag-badge"
      badge.textContent = tag

      const removeButton = document.createElement("span")
      removeButton.className = "remove-tag"
      removeButton.textContent = "x"
      removeButton.dataset.action = "click->tags-input#removeTag"
      removeButton.dataset.tag = tag

      badge.appendChild(removeButton)
      this.badgeContainerTarget.appendChild(badge)
    })

    this.hiddenInputTarget.value = this.tags.join(", ")
  }
}