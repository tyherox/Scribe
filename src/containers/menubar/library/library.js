/**
 * Created by JohnBae on 1/29/17.
 */

import React, {Component} from "react";
import Button from "../../../components/button";
import VCenter from "../../../components/vCenter/main";
import fs from '../../../helpers/fileSystem';
import * as Actions from '../../../actions/index';
import {connectAdvanced} from "react-redux";
import {bindActionCreators} from 'redux';
import shallowEqual from 'shallowequal';

var fileStorage = new fs("widgets/1-sheets");
var projectStorage = new fs("layouts");

class LibraryPane extends Component{

    constructor(props) {
        super(props);
        this.state = {searchValue: ""}
        this.handleListChange = this.handleListChange.bind(this);
        this.deleteLayout = this.deleteLayout.bind(this);
        this.addProject = this.addProject.bind(this);
        this.setLayout = this.setLayout.bind(this);
    }

    handleListChange(event){
        this.props.reduxActions.modifyAtSetting({librarySortValue: event.target.value});
    }

    deleteFile(name){

        fileStorage.remove(name);
        var file;
        this.props.reduxLayout.forEach(function(elem){
            var id = elem.get("id");
            var content = elem.get("content");
            if(content) {
                var title = content.get("title");
                if(name == title) file = id;
            }
        });
        if(file) this.props.reduxActions.deleteAtLayout(file.toString());
        this.forceUpdate();
    }

    setLayout(data){
        console.log(data);
        this.props.reduxActions.setLayout(data);
    }

    addProject(){
        var i = 0, self = this;
        var name = "Untitled." + i++;
        while(this.props.reduxProjects.has(name)) {
            name = "Untitled." + i++;
        }

        var layout = this.props.reduxLayout.map(function(elem){
            return elem;
        });

        this.props.reduxActions.addStoredLayout(name, layout);
    }

    deleteLayout(name){
        console.log("Deleting:", name);
        this.props.reduxActions.deleteStoredLayout(name);
    }

    activateDropdown() {
     document.getElementById("myDropdown").classList.toggle("show");
    }

    renameLayout(prevName, name){
        this.props.reduxActions.renameStoredLayout(prevName, name);
    }

    componentDidMount(){
        window.onclick = function(event) {
            if (!event.target.matches('.dropbtn')) {

                var dropdowns = document.getElementsByClassName("dropdown-content");
                var i;
                for (i = 0; i < dropdowns.length; i++) {
                    var openDropdown = dropdowns[i];
                    if (openDropdown.classList.contains('show')) {
                        openDropdown.classList.remove('show');
                    }
                }
            }
        }
    }

