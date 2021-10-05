// Form group sub elements

export type DynamicForm = Array<FormField>

export type FormField = FormFieldUnit | FormFieldMultiple

export enum FormFieldType {
  TEXT = 'text',
  SELECT = 'select'
}

export enum FormElementType {
  MULTIPLE = 'multiple',
  UNIT = 'unit'
}

export interface FormElementCommon {
  required?: boolean
  validation?: string
  name: string
  label?: string
  help?: string
  defaultValue?: string
}

export interface FormTextElement extends FormElementCommon {
  type: `${FormFieldType.TEXT}`
  placeholder?: string
}

export interface FormSelectElement extends FormElementCommon {
  type: `${FormFieldType.SELECT}`
  options: string[]
}

export type FormElement = FormTextElement | FormSelectElement

// Form fields (single and multiple)
export type FormFieldUnit = {
  type: `${FormElementType.UNIT}`
  element: FormTextElement | FormSelectElement
}

export type FormFieldMultiple = {
  type: `${FormElementType.MULTIPLE}`
  title: string
  help?: string
  group: string
  elements: FormElement[]
}
