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
    }, 10)
}


//handle uploading
function createInput() {
    const input = document.createElement("input")
    input.setAttribute("type", "file")
    input.setAttribute("multiple", "true")
    input.setAttribute("name", "file")

    input.addEventListener("change", () => {
        submitInput(input)
    }, false)

    return input
}

function submitInput(input) {
    const data = new FormData()

    for (file of input.files) {
        data.append(file.name, file)
    }

    const xhr = new XMLHttpRequest()
    xhr.open("POST", "/upload")
    xhr.upload.addEventListener("progress", (e) => {
        const percent = e.lengthComputable ? (e.loaded / e.total) * 100 : 0
        console.log(percent.toFixed(2))
    })

    xhr.send(data)
}

centerDrop.addEventListener("click", () => {
    const input = createInput()
    input.click()
    return false
}, false)

dropArea.addEventListener("drop", (e) => {
    const input = createInput()
    input.files = e.dataTransfer.files
    submitInput(input)
}, false)
