<script setup lang="ts">
import { type TextFieldProps, useTextField } from "@formwerk/core";
import { configure } from "@formwerk/core";

configure({
  disableHtmlValidation: true,
});
const props = defineProps<TextFieldProps>();

const {
  inputProps,
  labelProps,
  errorMessage,
  errorMessageProps,
  descriptionProps,
} = useTextField(props);
</script>

<template>
  <div class="field">
    <label v-bind="labelProps">{{ label }}</label>
    <input v-bind="inputProps" />

    <div v-if="errorMessage" v-bind="errorMessageProps" class="error">
      {{ errorMessage }}
    </div>

    <div v-if="description" v-bind="descriptionProps" class="hint">
      {{ description }}
    </div>
  </div>
</template>

<style scoped>
.field {
  --color-primary: #ba1651;
  --color-text-primary: #333;
  --color-text-secondary: #666;
  --color-border: #d4d4d8;
  --color-focus: var(--color-primary);
  --color-error: #f00;
  width: 100%;

  label {
    display: block;
    margin-bottom: 0.25rem;
    font-size: 14px;
    font-weight: 500;
    color: var(--color-text-primary);
  }

  .hint {
    font-size: 13px;
    color: var(--color-text-secondary);
    opacity: 0;
    transition: opacity 0.3s ease;
  }

  .hint,
  .error {
    margin-top: 0.25rem;
  }

  input {
    display: block;
    width: 100%;
    padding: 0.5rem 0.6rem;
    font-size: 13px;
    color: var(--color-text-primary);
    border: 1px solid var(--color-border);
    background-color: var(--color-background);
    border-radius: calc(infinity * 1px);
    transition: border-color 0.3s ease;

    &:focus {
      outline: none;
      border-color: var(--color-button);
      box-shadow: 0 0 0 1px var(--color-button);
    }
  }

  .error {
    display: none;
    font-size: 13px;
    color: var(--color-error);
  }

  &:has(:focus) {
    .hint {
      opacity: 1;
    }
  }

  &:has(:user-invalid) {
    --color-border: var(--color-error);
    --color-focus: var(--color-error);

    .error {
      display: block;
    }

    .hint {
      display: none;
    }
  }
}
</style>
