(function (win){
    function TekTekNeo(path)
    {
        var count = 0,
            Item = function (name, type, src, data, ID, tID) {
                this.name = name || "";
                this.type = type || -1;
                this.src = src || "";
                this.data = data || {};
                this.tID = tID || -1;
                this.ID = ID || count;
                count++;
            },
            inventory = {};
        this.Make = function(name, type, src, data){
            var item = new Item(name, type, src, data);
            inventory.type = inventory.type || [];
            item.tID = inventory.type.length;
            inventory.type.push(item);
        };
        this.Init = function(path){

        };
        this.AddLayer = function() {};
        this.RemLayer = function() {};
    };
    win.ttn = new TekTekNeo();
    return window.addEventListener ? window.addEventListener("load", win.ttn.init, 0) : 
     (window.attachEvent ? window.attachEvent("onload", win.ttn.init) : window.onload = win.ttn.init);
})(window)