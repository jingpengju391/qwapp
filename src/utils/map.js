export default{

    mapApi:callback => {

        if( window.BMap ){
			
            callback();
            return false;
        }
 
        let

        head = document.head || document.getElementsByTagName('head')[0],

        mapSrc = document.createElement("script");

        mapSrc.setAttribute("type","text/javascript");

        mapSrc.src="http://api.map.baidu.com/api?v=2.0&ak=ZMRViaPFowvgIxSu6dTnGfoFqEPeZVzl";

        head.appendChild(mapSrc);

        if ( window.ActiveXObject || "ActiveXObject" in window){
            if(mapSrc.readyState){
                mapSrc.onreadystatechange = function() {
                    if(this.readyState == "loaded" || this.readyState == "complete") callback();
                }
            }else{
                mapSrc.onload = function() {
                  callback();
                }
            }
        }else{
            mapSrc.onload = function() {
                callback();
            }
        }

    },
}
