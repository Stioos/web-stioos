#!/usr/bin/env python3
"""Double-fork daemonizer: survives sandbox per-command process reaping."""
import os, sys

cmd = sys.argv[1:]
logfile = sys.argv[-1] if False else None

def daemonize_and_exec(cmd):
    log_path = '/home/z/my-project/dev.log'
    devnull_fd = os.open(os.devnull, os.O_RDONLY)
    log_fd = os.open(log_path, os.O_WRONLY | os.O_CREAT | os.O_APPEND, 0o644)
    pid = os.fork()
    if pid == 0:
        os.setsid()
        p2 = os.fork()
        if p2 == 0:
            os.chdir('/home/z/my-project')
            os.dup2(devnull_fd, 0)
            os.dup2(log_fd, 1)
            os.dup2(log_fd, 2)
            os.close(devnull_fd); os.close(log_fd)
            os.execvp(cmd[0], cmd)
        os._exit(0)
    os.waitpid(pid, 0)

if __name__ == '__main__':
    # usage: daemon-start.py -- <argv...>
    args = sys.argv[1:]
    if args and args[0] == '--':
        args = args[1:]
    daemonize_and_exec(args)
    print('daemon started:', ' '.join(args))
