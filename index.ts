interface RENDER_OPTIONS {
  src: string;
  alt: string;
}

interface BINDING {
  value: string | {
    src: string;
    alt: string;
    disabled: boolean;
  };
  arg: string;
}

const style = `
.maz-zoom-img {
  position: fixed;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  padding: 1rem;
  z-index: 1050;
  background-color: rgba(86, 87, 117, .7);
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
}

.maz-zoom-img img {
  max-width: 100%;
  max-height: 100%;
}

.maz-zoom-img img,
.maz-zoom-img button {
  transition: all 300ms ease-in-out;
  opacity: 0;
  transform: scale(0.5);
}

.maz-zoom-img button {
  margin-bottom: 20px;
  border: none;
  background-color: white;
  height: 40px;
  width: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 40px;
  cursor: pointer;
}

.maz-zoom-img button:hover {
  background-color: #ccc;
}

.maz-zoom-img.maz-animate img,
.maz-zoom-img.maz-animate button {
  opacity: 1;
  transform: scale(1);
}`

const addStyle = (styleString: string): void => {
  const style = document.createElement('style')
  style.type = 'text/css'
  style.id = 'MazPreviewStyle'
  style.textContent = styleString
  document.head.append(style)
}

const closePreview = (): void => {
  const container: HTMLElement = document.querySelector(
    '#MazImgPreviewFullsize'
  ) as HTMLElement
  const style: HTMLElement = document.querySelector(
    '#MazPreviewStyle'
  ) as HTMLElement

  if (container) {
    container.classList.remove('maz-animate')
  }
  setTimeout(() => {
    if (container) {
      container.remove()
    }
    if (style) {
      style.remove()
    }
  }, 500)
}

const keydownLister = (e: KeyboardEvent): void => {
  if (e.keyCode === 27) {
    document.removeEventListener('keydown', keydownLister)
    closePreview()
  }
}

const renderPreview = (options?: RENDER_OPTIONS) => {
  addStyle(style)

  const container: HTMLElement = document.createElement('div')
  container.classList.add('maz-zoom-img')
  container.setAttribute('id', 'MazImgPreviewFullsize')
  container.addEventListener('click', (e): void => {
    if (container.isEqualNode(e.target as Node)) {
      closePreview()
    }
  })

  const img: HTMLElement = document.createElement('img')
  if (typeof options === 'object') {
    img.setAttribute('src', options.src)
    img.setAttribute('alt', options.alt)
  }
  img.classList.add('maz-border-radius')

  const icon: HTMLElement = document.createElement('i')
  icon.classList.add('material-icons')
  icon.appendChild(document.createTextNode('close'))
  const button: HTMLElement = document.createElement('button')
  button.onclick = (): void => {
    closePreview()
  }
  button.appendChild(icon)

  container.append(button, img)

  document.body.appendChild(container)
  document.addEventListener('keydown', keydownLister)
  setTimeout(() => {
    if (container) {
      container.classList.add('maz-animate')
    }
  }, 150)
}

export default {
  bind(el: HTMLElement, binding: BINDING): void {
    if (typeof (binding.value) === 'object' && binding.value.disabled) {
      return
    }
    if (!binding.value) {
      throw new Error('[MazUI](img-preview) url of image must be provided')
    }

    const options: RENDER_OPTIONS = {
      src: typeof (binding.value) === 'object' ? binding.value.src : binding.value,
      alt: typeof (binding.value) === 'object' ? binding.value.alt : 'image preview',
    }

    const bindEvent: string = binding.arg || 'click'
    el.addEventListener(bindEvent, () => renderPreview(options))
  },
  unbind(el: HTMLElement, binding: BINDING): void {
    const bindEvent: string = binding.arg || 'click'
    el.removeEventListener(bindEvent, () => renderPreview())
  },
}
