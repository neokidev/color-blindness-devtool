import type { Meta, StoryObj } from '@storybook/web-components'
import { html } from 'lit'

import './color-blindness-devtool'

interface ColorBlindnessDevtoolProps {}

const meta = {
  title: 'ColorBlindnessDevtool',
  tags: ['autodocs'],
  render: () => html`
    <style>
      .rainbow-square {
        width: 100%;
        height: 8rem;
        background: linear-gradient(
          to right,
          red,
          orange,
          yellow,
          green,
          blue,
          indigo,
          violet
        );
      }
    </style>
    <color-blindness-devtool>
      <div class="rainbow-square"></div>
    </color-blindness-devtool>
  `,
} satisfies Meta<ColorBlindnessDevtoolProps>

export default meta
type Story = StoryObj<ColorBlindnessDevtoolProps>

export const Default: Story = {
  args: {},
}