const socket = io()

const btnForm_submit = document.getElementById('btnForm_submit')

btnForm_submit.addEventListener('click', (e) => {
    //console.log(e.target.value)
    e.preventDefault()
    let prod = {
        title: document.getElementById('title').value,
        price: document.getElementById('price').value,
        thumbnail: document.getElementById('thumbnail').value
    }
    document.getElementById('title').value = ""
    document.getElementById('price').value = ""
    document.getElementById('thumbnail').value = ""

    socket.emit('newProduct', prod)
})

socket.on('products', (data) => {
    let content = data.reduce((a, b, idx) => a +
        `<tr>
            <td>${b.title}</td>
            <td>$${b.price}</td>
            <td><img src="${b.thumbnail}" alt="${b.title}" width="32" height="32" /></td>
        </tr>`, ` `)
    document.getElementById('productsTable').innerHTML = content
})



const btnChat_submit = document.getElementById('btnChat_submit')

btnChat_submit.addEventListener('click', (e) => {
    //console.log(e.target.value)
    e.preventDefault()
    let message = {
        author: document.getElementById('author').value,
        date: (new Date()).toLocaleString(),
        text: document.getElementById('message').value
    }
    document.getElementById('message').value = ""

    socket.emit('newMessage', message)
})

socket.on('messages', (data) => {
    let content = data.reduce((a, b, idx) => a +
        `<div class="d-block">
        <strong class="d-inline text-primary">${b.author}</strong> 
        <div class="d-inline text-danger">${b.date}</div> : 
        <em class="d-inline text-success"> ${b.text}</em>
    </div>
    `, ` `)
    document.getElementById('lastMessage').innerHTML = content
})


/**
 * Check Email from input with id="author"
 */

const inputAuthor = document.getElementById('author')

inputAuthor.addEventListener('blur', (e) => {
    const re = /^(([^<>()[\]\.,;:\s@\"]+(\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i
    validateSwap(re.test(e.target.value), inputAuthor)
    checkStatusSubmitButton()
})


/**
 * Check messsage from input with id="message"
 */

const inputMessage = document.getElementById('message')

inputMessage.addEventListener('blur', (e) => {
    validateSwap(e.target.value.length, inputMessage)
    checkStatusSubmitButton()
})

const validateSwap = (isValid, elementNode) => {
    if (isValid) {
        elementNode.classList.remove('is-invalid')
        elementNode.classList.add('is-valid')
    } else {
        elementNode.classList.remove('is-valid')
        elementNode.classList.add('is-invalid')
    }
}


/**
 * Check status for submit button of chat.
 */

const checkStatusSubmitButton = () => {
    if (inputAuthor.classList.contains('is-valid') && inputMessage.classList.contains('is-valid')) {
        btnChat_submit.removeAttribute('disabled')
    } else {
        btnChat_submit.setAttribute('disabled', 'true')
    }
}





