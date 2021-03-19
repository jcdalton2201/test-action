import { escapeCharacters, splice } from '../utils/stringUtils.js';

export class MaskUtil {
    constructor(input, pattern='', controller) {
        this.input = input;
        this.maskPattern = pattern;
        this.controller = controller;

        this.numValidate = /^\d$/;
        this.stringValidate = /^[a-zA-Z]$/;
        this.allValidate = /^\w$/;

        this.mask = pattern.split('').map(char => {
            let validator;
            if (char === 'A') {
                validator = this.stringValidate;
            } else if (char === '1') {
                validator = this.numValidate;
            } else if (char === 'e') {
                validator = this.allValidate;
            }
            return { char, validator };
        });

        this.validators = this.mask.filter(charData => charData.validator);

        this.placeholder = this.mask.map(char => {
            if (char.validator) {
                return '_';
            } else {
                return char.char;
            }
        }).join('');

        /** Construct a string to be used as a pattern setting in an input component */
        this.regExp = this.mask.map(entry => {
            const { validator, char } = entry;
            if (validator) {
                switch (validator) {
                case this.numValidate:
                    return '\\d';
                case this.stringValidate:
                    return '[a-zA-Z]';
                case this.allValidate:
                    return '\\w';
                }
            } else {
                if (escapeCharacters.includes(char)) {
                    return `\\${char}`;
                } else {
                    return char;
                }
            }
        }).join('');

        input.pattern = this.regExp;
        this.__inputKeydownMask = this.__inputKeydownMask.bind(this);
        this.__inputPaste = this.__inputPaste.bind(this);

        input.addEventListener('keydown', this.__inputKeydownMask);
        input.addEventListener('paste', this.__inputPaste);
    }

    disconnect() {
        this.input.removeEventListener('keydown', this.__inputKeydownMask);
        this.input.removeEventListener('paste', this.__inputPaste);
    }

    parseRaw(data) {
        data = data || '';
        const filteredData = data.replace(/\W/g, '');
        if (filteredData.length === this.validators.length) {
            const isValid = filteredData.split('')
                .map((char, index) => !!char.match(this.validators[index].validator))
                .reduce((accumulator, currentValue) => {
                    if (currentValue === false) {
                        return false;
                    } else {
                        return accumulator;
                    }
                });

            if (!isValid) {
                return false;
            }
            let pointer = -1;
            return this.mask.map((maskObj) => {
                if (maskObj.validator) {
                    pointer += 1;
                    return filteredData[pointer];
                } else {
                    return maskObj.char;
                }
            }).join('');
        } else {
            return data;
        }
    }

    __inputKeydownMask(event) {
        const { selectionStart, selectionEnd } = event.target;
        const key = event.key;
        const ignored = ['Backspace', 'Tab', 'Enter', 'Escape', 'ArrowLeft', 'ArrowRight', 'Shift'];
        if (ignored.includes(key) || event.metaKey) {
            return;
        }
        if (event.target.value.length >= this.mask.length) {
            event.preventDefault();
            return false;
        }
        if (selectionStart === selectionEnd) {
            let index = selectionStart;
            let mask = this.mask[index];
            while(mask && !mask.validator && key != mask.char) {
                event.target.value = splice(event.target.value, index, mask.char);
                event.target.setSelectionRange(index + 1, index + 1);
                mask = this.mask[index + 1];
                index += 1;
            }
            if (mask && mask.validator) {
                const match = !!key.match(mask.validator);
                if (!match) {
                    event.preventDefault();
                    return false;
                }
            }
        }
    }

    __inputPaste(event) {
        const data = event.clipboardData.getData('text/plain');
        const maskedData = this.parseRaw(data);

        if (maskedData === false) {
            this.controller.setCustomValidity('The information entered does not follow the proper format');
        } else {
            this.controller.setCustomValidity('');
            setTimeout(() => {
                this.controller.value = maskedData;
            });
        }
    }
}