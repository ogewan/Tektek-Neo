(function (win){
    function TekTekNeo(path)
    {
        var countItem = 0,
            countActiveLayer = 0,
            Item = function (name, color, type, src, data, ID, tID) {
                this.name = name || "";
                this.type = type || -1;
                this.src = src || "";
                this.data = data || {};
                this.tID = tID || -1;
                if (typeof color === 'number'){
                    this.color = [color];
                }
                else if (typeof color === 'string'){
                    var hex = ParseInt(color, 16);
                    this.color = (!IsNan(hex)) ? [hex] : [color];
                }
                else if (Array.IsArray(color)){
                    this.color = color;
                }
                else {
                    this.color = [];
                }
                this.AddColor = function () {
                    
                };
                this.RemColor = function () {

                };
                this.ID = ID || countItem;
                countItem++;
            },
            Layer = function (index, type, hue, levels, item, canvas) {
                this.type = type || -1;
                this.hue = hue || 0;
                this.levels = levels || "";
                this.item = item || -1;
                this.canvas = canvas || document.createElement("canvas");
                this.ctx = this.canvas.getContext("2d");
                this.tID = -1;
            },
            canvas = {
                zindicies: [],  //primary sort
                types: {},      //hash layers by type, sort by zindex
            },
            inventory = {
                ids: [],    //primary sort
                types: {},  //hash items by type, sort by tID, via object of arrays
                colors: {}  //hash items by color, via object of objects
            }
            saver = {
                canvas : 0,
                ctx : 0,
                init : function () {
                    this.canvas = document.createElement("canvas");
                    this.ctx = this.canvas.getContext("2d");
                },
                save : function () {
                    var n = i = 0;
                    for (i = 0, n = canvas.zindicies.length; i < n; i++) {
                        this.canvas.drawImage(canvas.zindicies[i], 0, 0);
                    }
                    this.canvas.toDataURL();
                    //this.canvas.clearRect(0, 0, canvas.width, canvas.height);
                }
            };
        this.Make = function (name, color, type, src, data) {
            var item = new Item (name, color, type, src, data);
            inventory.types.type = inventory.types.type || [];
            item.tID = inventory.types.type.length;
            inventory.types.type.push(item);
            if (inventory.ids[item.ID] === void(0)) {
                inventory.ids[item.ID] = item;
            } else {
                throw "already defined";
            }
            inventory.colors[Normalize(color)] = item;
        };
        this.Init = function (path) {

        };
        this.AddLayer = function () {

        };
        this.RemLayer = function () {
            
        };
    };
    win.ttn = new TekTekNeo();
    return window.addEventListener ? window.addEventListener("load", win.ttn.init, 0) : 
     (window.attachEvent ? window.attachEvent("onload", win.ttn.init) : window.onload = win.ttn.init);
})(window)