// SPDX-License-Identifier: GPL-3.0-or-later
// SPDX-FileCopyrightText: Andy Holmes <andrew.g.r.holmes@gmail.com>

/* exported init */

const ExtensionUtils = imports.misc.extensionUtils;


class Extension {
    constructor(metadata) {
        this._metadata = metadata;
    }
  
    enable() {
    }
  
    disable() {
    }
}


/** */
function init(metadata) {
    ExtensionUtils.initTranslations();
  
    return new Extension(metadata);
}
