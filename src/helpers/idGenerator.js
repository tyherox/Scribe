/**
 * Created by JohnBae on 3/27/17.
 */

export default function(base, range){
    var unique = 1,
        id = base;
    if(range != undefined){
        while(range.find(function(elem){
            return elem == id;
        })){
            id = base + "." +  unique++;
        }
    }
    return id;
}
