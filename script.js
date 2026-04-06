document.addEventListener('DOMContentLoaded', () => {

    // Helper: Num to words
    function numberToWords(num) {
        if (num === 0) return 'Zero';
        const a = ['', 'One ', 'Two ', 'Three ', 'Four ', 'Five ', 'Six ', 'Seven ', 'Eight ', 'Nine ', 'Ten ', 'Eleven ', 'Twelve ', 'Thirteen ', 'Fourteen ', 'Fifteen ', 'Sixteen ', 'Seventeen ', 'Eighteen ', 'Nineteen '];
        const b = ['', '', 'Twenty', 'Thirty', 'Forty', 'Fifty', 'Sixty', 'Seventy', 'Eighty', 'Ninety'];
        
        function inWords(n) {
            if (n < 20) return a[n];
            if (n < 100) return b[Math.floor(n / 10)] + (n % 10 !== 0 ? ' ' + a[n % 10] : '');
            if (n < 1000) return a[Math.floor(n / 100)] + 'Hundred ' + (n % 100 !== 0 ? ' ' + inWords(n % 100) : '');
            if (n < 100000) return inWords(Math.floor(n / 1000)) + ' Thousand ' + (n % 1000 !== 0 ? inWords(n % 1000) : '');
            if (n < 10000000) return inWords(Math.floor(n / 100000)) + ' Lakh ' + (n % 100000 !== 0 ? inWords(n % 100000) : '');
            return inWords(Math.floor(n / 10000000)) + ' Crore ' + (n % 10000000 !== 0 ? inWords(n % 10000000) : '');
        }
        return inWords(Math.floor(num));
    }

    // Default Date formatted to DD/MM/YYYY
    const today = new Date();
    const dd = String(today.getDate()).padStart(2, '0');
    const mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
    const yyyy = today.getFullYear();
    document.getElementById('f-inv-date').value = dd + '/' + mm + '/' + yyyy;
    document.getElementById('f-veh-date').value = '';

    // Data Binding
    const bindings = [
        { f: 'f-inv-no', p: 'p-inv-no' },
        { f: 'f-inv-date', p: 'p-inv-date' },
        { f: 'f-b-name', p: 'p-b-name' },
        { f: 'f-b-addr', p: 'p-b-addr' },
        { f: 'f-b-gstin', p: 'p-b-gstin' },
        { f: 'f-del-note', p: 'p-del-note' },
        { f: 'f-pay-terms', p: 'p-pay-terms' },
        { f: 'f-sup-ref', p: 'p-sup-ref' },
        { f: 'f-oth-ref', p: 'p-oth-ref' },
        { f: 'f-veh-no', p: 'p-veh-no' },
        { f: 'f-veh-date', p: 'p-veh-date' },
        { f: 'f-desp-thru', p: 'p-desp-thru' },
        { f: 'f-dest', p: 'p-dest' }
    ];

    function updateText() {
        bindings.forEach(b => {
            const val = document.getElementById(b.f).value;
            // set with line text preservation for addresses
            document.getElementById(b.p).innerText = val;
        });
    }

    // Items logic
    const itemsContainer = document.getElementById('items-form-container');
    const pItemsBody = document.getElementById('p-items-body');

    function updateCalculations() {
        let subtotal = 0;
        pItemsBody.innerHTML = '';
        
        const rows = document.querySelectorAll('.item-form-row');
        rows.forEach((row, index) => {
            const desc = row.querySelector('.i-desc').value;
            const hsn = row.querySelector('.i-hsn').value;
            const qtyStr = row.querySelector('.i-qty').value;
            const unit = row.querySelector('.i-unit').value;
            const rateStr = row.querySelector('.i-rate').value;
            
            const qty = parseFloat(qtyStr) || 0;
            const rate = parseFloat(rateStr) || 0;
            
            const amount = qty * rate;
            subtotal += amount;

            // Generate Preview row
            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td class="no-b-bot text-center">${index + 1}</td>
                <td class="no-b-bot" style="white-space: pre-wrap;">${desc}</td>
                <td class="no-b-bot text-center">${hsn}</td>
                <td class="no-b-bot text-center">${qtyStr}</td>
                <td class="no-b-bot text-center">${unit}</td>
                <td class="no-b-bot text-right">${rateStr}</td>
                <td class="no-b-bot text-right" style="font-weight: bold;">${amount.toLocaleString('en-IN', {minimumFractionDigits: 2, maximumFractionDigits: 2})}</td>
            `;
            pItemsBody.appendChild(tr);
        });

        const cgst = subtotal * 0.09;
        const sgst = subtotal * 0.09;
        const totalPreRoundoff = subtotal + cgst + sgst;
        const grandTotal = Math.round(totalPreRoundoff);
        const roundOff = grandTotal - totalPreRoundoff;

        // Update preview values
        document.getElementById('p-subtotal').innerText = subtotal.toLocaleString('en-IN', {minimumFractionDigits: 2, maximumFractionDigits: 2});
        document.getElementById('p-cgst').innerText = cgst.toLocaleString('en-IN', {minimumFractionDigits: 2, maximumFractionDigits: 2});
        document.getElementById('p-sgst').innerText = sgst.toLocaleString('en-IN', {minimumFractionDigits: 2, maximumFractionDigits: 2});
        
        document.getElementById('p-total-pre').innerText = totalPreRoundoff.toLocaleString('en-IN', {minimumFractionDigits: 2, maximumFractionDigits: 2});
        document.getElementById('p-roundoff').innerText = roundOff.toLocaleString('en-IN', {minimumFractionDigits: 2, maximumFractionDigits: 2});
        document.getElementById('p-grand-total').innerText = grandTotal.toLocaleString('en-IN', {minimumFractionDigits: 2, maximumFractionDigits: 2});

        const words = numberToWords(grandTotal);
        document.getElementById('p-words').innerText = words + 'Rupee only';
    }

    function createRow(desc="", hsn="", qty="", unit="", rate="") {
        const div = document.createElement('div');
        div.className = 'item-form-row';
        div.innerHTML = `
            <input type="text" class="i-desc" value="${desc}" placeholder="Description" style="width: 30%;">
            <input type="text" class="i-hsn" value="${hsn}" placeholder="HSN" style="width: 15%;">
            <input type="text" class="i-qty" value="${qty}" placeholder="Qty" style="width: 15%;">
            <input type="text" class="i-unit" value="${unit}" placeholder="Unit" style="width: 15%;">
            <input type="text" class="i-rate" value="${rate}" placeholder="Rate" style="width: 15%;">
            <button type="button" class="btn btn-danger btn-remove-item">X</button>
        `;

        div.querySelector('.btn-remove-item').addEventListener('click', () => {
            div.remove();
            updateCalculations();
        });

        div.querySelectorAll('input').forEach(i => i.addEventListener('input', updateCalculations));
        
        itemsContainer.appendChild(div);
        updateCalculations();
    }

    document.getElementById('btn-add-item').addEventListener('click', () => createRow('', '', '', '', ''));
    
    // Add event listeners to all main form inputs
    document.querySelectorAll('.form-section input, .form-section textarea').forEach(i => {
        i.addEventListener('input', updateText);
    });

    // Initialize Print
    document.getElementById('btn-print').addEventListener('click', () => {
        const originalTitle = document.title;
        const invNo = document.getElementById('f-inv-no').value.trim();
        
        if (invNo) {
            document.title = `invoice_${invNo}`;
        } else {
            document.title = `invoice`;
        }
        
        window.print();
        
        document.title = originalTitle;
    });

    // Initial setup
    updateText();
    createRow(); // adds the default UltratechCement row
});
