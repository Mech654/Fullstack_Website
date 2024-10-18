const ChartItems = document.getElementById('myChart');
let total_type = 0;
let total_quantity = 0;
let total_price = 0;

async function fetchItemForChart() {
    total_type = 0;
    total_quantity = 0;
    total_price = 0;
    const arrayy = await fetchItemData();
    ChartItems.innerHTML = '';
    if (arrayy && arrayy.result === 'Success' && Array.isArray(arrayy.orders)) {
        total_type = arrayy.orders.length;
        arrayy.orders.forEach((item) => {
            const itemDiv = document.createElement('div');
            itemDiv.id = item.product_name;
            itemDiv.className = 'item';
            itemDiv.style.display = 'flex';
            itemDiv.style.alignItems = 'center';
            itemDiv.style.marginTop = '20px';
            itemDiv.style.marginBottom = '10px';
            itemDiv.style.padding = '10px';
            itemDiv.style.backgroundColor = `#3980d5`;

            const imgElement = document.createElement('img');
            imgElement.src = item.image_path;
            imgElement.alt = `Image for ${item.product_name}`;
            imgElement.style.width = '50px';
            imgElement.style.height = '50px';
            imgElement.style.marginRight = '10px';

            itemDiv.innerHTML = `
                <p style="margin: 0 10px;">Product Name: ${item.product_name}</p>
                <p id="quantity" style="margin: 0 10px;">Quantity: ${item.quantity}</p>
                <p style="margin: 0 10px;">Price: $${item.price.toFixed(2)}</p>
                <p style="margin: 0 10px;">Order ID: ${item.Order_ID}</p>
            `;

            itemDiv.prepend(imgElement);

            // Attach click event listener directly to each itemDiv
            itemDiv.addEventListener('click', () => {
                handleDivClick(itemDiv.id);
            });

            ChartItems.appendChild(itemDiv);

            total_quantity += item.quantity;
            total_price += (item.price * item.quantity);
        });

        const itemDiv = document.createElement('div');
        itemDiv.className = 'paymenttotal';
        itemDiv.style.display = 'flex';
        itemDiv.style.padding = '30px';
        itemDiv.style.marginTop = '40px';
        itemDiv.style.backgroundColor = `wheat`;
        itemDiv.style.alignItems = 'center';
        itemDiv.innerHTML = `
            <p style="margin: 0 10px;">Total types: ${total_type}</p>
            <p style="margin: 0 10px;">Total quantity: ${total_quantity}</p>
            <p style="margin: 0 10px;">Total price: $${total_price.toFixed(2)}</p>
        `;

        ChartItems.appendChild(itemDiv);

        const invisibleDiv = document.createElement('div');
        invisibleDiv.style.height = '100px';
        invisibleDiv.style.opacity = '0';
        ChartItems.appendChild(invisibleDiv);
    } else {
        console.error('No items found in the fetched data.');
    }


}

function handleDivClick(divId) {
    if (Delete === true) {
        const itemDiv = document.getElementById(divId);
        const orderId = itemDiv.querySelector('p:nth-child(5)').textContent.split(': ')[1];
        console.log('Order ID:', orderId);
        callServerMethod(orderId);
    }
}




async function callServerMethod(order_id) {
    const url = 'https://flaskapp-fahsabdxgzbteaet.northeurope-01.azurewebsites.net/extract';

    try {
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ 'order_id': order_id })  // Sending order_id
        });

        if (!response.ok) {
            throw new Error('Network response was not ok');
        }

        const data = await response.json();
        console.log('Success:', data);
    } catch (error) {
        console.error('Error:', error);
    }
}






async function fetchItemData() {
    let itemData = null;
    try {
        const userId = localStorage.getItem('user_id');
        if (!userId) {
            throw new Error('User ID not found in localStorage');
        }
        const response = await fetch('https://flaskapp-fahsabdxgzbteaet.northeurope-01.azurewebsites.net/get_orders', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ 'customer_id': userId })
        });
        itemData = await response.json();
    } catch (error) {
        console.error('Error fetching items:', error);
    }
    console.log('itemData:', itemData);
    return itemData;
}

function info() {
    document.getElementById('Order_amount').innerHTML = `Total types: ${total_type} <br>`;
    document.getElementById('total_quantity').innerHTML = `Total quantity: ${total_quantity} <br>`;
    document.getElementById('total_price').innerHTML = `Total price: $${(total_price).toFixed(2)} <br>`;
}
