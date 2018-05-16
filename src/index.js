import { render } from 'preact'
import TextInput from './components/text-input/text-input'
import SubmitButton from './components/submit-button/submit-button'
import './index.scss'

var componentList = {
    TextInput: TextInput,
    SubmitButton: SubmitButton
}

document.addEventListener('DOMContentLoaded', function () {
    const ComponentElements = document.querySelectorAll('[data-component]')
    for (let i in ComponentElements) {
        if (ComponentElements.hasOwnProperty(i)) {
            const element = ComponentElements[i]
            let componentName = element.getAttribute('data-component')

            if (typeof componentList[componentName] !== 'undefined') {
                let label = element.getAttribute('data-label')
                let name = element.getAttribute('data-name')
                let values = JSON.parse(element.getAttribute('data-values'))
                let componentReference = (new componentList[componentName]()).render({label: label, name: name, values: values})
                render(componentReference, element.parentNode, element)
            }
        }
    }
})
