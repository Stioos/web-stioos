#!/usr/bin/env python3
"""Double-fork daemonizer for the Django dev server — survives the
sandbox's per-command process reaping (same technique as the project's
.zscripts/daemon-start.py used for the Next.js server).

Usage: python3 daemon.py
"""
import os
import sys

LOG = "/tmp/django.log"
CMD = [sys.executable, "manage.py", "runserver", "0.0.0.0:8000", "--noreload"]


def daemonize_and_exec(cmd):
    devnull_fd = os.open(os.devnull, os.O_RDONLY)
    log_fd = os.open(LOG, os.O_WRONLY | os.O_CREAT | os.O_APPEND, 0o644)
    pid = os.fork()
    if pid == 0:
        os.setsid()
        p2 = os.fork()
        if p2 == 0:
            os.chdir(os.path.dirname(os.path.abspath(__file__)))
            os.dup2(devnull_fd, 0)
            os.dup2(log_fd, 1)
            os.dup2(log_fd, 2)
            os.close(devnull_fd)
            os.close(log_fd)
            os.execvp(cmd[0], cmd)
        os._exit(0)
    os.waitpid(pid, 0)


if __name__ == "__main__":
    daemonize_and_exec(CMD)
    print("django daemon started:", " ".join(CMD))
