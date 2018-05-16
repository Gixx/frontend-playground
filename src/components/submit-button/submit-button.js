import { h, Component } from 'preact'

export default class SubmitButton extends Component {
    render (props, state) {
        let id = 'id-' + props.name
        return (
            <div id={id} className="component submit-button">
                <button type="submit" name={props.name}>{props.label}</button>
            </div>
        )
    }
}
