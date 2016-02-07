AVE.Modules['UserInfoFixedPos'] = {
    ID: 'UserInfoFixedPos',
    Name: 'User-block fixes',
    Desc: 'Minor fixes to the userblock.',
    Category: 'Misc',

    Index: 200,
    Enabled: false,

    RunAt: 'banner',

    Store: {},

    Options: {
        Enabled: {
            Type: 'boolean',
            Value: true
        },
        DivideBlock: {
            Type: 'boolean',
            Value: false
        },
        ToggleBlock: {
            Type: 'boolean',
            Value: true
        },
        PersistentHide: {
            Type: 'boolean',
            Value: false
        },
        HidePoints: {
            Type: 'boolean',
            Value: false
        }
    },

    SavePref: function (POST) {
        this.Store.SetValue(this.Store.Prefix + this.ID, JSON.stringify(POST[this.ID]));
    },

    SetOptionsFromPref: function () {
        var _this = this;
        var Opt = _this.Store.GetValue(_this.Store.Prefix + _this.ID, "{}");

        if (Opt != undefined) {
            Opt = JSON.parse(Opt);
            $.each(Opt, function (key, value) {
                if (!_this.Options.hasOwnProperty(key)) {print("AVE: loading "+_this.ID+" > option key " +key+" doesn't exist");return true;}
                _this.Options[key].Value = value;
            });
        }
        _this.Enabled = _this.Options.Enabled.Value;
    },

    Load: function () {
        this.Store = AVE.Storage;
        this.SetOptionsFromPref();

        if (this.Enabled) {
            this.Start();
        }
    },

    bg: "",
    userBlockOriginalOffset: null,
    userBlockOriginalWidth: 0,
    HeaderFixed: false,

    Start: function () {
        if (!AVE.Utils.ListHeaderHeight) { AVE.Utils.ListHeaderHeight = $('#sr-header-area').height(); }

        if (AVE.Modules['HeaderFixedPos'] && AVE.Modules['HeaderFixedPos'].Enabled){ this.HeaderFixed = true; }

        var JqId1 = $('#header-account'),
            JqId2 = $("div#header-account > div.logged-in");
        //this.userBlockOriginalTopOffset = JqId1.offset().top;
        //this.SetAccountHeaderPosAsFixed();

        if (this.Options.DivideBlock.Value && JqId2.length > 0) {
            //Align header-account's content
            JqId2.css("text-align", "center");
            //Add a line return before the icons
            $("<br />").insertAfter("div#header-account > div.logged-in > span.separator:first");
            //Remove the, now useless, separator
            $("div#header-account > div.logged-in > span.separator:first").remove();    
        }

        if (this.Options.ToggleBlock.Value && $('#header-account:has(div.logged-in)').length > 0) {
            //Add arrow icon element
            JqId1.append('<div title="Hide user block" class="expanded" id="AVE_ToggleUserBlock"></div>');
            this.ToggleBlockListener();
        }

        if (this.Options.PersistentHide.Value) {
            $("div#AVE_ToggleUserBlock").click();
        }

        if (this.Options.HidePoints.Value){
            var html = $("a[title='Profile']")[0].outerHTML;
            $("span.user:first").html(html);
        }

        this.SetAltBackground();

        AVE.Utils.AddStyle('\
div#AVE_ToggleUserBlock{\
    background-position: center center;\
    background-repeat: no-repeat;\
    border: 1px solid #' + (AVE.Utils.CSSstyle === "dark" ? "222" : "DCDCDC") + ';\
    border-radius: 1em;\
    cursor:pointer;\
    float:right;\
    width: 14px;\
    height: 14px;\
}\
div#AVE_ToggleUserBlock.expanded{\
    /* SVG from Jquery Mobile Icon Set */\
    background-image: url("data:image/svg+xml;charset=US-ASCII,%3C%3Fxml%20version%3D%221.0%22%20encoding%3D%22iso-8859-1%22%3F%3E%3C!DOCTYPE%20svg%20PUBLIC%20%22-%2F%2FW3C%2F%2FDTD%20SVG%201.1%2F%2FEN%22%20%22http%3A%2F%2Fwww.w3.org%2FGraphics%2FSVG%2F1.1%2FDTD%2Fsvg11.dtd%22%3E%3Csvg%20version%3D%221.1%22%20id%3D%22Layer_1%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20xmlns%3Axlink%3D%22http%3A%2F%2Fwww.w3.org%2F1999%2Fxlink%22%20x%3D%220px%22%20y%3D%220px%22%20%20width%3D%2214px%22%20height%3D%2214px%22%20viewBox%3D%220%200%2014%2014%22%20style%3D%22enable-background%3Anew%200%200%2014%2014%3B%22%20xml%3Aspace%3D%22preserve%22%3E%3Cpolygon%20style%3D%22fill%3A%23DDD%3B%22%20points%3D%223.404%2C2.051%208.354%2C7%203.404%2C11.95%205.525%2C14.07%2012.596%2C7%205.525%2C-0.071%20%22%2F%3E%3C%2Fsvg%3E");\
}\
div#AVE_ToggleUserBlock.collapsed{\
    /* SVG from Jquery Mobile Icon Set */\
    background-image: url("data:image/svg+xml;charset=US-ASCII,%3C%3Fxml%20version%3D%221.0%22%20encoding%3D%22iso-8859-1%22%3F%3E%3C!DOCTYPE%20svg%20PUBLIC%20%22-%2F%2FW3C%2F%2FDTD%20SVG%201.1%2F%2FEN%22%20%22http%3A%2F%2Fwww.w3.org%2FGraphics%2FSVG%2F1.1%2FDTD%2Fsvg11.dtd%22%3E%3Csvg%20version%3D%221.1%22%20id%3D%22Layer_1%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20xmlns%3Axlink%3D%22http%3A%2F%2Fwww.w3.org%2F1999%2Fxlink%22%20x%3D%220px%22%20y%3D%220px%22%20%20width%3D%2214px%22%20height%3D%2214px%22%20viewBox%3D%220%200%2014%2014%22%20style%3D%22enable-background%3Anew%200%200%2014%2014%3B%22%20xml%3Aspace%3D%22preserve%22%3E%3Cpolygon%20fill%3D%22%23DDD%22%20points%3D%2214%2C5%209%2C5%209%2C0%205%2C0%205%2C5%200%2C5%200%2C9%205%2C9%205%2C14%209%2C14%209%2C9%2014%2C9%20%22%2F%3E%3Cg%3E%3C%2Fg%3E%3Cg%3E%3C%2Fg%3E%3Cg%3E%3C%2Fg%3E%3Cg%3E%3C%2Fg%3E%3Cg%3E%3C%2Fg%3E%3Cg%3E%3C%2Fg%3E%3Cg%3E%3C%2Fg%3E%3Cg%3E%3C%2Fg%3E%3Cg%3E%3C%2Fg%3E%3Cg%3E%3C%2Fg%3E%3Cg%3E%3C%2Fg%3E%3Cg%3E%3C%2Fg%3E%3Cg%3E%3C%2Fg%3E%3Cg%3E%3C%2Fg%3E%3Cg%3E%3C%2Fg%3E%3C%2Fsvg%3E");\
}\
.logged-in{\
    margin-bottom:2px;\
}\
div#header-account > div.logged-in{\
    background: ' + this.bg + '\
}\
/* Next is a fix for some custom styles */\
div#container {z-index: 1;}\
div#header-container {z-index: 2;}\
.modal-backdrop.in {display: none;}\
.modal#linkFlairSelectModal{top: 140px;}');

        this.Listeners();
    },

    SetAltBackground: function () {
        if(!AVE.Modules['InjectCustomStyle'] || !AVE.Modules['InjectCustomStyle'].Enabled){return;}

        var JqId = $("div#header-container");
        this.bg = JqId.css("background-color") + " " +
                  JqId.css("background-image") + " " +
                  JqId.css("background-repeat") + " " +
                  JqId.css("background-attachment") + " " +
                  JqId.css("background-position") + " " +
                  JqId.css("background-clip") + " " +
                  JqId.css("background-origin");

        if (JqId.css("background-color") === "transparent" &&
            JqId.css("background-image") === "none") {
            this.bg = $("div#header[role='banner']").css("background-color");
            if (this.bg === "transparent") {
                this.bg = $("#logged-in").css("background-color");

                if (this.bg === "transparent" &&
                    this.bg === $("[title='Profile']").css("color")) {
                    $("[title='Profile']").css("color");
                    this.bg = $("#header-account").css("background-color");

                    if (this.bg === "transparent") {
                        this.bg = $("div#header[role='banner']").css("background-color");

                        if (this.bg === "transparent") {
                            //If there is no colour nor any image set, we set a default value
                            this.bg = AVE.Utils.CSSstyle === "dark" ? "rgba(41, 41, 41, 0.80)" : "rgba(246, 246, 246, 0.80)";
                        }
                    }
                }
            }
        }
        $('div#header-account > div.logged-in').css("background", this.bg);
    },

    SetAccountHeaderPosAsFixed: function () {
        var JqId = $('#header-account');
        if ($(window).scrollTop() + (this.HeaderFixed ? AVE.Utils.ListHeaderHeight : 0) > this.userBlockOriginalOffset.top) {
            JqId.css('position', 'fixed')
                .css('top', (this.HeaderFixed ? AVE.Utils.ListHeaderHeight : 0) +"px")
                .css('left', this.userBlockOriginalOffset.left+"px")
                .css('right', this.userBlockOriginalOffset.right+"px")
                .css("text-align", "center")
                .css("height", "0px");
            $('.logged-in').css("background", AVE.Utils.CSSstyle == "dark" ? "rgba(41, 41, 41, 0.80)" : "rgba(246, 246, 246, 0.80)");
        } else {
            JqId.css('position', "")
                .css('top', "")
                .css('left', "")
                .css('right', "")
                .css("text-align", "")
                .css("height", "");
            $('.logged-in').css("background", "");
        }
    },

    ToggleBlockListener: function() {
        var JqId = $("div#AVE_ToggleUserBlock");
        JqId.on("click", function () {//
            if (JqId.hasClass("collapsed")) {//If user block is already hidden
                //Show expand icon
                JqId.removeClass("collapsed");
                JqId.addClass("expanded");
                //Change element's title
                JqId.attr("title", "Hide user block");
                //Show user block
                $('div#header-account > div.logged-in,div.logged-out').show();
                //Restore #header-account's default size
                $('div#header-account').css("width", "")
                    .css("height", "");
            } else {//If user block is visible
                //Show collapse icon
                JqId.removeClass("expanded");
                JqId.addClass("collapsed");
                //Change element's title
                JqId.attr("title", "Show user block");
                //Hide user block
                $('div#header-account > div.logged-in,div.logged-out').hide();
                //Set #header-account's size to be that of the toggle icon
                $('div#header-account').css("width", "14px")
                    .css("height", "14px");
            }
        });
    },

    Listeners: function () {
        var _this = this;
        $(window).ready(function () { _this.UpdateBlockData(); _this.SetAccountHeaderPosAsFixed();})
                 .on("scroll", function () { _this.SetAccountHeaderPosAsFixed();})
                 .on("resize", function () { _this.UpdateBlockData(); _this.SetAccountHeaderPosAsFixed();});
    },

    UpdateBlockData : function () {
        var JqId = $('#header-account');

        // Reset the block for an instant so that we don't get back the offset values we ourselves set.
        // If you don't see what I mean: comment out the next css calls, then resize the page while scrolled down
        JqId.css('position', "")
            .css('top', "")
            .css('left', "")
            .css('right', "")
            .css("text-align", "")
            .css("height", "");

        if (!this.userBlockOriginalOffset){
            this.userBlockOriginalOffset = JqId.offset();
            this.userBlockOriginalWidth = JqId.outerWidth();
        }
        else { this.userBlockOriginalOffset.left = JqId.offset().left; }

        this.userBlockOriginalOffset.right = Math.floor($(document).width() - (this.userBlockOriginalOffset.left + this.userBlockOriginalWidth + 1));
        if (this.userBlockOriginalOffset.right < 0){this.userBlockOriginalOffset.right = 0;}
    },

    AppendToPreferenceManager: { //Use to add custom input to the pref Manager
        html: function () {
            var _this = AVE.Modules['UserInfoFixedPos'];
            var htmlStr = "";
            htmlStr += '<input ' + (_this.Options.DivideBlock.Value ? 'checked="true"' : "") + ' id="DivideBlock" type="checkbox"/><label style="display:inline;" for="DivideBlock"> Account header separated - username and stats at the top, icons below</label>';
            htmlStr += '<br /><input ' + (_this.Options.ToggleBlock.Value ? 'checked="true"' : "") + ' id="ToggleBlock" type="checkbox"/><label style="display:inline;" for="ToggleBlock"> Show icon to toggle hide/show the user block</label>';
            htmlStr += '<br /><input ' + (_this.Options.PersistentHide.Value ? 'checked="true"' : "") + ' id="PersistentHide" type="checkbox"/><label style="display:inline;" for="PersistentHide"> Always hide the userblock</label>';
            htmlStr += '<br /><input ' + (_this.Options.HidePoints.Value ? 'checked="true"' : "") + ' id="HidePoints" type="checkbox"/><label style="display:inline;" for="HidePoints"> Hide contribution points</label>';

            return htmlStr;
        }
    }
};
