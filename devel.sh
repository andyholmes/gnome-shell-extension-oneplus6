#!/usr/bin/sh -e

EXTENSION_UUID=oneplus6@andyholmes.ca
EXTENSION_SRCDIR="$(pwd)/${EXTENSION_UUID}"
EXTENSION_ZIP="$(pwd)/${EXTENSION_UUID}.shell-extension.zip"


#
# Helper Functions
#
pack_extension() {
    gnome-extensions pack --force \
                          --extra-source "${EXTENSION_SRCDIR}"/prefs.ui \
                     "${EXTENSION_SRCDIR}"
}

install_extension() {
    pack_extension && \
    gnome-extensions install --force "${EXTENSION_ZIP}"
}

test_extension() {
    export MUTTER_DEBUG_DUMMY_MODE_SPECS=1366x768

    install_extension && \
    dbus-run-session -- gnome-shell --nested --wayland
}


#
# Usage
#
if [ "${1}" = "pack" ]; then
    pack_extension;
elif [ "${1}" = "install" ]; then
    install_extension;
elif [ "${1}" = "test" ]; then
    test_extension;
else
    echo "Usage: ${0} [pack|install|test]";
fi