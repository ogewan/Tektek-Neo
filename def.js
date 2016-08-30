(function (win) {
    function TekTekNeo(path) {
        var countItem = 0,
            countActiveLayer = 0,
            state = 0,
            Update = 0,
            IsMulti = function (type) {
                var typeMap = {};
                return typeMap[type] || false;
            },
            Normalize = function (color) {
                var colorMap = {
                    pink: 0xFFC0CB,
                    red: 0xFF0000,
                    magenta: 0xFF00FF,
                    brown: 0x8B4513,
                    orange: 0xFFA500,
                    yellow: 0xFFFF00,
                    green: 0x00FF00,
                    cyan: 0x00FFFF,
                    blue: 0x0000FF,
                    navy: 0x0000CD,
                    violet: 0x9400D3,
                    black: 0x000000,
                    grey: 0xBEBEBE,
                    white: 0xFFFFFF
                },
                    res = 0;
                if (typeof color == 'string') {
                    res = colorMap[color.toLowerCase()];
                } else if ((Array.isArray(color) && color.length == 3) || !IsNan(color / 2)) {
                    if (Array.isArray(color)) {
                        res = color[0] * 65536 + color[1] * 256 + color[2];
                    } else {
                        res = color;
                    }
                    var select = "";
                    var value = 0xFFFFFFFF;
                    for (var key in colorMap) {
                        if (colorMap.hasOwnProperty(key)) {
                            if (value > Math.abs(colorMap[key] - res)) {
                                value = Math.abs(colorMap[key] - res);
                                select = key;
                            }
                        }
                    }
                    res = colorMap[select];
                } else {
                    res = 0;
                }
                return res;
            },
            str2b64 = function (str) {
                return btoa(unescape(encodeURIComponent(str)));
            },
            b642str = function (b64) {
                return decodeURIComponent(escape(window.atob(b64)));
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
            Layer = function (type, multi, hue, levels, fVert, fHorz, item, canvas) {
                this.type = type || -1;
                this.multi = multi || IsMulti(this.type);
                this.hue = hue || 0;
                this.levels = levels || "";
                this.flipVert = fVert;
                this.flipHorz = fHorz;
                this.item = item || -1;
                this.canvas = canvas || document.createElement("canvas");
                this.canvas.class = "layer";
                this.ctx = this.canvas.getContext("2d");
                this.tID = -1;
                this.enable = true;
                //locks
                this.alLock = false;
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
                    var n = 0,
                        i = 0,
                        raw = "",
                        strstate = "",
                        solution = "",
                        compItems = [],
                        evt = 0;
                    for (i = 0, n = canvas.zindicies.length; i < n; i++) {
                        if (canvas.zindicies[i].enable) {
                            this.canvas.drawImage(canvas.zindicies[i], 0, 0);
                        }
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
                load: function (data) {
                    smlState = JSON.parse(b642str(data.substr(data.indexOf("abcdef") + 6)));
                    var cnvcur = canvas.zindicies,
                        smlcur = smlState.items,
                        newID = 0,
                        maxSta = canvas.zindicies.length,
                        maxSml = smlState.items.length,
                        newlayers = [],
                        newTypeMap = {},
                        i = 0,
                        j = 0,
                        n = 0,
                        SLI = false,
                        smlState = {},
                        cursor = {},
                        handl = {},
                        cnvcursor = {},
                        smlcursor = {};

                    if (!state.GLock) {
                        //stateful state properties
                        state.name = (state.GNmLock) ? state.name : smlState.name;
                        state.flipVert = (state.GFhLock) ? state.flipVert : smlState.flipVert;
                        state.flipHorz = (state.GHoLock) ? state.flipHorz : smlState.flipHorz;

                        //stateful layer properties
                        //remove any layer that is unlocked
                        SLI = state.LockInherit;
                        for (n = 0; n < maxSta; n++) {
                            cnvcursor = cnvcur[n];
                            if (!(cnvcursor.alLock ||
                                cnvcursor.itLock || cnvcursor.huLock || cnvcursor.fvLock ||
                                cnvcursor.fhLock || cnvcursor.itLock)) {
                                cnvcursor.canvas.parentNode.removeChild(cnvcursor.canvas);
                                cnvcur.splice(n, 1);
                                maxSta = canvas.zindicies.length;
                                n--;
                            }
                        }

                        while (j < maxSml) {
                            cnvcursor = cnvcur[i];
                            smlcursor = smlcur[j];
                            if (cnvcursor.alLock) {
                                newLayersID = newLayers[newLayers.push(cnvcursor) - 1];
                                cnvcur[i] = {};
                                i++;
                            } else {
                                cnvcursor = {};
                                for (n = 0; n < maxSta; n++) {
                                    if (smlcursor.type == cnvcur[n].type) {
                                        cnvcursor = cnvcur[n];
                                        break;
                                    }
                                }
                                newLayersID = newLayers[newLayers.push(new Layer(
                                    (cnvcursor.itLock) ? cnvcursor.item.type : smlcursor.item.type,
                                    void (0),
                                    (cnvcursor.huLock) ? cnvcursor.hue : smlcursor.hue,
                                    (cnvcursor.fvLock) ? cnvcursor.flipVert : smlcursor.flipVert,
                                    (cnvcursor.fhLock) ? cnvcursor.flipHorz : smlcursor.flipHorz,
                                    (cnvcursor.itLock) ? cnvcursor.item : smlcursor.item
                                )) - 1];
                                newLayersID.enable = smlcursor.enable;
                                cnvcursor.canvas.parentNode.removeChild(cnvcursor.canvas);
                                if (SLI) {
                                    newLayersID.alLock = smlcursor.alLock;
                                    newLayersID.huLock = smlcursor.huLock;
                                    newLayersID.leLock = smlcursor.leLock;
                                    newLayersID.fvLock = smlcursor.fvLock;
                                    newLayersID.fhLock = smlcursor.fhLock;
                                    newLayersID.itLock = smlcursor.itLock;
                                }
                                cnvcur[n] = {};
                                smlcur[j] = {};
                                j++;
                            }
                            if (newTypeMap[newLayersID.type] === void (0)) {
                                newTypeMap[newLayersID.type] = [newLayersID];
                                newLayersID.tID = 0;
                            } else {
                                newLayersID.tID = newTypeMap[newLayersID.type].push(newLayersID);
                            }
                        }

                        canvas.zindicies = newLayers;
                        canvas.types = newTypeMap;

                        if (state.LockInherit) {
                            state.LockInherit = smlState.LockInherit;
                            state.GLock = smlState.GLock;
                            state.GFhLock = smlState.GFhLock;
                            state.GHoLock = smlState.GHoLock;
                            state.GNmLock = smlState.GNmLock;
                        }
                    }
                }
            },
            auto = {
                toID: 0,
                time: 0,
                init: function (restore) {
                    if (typeof (Storage) !== void (0)) {
                        if (restore) {
                            auto.load();
                        }
                        time = 10000;
                        toID = win.setTimeout(auto.save, time);
                    } else {
                        console.log("TTN: This browser does not support Web Storage");
                    }
                },
                save: function () {
                    var strstate = '';
                    win.clearTimeout(toID);
                    state.items = canvas.zindicies;
                    strstate = JSON.stringify(state);
                    state.items = void (0);
                    localStorage.TTNState = strstate;
                    toID = win.setTimeout(auto.save, time);
                },
                load: function () {
                    var data = JSON.parse(localStorage.TTNState),
                        cnvcur = canvas.zindicies,
                        ditcur = data.items,
                        newID = {};
                    canvas.types = {};
                    for (var i = 0; i < cnvcur.length; i++) {
                        cnvcur[i].canvas.parentNode.removeChild(cnvcur[i].canvas);
                    }
                    canvas.zindicies = [];
                    for (var j = 0; j < ditcur.length; j++) {
                        newID = canvas.zindicies[canvas.zindicies.push(new Layer(
                            ditcur[j].item.type,
                            ditcur[j].multi,
                            ditcur[j].hue,
                            ditcur[j].flipVert,
                            ditcur[j].flipHorz,
                            ditcur[j].item
                        ))];
                        newID.enable = ditcur[j].enable;

                        if (canvas.types[newID.type] === void (0)) {
                            canvas.types[newID.type] = [newID];
                            newID.tID = 0;
                        } else {
                            newID.tID = canvas.types[newID.type].push(newID);
                        }
                    }
                },
                empt: function () {
                    localStorage.removeItem(TTNState);
                }
            };
        this.state = {
            name: "",
            flipVert: false,
            flipHorz: false,
            value: 0,
            budget: 0,
            LockInherit: false,
            GLock: false,
            GFhLock: false,
            GHoLock: false,
            GNmLock: false,
            embed: true //Includes data such as state and layers into the saved png
        };
        state = this.state;
        this.Init = function (path) {
            (function loadXMLDoc() {
                var xmlhttp;
                if (window.XMLHttpRequest) {
                    xmlhttp = new XMLHttpRequest();
                } else {
                    // code for older browsers
                    xmlhttp = new ActiveXObject("Microsoft.XMLHTTP");
                }
                xmlhttp.onreadystatechange = function () {
                    if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
                        var prelim = JSON.parse(xmlhttp.responseText);
                        for (var i = 0; i < prelim.length; i++) {
                            Make(prelim[i].name, prelim[i].color, prelim[i].type,
                                prelim[i].src, prelim[i].data);
                        }
                    } else if (xmlhttp.readyState == 4 && xmlhttp.status == 404) {
                        console.log("No Inventory Found");
                    }
                };
                xmlhttp.open("GET", path || "inventory.json", true);
                xmlhttp.send();
            })();
        };
        this.Update = function () {

        };
        Update = this.update;
        this.Make = function (name, color, type, src, data) {
            var item = new Item(name, Normalize(color), type, src, data);
            inventory.types.type = inventory.types.type || [];
            item.tID = inventory.types.type.length;
            inventory.types.type.push(item);
            if (inventory.ids[item.ID] === void (0)) {
                inventory.ids[item.ID] = item;
            } else {
                throw "already defined";
            }
            inventory.colors[item.color] = item;
        };
        Make = this.Make;
        this.Export = function () {
            var
                solution = JSON.stringify(inventory);
            evt = 0,
                link = document.createElement("A"),
                fallback = document.createElement("DIV"),
                fbClear = document.createElement("A");
            link.style = "display: none;";
            fallback.style = "display: none;";
            fallback.id = "ex_fallback";
            fbClear.innerHTML = "Clear";
            fbClear.addEventListener("click", function () {
                var self = document.getElementById("ex_fallback");
                self.parentNode.removeChild(self);
            });
            document.body.appendChild(link);
            document.body.appendChild(fallback);
            try {
                evt = new MouseEvent("click", {
                    bubbles: true,
                    cancelable: true,
                    view: window
                });
                link.download = "inventory.json";
                link.href = solution;
                link.dispatchEvent(evt);
                link.parentNode.removeChild(link);
            } catch (error) {
                fallback.innerHTML = "Right-click and select 'Save-As'<br><img src=" + solution + "></img>";
                fallback.style = "display: block;";
                fallback.appendChild(fbClear);
            }
        };
        Export = this.Make;
        Regenerate = function (){
            canvas.types = {};
            for (var j = 0; j < canvas.zindicies.length; j++) {
                if (canvas.types[canvas.zindicies[j].type] === void (0)) {
                    canvas.types[canvas.zindicies[j].type] = [canvas.zindicies[j]];
                    canvas.zindicies[j].tID = 0;
                } else {
                    canvas.zindicies[j].tID = canvas.types[canvas.zindicies[j].type].push(canvas.zindicies[j]);
                }
            }
        }
        this.AddLayer = function (item) {
            var cnvNEW = canvas.zindicies[canvas.zindicies.push(new Layer(
                void (0), void (0), void (0), void (0), void (0), item)) - 1];

            if (canvas.types[cnvNEW.type] === void (0)) {
                canvas.types[cnvNEW.type] = [cnvNEW];
                cnvNEW.tID = 0;
            } else {
                cnvNEW.tID = canvas.types[cnvNEW.type].push(cnvNEW);
            }
            auto.save();
        };
        this.RemLayer = function (index) {
            //remove layer
            canvas.zindicies.splice(index, 1);
            Regenerate();
            auto.save();
        };
        this.MovLayer = function (index, pos) {
            //move layer to pos
            canvas.zindicies.splice(pos, 0, canvas.zindicies.splice(index, 1));
            Regenerate();
            auto.save();
        };
        this.SwpLayer = function (src, dst) {
            //swap src layer with dst layer
            var LSrc = canvas.zindicies.splice(src, 1, {});
            var LDst = canvas.zindicies.splice(dst, 1, {});
            canvas.zindicies.splice(src, 1, LDst);
            canvas.zindicies.splice(dst, 1, LSrc);
            Regenerate();
            auto.save();
        };
        this.ModLayer = function (index) {
            //modify layer
            var target = canvas.zindicies[index];
            //auto.save();
            return target;
        };
        this.ReoLayer = function () {
            //reorder layers to standard order
            canvas.zindicies.sort(function (a, b) {
                return a - b;
            });
            Regenerate();
            auto.save();
        };
    }
    win.ttn = new TekTekNeo();
    return window.addEventListener ? window.addEventListener("load", win.ttn.init, 0) :
        (window.attachEvent ? window.attachEvent("onload", win.ttn.init) : window.onload = win.ttn.init);
})(window);
