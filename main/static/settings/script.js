var lastIndex = 0
var enterSizeInput
var value
var options = []

const cancelBlock = document.querySelector('.cancel-block')
const container = document.querySelectorAll('.container')
const pages = document.querySelectorAll('.pages')
const enterSizeInputs = document.querySelectorAll('.inner-enter-size-input')
const link = document.createElement('a')

function pageClick(index) {
    if (index != lastIndex) {
        link.setAttribute('href', '#page' + index)
        link.click()

        pages[index].classList.add('clicked')
        pages[lastIndex].classList.remove('clicked')
        lastIndex = index
    }
}
pageClick(0)

function cancel() {
    cancelBlock.style.display = 'flex'
}

function settingsContinue() {
    cancelBlock.style.display = 'none'
}

function settingsExit() {
    tetrisLink = document.createElement('a')
    tetrisLink.href = localStorage.getItem('prevUrl')
    tetrisLink.click()
}

function changeSize(width, height) {
    options = []
    link.setAttribute('href', `/width${width}/height${height}`)
    link.click()
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