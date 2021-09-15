# Docker-Upload
This project provides an easy way to allow people to upload files to you via a web interface, secured with an access code in order to prevent bad actors from discovering your web service and filling up your drives.

## Usage
Get the image

`docker pull themis3000/docker-upload:0.2.1`

Run the image

`docker run -d -p 5001:5001 -v /host/path:/app/uploads -e ACCESS_KEY=1234 themis3000/docker-upload:0.1.2`

Service is now available at port 5001 with the password 1234

## Features
- Supports drag and drop file/folder uploads
- Folders uploaded will retain the same directory tree/file names
- Password protected
- Supports uploading files via the system file browser