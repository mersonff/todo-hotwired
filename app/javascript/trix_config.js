// Configurações globais para o Trix Editor
document.addEventListener('DOMContentLoaded', function() {
  // Configuração de idioma para português brasileiro
  if (typeof Trix !== 'undefined') {
    // Configurações de formatação
    Trix.config.lang = {
      bold: "Negrito",
      italic: "Itálico",
      link: "Link", 
      heading1: "Título",
      quote: "Citação",
      code: "Código",
      bulletList: "Lista com marcadores",
      numberList: "Lista numerada",
      outdent: "Diminuir recuo",
      indent: "Aumentar recuo",
      attachFiles: "Anexar arquivos",
      undo: "Desfazer",
      redo: "Refazer",
      unlink: "Remover link",
      createLink: "Criar link",
      formatting: "Formatação"
    }

    // Configurações de comportamento
    Trix.config.attachments.preview.caption = {
      name: false,
      size: false
    }

    // Configuração de teclas de atalho personalizadas
    Trix.config.keyNames = Object.assign(Trix.config.keyNames, {
      bold: ["cmd+b", "ctrl+b"],
      italic: ["cmd+i", "ctrl+i"],
      link: ["cmd+k", "ctrl+k"],
      undo: ["cmd+z", "ctrl+z"],
      redo: ["cmd+shift+z", "ctrl+y"],
      heading1: ["cmd+alt+1", "ctrl+alt+1"]
    })
  }

  // Aplica configurações globais para todos os editores Trix
  document.addEventListener('trix-initialize', function(event) {
    const editor = event.target
    
    // Configurações específicas do editor
    editor.classList.add('rabisco-trix-editor')
    
    // Placeholder personalizado se não tiver um
    if (!editor.hasAttribute('placeholder')) {
      editor.setAttribute('placeholder', 'Digite aqui sua descrição detalhada... ✨')
    }
  })

  // Event listener para mudanças no conteúdo
  document.addEventListener('trix-change', function(event) {
    const editor = event.target
    
    // Adiciona classe se tem conteúdo
    if (editor.editor && editor.editor.getDocument().toString().trim()) {
      editor.classList.add('has-content')
    } else {
      editor.classList.remove('has-content')
    }
  })

  // Configuração para arquivo uploads (se habilitado)
  document.addEventListener('trix-file-accept', function(event) {
    const acceptedTypes = ['image/jpeg', 'image/png', 'image/gif', 'application/pdf']
    const maxFileSize = 5 * 1024 * 1024 // 5MB

    if (!acceptedTypes.includes(event.file.type)) {
      event.preventDefault()
      alert('Tipo de arquivo não suportado. Use apenas: JPEG, PNG, GIF ou PDF.')
      return
    }

    if (event.file.size > maxFileSize) {
      event.preventDefault()
      alert('Arquivo muito grande. Tamanho máximo: 5MB.')
      return
    }
  })
})

// Função helper para traduzir textos do Trix
window.translateTrixToolbar = function() {
  const toolbar = document.querySelector('trix-toolbar')
  if (!toolbar) return

  const buttons = toolbar.querySelectorAll('.trix-button')
  
  buttons.forEach(button => {
    const currentTitle = button.getAttribute('title')
    
    const translations = {
      'Bold': 'Negrito (Ctrl+B)',
      'Italic': 'Itálico (Ctrl+I)', 
      'Link': 'Inserir Link (Ctrl+K)',
      'Heading 1': 'Título Principal',
      'Quote': 'Citação',
      'Code': 'Código',
      'Bullet List': 'Lista com Marcadores',
      'Number List': 'Lista Numerada',
      'Decrease Nesting Level': 'Diminuir Recuo',
      'Increase Nesting Level': 'Aumentar Recuo',
      'Attach Files': 'Anexar Arquivos',
      'Undo': 'Desfazer (Ctrl+Z)',
      'Redo': 'Refazer (Ctrl+Y)'
    }
    
    if (currentTitle && translations[currentTitle]) {
      button.setAttribute('title', translations[currentTitle])
      button.setAttribute('aria-label', translations[currentTitle])
    }
  })
}

// Executa a tradução após um delay para garantir que o Trix carregou
setTimeout(window.translateTrixToolbar, 500)
