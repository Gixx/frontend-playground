import { h, Component } from 'preact'

export default class TextInput extends Component {
    render (props, state) {
        let id = 'id-' + props.name
        return (
            <div id={id} className="component text-input">
                <label>{props.label}: <input type="text" name={props.name} value={props.values[0]} /></label>
            </div>
        )
    }
}
