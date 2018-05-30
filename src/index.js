// import { JSZip } from 'jszip'
// import { JSZipUtils } from 'jszip-utils'
// import { render } from 'preact'
// import TextInput from './components/text-input/text-input'
// import SubmitButton from './components/submit-button/submit-button'
import './index.scss'

const JSZip = require('jszip')
const JSZipUtils = require('jszip-utils')

// var componentList = {
//     TextInput: TextInput,
//     SubmitButton: SubmitButton
// }

var LoadedComponents = {}

document.addEventListener('DOMContentLoaded', function () {
    const ComponentElements = document.getElementsByTagName('component')

    for (let i in ComponentElements) {
        if (ComponentElements.hasOwnProperty(i)) {
            const element = ComponentElements[i]
            let type = element.getAttribute('type')
            console.log('Type: ' + type)

            // Load component
            if (typeof LoadedComponents[type] === 'undefined') {
                let src = './components/' + type + '.zip'
                JSZipUtils.getBinaryContent(src, function (err, data) {
                    if (err) {
                        console.info(
                            '%c✖%c the component ' + src + ' cannot be loaded.',
                            'color:red',
                            'color:black'
                        )
                    }

                    JSZip.loadAsync(data).then(function () {
                        console.log(data)
                    })
                })
            }
            // let componentName = element.getAttribute('data-component')
            //
            // if (typeof componentList[componentName] !== 'undefined') {
            //     let label = element.getAttribute('data-label')
            //     let name = element.getAttribute('data-name')
            //     let values = JSON.parse(element.getAttribute('data-values'))
            //     let componentReference = (new componentList[componentName]()).render({label: label, name: name, values: values})
            //     render(componentReference, element.parentNode, element)
            // }
        }
    }
})
