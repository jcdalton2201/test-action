// .storybook/manager.js

import { addons } from '@storybook/addons';
import squidTheme from './squidTheme';
addons.setConfig({
    enableShortcuts: false,
    theme: squidTheme
});