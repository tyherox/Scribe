/**
 * Created by JohnBae on 1/16/17.
 */
module.exports = function(file){
    if(file!=null){
        var css = document.createElement("link");
        css.setAttribute("rel", "stylesheet");
        css.setAttribute("type", "text/css");
        css.setAttribute("href", file);
        document.getElementsByTagName("head")[0].appendChild(css)
    }
    else{
        console.debug("CSS link null value");
    }
};
