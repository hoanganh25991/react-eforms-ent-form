const childProcess = require("child_process")
const fs = require("fs")
const _ = console.log

const _c = {
  uploadTo: "/var/www/html/react-eforms-ent-form/build",
  remoteHost: "tinker.press"
}

// Build
_(`[INFO] Run buid`)
const buildLog = childProcess.execSync("yarn _build").toString()
_(`[INFO] Build log: ${buildLog}`)

// Upload
_(`[INFO] Upload build file`)
// This batch file do:
// 1. -mkdir (silent fail IF dir already exist)
// 2. put file
const uploadBatchFile = `
#!/usr/bin/env bash
-mkdir ${_c.uploadTo}
-mkdir ${_c.uploadTo}/static
# We have to add .htaccess put, cs buid/* NOT COVER it
# Silently continue if put fail
-put -R build/.htaccess ${_c.uploadTo}
put -R build/* ${_c.uploadTo}
exit`
// Create upload batch file
const uploadBatchFilePath = `${__dirname}/uploadBatchFile.config.sh`
fs.writeFileSync(uploadBatchFilePath, uploadBatchFile)
const uploadLog = childProcess.execSync(`sftp -b ${uploadBatchFilePath} root@${_c.remoteHost}`)
_(`[INFO] Upload log: ${uploadLog}`)
// Delete tmp upload batch file
fs.unlinkSync(uploadBatchFilePath)