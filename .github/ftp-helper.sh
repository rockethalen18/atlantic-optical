#!/usr/bin/env bash
# Helper for the deploy workflow: runs an lftp command and retries on
# transient FTP failures (shared hosting occasionally rejects a login or
# drops the control connection).

# ftp_run "<lftp commands>"
# Uses $FTP_USER, $FTP_PASS, $FTP_HOST from the environment.
ftp_run() {
  local attempts="${FTP_ATTEMPTS:-5}"
  local delay="${FTP_RETRY_DELAY:-30}"
  local command="$1"
  local i=1

  while [ "$i" -le "$attempts" ]; do
    if lftp -e "set ssl:verify-certificate no; set net:max-retries 3; set net:timeout 30; ${command}; bye" \
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
