window.appendText = async function (text) {
    console.log(`Appending text: ${text}`);
    const textarea = chatgpt.getChatBox();
    if (textarea) {
        textarea.value += `\n${text}`;
        chatgpt.focusChatbar(); // Focus the input field after appending text
    } else {
        console.log('Input field not found.');
    }
}

window.openFileHeaderModal = function () {
    console.log('Opening file header modal...');
    const modal = document.createElement('div');
    modal.id = 'fileHeaderModal';
    modal.style.position = 'fixed';
    modal.style.top = '50%';
    modal.style.left = '50%';
    modal.style.transform = 'translate(-50%, -50%)';
    modal.style.backgroundColor = '#171717';
    modal.style.border = '1px solid #ccc';
    modal.style.padding = '20px';
    modal.style.zIndex = '1001';
    modal.style.boxShadow = '0px 0px 10px rgba(0,0,0,0.1)';
    modal.innerHTML = `
        <h2>Add File Header</h2>
        <form id="fileHeaderForm">
            <input type="checkbox" name="Title" id="title"><label for="title">Title</label><br>
            <input type="checkbox" name="Author" id="author"><label for="author">Author</label><br>
            <input type="checkbox" name="Date" id="date"><label for="date">Date</label><br>
            <input type="checkbox" name="Description" id="description"><label for="description">Description</label><br>
            <button type="button" id="submitFileHeader">Submit</button>
            <button type="button" id="cancelFileHeader">Cancel</button>
        </form>
    `;
    document.body.appendChild(modal);

    document.getElementById('cancelFileHeader').addEventListener('click', () => {
        console.log('File header modal canceled.');
        modal.remove();
    });

    document.getElementById('submitFileHeader').addEventListener('click', async () => {
        const form = document.getElementById('fileHeaderForm');
        let headerText = 'Generate a header for this code file which includes the following properties:\n\n';
        const checkboxes = form.querySelectorAll('input[type="checkbox"]:checked');
        checkboxes.forEach(checkbox => {
            headerText += `- ${checkbox.name}\n`;
        });
        await appendText(headerText);
        console.log('File header modal submitted.');
        modal.remove();
    });
}
