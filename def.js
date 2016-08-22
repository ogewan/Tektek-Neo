(function (win) {
    function TekTekNeo(path) {
        var countItem = 0,
            countActiveLayer = 0,
            state = 0,
            Update = 0,
            Normalize = function (color) {

            },
            str2b64 = function (str) {

            },
            b642str = function (b64) {

            },
            Item = function (name, color, type, src, data, ID, tID) {
                this.name = name || "";
                this.type = type || -1;
                this.src = src || "";
                this.data = data || {};
                this.tID = tID || -1;
                if (typeof color === 'number') {
                    this.color = [color];
                }
                else if (typeof color === 'string') {
                    var hex = parseInt(color, 16);
                    this.color = (!IsNan(hex)) ? [hex] : [color];
                }
                else if (Array.isArray(color)) {
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
            Layer = function (index, type, multi, hue, levels, fVert, fHorz, item, canvas) {
                this.type = type || -1;
                this.multi = multi || false;
                this.hue = hue || 0;
                this.levels = levels || "";
                this.flipVert = fVert;
                this.flipHorz = fHorz;
                this.item = item || -1;
                this.canvas = canvas || document.createElement("canvas");
                this.ctx = this.canvas.getContext("2d");
                this.tID = -1;
                //locks
                this.huLock = false;
                this.leLock = false;
                this.fvLock = false;
                this.fhLock = false;
                this.itLock = false;
            },
            canvas = {
                zindicies: [],  //primary sort
                types: {},      //hash layers by type, sort by zindex
            },
            inventory = {
                ids: [],    //primary sort
                types: {},  //hash items by type, sort by tID, via object of arrays
                colors: {}  //hash items by color, via object of objects
            },
        saver = {
            init: function () {
                this.link = document.createElement("A");
                this.fallback = document.createElement("DIV");
                this.fbClear = document.createElement("A");
                this.canvas = document.createElement("canvas");
                this.ctx = this.canvas.getContext("2d");
                this.link.style = "display: none;";
                this.fallback.style = "display: none;";
                this.fallback.id = "fallback";
                this.fbClear.innerHTML = "Clear";
                this.fbClear.addEventListener("click", function () {
                    document.getElementById("fallback").style = "display: none;";
                });
                document.body.appendChild(this.link);
                document.body.appendChild(this.fallback);
            },
            save: function (embed) {
                var n = i = 0,
                    raw = "",
                    strstate = "",
                    solution = "",
                    compItems = [],
                    evt = 0;
                for (i = 0, n = canvas.zindicies.length; i < n; i++) {
                    this.canvas.drawImage(canvas.zindicies[i], 0, 0);
                    compItems.push(canvas.zindicies[i]);
                }
                raw = this.canvas.toDataURL();
                this.canvas.clearRect(0, 0, canvas.width, canvas.height);
                state.items = compItems;
                strstate = JSON.stringify(state);
                state.items = void (0);
                solution = raw;
                if (embed) solution += "abcdef" + str2b64(strstate);
                try {
                    evt = new MouseEvent("click", {
                        bubbles: true,
                        cancelable: true,
                        view: window
                    });
                    this.link.download = state.name + ".png";
                    this.link.href = solution;
                    this.link.dispatchEvent(evt);
                } catch (error) {
                    this.fallback.innerHTML = "Right-click and select 'Save-As'<br><img src=" + solution + "></img>";
                    this.fallback.style = "display: block;";
                    this.fallback.appendChild(fbClear);
                }
            },
            load: function (lock) {
                var data = '',
                    i = n = 0,
                    smlState = {};
                smlState = JSON.parse(b642str(data.substr(data.indexOf("abcdef") + 6)));
                if (lock !== void(0) && Array.isArray(lock)) {
                    for (i = 0, n = lock.length; i < n; i++) {
                        if (isNan(lock[i]/2)) {
                            smlState[lock[i]] = void(0);
                        } else{
                            smlState[lock[i]] = 0;
                        }
                    }
                }
                for (i = 0; i < n; i++)
                {

                }
            }
        };
        this.state = {
            name: "",
            flipVert: false,
            flipHorz: false,
            value: 0,
            embed: true
        };
        state = this.state;
        this.Init = function (path) {

        };
        this.Update = function () {

        };
        Update = this.update;
        this.Make = function (name, color, type, src, data) {
            var item = new Item(name, color, type, src, data);
            inventory.types.type = inventory.types.type || [];
            item.tID = inventory.types.type.length;
            inventory.types.type.push(item);
            if (inventory.ids[item.ID] === void (0)) {
                inventory.ids[item.ID] = item;
            } else {
                throw "already defined";
            }
            inventory.colors[Normalize(color)] = item;
        };
        this.AddLayer = function (index, replace) {

        };
        this.RemLayer = function (index) {

        };
        this.MovLayer = function (index) {

        };
        this.SwpLayer = function (src, dst) {

        };
        this.ModLayer = function (index) {

        };
    }
    win.ttn = new TekTekNeo();
    return window.addEventListener ? window.addEventListener("load", win.ttn.init, 0) :
        (window.attachEvent ? window.attachEvent("onload", win.ttn.init) : window.onload = win.ttn.init);
})(window);
