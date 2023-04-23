// SPDX-License-Identifier: GPL-3.0-or-later
// SPDX-FileCopyrightText: Andy Holmes <andrew.g.r.holmes@gmail.com>

/* exported init */

const ExtensionUtils = imports.misc.extensionUtils;
const Main = imports.ui.main;


/*
 * Panel Tweaks
 */
function moveDateMenu(state = true) {
    const centerBox = Main.panel?._centerBox;
    const leftBox = Main.panel?._leftBox;
    const dateMenu = Main.panel?.statusArea?.dateMenu;
    
    if (!centerBox || !leftBox || !dateMenu)
        return;
    
    if (state) {
        const centerChildren = centerBox.get_children();
      
        if (centerChildren.includes(dateMenu.container)) {
            centerBox.remove_child(dateMenu.container);
            Main.panel._leftBox.add_child(dateMenu.container);
        }
    } else {
        const leftChildren = leftBox.get_children();

        if (leftChildren.includes(dateMenu.container)) {
            leftBox.remove_child(dateMenu.container);
            centerBox.add_child(dateMenu.container);
        }

    }
}


class Extension {
    constructor(metadata) {
        this._metadata = metadata;
    }
  
    enable() {
        moveDateMenu(true);
    }
  
    disable() {
        moveDateMenu(false);
    }
}


/** */
function init(metadata) {
    ExtensionUtils.initTranslations();
  
    return new Extension(metadata);
}