    render(){

        var self = this,
            category = this.props.category,
            currentProject = this.props.currentProject != "" ? this.props.currentProject : "none",
            sortValue = this.props.sortValue,
            list;

        if(category == "files"){
            list = fileStorage.list(null, sortValue);
            if(list) list = list.map(function(file){
                if((self.state.searchValue!="" && file.includes(self.state.searchValue) || self.state.searchValue==""))
                return(
                    <ConnectedLibraryFile name = {file}
                                 key = {file}
                                 deleteFile = {self.deleteFile.bind(self, file)}
                                 selected = {self.props.reduxLayout.find((elem) => elem.get("content").get("title") == file) ? true : false}
                                 addSheet = {self.props.addWidget}/>
                )
            });
        }
        else if(category == "projects"){

            list = projectStorage.list(null, sortValue);
            if(list) list = list.map(function(file){
                file = file.replace(".json","");
                if((self.state.searchValue!="" && file.includes(self.state.searchValue) || self.state.searchValue==""))
                return(
                <ConnectedLibraryProject key = {file}
                                            path = {self.props.reduxProjects.get(file)}
                                            name = {file}
                                            selected = {file == self.props.currentProject}
                                            renameLayout = {self.renameLayout}
                                            deleteLayout = {self.deleteLayout}
                                            setLayout = {self.setLayout}/>
                )
            });
        }
        else list = null;

        return(
            <div id = "subMenu">
                <h2 className="subMenu-title">Library</h2>
                <div className="library-container">
                    <div className="library-toolbar">
                        <Button className = {this.props.category == "files"
                            ? "library-toolbar-selectButton-selected" : "library-toolbar-selectButton"}
                                onClick = {()=>this.props.reduxActions.modifyAtSetting({libraryCategory: "files"})}
                                type="half">Files</Button>
                        <Button className = {this.props.category == "projects"
                            ? "library-toolbar-selectButton-selected" : "library-toolbar-selectButton"}
                                onClick = {()=>this.props.reduxActions.modifyAtSetting({libraryCategory: "projects"})}
                                type="half">Projects</Button>
                    </div>
                    <div className="library-toolbar-transparent">
                        <input className="library-toolbar-search"
                               onChange={(event)=>this.setState({searchValue: event.target.value})}
                               defaultValue=""/>
                        <div className="dropdown">
                            <Button onClick={this.activateDropdown.bind(this)}
                                    className="dropbtn"
                                    customBackground
                                    icon = "sort.png"/>
                            <div id="myDropdown" className="dropdown-content">
                                <a className = {sortValue == "Name" ? "selectedA" : ""}
                                   onClick={()=>this.props.reduxActions.modifyAtSetting({librarySortValue: "Name"})}>
                                    Name
                                </a>
                                <a className = {sortValue == "Recently Opened" ? "selectedA" : ""}
                                   onClick={()=>this.props.reduxActions.modifyAtSetting({librarySortValue: "Recently Opened"})}>
                                    Recently Opened
                                </a>
                                <a className = {sortValue == "Date Created" ? "selectedA" : ""}
                                   onClick={()=>this.props.reduxActions.modifyAtSetting({librarySortValue: "Date Created"})}>
                                    Date Created
                                </a>
                                <a className = {sortValue == "Date Modified" ? "selectedA" : ""}
                                   onClick={()=>this.props.reduxActions.modifyAtSetting({librarySortValue: "Date Modified"})}>
                                    Date Modified
                                </a>
                            </div>
                        </div>
                    </div>
                    <div className={"library-scroll"}>
                        {list}
                        {category == "projects" ? <Button className="library-addProject"
                                                          onClick = {this.addProject}>+</Button> : null}
                    </div>
                </div>
            </div>
        )
    }
}

class LibraryProject extends Component{

    constructor(props){
        super(props);
        this.state = {showOptions: false};

        this.showOptions = this.showOptions.bind(this);
        this.hideOptions = this.hideOptions.bind(this);
        this.setLayout = this.setLayout.bind(this);
        this.deleteProject = this.deleteProject.bind(this);
        this.removeProject = this.removeProject.bind(this);
        this.enableRename = this.enableRename.bind(this);
    }

    setLayout(){
        var layout = JSON.parse(projectStorage.read(this.props.name + ".json"));
        this.props.setLayout(layout);
        this.props.reduxActions.modifyAtSetting({project: this.props.name});
    }

    removeProject(event){
        event.stopPropagation();
        if(this.props.name == this.props.currentProject){
            this.props.reduxActions.modifyAtSetting({project: ""});
        }
    }

    deleteProject(event){
        event.stopPropagation();
        if(this.props.name == this.props.currentProject){
            this.props.reduxActions.modifyAtSetting({project: ""});
        }
        this.props.deleteLayout(this.props.name);
    }

    showOptions(){
        this.setState({showOptions: true});
    }

    hideOptions(){
        this.setState({showOptions: false});
    }

    renameProject(event){
        if(event.target.value==""){
            this.deleteLayout();
        }
        else if(event.target.value!=this.props.name) {
            this.props.reduxActions.renameStoredLayout(this.props.name, event.target.value);
            var doesProjectExist = this.props.currentProject == this.props.name;
            if(doesProjectExist){
                this.props.reduxActions.modifyAtSetting({project: event.target.value});
            }
        }
    }

    enableRename(){
        this.refs.input.disabled = false;
        this.refs.input.setSelectionRange(0, this.refs.input.value.length);
        this.refs.input.focus();
    }

    keyPress(event){
        if (event.key === 'Enter') {
            event.target.blur();
        }
    }

    render(){
        var options = this.state.showOptions ? "library-item-showOption" : "library-item-hideOption";
        return(
            <div className = "library-item-default"
                 onMouseEnter={this.showOptions}
                 onMouseLeave={this.hideOptions}
                 onClick={this.setLayout}
                 onDoubleClick={this.enableRename}
                 ref="item">
                {this.props.selected ? <VCenter><div className = "selectedIcon"></div></VCenter> : null}
                <input className="library-item-title"
                       defaultValue={this.props.name}
                       disabled="true"
                       ref="input"
                       onKeyPress={this.keyPress.bind(this)}
                       onBlur={this.renameProject.bind(this)}/>
                <Button className={options}
                        icon = {this.props.selected ? "recall.png" : "delete.png"}
                        onClick={this.props.selected ? this.removeProject : this.deleteProject}/>
            </div>
        )
    }
}

