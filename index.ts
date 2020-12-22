
const svgs = {
  close: '<svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 0 24 24" width="24"><path d="M0 0h24v24H0z" fill="none"/><path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/></svg>',
  next: '<svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 0 24 24" width="24"><path d="M0 0h24v24H0z" fill="none"/><path d="M10 6L8.59 7.41 13.17 12l-4.58 4.59L10 18l6-6z"/></svg>',
  previous: '<svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 0 24 24" width="24"><path d="M0 0h24v24H0z" fill="none"/><path d="M15.41 7.41L14 6l-6 6 6 6 1.41-1.41L10.83 12z"/></svg>'
} as { [key: string]: string }
export interface RenderOptions {
  src: string
  alt: string
}

export interface ZoomImageOptions {
  value:
    | string
    | {
        src: string
        alt: string
        disabled?: boolean
      }
  arg: string
}

const style = `
.maz-zoom-img {
  position: fixed;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  padding: 2.5rem;
  z-index: 1050;
  background-color: rgba(86, 87, 117, .7);
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
}

.maz-zoom-img,
.maz-zoom-img * {
  box-sizing: border-box;
}

.maz-zoom-img__wrapper {
  display: flex;
  justify-content: center;
  align-items: center;
  min-width: 0;
  min-height: 0;
}

.maz-zoom-img img {
  max-width: 100%;
  max-height: 100%;
  margin-left: 1rem;
  margin-right: 1rem;
  margin-top: 1rem;
  min-width: 0;
}

.maz-zoom-img img,
.maz-zoom-img button {
  transition: all 300ms ease-in-out;
  opacity: 0;
  transform: scale(0.5);
}

.maz-zoom-img button {
  margin: 0 auto;
  border: none;
  background-color: white;
  height: 2.5rem;
  min-height: 2.5rem;
  width: 2.5rem;
  min-width: 2.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 2.5rem;
  cursor: pointer;
  flex: 0 0 auto;
  outline: none;
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
  style.id = 'MazPreviewStyle'
  style.textContent = styleString
  document.head.append(style)
}

const closePreview = (): void => {
  const container: HTMLElement | null = document.querySelector('#MazImgPreviewFullsize')
  const style: HTMLElement | null = document.querySelector('#MazPreviewStyle')
  const instance: HTMLElement | null = document.querySelector('.maz-zoom-img-instance.maz-is-open')

  if (instance) instance.classList.remove('maz-is-open')

  if (container) container.classList.remove('maz-animate')

  setTimeout(() => {
    if (container) container.remove()
    if (style) style.remove()
  }, 500)
}

const nextPreviousImage = (isNext: boolean, allInstances: Element[]): void => {
  const selectNextInstance = isNext
  const currentInstance: HTMLElement | null = document.querySelector('.maz-zoom-img-instance.maz-is-open')

  const imgElement: HTMLImageElement | null = document.querySelector('#MazImgElement')

  const currentInstanceIndex = allInstances.findIndex((i) => i === currentInstance)
  const newInstanceIndex = selectNextInstance ? currentInstanceIndex + 1 : currentInstanceIndex - 1

  const getNewInstanceIndex = (): number => {
    return newInstanceIndex < 0
      ? allInstances.length - 1
      : newInstanceIndex >= allInstances.length
      ? 0
      : newInstanceIndex
  }

  const nextInstance = allInstances[getNewInstanceIndex()]

  if (nextInstance && imgElement && currentInstance) {
    currentInstance.classList.remove('maz-is-open')
    nextInstance.classList.add('maz-is-open')

    const src: string | null = nextInstance.getAttribute('data-src')
    const alt: string | null = nextInstance.getAttribute('data-alt')

    if (src) imgElement.setAttribute('src', src)
    if (alt) imgElement.setAttribute('alt', alt)
  }
}

const keydownLister = (e: KeyboardEvent, allInstances: Element[]): void => {
  if (e.key === 'Escape' || e.key === ' ') {
    e.preventDefault()
    document.removeEventListener('keydown', (e) => keydownLister(e, allInstances))
    closePreview()
  }

  if (e.key === 'ArrowLeft' || e.key === 'ArrowRight') {
    nextPreviousImage(e.key === 'ArrowRight', allInstances)
  }
}

const getButton = (iconName = 'close', allInstances?: Element[]): HTMLButtonElement => {  // icon.classList.add('material-icons')

  const button = document.createElement('button')
  button.innerHTML = svgs[iconName]
  button.onclick = (): void => {
    iconName === 'close'
      ? closePreview()
      : allInstances
      ? nextPreviousImage(iconName === 'navigate_next', allInstances)
      : null
  }
  return button
}

const renderPreview = (el: HTMLElement, options?: RenderOptions): void => {
  el.classList.add('maz-is-open')
  addStyle(style)
  const allInstances = Array.from(document.querySelectorAll('.maz-zoom-img-instance'))

  const container: HTMLDivElement = document.createElement('div')
  container.classList.add('maz-zoom-img')
  container.setAttribute('id', 'MazImgPreviewFullsize')
  container.addEventListener('click', (e): void => {
    if (container.isEqualNode(e.target as Node)) {
      closePreview()
    }
  })

  const img: HTMLImageElement = document.createElement('img')
  if (typeof options === 'object') {
    img.setAttribute('src', options.src)
    img.setAttribute('alt', options.alt)
    img.id = 'MazImgElement'
  }
  img.classList.add('maz-border-radius')

  const buttons = []
  const closeButton = getButton()

  const hasMultipleInstance = allInstances.length > 1

  if (hasMultipleInstance) {
    const previousButton = getButton('previous', allInstances)
    const nextButton = getButton('next', allInstances)
    buttons.push(previousButton, nextButton)
  }

  const wrapper: HTMLDivElement = document.createElement('div')
  wrapper.classList.add('maz-zoom-img__wrapper')
  hasMultipleInstance ? wrapper.append(buttons[0], img, buttons[1]) : wrapper.append(img)

  container.append(closeButton, wrapper)

  document.body.appendChild(container)
  document.addEventListener('keydown', (e) => keydownLister(e, allInstances))

  setTimeout(() => {
    if (container) container.classList.add('maz-animate')
  }, 100)
}

const mouseEnter = (el: HTMLElement): void => {
  el.style.transition = 'all 300ms ease-in-out'
  el.style.transform = 'scale(1.01)'
  el.style.filter = 'blur(2px)'
}

const mouseLeave = (el: HTMLElement): void => {
  el.style.transform = ''
  el.style.filter = ''
  setTimeout(() => (el.style.transition = ''), 300)
}

interface BindingData {
  value?: string | {
    disabled: boolean
    src: string
    alt: string
  }
}

export default {
  bind(el: HTMLElement, binding: BindingData): void {
    if (!binding.value) throw new Error('[MazUI](img-preview) Image path must be defined. Ex: `v-zoom-img="<PATH_TO_IMAGE>"`')
    if (typeof binding.value === 'object' && !binding.value.src)
      throw new Error('[MazUI](img-preview) src of image must be provided')

    /**
     * If is disabled
     */
    if (typeof binding.value === 'object' && binding.value.disabled) return

    const options: RenderOptions = {
      src: typeof binding.value === 'object' ? binding.value.src : binding.value,
      alt: typeof binding.value === 'object' ? binding.value.alt : 'image preview'
    }

    /**
     * Set instance style
     */
    el.style.cursor = 'pointer'
    /**
     * Set class & data attribute to use it with previous & next functions
     */
    el.classList.add('maz-zoom-img-instance')
    el.setAttribute('data-src', options.src)
    el.setAttribute('data-alt', options.alt)
    /**
     * Add event listeners
     */
    el.addEventListener('mouseenter', () => mouseEnter(el))
    el.addEventListener('mouseleave', () => mouseLeave(el))
    el.addEventListener('click', () => renderPreview(el, options))
  },
  unbind(el: HTMLElement): void {
    /**
     * Remove all
     */
    el.removeEventListener('click', () => renderPreview(el))
    el.removeEventListener('mouseenter', () => mouseEnter(el))
    el.removeEventListener('mouseleave', () => mouseLeave(el))
    el.classList.remove('maz-zoom-img-instance')
    el.removeAttribute('data-src')
    el.removeAttribute('data-alt')
    el.style.cursor = ''
  }
}
