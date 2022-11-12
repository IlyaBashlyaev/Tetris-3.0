var lastIndex = 0
var enterSizeInput
var value
var options = []

const cancelBlock = document.querySelector('.cancel-block')
const container = document.querySelectorAll('.container')
const pages = document.querySelectorAll('.pages')
const enterSizeInputs = document.querySelectorAll('.inner-enter-size-input')

function cancel() {
    cancelBlock.style.display = 'flex'
}

function settingsContinue() {
    cancelBlock.style.display = 'none'
}

function settingsExit() {
    window.location.href = '/'
}

function changeSize(width, height) {
    options = []
    window.location.href = `/width${width}/height${height}`
}

function enterSize() {
    for (var index = 0; index < 2; index++) {
        input = enterSizeInputs[index]
        value = input.value

        if (value == '' || parseInt(value) < 5) {
            input.classList.add('wrong')
        }

        else {
            options.push(value)
        }
    }

    if (options.length == 2) {
        changeSize(options[0], options[1])
    }

    else {
        options = []
    }
}

function wrongClick(index) {
    input = enterSizeInputs[index]
    if (input.classList.contains('wrong')) {
        input.classList.remove('wrong')
    }
}