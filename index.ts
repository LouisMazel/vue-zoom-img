import { DirectiveOptions } from 'vue'

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

type DefaultZoomImgOptions = {
  alt: string
  disabled?: boolean
  scale?: boolean
  blur?: boolean
}

type ZoomImgOptions = {
  src: string
  alt: string
  disabled?: boolean
  scale?: boolean
  blur?: boolean
}
interface BindingData {
  value: string | ZoomImgOptions
}


const svgs = {
  close: '<svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 0 24 24" width="24"><path d="M0 0h24v24H0z" fill="none"/><path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/></svg>',
  next: '<svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 0 24 24" width="24"><path d="M0 0h24v24H0z" fill="none"/><path d="M10 6L8.59 7.41 13.17 12l-4.58 4.59L10 18l6-6z"/></svg>',
  previous: '<svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 0 24 24" width="24"><path d="M0 0h24v24H0z" fill="none"/><path d="M15.41 7.41L14 6l-6 6 6 6 1.41-1.41L10.83 12z"/></svg>'
} as { [key: string]: string }

class VueZoomImg {
  private options: ZoomImgOptions
  private defaultOptions: DefaultZoomImgOptions = {
    scale: true,
    blur: true,
    disabled: false,
    alt: 'vue zoom img'
  }

  constructor(binding: BindingData) {
    if (!binding.value) {
      throw new Error('[MazUI](img-preview) Image path must be defined. Ex: `v-zoom-img="<PATH_TO_IMAGE>"`')
    }

    if (typeof binding.value === 'object' && !binding.value.src) {
      throw new Error('[MazUI](img-preview) src of image must be provided')
    }

    this.options = this.buildOptions(binding)
  }

  private buildOptions(binding: BindingData): ZoomImgOptions {
    return {
      ...this.defaultOptions,
      ...(typeof binding.value === 'object' ? binding.value : { src: binding.value })
    }
  }

  get allInstances (): HTMLElement[] {
    return Array.from(document.querySelectorAll('.maz-zoom-img-instance'))
  }

  public create(el: HTMLElement): void {
    /**
     * If is disabled
     */
    if (this.options.disabled) return

    /**
     * Set instance style
     */
    el.style.cursor = 'pointer'
    /**
     * Set class & data attribute to use it with previous & next functions
     */
    el.classList.add('maz-zoom-img-instance')
    el.setAttribute('data-src', this.options.src)
    el.setAttribute('data-alt', this.options.alt)
    /**
     * Add event listeners
     */
    el.addEventListener('mouseenter', () => this.mouseEnter(el))
    el.addEventListener('mouseleave', () => this.mouseLeave(el))
    el.addEventListener('click', () => this.renderPreview(el, this.options))
  }

  public update(binding: BindingData) {
    this.options = this.buildOptions(binding)
  }

  public remove(el: HTMLElement): void {
    /**
     * Remove all
     */
    el.removeEventListener('click', () => this.renderPreview(el))
    el.removeEventListener('mouseenter', () => this.mouseEnter(el))
    el.removeEventListener('mouseleave', () => this.mouseLeave(el))
    el.classList.remove('maz-zoom-img-instance')
    el.removeAttribute('data-src')
    el.removeAttribute('data-alt')
    el.style.cursor = ''
  }

