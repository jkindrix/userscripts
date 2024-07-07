import { menuConfig } from './menu-config.js';
import { functionMap } from './function-map.js';

export function createContextMenu() {
    console.log('Creating context menu...');
    const menu = document.createElement('ul');
    menu.id = 'customContextMenu';
    menu.style.position = 'absolute';
    menu.style.display = 'none';
    menu.style.zIndex = '1000';
    menu.style.backgroundColor = '#171717';
    menu.style.border = '1px solid #ccc';
    menu.style.padding = '10px';
    menu.style.boxShadow = '0px 0px 10px rgba(0,0,0,0.1)';
    document.body.appendChild(menu);

    console.log('Building menu...');
    buildMenu(menu, menuConfig);
    console.log('Menu built.');

    document.addEventListener('click', () => {
        menu.style.display = 'none';
    });

    const inputField = chatgpt.getChatBox();
    if (inputField) {
        inputField.addEventListener('contextmenu', (event) => {
            event.preventDefault();

            // Ensure the menu is briefly displayed to measure its dimensions
            menu.style.display = 'block';
            const menuWidth = menu.offsetWidth;
            const menuHeight = menu.offsetHeight;
            menu.style.display = 'none';

            // Get the viewport dimensions
            const viewportWidth = window.innerWidth;
            const viewportHeight = window.innerHeight;

            // Calculate the desired position
            let top = event.pageY;
            let left = event.pageX;

            // Adjust position if menu overflows off the page
            if (top + menuHeight > viewportHeight) {
                top = viewportHeight - menuHeight;
            }
            if (left + menuWidth > viewportWidth) {
                left = viewportWidth - menuWidth;
            }

            // Ensure the menu does not go off the top or left edge
            top = Math.max(0, top);
            left = Math.max(0, left);

            // Apply the position to the menu
            menu.style.top = `${top}px`;
            menu.style.left = `${left}px`;
            menu.style.display = 'block';
        });
    } else {
        console.log('Input field not found.');
    }
}

function buildMenu(container, config) {
    for (const key in config) {
        if (typeof config[key] === 'object') {
            const submenu = document.createElement('li');
            submenu.textContent = key;
            const subcontainer = document.createElement('ul');
            subcontainer.style.display = 'none';
            subcontainer.style.position = 'absolute';
            subcontainer.style.backgroundColor = '#171717';
            subcontainer.style.border = '1px solid #ccc';
            subcontainer.style.padding = '10px';
            submenu.appendChild(subcontainer);
            container.appendChild(submenu);

            submenu.addEventListener('mouseenter', (event) => {
                subcontainer.style.display = 'block';

                // Get the submenu dimensions
                const subWidth = subcontainer.offsetWidth;
                const subHeight = subcontainer.offsetHeight;

                // Get the viewport dimensions
                const viewportWidth = window.innerWidth;
                const viewportHeight = window.innerHeight;

                // Calculate the desired position
                let subTop = submenu.offsetTop;
                let subLeft = submenu.offsetLeft + submenu.offsetWidth;

                // Adjust position if submenu overflows off the page
                if (subTop + subHeight > viewportHeight) {
                    subTop = viewportHeight - subHeight;
                }
                if (subLeft + subWidth > viewportWidth) {
                    subLeft = submenu.offsetLeft - subWidth;
                }

                // Ensure the submenu does not go off the top or left edge
                subTop = Math.max(0, subTop);
                subLeft = Math.max(0, subLeft);

                // Apply the position to the submenu
                subcontainer.style.top = `${subTop}px`;
                subcontainer.style.left = `${subLeft}px`;
            });

            submenu.addEventListener('mouseleave', () => {
                subcontainer.style.display = 'none';
            });

            subcontainer.addEventListener('mouseenter', () => {
                subcontainer.style.display = 'block';
            });

            subcontainer.addEventListener('mouseleave', () => {
                subcontainer.style.display = 'none';
            });

            buildMenu(subcontainer, config[key]);
        } else {
            const item = document.createElement('li');
            item.textContent = key;
            item.style.cursor = 'pointer';
            item.addEventListener('click', () => {
                console.log(`Executing action for ${key}`);
                try {
                    const func = functionMap[config[key]];
                    if (typeof func === 'function') {
                        func();
                    } else {
                        console.error(`Function ${config[key]} not found in function map.`);
                    }
                } catch (error) {
                    console.error(`Error executing action for ${key}:`, error);
                }
            });
            container.appendChild(item);
        }
    }
}