class LibraryFile extends Component{

    constructor(props){
        super(props);
        this.state = {showOptions: false, edit: false};

        this.addSheet = this.addSheet.bind(this);
        this.deleteFile = this.deleteFile.bind(this);
        this.removeSheet = this.removeSheet.bind(this);
        this.showOptions = this.showOptions.bind(this);
        this.hideOptions = this.hideOptions.bind(this);
        this.renameItem = this.renameItem.bind(this);
    }

    removeSheet(event){
        event.stopPropagation();
        var self = this;
        this.props.reduxLayout.forEach(function(elem){
            var id = elem.get("id");
            var content = elem.get("content");
            if(content) {
                var title = content.get("title");
                if(self.props.name == title) {
                    self.props.reduxActions.deleteAtLayout(id.toString());
                }
            }
        });
    }

    renameItem(){
        this.setState({edit: !this.state.edit});
    }

    addSheet(event){
        console.log("ADDING");
        if(!this.props.selected) this.props.addSheet({
            id: '1*',
            pinned: true,
            content: {title: this.props.name}
        });
        event.preventDefault();
    }

    deleteFile(event){
        event.stopPropagation();
        this.props.deleteFile(this.props.name);
    }

    showOptions(){
        this.setState({showOptions: true});
    }

    hideOptions(){
        this.setState({showOptions: false});
    }

    enableRename(){
        this.refs.input.disabled = false;
        this.refs.input.setSelectionRange(0, this.refs.input.value.length);
        this.refs.input.focus();
    }

    renameFile(event){
        var self = this;
        if(event.target.value==""){
            this.deleteLayout();
        }
        else if(event.target.value!=this.props.name) {
            fileStorage.rename(this.props.name, event.target.value);
            var sheet  = this.props.reduxLayout.find(function(elem){
                return (elem.get("content").get('title') == self.props.name);
            });
            if(sheet){
                this.props.reduxActions.modifyAtLayout(sheet.get('id'),{content:{title: event.target.value}});
            }
            this.refs.input.disabled = true;
        }
        else{
            this.refs.input.disabled = true;
        }
    }

    keyPress(event){
        if (event.key === 'Enter') {
            event.target.blur();
        }
    }

    render(){
        var options = this.state.showOptions ? "library-item-showOption" : "library-item-hideOption";
        return(
            <div className = "library-item-default"
                 onMouseEnter={this.showOptions}
                 onMouseLeave={this.hideOptions}
                 onClick={this.addSheet}
                 onDoubleClick={this.enableRename.bind(this)}
                 ref="item">
                {this.props.selected ? <VCenter><div className = "selectedIcon"></div></VCenter> : null}
                <input className="library-item-title"
                       defaultValue={this.props.name}
                       disabled="true"
                       ref="input"
                       onKeyPress={this.keyPress.bind(this)}
                       onBlur={this.renameFile.bind(this)}/>
                <Button className={options}
                        size={this.props.selected ? "small" : ""}
                        icon = {this.props.selected ? "recall.png" : "delete.png"}
                        onClick={this.props.selected ? this.removeSheet : this.deleteFile}>
                </Button>
            </div>
        )
    }
}

function selectorFactory(dispatch) {
    let state = {};
    let ownProps = {};
    let result = {};
    const actions = bindActionCreators(Actions, dispatch);
    return (nextState, nextOwnProps) => {
        const nextResult = {
            reduxProjects: nextState.storedLayouts,
            sortValue: nextState.settings.get('librarySortValue'),
            category: nextState.settings.get('libraryCategory'),
            currentProject: nextState.settings.get('project'),
            reduxLayout: nextState.layout,
            reduxActions: actions,
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

var ConnectedLibraryFile = connectAdvanced(selectorFactory)(LibraryFile);
var ConnectedLibraryProject = connectAdvanced(selectorFactory)(LibraryProject);
export default connectAdvanced(selectorFactory)(LibraryPane);