  private renderPreview(el: HTMLElement, options?: ZoomImgOptions): void {
    el.classList.add('maz-is-open')
    this.addStyle(style)

    const container: HTMLDivElement = document.createElement('div')
    container.classList.add('maz-zoom-img')
    container.setAttribute('id', 'MazImgPreviewFullsize')
    container.addEventListener('click', (e): void => {
      if (container.isEqualNode(e.target as Node)) {
        this.closePreview()
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
    const closeButton = this.getButton()

    const hasMultipleInstance = this.allInstances.length > 1

    if (hasMultipleInstance) {
      const previousButton = this.getButton('previous')
      const nextButton = this.getButton('next')
      buttons.push(previousButton, nextButton)
    }

    const wrapper: HTMLDivElement = document.createElement('div')
    wrapper.classList.add('maz-zoom-img__wrapper')
    hasMultipleInstance ? wrapper.append(buttons[0], img, buttons[1]) : wrapper.append(img)

    container.append(closeButton, wrapper)

    document.body.appendChild(container)
    this.keyboardEventHandler(true)

    setTimeout(() => {
      if (container) container.classList.add('maz-animate')
    }, 100)
  }


  private mouseLeave (el: HTMLElement): void {
    if (this.options.scale) el.style.transform = ''
    if (this.options.blur) el.style.filter = ''
    el.style.zIndex = ''
    setTimeout(() => (el.style.transition = ''), 300)
  }

  private mouseEnter(el: HTMLElement): void {
    el.style.transition = 'all 300ms ease-in-out'
    el.style.zIndex = '1'
    if (this.options.scale) el.style.transform = 'scale(1.1)'
    if (this.options.blur) el.style.filter = 'blur(2px)'
  }

  private keydownLister (e: KeyboardEvent): void {
    if (e.key === 'Escape' || e.key === ' ') {
      e.preventDefault()
      this.closePreview()
    }

    if (e.key === 'ArrowLeft' || e.key === 'ArrowRight') {
      this.nextPreviousImage(e.key === 'ArrowRight')
    }
  }

  private getButton (iconName = 'close'): HTMLButtonElement {

    const button = document.createElement('button')
    button.innerHTML = svgs[iconName]
    button.onclick = (): void => {
      iconName === 'close'
        ? this.closePreview()
        : this.allInstances
        ? this.nextPreviousImage(iconName === 'navigate_next')
        : null
    }
    return button
  }

  private closePreview(): void {
    const container: HTMLElement | null = document.querySelector('#MazImgPreviewFullsize')
    const style: HTMLElement | null = document.querySelector('#MazPreviewStyle')
    const instance: HTMLElement | null = document.querySelector('.maz-zoom-img-instance.maz-is-open')


    if (instance) instance.classList.remove('maz-is-open')

    if (container) container.classList.remove('maz-animate')

    this.keyboardEventHandler(false)

    setTimeout(() => {
      if (container) container.remove()
      if (style) style.remove()
    }, 300)
  }

  private nextPreviousImage (isNext: boolean): void {
    const selectNextInstance = isNext
    const currentInstance: HTMLElement | null = document.querySelector('.maz-zoom-img-instance.maz-is-open')

    const imgElement: HTMLImageElement | null = document.querySelector('#MazImgElement')

    const currentInstanceIndex = this.allInstances.findIndex((i) => i === currentInstance)
    const newInstanceIndex = selectNextInstance ? currentInstanceIndex + 1 : currentInstanceIndex - 1

    const getNewInstanceIndex = (): number => {
      return newInstanceIndex < 0
        ? this.allInstances.length - 1
        : newInstanceIndex >= this.allInstances.length
        ? 0
        : newInstanceIndex
    }

    const nextInstance = this.allInstances[getNewInstanceIndex()]

    if (nextInstance && imgElement && currentInstance) {
      currentInstance.classList.remove('maz-is-open')
      nextInstance.classList.add('maz-is-open')

      const src: string | null = nextInstance.getAttribute('data-src')
      const alt: string | null = nextInstance.getAttribute('data-alt')

      if (src) imgElement.setAttribute('src', src)
      if (alt) imgElement.setAttribute('alt', alt)
    }
  }
  private addStyle (styleString: string): void {
    const style = document.createElement('style')
    style.id = 'MazPreviewStyle'
    style.textContent = styleString
    document.head.append(style)
  }

  private keyboardEventHandler(add: boolean) {
    if (add) return document.addEventListener('keydown', this.keydownLister.bind(this))
    document.removeEventListener('keydown', this.keydownLister.bind(this))
  }
}

let instance: VueZoomImg

export default {
  bind(el: HTMLElement, binding: BindingData): void {
    instance = new VueZoomImg(binding)
    instance.create(el)
  },
  update(el: HTMLElement, binding: BindingData): void {
    instance.update(binding)
  },
  unbind(el: HTMLElement): void {
    instance.remove(el)
  }
} as DirectiveOptions
