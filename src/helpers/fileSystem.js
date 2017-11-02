/**
 * Created by JohnBae on 8/10/16.
 */
import FS from 'fs';
import fs from 'fs-jetpack';
import { remote } from 'electron';

var dev = remote.app.getPath('userData');

export default function(path){

    var dir = fs.cwd(dev+"/"+path);

    return({
        cwd: ()=> dir.cwd(),
        setDir: function(path){
            dir = fs.cwd(path);
        },
        exists: function(path){
            return dir.exists(path);
        },
        remove: function(name){
            dir.remove(dir.path("./" + name));
        },
        save: function(path, data){
            var json = JSON.stringify(data, null, "\t");
            dir.write(path, json);
        },
        rename: function(prevName, newName, path){
            path = path == undefined ? "" : path;
            dir.rename(dir.path("./"+ path + "/" + prevName), newName);
        },
        read: function(path){
            return dir.read(dir.path("./" + path));
        },
        path: function(path){
            return dir.path(path);
        },
        list: function(path, sort){
            var searchPath = path ? "./" + path : "./";
            var sortList = dir.inspectTree(dir.path(searchPath));
            if(sort==undefined) sort = "Name";
            switch(sort){
                case "Name":
                    return dir.list(dir.path(searchPath));

                case "Recently Opened" :
                    if(!sortList) return null;
                    return sortList.children.sort((a,b) => b.accessTime - a.accessTime).map((elem) => elem.name);
                    break;

                case "Date Created" :
                    if(!sortList) return null;
                    var list = dir.list(dir.path(searchPath)).map(function(elem){
                        return [elem, FS.statSync(dir.path("./"+elem)).birthtime];
                    });
                    list = list.sort((a,b) => b[1] - a[1]);
                    list = list.map(function(elem){
                        return elem[0];
                    });
                    return list;
                    break;

                case "Date Modified" :
                    if(!sortList) return null;
                    return sortList.children.sort((a,b) => b.modifyTime - a.modifyTime).map((elem) => elem.name);
                    break;
            }

            return undefined;
        }
    })
}
