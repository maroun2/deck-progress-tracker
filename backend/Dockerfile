# Decky CLI (`decky plugin build`, which the plugin store runs) builds this
# image and runs it with backend/ at /backend, the plugin root at /plugin and
# the zip's bin/ directory at /backend/out.
#
# Nothing here is compiled: the image only runs pip, which installs the
# pinned, hash-checked, pure-Python wheels from requirements.txt into
# bin/py_modules (see install-py-deps.sh). The vanilla SteamOS base image
# has Python but no pip.
FROM ghcr.io/steamdeckhomebrew/holo-base:latest

RUN pacman -Sy --noconfirm --needed python-pip && pacman -Scc --noconfirm

# entrypoint.sh should always be located in the backend folder
ENTRYPOINT [ "/backend/entrypoint.sh" ]
