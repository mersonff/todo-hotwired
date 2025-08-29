import { Controller } from '@hotwired/stimulus'

export default class extends Controller {
  static targets = ['grid', 'filterButton', 'sortButton', 'gridButton']
  static values = { 
    filter: String,
    sort: String,
    gridSize: String
  }

  connect() {
    this.filterValue = 'all'
    this.sortValue = 'position'
    this.gridSizeValue = 'medium'
    this.updateDisplay()
  }

  // Filtros
  filterAll() {
    this.filterValue = 'all'
    this.updateFilter()
  }

  filterCompleted() {
    this.filterValue = 'completed'
    this.updateFilter()
  }

  filterPending() {
    this.filterValue = 'pending'
    this.updateFilter()
  }

  filterImportant() {
    this.filterValue = 'important'
    this.updateFilter()
  }

  // Ordenação
  sortByPosition() {
    this.sortValue = 'position'
    this.updateSort()
  }

  sortByCreated() {
    this.sortValue = 'created'
    this.updateSort()
  }

  sortByTitle() {
    this.sortValue = 'title'
    this.updateSort()
  }

  sortByImportance() {
    this.sortValue = 'importance'
    this.updateSort()
  }

  // Grid
  gridSmall() {
    this.gridSizeValue = 'small'
    this.updateGrid()
  }

  gridMedium() {
    this.gridSizeValue = 'medium'
    this.updateGrid()
  }

  gridLarge() {
    this.gridSizeValue = 'large'
    this.updateGrid()
  }

  // Métodos auxiliares
  updateFilter() {
    this.updateActiveButtons('filter')
    this.applyFilters()
  }

  updateSort() {
    this.updateActiveButtons('sort')
    this.applySorting()
  }

  updateGrid() {
    this.updateActiveButtons('grid')
    this.applyGridSize()
  }

  updateActiveButtons(type) {
    // Remove active de todos os botões do tipo
    this[`${type}ButtonTargets`].forEach(btn => {
      btn.classList.remove('active')
    })

    // Adiciona active no botão correspondente
    const activeValue = this[`${type}Value`]
    const activeButton = this[`${type}ButtonTargets`].find(btn => 
      btn.dataset[`${type}Type`] === activeValue
    )
    if (activeButton) {
      activeButton.classList.add('active')
    }
  }

  applyFilters() {
    const tasks = this.gridTarget.querySelectorAll('.todo-item')
    
    tasks.forEach(task => {
      const isCompleted = task.classList.contains('is-completed')
      const starIcon = task.querySelector('.icon-star path[fill="#FFF59D"]')
      const isImportant = starIcon !== null
      let show = false

      switch (this.filterValue) {
      case 'all':
        show = true
        break
      case 'completed':
        show = isCompleted
        break
      case 'pending':
        show = !isCompleted
        break
      case 'important':
        show = isImportant
        break
      }

      task.style.display = show ? 'block' : 'none'
    })

    this.updateTaskCount()
  }

  applySorting() {
    const tasks = Array.from(this.gridTarget.querySelectorAll('.todo-item'))
    const sortedTasks = this.sortTasks(tasks)
    
    // Reordena os elementos no DOM
    sortedTasks.forEach(task => {
      this.gridTarget.appendChild(task)
    })
  }

  sortTasks(tasks) {
    return tasks.sort((a, b) => {
      switch (this.sortValue) {
      case 'position':
        return this.getTaskPosition(a) - this.getTaskPosition(b)
      case 'created':
        return new Date(this.getTaskCreated(b)) - new Date(this.getTaskCreated(a))
      case 'title':
        return this.getTaskTitle(a).localeCompare(this.getTaskTitle(b))
      case 'importance': {
        const aImportant = this.isTaskImportant(a)
        const bImportant = this.isTaskImportant(b)
        if (aImportant && !bImportant) {
          return -1
        }
        if (!aImportant && bImportant) {
          return 1
        }
        return this.getTaskPosition(a) - this.getTaskPosition(b)
      }
      default:
        return 0
      }
    })
  }

  applyGridSize() {
    this.gridTarget.className = this.gridTarget.className
      .replace(/mural-grid--(small|medium|large)/, '')
    this.gridTarget.classList.add(`mural-grid--${this.gridSizeValue}`)
  }

  updateDisplay() {
    this.updateActiveButtons('filter')
    this.updateActiveButtons('sort')
    this.updateActiveButtons('grid')
    this.applyFilters()
    this.applySorting()
    this.applyGridSize()
  }

  updateTaskCount() {
    const totalTasks = this.gridTarget.querySelectorAll('.todo-item').length
    const visibleTasks = this.gridTarget.querySelectorAll('.todo-item:not([style*="none"])').length
    
    const countElement = document.querySelector('.task-count')
    if (countElement) {
      if (this.filterValue === 'all') {
        countElement.textContent = `${totalTasks} tarefa${totalTasks !== 1 ? 's' : ''}`
      } else {
        countElement.textContent = `${visibleTasks} de ${totalTasks} tarefa${totalTasks !== 1 ? 's' : ''}`
      }
    }
  }

  // Helpers para extrair dados das tasks
  getTaskPosition(task) {
    return parseInt(task.dataset.position || '0')
  }

  getTaskCreated(task) {
    return task.dataset.created || ''
  }

  getTaskTitle(task) {
    const titleElement = task.querySelector('.task-title')
    return titleElement ? titleElement.textContent.trim() : ''
  }

  isTaskImportant(task) {
    const starIcon = task.querySelector('.icon-star path[fill="#FFF59D"]')
    return starIcon !== null
  }
}
