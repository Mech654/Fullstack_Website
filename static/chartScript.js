const ChartItems = document.getElementById('myChart');
let total_type = 0;
let total_quantity = 0;
let total_price = 0;

async function fetchItemForChart() {
    total_type = 0;
    total_quantity = 0;
    total_price = 0;
    const arrayy = await fetchItemData();

    // Clear existing items to avoid duplication
    ChartItems.innerHTML = '';

    if (arrayy && arrayy.result === 'Success' && Array.isArray(arrayy.orders)) {
        total_type = arrayy.orders.length; // Update total_type based on the number of orders
        arrayy.orders.forEach((item) => {
            const itemDiv = document.createElement('div');
            itemDiv.className = 'item';
            itemDiv.style.display = 'flex'; // Use flexbox for horizontal alignment
            itemDiv.style.alignItems = 'center'; // Center items vertically
            itemDiv.style.marginTop = '20px';
            itemDiv.style.marginBottom = '10px'; // Add space between items
            itemDiv.style.padding = '10px'; // Add padding inside each item div
            itemDiv.style.backgroundColor = `#3980d5`; // Dark blue background color

            // Add an image element for the product
            const imgElement = document.createElement('img');
            imgElement.src = item.image_path; // Use the image path from the data
            imgElement.alt = `Image for ${item.product_name}`;
            imgElement.style.width = '50px'; // Set image width (adjust as needed)
            imgElement.style.height = '50px'; // Set image height (adjust as needed)
            imgElement.style.marginRight = '10px'; // Space between the image and text

            // Create the inner HTML for text content
            itemDiv.innerHTML = `
                <p style="margin: 0 10px;">Product Name: ${item.product_name}</p>
                <p style="margin: 0 10px;">Quantity: ${item.quantity}</p>
                <p style="margin: 0 10px;">Price: $${item.price.toFixed(2)}</p>
                <p style="margin: 0 10px;">Order ID: ${item.Order_ID}</p>
            `;

            // Insert the image at the beginning of the div
            itemDiv.prepend(imgElement);
            ChartItems.appendChild(itemDiv);

            // Accumulate total quantity and price
            total_quantity += item.quantity;
            total_price += (item.price * item.quantity);
        });

        const itemDiv = document.createElement('div');
        itemDiv.className = 'paymenttotal';
        itemDiv.style.display = 'flex'; // Use flexbox for horizontal alignment
        itemDiv.style.padding = '30px';
        itemDiv.style.marginTop = '40px';
        itemDiv.style.backgroundColor = `wheat`;
        itemDiv.style.alignItems = 'center'; // Center items vertically
        itemDiv.innerHTML = `
            <p style="margin: 0 10px;">Total types: ${total_type}</p>
            <p style="margin: 0 10px;">Total quantity: ${total_quantity}</p>
            <p style="margin: 0 10px;">Total price: $${total_price.toFixed(2)}</p>
        `;

        ChartItems.appendChild(itemDiv);

        // Add an extra invisible div for spacing at the end
        const invisibleDiv = document.createElement('div');
        invisibleDiv.style.height = '100px'; // Adjust height for the needed space
        invisibleDiv.style.opacity = '0'; // Invisible
        ChartItems.appendChild(invisibleDiv);

    } else {
        console.error('No items found in the fetched data.');
    }

    // Update the information displayed
    info();
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

// A function to put the data into the payment info div
function info() {
    document.getElementById('Order_amount').innerHTML = `
        Total types: ${total_type} <br>
        
        `;
        document.getElementById('total_quantity').innerHTML = `
        Total quantity: ${total_quantity} <br>
        `;
        
        document.getElementById('total_price').innerHTML = `
        
        Total price: $${total_price.toFixed(2)} <br>
    `;
}

// Fetch and render chart data on page load
fetchItemForChart();