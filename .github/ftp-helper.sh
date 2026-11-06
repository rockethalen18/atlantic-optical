#!/usr/bin/env bash
# Helper for the deploy workflow: runs an lftp command and retries on
# transient FTP failures.
#
# The shared host only accepts a limited number of FTP sessions at a time and
# occasionally drops the control connection during a long transfer, so the
# whole deployment is sent through a SINGLE lftp session (see deploy.yml) and
# retried as a whole. lftp's mirror is incremental, so a retry only re-sends
# what is still missing.

# ftp_run "<lftp commands>"
# Uses $FTP_USER, $FTP_PASS, $FTP_HOST from the environment.
ftp_run() {
  local attempts="${FTP_ATTEMPTS:-6}"
  local delay="${FTP_RETRY_DELAY:-45}"
  local command="$1"
  local i=1

  while [ "$i" -le "$attempts" ]; do
    if lftp -e "set ssl:verify-certificate no; set net:max-retries 30; set net:retry-delay 15; set net:timeout 60; set xfer:clobber true; ${command}; bye" \
             -u "$FTP_USER,$FTP_PASS" "$FTP_HOST"; then
      echo "FTP operation succeeded on attempt ${i}/${attempts}"
      return 0
    fi
    echo "FTP operation failed on attempt ${i}/${attempts} - retrying in ${delay}s" >&2
    i=$((i + 1))
    if [ "$i" -le "$attempts" ]; then
      sleep "$delay"
    fi
  done

  echo "FTP operation failed after ${attempts} attempts" >&2
  return 1
}
