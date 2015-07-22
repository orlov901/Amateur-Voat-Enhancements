AVE.Storage = {
    Prefix: "AVE_",

    Data: null,

    GetValue: function (key, def) {
        if (!this.Data) { return null; }
        //AVE.Utils.SendMessage({ request: "Storage", type: "GetValue", key: key});

        var val = this.Data[key];
        if (val == undefined) {
            if (def == undefined) {
                return null;
            } else { return def }
        } return val;
    },

    SetValue: function (key, val) {
        if (!this.Data) { return null; }
        AVE.Utils.SendMessage({ request: "Storage", type: "SetValue", key: key, value: val });

        this.Data[key] = val;
    },

    DeleteValue: function (key) {
        if (!this.Data) { return null; }
        AVE.Utils.SendMessage({ request: "Storage", type: "DeleteValue", key: key });

        delete this.Data[key];
    },
};