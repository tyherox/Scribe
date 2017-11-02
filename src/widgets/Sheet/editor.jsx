/**
 * Created by JohnBae on 8/14/16.
 */

import React from 'react';
import ReactDOM from 'react-dom';
import {connectAdvanced} from 'react-redux';
import {bindActionCreators} from 'redux';
import shallowEqual from 'shallowequal';
import * as Actions from '../../actions/index';
import {Editor, EditorState, convertFromRaw, convertToRaw, RichUtils} from 'draft-js';
import {storage} from "./main";
import Separator from "../../components/separator/main";

class EditorComponent extends React.Component {

    constructor(props) {

        super(props);
        var editorState = storage.read(this.props.reduxPath);

        if(editorState != undefined){
            editorState = storage.read(this.props.reduxPath);
            editorState = EditorState.createWithContent(convertFromRaw(JSON.parse(editorState)));
        }
        else{
            editorState = EditorState.createEmpty()
        }

        this.state = {editorState: editorState};

        var self = this;
        this.onChange = (editorState) => {
            if(editorState.getCurrentContent() != self.state.editorState.getCurrentContent()){
                var content = editorState.getCurrentContent();
                var raw = convertToRaw(content);
                storage.save(self.props.reduxPath, raw);
            }
            this.setState({editorState: editorState});
        };
        this.focus = () => this.refs.editor.focus();
        this.handleKeyCommand = (command) => this._handleKeyCommand(command);
        this.onTab = (e) => this._onTab(e);
        this.toggleBlockType = (type) => this._toggleBlockType(type);
        this.toggleInlineStyle = (style) => this._toggleInlineStyle(style);
    }

    componentWillReceiveProps(nextProps){
        if(nextProps.reduxPath != this.props.reduxPath){
            var editorState = nextProps.reduxPath;
            if(editorState != undefined){
                editorState = storage.read(editorState);
                if(editorState) {
                    editorState = EditorState.createWithContent(convertFromRaw(JSON.parse(editorState)));
                    this.setState({editorState: editorState});
                }
            }
        }
        if(nextProps.reduxToolbar != this.props.reduxToolbar){
            if(!this.props.reduxToolbar){
                this.refs.container.style.height = "calc(100% - 55px)"
            }
            else {
                this.refs.container.style.height = "calc(100% - 10px)"
            }
        }
    }

    _handleKeyCommand(command) {
        const {editorState} = this.state;
        const newState = RichUtils.handleKeyCommand(editorState, command);
        if (newState) {
            this.onChange(newState);
            return true;
        }
        return false;
    }

    _onTab(e) {
        const maxDepth = 4;
        this.onChange(RichUtils.onTab(e, this.state.editorState, maxDepth));
    }

    _toggleBlockType(blockType) {
        this.onChange(
            RichUtils.toggleBlockType(
                this.state.editorState,
                blockType
            )
        );
    }

    _toggleInlineStyle(inlineStyle) {
        this.onChange(
            RichUtils.toggleInlineStyle(
                this.state.editorState,
                inlineStyle
            )
        );
    }

    render() {

        const {editorState} = this.state;
        return (
        <div className="editor-container">
            {this.props.reduxToolbar ? <div id = "editor-toolbar" ref = "toolbar">
                <Separator/>
                <BlockStyleControls
                    editorState={editorState}
                    onToggle={this.toggleBlockType}/>
                <InlineStyleControls
                    editorState={editorState}
                    onToggle={this.toggleInlineStyle}/>
                <Separator/>
            </div> : null}
            <div className="editorContainer" ref="container">
                <div className="editorContent"
                     ref="editorArea"
                     onClick={this.focus}>
                    <Editor ref="editor"
                            placeholder="Tell a story..."
                            blockStyleFn={getBlockStyle}
                            customStyleMap={styleMap}
                            editorState={editorState}
                            handleKeyCommand={this.handleKeyCommand}
                            onChange={this.onChange}
                            onTab={this.onTab}
                            onFocus={()=>{this.setState({focused: true}); if(this.refs.toolbar) this.refs.toolbar.style.opacity = "1"}}
                            onBlur={()=>{this.setState({focused: false}); if(this.refs.toolbar) this.refs.toolbar.style.opacity = ".1"}}
                            spellCheck={true}/>
                </div>
            </div>
        </div>
        );
    }
}

const styleMap = {
    CODE: {
        backgroundColor: 'rgba(0, 0, 0, 0.05)',
        fontFamily: '"Inconsolata", "Menlo", "Consolas", monospace',
        fontSize: 14,
        padding: 2,
    },
};

function getBlockStyle(block) {
    switch (block.getType()) {
        case 'blockquote': return 'RichEditor-blockquote';
        default: return null;
    }
}

class StyleButton extends React.Component {
    constructor() {
        super();
        this.onToggle = (e) => {
            e.preventDefault();
            this.props.onToggle(this.props.style);
        };
    }

    render() {
        let className = 'RichEditor-styleButton';
        if (this.props.active) {
            className += ' RichEditor-activeButton';
        }

        return (
            <span className={className} onMouseDown={this.onToggle}>
              {this.props.label}
            </span>
        );
    }
}

const BLOCK_TYPES = [
    {label: 'H1', style: 'header-one'},
    {label: 'H2', style: 'header-two'},
    {label: 'Blockquote', style: 'blockquote'},
    {label: 'UL', style: 'unordered-list-item'},
    {label: 'OL', style: 'ordered-list-item'},
    {label: 'Code Block', style: 'code-block'},
];

const BlockStyleControls = (props) => {
    const {editorState} = props;
    const selection = editorState.getSelection();
    const blockType = editorState
        .getCurrentContent()
        .getBlockForKey(selection.getStartKey())
        .getType();

    return (
        <div className="RichEditor-controls">
            {BLOCK_TYPES.map((type) =>
                <StyleButton
                    key={type.label}
                    active={type.style === blockType}
                    label={type.label}
                    onToggle={props.onToggle}
                    style={type.style}
                />
            )}
        </div>
    );
};

var INLINE_STYLES = [
    {label: 'B', style: 'BOLD'},
    {label: 'I', style: 'ITALIC'},
    {label: 'U', style: 'UNDERLINE'}
];

const InlineStyleControls = (props) => {
    var currentStyle = props.editorState.getCurrentInlineStyle();
    return (
        <div className="RichEditor-controls">
            {INLINE_STYLES.map(type =>
                <StyleButton
                    key={type.label}
                    active={currentStyle.has(type.style)}
                    label={type.label}
                    onToggle={props.onToggle}
                    style={type.style}
                />
            )}
        </div>
    );
};

function layoutSelector(dispatch) {
    let state = {};
    let ownProps = {};
    let result = {};
    const actions = bindActionCreators(Actions, dispatch);
    return (nextState, nextOwnProps) => {
        if(!nextState.layout.get(nextOwnProps.id)) return result;
        const nextResult = {
            reduxPath: nextState.layout.get(nextOwnProps.id).get("content").get("title"),
            reduxToolbar: nextState.settings.get("toolbarToggle"),
            ...nextOwnProps
        };
        state = nextState;
        ownProps = nextOwnProps;
        if (!shallowEqual(result,nextResult)){
            result = nextResult;
        }
        return result
    }
}

export default connectAdvanced(layoutSelector)(EditorComponent);
