'use strict';

const { Adw, Gio, GObject, Gtk } = imports.gi;

const ExtensionUtils = imports.misc.extensionUtils;
const Extension = ExtensionUtils.getCurrentExtension();


/**
 * Panel Preferences
 */
const OP6PanelPreferences = GObject.registerClass({
    GTypeName: 'OP6PanelPreferences',
    Template: Extension.dir.get_child('prefs.ui').get_uri(),
    InternalChildren: [
        'clock_hide_date',
        'clock_move_left',
        'status_hide_volume',
    ],
}, class OP6PanelPreferences extends Adw.PreferencesPage {
    constructor(params = {}) {
        super(params);

        this._settings = ExtensionUtils.getSettings();

        // Clock Group
        this._settings.bind('clock-hide-date', this._clock_hide_date, 'active',
            Gio.SettingsBindFlags.DEFAULT);
        this._clock_hide_date.active = this._settings.get_boolean('clock-hide-date');

        this._settings.bind('clock-move-left', this._clock_move_left, 'active',
            Gio.SettingsBindFlags.DEFAULT);
        this._clock_move_left.active = this._settings.get_boolean('clock-move-left');

        // Status Group
        this._settings.bind('status-hide-volume', this._status_hide_volume, 'active',
            Gio.SettingsBindFlags.DEFAULT);
        this._status_hide_volume.active = this._settings.get_boolean('status-hide-volume');
    }
});


function init() {
    ExtensionUtils.initTranslations();
}

function fillPreferencesWindow(window) {
    const pages = [
        new OP6PanelPreferences(),
    ];

    for (const page of pages)
        window.add(page);
}
