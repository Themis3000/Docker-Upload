//handles animation
const svgElements = []
for (const svgId of ["eT1NXirqcaB2_to", "eT1NXirqcaB2_tr", "eT1NXirqcaB11_to", "eT1NXirqcaB11_tr", "eT1NXirqcaB17_to"]) {
    svgElements.push(document.getElementById(svgId))
}

function startAnimation() {
    for (const svgElement of svgElements) {
        svgElement.style.animation = `150ms linear 0s 1 alternate forwards ${svgElement.id}`
    }
}


function reverseAnimation() {
    for (const svgElement of svgElements) {
        svgElement.style.animation = ""
    }
}

const dropArea = document.body
const centerDrop = document.getElementById("drop")

// sets event handlers
centerDrop.addEventListener("mouseenter", handleEnter, false)
centerDrop.addEventListener("mouseleave", handleExit, false)

;['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
    dropArea.addEventListener(eventName, preventDefaults, false)
})

dropArea.addEventListener("dragenter", handleEnter, false)
dropArea.addEventListener("dragover", handleEnter, false)

dropArea.addEventListener("drop", handleExit, false)
dropArea.addEventListener("dragleave", handleExit, false)

function preventDefaults (e) {
    e.preventDefault()
    e.stopPropagation()
}

let entered = false
let stopped = true

function handleEnter() {
    if (stopped) {
        stopped = false
        startAnimation()
    }
    
    entered = true
}

function handleExit() {
    entered = false

    setTimeout(() => {
        if (!entered && !stopped) {
            stopped = true
            reverseAnimation()
        }
    }, 200)
}


//handle uploading
const statusDiv = document.getElementById("status")
const centerUploading = document.getElementById("uploading")

function submitFiles(files) {
    const access_key = window.prompt("Please input your access key:", "")

    const data = new FormData()

    for (file of files) {
        data.append(file.name, file)
    }

    const xhr = new XMLHttpRequest()
    xhr.open("POST", "/upload")
    xhr.upload.addEventListener("progress", (e) => {
        const percent = e.lengthComputable ? (e.loaded / e.total) * 100 : 0
        statusDiv.style.width = `${percent}%`
        statusDiv.innerHTML = `${percent.toFixed(1)}%`

        if (percent === 100) {
            window.alert("Upload complete")
            showHome()
            statusDiv.style.width = "0"
            statusDiv.innerHTML = ""
        }
    })

    xhr.onerror = () => {
        window.alert("Failed upload. Make sure your access key is correct.")
        showHome()
    }

    xhr.setRequestHeader("key", access_key)
    xhr.send(data)

    showUpload()
}


async function getAllFileEntries(dataTransferItemList) {
    let fileEntries = []
    // Use BFS to traverse entire directory/file structure
    let queue = []
    // Unfortunately dataTransferItemList is not iterable i.e. no forEach
    for (let i = 0; i < dataTransferItemList.length; i++) {
        queue.push(dataTransferItemList[i].webkitGetAsEntry())
    }
    while (queue.length > 0) {
        let entry = queue.shift()
        if (entry.isFile) {
            fileEntries.push(entry)
        } else if (entry.isDirectory) {
            queue.push(...await readAllDirectoryEntries(entry.createReader()))
        }
    }
    return fileEntries
}
  
// Get all the entries (files or sub-directories) in a directory 
// by calling readEntries until it returns empty array
async function readAllDirectoryEntries(directoryReader) {
    let entries = []
    let readEntries = await readEntriesPromise(directoryReader)
    while (readEntries.length > 0) {
        entries.push(...readEntries)
        readEntries = await readEntriesPromise(directoryReader)
    }
    return entries
}
  
// Wrap readEntries in a promise to make working with readEntries easier
// readEntries will return only some of the entries in a directory
// e.g. Chrome returns at most 100 entries at a time
async function readEntriesPromise(directoryReader) {
    try {
        return await new Promise((resolve, reject) => {
            directoryReader.readEntries(resolve, reject)
        })
    } catch (err) {
        console.log(err)
    }
}

async function toFilePromise(fileEntry) {
    return new Promise((resolve) => {
        fileEntry.file(resolve)
    })
}

function showHome() {
    centerDrop.style.display = "flex"
    centerUploading.style.display = "none"
}

function showUpload() {
    centerDrop.style.display = "none"
    centerUploading.style.display = "flex"
}

centerDrop.addEventListener("click", () => {
    const input = document.createElement("input")
    input.setAttribute("type", "file")
    input.setAttribute("multiple", "true")
    input.setAttribute("name", "file")

    input.addEventListener("change", () => {
        submitFiles(input.files)
        input.remove()
    }, false)

    input.click()
    return false
}, false)

dropArea.addEventListener("drop", async (e) => {
    let files = []
    let items = await getAllFileEntries(e.dataTransfer.items)

    for (const item of items) {
        file = await toFilePromise(item)
        files.push(file)
    }

    submitFiles(files)
}, false)
