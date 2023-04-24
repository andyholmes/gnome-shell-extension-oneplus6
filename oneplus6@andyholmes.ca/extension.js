// SPDX-License-Identifier: GPL-3.0-or-later
// SPDX-FileCopyrightText: Andy Holmes <andrew.g.r.holmes@gmail.com>

/* exported init */

const { Gio } = imports.gi;

const ExtensionUtils = imports.misc.extensionUtils;
const Main = imports.ui.main;
const QuickSettings = imports.ui.quickSettings;


/*
 * Panel Tweaks
 */
function clockHideDate(state = true) {
    const _settings = Gio.Settings.new('org.gnome.desktop.interface');
    _settings.set_boolean('clock-show-date', !state);
}

function clockMoveLeft(state = true) {
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

function statusHideVolume (state = true) {
    const volume = Main.panel?.statusArea?.quickSettings?._volume;
    const original = QuickSettings.SystemIndicator.prototype._syncIndicatorsVisible;

    if (!volume)
        return;

    if (state) {
        volume._syncIndicatorsVisible = function () {};
        volume.visible = false;
    } else {
        volume._syncIndicatorsVisible = original;
        volume.visible = true;
    }
}


function _onClockAppearanceChanged(settings, key) {
    try {
        const hideDate = settings.get_boolean(key);
        clockHideDate(hideDate);
    } catch (e) {
        logError(e, 'Failed to change clock appearance');
    }
}

function _onClockPositionChanged(settings, key) {
    try {
        const moveLeft = settings.get_boolean(key);
        clockMoveLeft(moveLeft);
    } catch (e) {
        logError(e, 'Failed to change clock position');
    }
}

function _onVolumeAppearanceChanged(settings, key) {
    try {
        const hideVolume = settings.get_boolean(key);
        statusHideVolume(hideVolume);
    } catch (e) {
        logError(e, 'Failed to change volume position');
    }
}


/*
 * Extension
 */
class Extension {
    constructor(metadata) {
        this._metadata = metadata;
        this._defaults = {
            'clock-hide-date': false,
            'clock-move-left': false,
            'status-hide-volume': false,
        };
    }

    enable() {
        // Update the defaults
        try {
            const _settings = Gio.Settings.new('org.gnome.desktop.interface');
            const showDate = _settings.get_boolean('clock-show-date');
            this._defaults['clock-hide-date'] = !showDate;
        } catch (e) {
            logError(e, 'Failed to check clock appearance');
        }

        // Panel Preferences
        this._settings = ExtensionUtils.getSettings();
        this._settings.connect('changed::clock-hide-date',
            _onClockAppearanceChanged);
        _onClockAppearanceChanged(this._settings, 'clock-hide-date');

        this._settings.connect('changed::clock-move-left',
            _onClockPositionChanged);
        _onClockPositionChanged(this._settings, 'clock-move-left');

        this._settings.connect('changed::status-hide-volume',
            _onVolumeAppearanceChanged);
        _onVolumeAppearanceChanged(this._settings, 'status-hide-volume');
    }
  
    disable() {
        clockHideDate(this._defaults['clock-hide-date']);
        clockMoveLeft(this._defaults['clock-move-left']);
        statusHideVolume(this._defaults['status-hide-volume']);

        this._settings.run_dispose();
        this._settings = null;
    }
}


/** */
function init(metadata) {
    ExtensionUtils.initTranslations();
  
    return new Extension(metadata);
}
