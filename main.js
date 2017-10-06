function allowDrop(ev) {
    ev.preventDefault();
}

function drag(ev) {
    ev.dataTransfer.setData('text', ev.target.id);
}

function drop(ev) {
    ev.preventDefault();
    let data = ev.dataTransfer.getData('text');
    let ul = $('#' + data).parent().parent();
    if ($('#' + ev.target.id).parent().children('ul').length > 0) {
        $('#' + ev.target.id).parent().children('ul')[0].append($('#' + data).parent()[0]);
    } else {
        let id = generateUUID();
        $('#' + ev.target.id).parent().append(`<ul id='${id}'></ul>`);
        $('#' + id).append($('#' + data).parent()[0]);
    }
    if (ul.children('li').length === 0) {
        ul.remove();
    }
    updateClass();
}

function generateUUID() { // Public Domain/MIT
    var d = new Date().getTime();
    if (typeof performance !== 'undefined' && typeof performance.now === 'function') {
        d += performance.now(); //use high-precision timer if available
    }
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
        var r = (d + Math.random() * 16) % 16 | 0;
        d = Math.floor(d / 16);
        return (c === 'x' ? r : (r & 0x3 | 0x8)).toString(16);
    });
}

function getLiTagWithTextInSpan(liId, text, spanId, style = '') {
    return `<li id ='${liId}'><span id='${spanId}' class='${style}' draggable='true' ondragstart='drag(event)' ondragover='allowDrop(event)' ondrop='drop(event)'>${text}</span></li>`;
}

function generateTree(input) {
    var $coveringdiv = $('.cover');
    let id = generateUUID();
    let liId = generateUUID();
    let spanId = generateUUID();
    $coveringdiv.append(`<ul id='${id}'></ul>`);
    //debugger;
    $('#' + id).append(getLiTagWithTextInSpan(liId, input.root, spanId, "Collapsable root parent"));
    id = generateUUID();
    $('#' + liId).append(`<ul id='${id}'></ul>`);
    generateNodes(input.data, $('#' + id))
}

function generateNodes(data, ul) {
    data.forEach(function (element) {
        let liId = generateUUID();
        let spanId = generateUUID();
        ul.append(getLiTagWithTextInSpan(liId, element.name, spanId, 'Collapsable'));
        if (element.children) {
            let ulId = generateUUID();
            $('#' + liId).append(`<ul id='${ulId}'></ul>`);
            generateNodes(element.children, $('#' + ulId));
        }
    }, this);
}

function updateClass() {
    $('.cover span').each(function () {
        if ($(this).parent().children('ul').length > 0) {
            $(this).removeClass('leaf');
            $(this).addClass('parent');
        } else {
            $(this).removeClass('parent');
            $(this).addClass('leaf');
        }
    });
}