import { LitElement, css, html } from 'lit'
import { customElement, state } from 'lit/decorators.js'

import packageJson from '../package.json'
import './card'
import './chevron-up-icon'
import './color-blindness-filter'
import { ColorBlindnessFilterKind } from './color-blindness-filter'
import './github-icon'
import './logo'
import { resetStyles } from './reset-styles'

interface CardItem {
  kind: ColorBlindnessFilterKind
  description: string
}

const cardItems: CardItem[] = [
  { kind: 'trichromacy', description: 'Normal' },
  { kind: 'achromatomaly', description: 'Blue Cone Monochromacy' },
  { kind: 'achromatopsia', description: 'Monochromacy' },
  { kind: 'deuteranomaly', description: 'Green-Weak' },
  { kind: 'deuteranopia', description: 'Green-Blind' },
  { kind: 'protanomaly', description: 'Red-Weak' },
  { kind: 'protanopia', description: 'Red-Blind' },
  { kind: 'tritanomaly', description: 'Blue-Weak' },
  { kind: 'tritanopia', description: 'Blue-Blind' },
]

@customElement('color-blindness-devtool')
export class ColorBlindnessDevtool extends LitElement {
  static override styles = [
    resetStyles,
    css`
      :host {
        --background: #13151a;
        --border: #2d2f38;
        --accent: #055de3;
        --rule: #1c1e24;
        --muted: #bfc1c9;
      }

      h1 {
        font-size: 1.25rem;
        font-weight: 700;
      }

      ul {
        display: grid;
        grid-template-columns: 1fr 1fr 1fr;
        gap: 0.5rem;
      }

      hr {
        margin: 1rem 0;
        border: 1px solid var(--rule);
      }

      button {
        position: absolute;
        top: calc(-2rem + 1px);
        left: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        width: 4rem;
        height: 2rem;
        background: var(--background);
        border: 1px solid var(--border);
        border-bottom: none;
        border-radius: 50% / 100% 100% 0 0;
        transform: translateX(-50%);
      }

      @keyframes overshoot {
        0% {
          transform: translateX(-50%) translateY(100%);
        }

        70% {
          transform: translateX(-50%) translateY(-2rem);
        }

        100% {
          transform: translateX(-50%) translateY(-1rem);
        }
      }

      .root {
        position: fixed;
        bottom: 0;
        left: 50%;
        z-index: calc(infinity);
        transition: transform 0.35s;
        transform: translateX(-50%) translateY(100%);
        animation-fill-mode: forwards;
      }

      .root[data-state='open'] {
        transform: translateX(-50%) translateY(-1rem);
        animation: overshoot 0.375s ease-in-out;
      }

      color-blindness-devtool-chevron-up-icon {
        color: var(--muted);
        transition: transform 0.35s;
        transform: translateY(0.3rem);
      }

      .root[data-state='open'] color-blindness-devtool-chevron-up-icon {
        transform: translateY(0.3rem) rotate(180deg);
      }

      .panel {
        display: none;
        width: 36rem;
        padding: 1rem;
        color: white;
        background: var(--background);
        border: 1px solid var(--border);
        border-radius: 0.5rem;
      }

      header {
        display: flex;
        gap: 0.75rem;
        align-items: center;
      }

      header > a {
        margin-left: auto;
      }

      .version {
        font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas,
          'Liberation Mono', 'Courier New', monospace;
        color: var(--muted);
      }

      color-blindness-devtool-logo::part(img) {
        width: 16rem;
      }

      color-blindness-devtool-github-icon {
        color: var(--muted);
      }

      color-blindness-devtool-github-icon:hover {
        opacity: 0.75;
      }

      color-blindness-devtool-github-icon::part(img) {
        width: 1.5rem;
        height: 1.5rem;
      }
    `,
  ]

  @state()
  private isOpen = false

  @state()
  private selectedKind: ColorBlindnessFilterKind = 'trichromacy'

  private handleWindowClick = (event: MouseEvent) => {
    if (
      this.isOpen &&
      event.target instanceof HTMLElement &&
      !event.target.closest('color-blindness-devtool')
    ) {
      this.isOpen = false
    }
  }

  override connectedCallback() {
    super.connectedCallback()
    window.addEventListener('click', this.handleWindowClick)
  }

  override disconnectedCallback() {
    window.removeEventListener('click', this.handleWindowClick)
    super.disconnectedCallback()
  }

  private handleOpen() {
    const panel = this.shadowRoot?.querySelector('.panel')
    if (this.isOpen && panel instanceof HTMLElement) {
      panel.style.display = 'block'
    }
  }

  private handleClose() {
    const panel = this.shadowRoot?.querySelector('.panel')
    if (!this.isOpen && panel instanceof HTMLElement) {
      panel.style.display = 'none'
    }
  }

  private handleToggleButtonClick() {
    this.isOpen = !this.isOpen
  }

  private handleCardSelect(
    event: CustomEvent<{ kind: ColorBlindnessFilterKind }>,
  ) {
    this.selectedKind = event.detail.kind
  }

  override render() {
    return html`
      <color-blindness-filter kind=${this.selectedKind}>
        <slot></slot>
      </color-blindness-filter>
      <div
        class="root"
        data-state=${this.isOpen ? 'open' : 'closed'}
        @transitionstart=${this.handleOpen}
        @transitionend=${this.handleClose}
      >
        <button @click=${this.handleToggleButtonClick}>
          <color-blindness-devtool-chevron-up-icon></color-blindness-devtool-chevron-up-icon>
        </button>
        <div class="panel">
          <header>
            <color-blindness-devtool-logo></color-blindness-devtool-logo>
            <span class="version">${packageJson.version}</span>
            <a
              href="https://github.com/neokidev/color-blindness-devtool"
              target="_blank"
              rel="noopener noreferrer"
            >
              <color-blindness-devtool-github-icon></color-blindness-devtool-github-icon>
            </a>
          </header>
          <hr />
          <main>
            <ul>
              ${cardItems.map(
                ({ kind, description }) => html`
                  <li>
                    <color-blindness-devtool-card
                      kind=${kind}
                      description=${description}
                      ?active=${this.selectedKind === kind}
                      @select=${this.handleCardSelect}
                    ></color-blindness-devtool-card>
                  </li>
                `,
              )}
            </ul>
          </main>
        </div>
      </div>
    `
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'color-blindness-devtool': ColorBlindnessDevtool
  }
}
